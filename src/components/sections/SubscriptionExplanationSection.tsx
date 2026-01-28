import { useLanguage } from '@/contexts/LanguageContext';
import { CreditCard, Package, Calendar, XCircle } from 'lucide-react';

const SubscriptionExplanationSection = () => {
  const { t, isRTL } = useLanguage();

  const steps = [
    {
      icon: CreditCard,
      title: t('subscription.step1.title'),
      desc: t('subscription.step1.desc'),
    },
    {
      icon: Package,
      title: t('subscription.step2.title'),
      desc: t('subscription.step2.desc'),
    },
    {
      icon: Calendar,
      title: t('subscription.step3.title'),
      desc: t('subscription.step3.desc'),
    },
    {
      icon: XCircle,
      title: t('subscription.step4.title'),
      desc: t('subscription.step4.desc'),
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isRTL ? 'font-cairo' : 'font-sans'}`}>
            <span className="gradient-text">{t('subscription.title')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('subscription.subtitle')}
          </p>
        </div>

        <div className={`max-w-4xl mx-auto ${isRTL ? 'direction-rtl' : ''}`}>
          <div className="relative">
            {/* Vertical line */}
            <div className={`absolute ${isRTL ? 'right-6' : 'left-6'} top-0 bottom-0 w-0.5 bg-gradient-to-b from-gradient-purple to-gradient-blue md:left-1/2 md:-translate-x-1/2 md:right-auto`} />

            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex items-start gap-6 mb-12 last:mb-0 ${
                  isRTL ? 'flex-row-reverse' : ''
                } ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`w-12 h-12 rounded-full gradient-bg flex items-center justify-center z-10 flex-shrink-0 ${
                  isRTL ? '' : ''
                } md:absolute md:left-1/2 md:-translate-x-1/2`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>

                <div className={`flex-1 glass rounded-2xl p-6 gradient-border ${
                  index % 2 === 0 ? 'md:mr-auto md:ml-0 md:pr-20' : 'md:ml-auto md:mr-0 md:pl-20'
                } md:w-[calc(50%-3rem)]`}>
                  <h3 className={`text-xl font-semibold mb-2 ${isRTL ? 'font-cairo text-right' : 'font-sans'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionExplanationSection;
