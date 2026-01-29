import { useState, useEffect, forwardRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartStep from '@/components/subscribe/CartStep';
import PaymentStep from '@/components/subscribe/PaymentStep';
import FormStep from '@/components/subscribe/FormStep';
import SuccessStep from '@/components/subscribe/SuccessStep';
import { motion, AnimatePresence } from 'framer-motion';

export interface OrderData {
  setupFee: number;
  monthlyFee: number;
  customDomainAddon: boolean;
  businessEmailAddon: boolean;
  customDomainPrice: number;
  businessEmailPrice: number;
  addonTotal: number;
  total: number;
  paymentMethod: string;
  receiptUrl: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  whatsapp: string;
  websiteRequirements: string;
}

const Subscribe = forwardRef<HTMLDivElement>((_, ref) => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRenewal = searchParams.get('renewal') === 'true';
  const orderId = searchParams.get('orderId');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedOrderId, setSubmittedOrderId] = useState<string>('');
  const [orderData, setOrderData] = useState<OrderData>({
    setupFee: 1500,
    monthlyFee: 500,
    customDomainAddon: false,
    businessEmailAddon: false,
    customDomainPrice: 2000,
    businessEmailPrice: 4000,
    addonTotal: 0,
    total: 1500,
    paymentMethod: '',
    receiptUrl: '',
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    whatsapp: '',
    websiteRequirements: '',
  });

  useEffect(() => {
    const fetchPricing = async () => {
      const { data: pricingData } = await supabase
        .from('pricing')
        .select('*')
        .single();
      
      const { data: addonData } = await supabase
        .from('addon_settings')
        .select('*')
        .single();
      
      if (pricingData) {
        // Apply discount if enabled
        const applyDiscount = (price: number) => {
          if (pricingData.discount_enabled && pricingData.discount_percent > 0) {
            return Math.round(price - (price * pricingData.discount_percent / 100));
          }
          return price;
        };
        
        const baseSetupFee = isRenewal ? pricingData.monthly_fee : pricingData.setup_fee;
        const discountedSetupFee = applyDiscount(baseSetupFee);
        const discountedMonthlyFee = applyDiscount(pricingData.monthly_fee);
        
        setOrderData(prev => ({
          ...prev,
          setupFee: discountedSetupFee,
          monthlyFee: discountedMonthlyFee,
          total: discountedSetupFee,
          customDomainPrice: addonData?.custom_domain_price || 2000,
          businessEmailPrice: addonData?.business_email_price || 4000,
        }));
      }
    };

    fetchPricing();
  }, [isRenewal]);

  const updateOrderData = (data: Partial<OrderData>) => {
    setOrderData(prev => {
      const updated = { ...prev, ...data };
      let addonTotal = 0;
      if (updated.customDomainAddon) addonTotal += updated.customDomainPrice;
      if (updated.businessEmailAddon) addonTotal += updated.businessEmailPrice;
      updated.addonTotal = addonTotal;
      updated.total = updated.setupFee + addonTotal;
      return updated;
    });
  };

  const handleComplete = (orderId: string) => {
    setSubmittedOrderId(orderId);
    setCurrentStep(4);
  };

  const steps = [
    { number: 1, label: isRTL ? 'السلة' : 'Cart' },
    { number: 2, label: isRTL ? 'الدفع' : 'Payment' },
    { number: 3, label: isRTL ? 'البيانات' : 'Details' },
  ];

  return (
    <div ref={ref} className={`min-h-screen bg-background ${isRTL ? 'font-cairo' : 'font-sans'}`}>
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Progress Steps */}
          {currentStep < 4 && (
            <div className="mb-12">
              <div className="flex items-center justify-center gap-4">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                        currentStep >= step.number 
                          ? 'gradient-bg text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {step.number}
                      </div>
                      <span className={`hidden sm:inline text-sm font-medium ${
                        currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 sm:w-20 h-0.5 mx-2 ${
                        currentStep > step.number ? 'gradient-bg' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <CartStep 
                  orderData={orderData}
                  updateOrderData={updateOrderData}
                  onNext={() => setCurrentStep(2)}
                  isRenewal={isRenewal}
                />
              )}
              {currentStep === 2 && (
                <PaymentStep 
                  orderData={orderData}
                  updateOrderData={updateOrderData}
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                />
              )}
              {currentStep === 3 && (
                <FormStep 
                  orderData={orderData}
                  updateOrderData={updateOrderData}
                  onComplete={handleComplete}
                  onBack={() => setCurrentStep(2)}
                  isRenewal={isRenewal}
                  renewalOrderId={orderId}
                />
              )}
              {currentStep === 4 && (
                <SuccessStep orderId={submittedOrderId} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
});

Subscribe.displayName = 'Subscribe';

export default Subscribe;
