import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SubscribePopup from '@/components/SubscribePopup';

interface Pricing {
  setup_fee: number;
  monthly_fee: number;
  discount_enabled: boolean;
  discount_percent: number;
}

const PricingSection = () => {
  const { t, isRTL, language } = useLanguage();
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchPricing = async () => {
      const { data, error } = await supabase
        .from('pricing')
        .select('*')
        .single();
      
      if (!error && data) {
        setPricing(data);
      }
    };

    fetchPricing();
  }, []);

  const features = [
    t('pricing.features.customWebsite'),
    t('pricing.features.professionalUI'),
    t('pricing.features.responsive'),
    t('pricing.features.hosting'),
    t('pricing.features.unlimitedEdits'),
    t('pricing.features.support'),
    t('pricing.features.delivery'),
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-EG').format(price);
  };

  const getDiscountedPrice = (price: number) => {
    if (pricing?.discount_enabled && pricing.discount_percent > 0) {
      return price - (price * pricing.discount_percent / 100);
    }
    return price;
  };

  return (
    <>
      <section id="pricing" className="py-24 relative">
        {/* Background effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-gradient-purple/5 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isRTL ? 'font-cairo' : 'font-sans'}`}>
              <span className="gradient-text">{t('pricing.title')}</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('pricing.subtitle')}
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="glass rounded-3xl p-8 relative overflow-hidden gradient-border">
              {/* Discount badge */}
              {pricing?.discount_enabled && pricing.discount_percent > 0 && (
                <div className="absolute top-4 right-4 gradient-bg px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-bold">
                    {pricing.discount_percent}% {t('pricing.discount')}
                  </span>
                </div>
              )}

              <h3 className={`text-2xl font-bold mb-8 text-center ${isRTL ? 'font-cairo' : 'font-sans'}`}>
                {t('pricing.cardTitle')}
              </h3>

              {/* Setup Fee */}
              <div className="mb-6 p-4 rounded-xl bg-muted/50 border border-border">
                <div className={`flex items-baseline justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-muted-foreground">{t('pricing.setupFee')}</span>
                  <div className={`flex items-baseline gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {pricing?.discount_enabled && pricing.discount_percent > 0 && (
                      <span className="text-muted-foreground line-through text-lg">
                        {pricing ? formatPrice(pricing.setup_fee) : '1,500'} EGP
                      </span>
                    )}
                    <span className="text-3xl font-bold gradient-text">
                      {pricing ? formatPrice(Math.round(getDiscountedPrice(pricing.setup_fee))) : '1,500'} EGP
                    </span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">({t('pricing.oneTime')})</span>
              </div>

              {/* Monthly Fee */}
              <div className="mb-8 p-4 rounded-xl bg-muted/50 border border-border">
                <div className={`flex items-baseline justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-muted-foreground">{t('pricing.monthly')}</span>
                  <div className={`flex items-baseline gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {pricing?.discount_enabled && pricing.discount_percent > 0 && (
                      <span className="text-muted-foreground line-through text-lg">
                        {pricing ? formatPrice(pricing.monthly_fee) : '500'} EGP
                      </span>
                    )}
                    <span className="text-3xl font-bold gradient-text">
                      {pricing ? formatPrice(Math.round(getDiscountedPrice(pricing.monthly_fee))) : '500'} EGP
                    </span>
                    <span className="text-muted-foreground">{t('pricing.perMonth')}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className={isRTL ? 'font-cairo' : 'font-sans'}>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                size="lg"
                className="w-full gradient-bg hover:opacity-90 transition-opacity text-lg py-6"
                onClick={() => setIsPopupOpen(true)}
              >
                {t('pricing.subscribe')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SubscribePopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </>
  );
};

export default PricingSection;
