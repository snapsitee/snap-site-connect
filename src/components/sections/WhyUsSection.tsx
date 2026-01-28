import { useLanguage } from '@/contexts/LanguageContext';
import { Zap, CreditCard, Wallet, Layout, Headphones } from 'lucide-react';

const WhyUsSection = () => {
  const { t, isRTL } = useLanguage();

  const features = [
    {
      icon: Zap,
      title: t('whyUs.fastDelivery.title'),
      desc: t('whyUs.fastDelivery.desc'),
    },
    {
      icon: CreditCard,
      title: t('whyUs.subscription.title'),
      desc: t('whyUs.subscription.desc'),
    },
    {
      icon: Wallet,
      title: t('whyUs.noUpfront.title'),
      desc: t('whyUs.noUpfront.desc'),
    },
    {
      icon: Layout,
      title: t('whyUs.professionalUI.title'),
      desc: t('whyUs.professionalUI.desc'),
    },
    {
      icon: Headphones,
      title: t('whyUs.support.title'),
      desc: t('whyUs.support.desc'),
    },
  ];

  return (
    <section id="why-us" className="py-24 relative">
      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-gradient-purple/5 to-gradient-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isRTL ? 'font-cairo' : 'font-sans'}`}>
            <span className="gradient-text">{t('whyUs.title')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('whyUs.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6 transition-all duration-300 hover:scale-105 group gradient-border"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-lg font-semibold ${isRTL ? 'font-cairo' : 'font-sans'}`}>
                  {feature.title}
                </h3>
              </div>
              <p className="text-muted-foreground">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
