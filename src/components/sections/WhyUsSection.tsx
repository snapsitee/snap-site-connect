import { useLanguage } from '@/contexts/LanguageContext';
import { Zap, CreditCard, Wallet, Layout, Headphones, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ScrollReveal from '@/components/ui/scroll-reveal';
import StaggerContainer, { StaggerItem } from '@/components/ui/stagger-container';

const WhyUsSection = () => {
  const { t, isRTL } = useLanguage();

  const features = [
    {
      icon: Zap,
      title: t('whyUs.fastDelivery.title'),
      desc: t('whyUs.fastDelivery.desc'),
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: CreditCard,
      title: t('whyUs.subscription.title'),
      desc: t('whyUs.subscription.desc'),
      gradient: 'from-gradient-purple to-pink-500',
    },
    {
      icon: Wallet,
      title: t('whyUs.noUpfront.title'),
      desc: t('whyUs.noUpfront.desc'),
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Layout,
      title: t('whyUs.professionalUI.title'),
      desc: t('whyUs.professionalUI.desc'),
      gradient: 'from-gradient-blue to-cyan-500',
    },
    {
      icon: Headphones,
      title: t('whyUs.support.title'),
      desc: t('whyUs.support.desc'),
      gradient: 'from-purple-500 to-gradient-purple',
    },
    {
      icon: Shield,
      title: isRTL ? 'آمان مضمون' : 'Secure & Reliable',
      desc: isRTL ? 'نضمن أمان موقعك وبياناتك بأحدث التقنيات' : 'We ensure your website and data are protected with the latest security standards',
      gradient: 'from-gradient-blue to-indigo-500',
    },
  ];

  return (
    <section id="why-us" className="py-28 relative">
      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-gradient-purple/5 to-gradient-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal className="text-center mb-20">
          <Badge variant="outline" className="mb-4 border-gradient-blue/30 text-gradient-blue bg-gradient-blue/5">
            {isRTL ? 'لماذا نحن' : 'Why Choose Us'}
          </Badge>
          <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${isRTL ? 'font-cairo' : 'font-sans'}`}>
            <span className="gradient-text">{t('whyUs.title')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('whyUs.subtitle')}
          </p>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.08} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <div className="glass rounded-2xl p-6 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 group gradient-border h-full hover:shadow-xl hover:shadow-gradient-purple/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold ${isRTL ? 'font-cairo' : 'font-sans'}`}>
                    {feature.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default WhyUsSection;
