import { useLanguage } from '@/contexts/LanguageContext';
import { Check } from 'lucide-react';

const WhatYouGetSection = () => {
  const { t, isRTL } = useLanguage();

  const benefits = [
    t('whatYouGet.customWebsite'),
    t('whatYouGet.modernDesign'),
    t('whatYouGet.responsive'),
    t('whatYouGet.hosting'),
    t('whatYouGet.updates'),
    t('whatYouGet.support'),
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isRTL ? 'font-cairo' : 'font-sans'}`}>
              <span className="gradient-text">{t('whatYouGet.title')}</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('whatYouGet.subtitle')}
            </p>
          </div>

          <div className="glass rounded-3xl p-8 md:p-12 gradient-border">
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-lg ${isRTL ? 'font-cairo text-right' : 'font-sans'}`}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouGetSection;
