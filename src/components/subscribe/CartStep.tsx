import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Globe, Mail, ArrowRight, ArrowLeft, Ticket, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { OrderData } from '@/pages/Subscribe';

interface CartStepProps {
  orderData: OrderData;
  updateOrderData: (data: Partial<OrderData>) => void;
  onNext: () => void;
  isRenewal?: boolean;
}

interface AddonSettings {
  custom_domain_price: number;
  custom_domain_enabled: boolean;
  business_email_price: number;
  business_email_enabled: boolean;
}

interface AppliedCoupon {
  code: string;
  discount_type: 'fixed' | 'percentage';
  discount_value: number;
}

const CartStep = ({ orderData, updateOrderData, onNext, isRenewal = false }: CartStepProps) => {
  const { isRTL, language } = useLanguage();
  const [addonSettings, setAddonSettings] = useState<AddonSettings | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const fetchAddons = async () => {
      const { data } = await supabase
        .from('addon_settings')
        .select('*')
        .single();
      
      if (data) {
        setAddonSettings(data);
        updateOrderData({
          customDomainPrice: data.custom_domain_price,
          businessEmailPrice: data.business_email_price,
        });
      }
    };

    fetchAddons();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-EG').format(price);
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsValidating(true);
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase().trim())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      toast.error(isRTL ? 'كود الكوبون غير صالح' : 'Invalid coupon code');
      setIsValidating(false);
      return;
    }

    // Check max uses
    if (data.max_uses && data.usage_count >= data.max_uses) {
      toast.error(isRTL ? 'تم استنفاد الكوبون' : 'Coupon has been exhausted');
      setIsValidating(false);
      return;
    }

    setAppliedCoupon({
      code: data.code,
      discount_type: data.discount_type as 'fixed' | 'percentage',
      discount_value: data.discount_value,
    });

    // Calculate and save discount to order data (applies only to setup/renewal fee, not add-ons)
    let discountAmount = 0;
    if (data.discount_type === 'percentage') {
      discountAmount = Math.round(orderData.setupFee * data.discount_value / 100);
    } else {
      discountAmount = Math.min(data.discount_value, orderData.setupFee);
    }
    
    updateOrderData({
      couponCode: data.code,
      couponDiscount: discountAmount,
    });
    
    toast.success(isRTL ? 'تم تطبيق الكوبون بنجاح!' : 'Coupon applied successfully!');
    setIsValidating(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    updateOrderData({
      couponCode: '',
      couponDiscount: 0,
    });
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    // Coupon applies only to setup/renewal fee, not add-ons
    if (appliedCoupon.discount_type === 'percentage') {
      return Math.round(orderData.setupFee * appliedCoupon.discount_value / 100);
    }
    return Math.min(appliedCoupon.discount_value, orderData.setupFee);
  };

  const discount = calculateDiscount();
  const finalTotal = orderData.total - discount;

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="glass rounded-3xl p-8 gradient-border">
      <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${isRTL ? 'text-right' : ''}`}>
            {isRenewal 
              ? (isRTL ? 'تجديد الاشتراك' : 'Renew Subscription')
              : (isRTL ? 'ملخص الطلب' : 'Order Summary')
            }
          </h2>
          <p className={`text-muted-foreground text-sm ${isRTL ? 'text-right' : ''}`}>
            {isRTL ? 'راجع طلبك وأضف الإضافات' : 'Review your order and add extras'}
          </p>
        </div>
      </div>

      {/* Main Fee */}
      <div className="space-y-4 mb-6">
        <div className={`p-4 rounded-xl bg-muted/50 border border-border ${isRTL ? 'text-right' : ''}`}>
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="font-medium">
              {isRenewal 
                ? (isRTL ? 'رسوم التجديد الشهري' : 'Monthly Renewal Fee')
                : (isRTL ? 'رسوم الإعداد' : 'Setup Fee')
              }
            </span>
            <span className="text-xl font-bold gradient-text">
              {formatPrice(orderData.setupFee)} EGP
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {isRenewal 
              ? (isRTL ? 'سيتم تجديد اشتراكك لمدة شهر' : 'Your subscription will be renewed for one month')
              : (isRTL ? 'دفعة لمرة واحدة' : 'One-time payment')
            }
          </p>
        </div>
      </div>

      {/* Add-ons (only for new subscriptions) */}
      {!isRenewal && addonSettings && (
        <div className="mb-6">
          <h3 className={`font-semibold mb-4 ${isRTL ? 'text-right' : ''}`}>
            {isRTL ? 'إضافات اختيارية' : 'Optional Add-ons'}
          </h3>
          
          <div className="space-y-3">
            {addonSettings.custom_domain_enabled && (
              <label className={`flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary/50 transition-colors cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Checkbox
                  checked={orderData.customDomainAddon}
                  onCheckedChange={(checked) => updateOrderData({ customDomainAddon: checked as boolean })}
                  className="mt-1"
                />
                <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="font-medium">
                      {isRTL ? 'دومين مخصص' : 'Custom Domain'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isRTL 
                      ? 'احصل على دومين خاص بدلاً من .snapsitee.com'
                      : 'Get your own domain instead of .snapsitee.com'
                    }
                  </p>
                  <span className="text-sm font-semibold text-primary">
                    {formatPrice(addonSettings.custom_domain_price)} EGP/{isRTL ? 'سنوياً' : 'year'}
                  </span>
                </div>
              </label>
            )}

            {addonSettings.business_email_enabled && (
              <label className={`flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary/50 transition-colors cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Checkbox
                  checked={orderData.businessEmailAddon}
                  onCheckedChange={(checked) => updateOrderData({ businessEmailAddon: checked as boolean })}
                  className="mt-1"
                />
                <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="font-medium">
                      {isRTL ? 'بريد إلكتروني للأعمال' : 'Business Email'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isRTL 
                      ? 'بريد احترافي باسم شركتك'
                      : 'Professional email with your company name'
                    }
                  </p>
                  <span className="text-sm font-semibold text-primary">
                    {formatPrice(addonSettings.business_email_price)} EGP/{isRTL ? 'سنوياً' : 'year'}
                  </span>
                </div>
              </label>
            )}
          </div>
        </div>
      )}

      {/* Coupon Code */}
      <div className="mb-6">
        <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
          <Ticket className="w-5 h-5 text-primary" />
          {isRTL ? 'كود الخصم' : 'Coupon Code'}
        </h3>
        
        {appliedCoupon ? (
          <div className={`flex items-center justify-between p-3 rounded-xl bg-accent/50 border border-accent ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Check className="w-5 h-5 text-primary" />
              <span className="font-mono font-bold text-primary">{appliedCoupon.code}</span>
              <span className="text-sm text-muted-foreground">
                ({appliedCoupon.discount_type === 'percentage' 
                  ? `${appliedCoupon.discount_value}%` 
                  : `${formatPrice(appliedCoupon.discount_value)} EGP`
                })
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeCoupon}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder={isRTL ? 'أدخل كود الخصم' : 'Enter coupon code'}
              className={`flex-1 uppercase ${isRTL ? 'text-right' : ''}`}
              onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
            />
            <Button
              onClick={applyCoupon}
              disabled={isValidating || !couponCode.trim()}
              variant="outline"
            >
              {isValidating 
                ? (isRTL ? 'جاري التحقق...' : 'Checking...') 
                : (isRTL ? 'تطبيق' : 'Apply')
              }
            </Button>
          </div>
        )}
      </div>

      {/* Total */}
      <div className={`p-4 rounded-xl gradient-bg text-white mb-6 ${isRTL ? 'text-right' : ''}`}>
        {discount > 0 && (
          <div className={`flex items-center justify-between mb-2 text-white/80 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span>{isRTL ? 'المجموع الفرعي' : 'Subtotal'}</span>
            <span>{formatPrice(orderData.total)} EGP</span>
          </div>
        )}
        {discount > 0 && (
          <div className={`flex items-center justify-between mb-2 text-white/80 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span>{isRTL ? 'الخصم' : 'Discount'}</span>
            <span>-{formatPrice(discount)} EGP</span>
          </div>
        )}
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="font-medium">{isRTL ? 'الإجمالي' : 'Total'}</span>
          <span className="text-2xl font-bold">{formatPrice(finalTotal)} EGP</span>
        </div>
      </div>

      {/* Next Button */}
      <Button
        onClick={() => {
          // Ensure finalTotal is updated before moving to payment
          updateOrderData({ finalTotal });
          onNext();
        }}
        className={`w-full gradient-bg hover:opacity-90 text-lg py-6 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {isRTL ? 'متابعة للدفع' : 'Continue to Payment'}
          <ArrowIcon className="w-5 h-5" />
        </span>
      </Button>
    </div>
  );
};

export default CartStep;
