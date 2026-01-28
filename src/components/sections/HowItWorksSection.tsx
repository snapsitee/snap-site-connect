import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Palette, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ScrollReveal from '@/components/ui/scroll-reveal';
import StaggerContainer, { StaggerItem } from '@/components/ui/stagger-container';

const HowItWorksSection = () => {
  const { t, isRTL } = useLanguage();

  const steps = [
    {
      icon: FileText,
      title: t('howItWorks.step1.title'),
      desc: t('howItWorks.step1.desc'),
      step: isRTL ? '١' : '1',
      color: 'from-gradient-purple to-gradient-purple/70',
    },
    {
      icon: Palette,
      title: t('howItWorks.step2.title'),
      desc: t('howItWorks.step2.desc'),
      step: isRTL ? '٢' : '2',
      color: 'from-gradient-purple/80 to-gradient-blue/80',
    },
    {
      icon: Rocket,
      title: t('howItWorks.step3.title'),
      desc: t('howItWorks.step3.desc'),
      step: isRTL ? '٣' : '3',
      color: 'from-gradient-blue to-gradient-blue/70',
    },
  ];

  return (
    <section id="how-it-works" className="py-28 relative">
      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-gradient-purple/5 via-transparent to-gradient-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal className="text-center mb-20">
          <Badge variant="outline" className="mb-4 border-gradient-purple/30 text-gradient-purple bg-gradient-purple/5">
            {isRTL ? 'كيف نعمل' : 'Our Process'}
          </Badge>
          <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${isRTL ? 'font-cairo' : 'font-sans'}`}>
            <span className="gradient-text">{t('howItWorks.title')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </ScrollReveal>

        <StaggerContainer className={`grid md:grid-cols-3 gap-8 max-w-5xl mx-auto ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          {steps.map((step, index) => (
            <StaggerItem key={index}>
              <div className="relative group h-full">
                <div className="glass rounded-3xl p-8 h-full transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 gradient-border hover:shadow-xl hover:shadow-gradient-purple/10">
                  {/* Icon container with gradient */}
                  <div className={`flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} mb-6 mx-auto shadow-lg shadow-gradient-purple/20 group-hover:scale-110 transition-transform duration-500`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Step number */}
                  <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-muted/80 backdrop-blur-sm flex items-center justify-center text-lg font-bold border border-border">
                    {step.step}
                  </div>
                  
                  <h3 className={`text-xl font-semibold mb-4 text-center ${isRTL ? 'font-cairo' : 'font-sans'}`}>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className={`hidden md:block absolute top-1/2 ${isRTL ? '-left-4' : '-right-4'} w-8 h-0.5 bg-gradient-to-r from-gradient-purple to-gradient-blue opacity-50`} />
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal delay={0.4} className="flex justify-center mt-12">
          <Badge variant="secondary" className="text-sm px-6 py-3 bg-muted/80 border border-gradient-purple/20 shadow-lg backdrop-blur-sm">
            <span className="text-gradient-purple mr-2">✓</span>
            {t('howItWorks.noContracts')}
          </Badge>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HowItWorksSection;
