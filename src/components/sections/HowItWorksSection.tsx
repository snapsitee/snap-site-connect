import { useLanguage } from '@/contexts/LanguageContext';
import { Search, MousePointerClick, ClipboardCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ScrollReveal from '@/components/ui/scroll-reveal';
import StaggerContainer, { StaggerItem } from '@/components/ui/stagger-container';
import BorderGlow from '@/components/ui/BorderGlow';

const HowItWorksSection = () => {
  const { t, isRTL } = useLanguage();

  const steps = [
    {
      icon: Search,
      titleEn: 'Your Customer Finds You Online',
      titleAr: 'عميلك بيلاقيك أونلاين',
      descEn: 'Through Google, social media, or a link you share — they land on your professional page',
      descAr: 'من جوجل أو السوشيال ميديا أو لينك بتشاركه — بيوصل لصفحتك الاحترافية',
      step: isRTL ? '١' : '1',
      iconBg: 'from-purple-500 to-pink-500',
    },
    {
      icon: MousePointerClick,
      titleEn: 'They Take Action Instantly',
      titleAr: 'بياخد أكشن فوراً',
      descEn: 'Book an appointment, send a message, or call you — in just one click',
      descAr: 'بيحجز موعد أو بيبعت رسالة أو بيتصل — بضغطة واحدة بس',
      step: isRTL ? '٢' : '2',
      iconBg: 'from-purple-600 to-blue-500',
    },
    {
      icon: ClipboardCheck,
      titleEn: 'You Receive Everything Organized',
      titleAr: 'بتستلم كل حاجة منظمة',
      descEn: 'Every lead, every booking — organized and ready for you to follow up',
      descAr: 'كل عميل محتمل وكل حجز — منظم وجاهز تتابع عليه',
      step: isRTL ? '٣' : '3',
      iconBg: 'from-blue-400 to-cyan-400',
    },
  ];

  return (
    <section id="how-it-works" className="py-28 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-gradient-purple/5 via-transparent to-gradient-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-purple/10 border border-gradient-purple/30 text-gradient-purple mb-6">
            {isRTL ? 'كيف بيشتغل' : 'How It Works'}
          </span>
          <h2 className={`text-3xl md:text-5xl font-bold mb-4 gradient-text ${isRTL ? 'font-cairo' : ''}`}>
            {isRTL ? 'إزاي عملاءك بيلاقوك' : 'How Your Customers Find You'}
          </h2>
          <p className={`text-muted-foreground text-lg max-w-2xl mx-auto ${isRTL ? 'font-cairo' : ''}`}>
            {isRTL ? 'نظام بسيط بيجيبلك عملاء أوتوماتيك' : 'A simple system that brings you customers automatically'}
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          {steps.map((step, index) => (
            <StaggerItem key={index}>
              <div className="relative h-full">
                <BorderGlow
                  glowColor="270 70 60"
                  backgroundColor="hsl(222 47% 6%)"
                  colors={['#DC18EE', '#1E8CED', '#a855f7']}
                  borderRadius={16}
                  glowRadius={30}
                  glowIntensity={0.8}
                  fillOpacity={0.3}
                  coneSpread={20}
                >
                  <div className={`p-8 flex flex-col items-center text-center gap-4 min-h-[280px] relative ${isRTL ? 'font-cairo' : ''}`}>
                    {/* Step number */}
                    <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} w-9 h-9 rounded-full bg-muted/80 backdrop-blur-sm flex items-center justify-center text-sm font-bold border border-border`}>
                      {step.step}
                    </div>

                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.iconBg} flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-foreground mt-2">
                      {isRTL ? step.titleAr : step.titleEn}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {isRTL ? step.descAr : step.descEn}
                    </p>
                  </div>
                </BorderGlow>

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
            {isRTL ? 'بدون التزام طويل المدى' : 'No long-term contracts required'}
          </Badge>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HowItWorksSection;
