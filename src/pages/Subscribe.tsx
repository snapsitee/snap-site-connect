import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import StepIndicator from '@/components/subscribe/StepIndicator';
import AddonsStep from '@/components/subscribe/AddonsStep';
import PaymentStep from '@/components/subscribe/PaymentStep';
import DetailsStep from '@/components/subscribe/DetailsStep';
import ConfirmationStep from '@/components/subscribe/ConfirmationStep';

interface PaymentSettings {
  instapay_account_number: string;
  instapay_username: string;
  instapay_link: string;
  instapay_qr_url: string | null;
  vodafone_number: string;
  vodafone_link: string;
  vodafone_qr_url: string | null;
}

interface AddonSettings {
  custom_domain_enabled: boolean;
  custom_domain_price: number;
  business_email_enabled: boolean;
  business_email_price: number;
}

interface CouponData {
  code: string;
  discount_type: string;
  discount_value: number;
  discountAmount: number;
}

interface PricingData {
  setup_fee: number;
  monthly_fee: number;
  discount_enabled: boolean;
  discount_percent: number;
}

const Subscribe = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const isRenewal = searchParams.get('renewal') === 'true';
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(isRenewal ? 2 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    whatsapp: '',
    websiteRequirements: '',
    originalOrderId: '',
  });
  
  // Add-ons state
  const [selectedAddons, setSelectedAddons] = useState({
    customDomain: false,
    businessEmail: false,
  });
  
  // Coupon state
  const [couponData, setCouponData] = useState<CouponData | null>(null);
  
  // Payment state
  const [selectedPayment, setSelectedPayment] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  
  // Settings from DB
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [addonSettings, setAddonSettings] = useState<AddonSettings | null>(null);
  const [pricing, setPricing] = useState<PricingData | null>(null);

  // Calculate prices
  const basePrice = pricing 
    ? (isRenewal 
        ? (pricing.discount_enabled ? Math.round(pricing.monthly_fee * (1 - pricing.discount_percent / 100)) : pricing.monthly_fee)
        : (pricing.discount_enabled ? Math.round(pricing.setup_fee * (1 - pricing.discount_percent / 100)) : pricing.setup_fee)
      )
    : 0;

  const addonTotal = 
    (selectedAddons.customDomain && addonSettings?.custom_domain_enabled ? addonSettings.custom_domain_price : 0) +
    (selectedAddons.businessEmail && addonSettings?.business_email_enabled ? addonSettings.business_email_price : 0);

  const discount = couponData?.discountAmount || 0;
  const totalAmount = basePrice + addonTotal - discount;

  useEffect(() => {
    const fetchSettings = async () => {
      const [
        { data: paymentData },
        { data: pricingData },
        { data: addonData },
      ] = await Promise.all([
        supabase.from('payment_settings').select('*').single(),
        supabase.from('pricing').select('*').single(),
        supabase.from('addon_settings').select('*').single(),
      ]);
      
      if (paymentData) setPaymentSettings(paymentData);
      if (pricingData) setPricing(pricingData);
      if (addonData) setAddonSettings(addonData);
    };
    fetchSettings();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (!receiptFile) {
        toast({
          variant: 'destructive',
          title: isRTL ? 'يرجى رفع إيصال الدفع' : 'Please upload payment receipt',
        });
        setIsSubmitting(false);
        return;
      }

      // Upload receipt
      const fileName = `${Date.now()}-${receiptFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, receiptFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);

      if (isRenewal) {
        // Validate order ID exists
        const { data: orderCheck } = await supabase
          .from('orders')
          .select('order_id')
          .eq('order_id', formData.originalOrderId.trim().toUpperCase())
          .maybeSingle();
        
        if (!orderCheck) {
          toast({
            variant: 'destructive',
            title: isRTL ? 'رقم الطلب غير موجود' : 'Order ID not found',
          });
          setIsSubmitting(false);
          return;
        }

        const { data, error } = await supabase
          .from('renewals')
          .insert([{
            renewal_id: 'TEMP', // Will be overwritten by trigger
            original_order_id: formData.originalOrderId.trim().toUpperCase(),
            full_name: formData.fullName.trim(),
            business_name: formData.businessName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            whatsapp: formData.whatsapp.trim(),
            renewal_fee: basePrice,
            payment_method: selectedPayment,
            receipt_url: publicUrl,
            status: 'pending',
            coupon_code: couponData?.code || null,
            coupon_discount: discount,
          }])
          .select('renewal_id')
          .single();

        if (error) {
          console.error('Renewal insert error:', error);
          throw new Error(`Renewal failed: ${error.message}`);
        }
        setSubmittedId(data.renewal_id);
      } else {
        const { data, error } = await supabase
          .from('orders')
          .insert([{
            order_id: 'TEMP', // Will be overwritten by trigger
            full_name: formData.fullName.trim(),
            business_name: formData.businessName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            whatsapp: formData.whatsapp.trim(),
            website_requirements: formData.websiteRequirements.trim(),
            setup_fee: basePrice,
            monthly_fee: pricing?.monthly_fee || 0,
            custom_domain_addon: selectedAddons.customDomain,
            business_email_addon: selectedAddons.businessEmail,
            addon_total: addonTotal,
            payment_method: selectedPayment,
            receipt_url: publicUrl,
            coupon_code: couponData?.code || null,
            coupon_discount: discount,
          }])
          .select('order_id')
          .single();

        if (error) {
          console.error('Order insert error:', error);
          throw new Error(`Order failed: ${error.message}`);
        }
        setSubmittedId(data.order_id);
      }

      // Move to confirmation step
      setCurrentStep(4);
    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        variant: 'destructive',
        title: isRTL ? 'حدث خطأ' : 'Error occurred',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = isRenewal
    ? [
        isRTL ? 'الدفع' : 'Payment',
        isRTL ? 'البيانات' : 'Details',
        isRTL ? 'تم' : 'Done',
      ]
    : [
        isRTL ? 'الإضافات' : 'Add-ons',
        isRTL ? 'الدفع' : 'Payment',
        isRTL ? 'البيانات' : 'Details',
        isRTL ? 'تم' : 'Done',
      ];

  const totalSteps = isRenewal ? 3 : 4;
  const displayStep = isRenewal ? currentStep - 1 : currentStep;

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-cairo' : 'font-sans'}`}>
      <Navbar />
      
      <main className="pt-20 sm:pt-24 pb-10 sm:pb-16">
        <div className="container mx-auto px-3 sm:px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 gradient-border"
          >
            {/* Header */}
            <div className="text-center mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">
                {isRenewal 
                  ? (isRTL ? 'تجديد الاشتراك' : 'Renew Subscription')
                  : (isRTL ? 'اشترك الآن' : 'Subscribe Now')
                }
              </h1>
            </div>

            {/* Step Indicator - hide on confirmation */}
            {currentStep < 4 && (
              <StepIndicator
                currentStep={displayStep}
                totalSteps={totalSteps}
                stepLabels={stepLabels}
                isRTL={isRTL}
              />
            )}

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {currentStep === 1 && !isRenewal && (
                <AddonsStep
                  key="addons"
                  addonSettings={addonSettings}
                  basePrice={basePrice}
                  selectedAddons={selectedAddons}
                  setSelectedAddons={setSelectedAddons}
                  couponData={couponData}
                  setCouponData={setCouponData}
                  onNext={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 2 && (
                <PaymentStep
                  key="payment"
                  paymentSettings={paymentSettings}
                  totalAmount={totalAmount}
                  basePrice={basePrice}
                  selectedPayment={selectedPayment}
                  setSelectedPayment={setSelectedPayment}
                  receiptFile={receiptFile}
                  setReceiptFile={setReceiptFile}
                  couponData={couponData}
                  setCouponData={setCouponData}
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                  isRenewal={isRenewal}
                />
              )}

              {currentStep === 3 && (
                <DetailsStep
                  key="details"
                  formData={formData}
                  setFormData={setFormData}
                  isRenewal={isRenewal}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit}
                  onBack={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 4 && (
                <ConfirmationStep
                  key="confirmation"
                  orderId={submittedId}
                  isRenewal={isRenewal}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Subscribe;
