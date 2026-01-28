import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Palette, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const HowItWorksSection = () => {
  const { t, isRTL } = useLanguage();

  const steps = [
    {
      icon: FileText,
      title: t('howItWorks.step1.title'),
      desc: t('howItWorks.step1.desc'),
      step: isRTL ? '١' : '1',
    },
    {
      icon: Palette,
      title: t('howItWorks.step2.title'),
      desc: t('howItWorks.step2.desc'),
      step: isRTL ? '٢' : '2',
    },
    {
      icon: Rocket,
      title: t('howItWorks.step3.title'),
      desc: t('howItWorks.step3.desc'),
      step: isRTL ? '٣' : '3',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isRTL ? 'font-cairo' : 'font-sans'}`}>
            <span className="gradient-text">{t('howItWorks.title')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className={`grid md:grid-cols-3 gap-8 max-w-5xl mx-auto ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="glass rounded-2xl p-8 h-full transition-all duration-300 hover:scale-105 gradient-border">
                <div className="flex items-center justify-center w-16 h-16 rounded-full gradient-bg mb-6 mx-auto">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
                <h3 className={`text-xl font-semibold mb-3 text-center ${isRTL ? 'font-cairo' : 'font-sans'}`}>
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-center">
                  {step.desc}
                </p>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={`hidden md:block absolute top-1/2 ${isRTL ? '-left-4' : '-right-4'} w-8 h-0.5 bg-gradient-to-r from-gradient-purple to-gradient-blue`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Badge variant="secondary" className="text-sm px-4 py-2 bg-muted border border-gradient-purple/30">
            {t('howItWorks.noContracts')}
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
