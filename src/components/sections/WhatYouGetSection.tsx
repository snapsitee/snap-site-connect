import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ScrollReveal from '@/components/ui/scroll-reveal';
import BorderGlow from '@/components/ui/BorderGlow';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const WhatYouGetSection = () => {
  const { t, isRTL } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const benefits = [
    {
      en: 'Save 10+ hours every week on bookings & follow-ups',
      ar: 'وفّر +١٠ ساعات أسبوعياً من الحجوزات والمتابعات',
    },
    {
      en: 'Get more customers automatically through your website',
      ar: 'اكسب عملاء أكتر أوتوماتيك من موقعك',
    },
    {
      en: 'Look more professional than your competitors',
      ar: 'اظهر أكثر احترافية من منافسيك',
    },
    {
      en: 'Never miss a lead or booking again',
      ar: 'ما تفوّتش عميل أو حجز تاني',
    },
    {
      en: 'Organize your entire workflow in one place',
      ar: 'نظّم كل شغلك في مكان واحد',
    },
    {
      en: 'Focus on your work while SnapSite handles the rest',
      ar: 'ركّز على شغلك وSnapSite يتولى الباقي',
    },
  ];

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-purple/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-blue/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-gradient-purple/30 text-gradient-purple bg-gradient-purple/5">
              <Gift className="w-3 h-3 mr-1" />
              {isRTL ? 'ما تحصل عليه' : 'What You Get'}
            </Badge>
            <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${isRTL ? 'font-cairo' : 'font-sans'}`}>
              <span className="gradient-text">
                {isRTL ? 'إيه اللي هيتغير في بيزنسك' : 'What Changes For Your Business'}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {isRTL ? 'نتائج حقيقية هتشوفها من أول يوم' : "Real results you'll see from day one"}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <BorderGlow
              glowColor="270 70 60"
              backgroundColor="hsl(222 47% 6%)"
              colors={['#DC18EE', '#1E8CED', '#a855f7']}
              borderRadius={24}
              glowRadius={30}
              glowIntensity={0.8}
              fillOpacity={0.3}
              coneSpread={20}
            >
              <div 
                ref={containerRef}
                className="p-8 md:p-12 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-gradient-purple/20 to-transparent rounded-full blur-2xl" />
                
                <div 
                  className={`grid sm:grid-cols-2 gap-x-12 gap-y-8 relative z-10 ${isRTL ? 'text-right' : 'text-left'}`} 
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.1 * index,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ 
                          duration: 0.4, 
                          delay: 0.15 * index,
                          type: 'spring',
                          stiffness: 200
                        }}
                        className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center flex-shrink-0 shadow-lg shadow-gradient-purple/25"
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                      <span className={`text-lg ${isRTL ? 'font-cairo' : 'font-sans'}`}>
                        {isRTL ? benefit.ar : benefit.en}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </BorderGlow>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default WhatYouGetSection;
