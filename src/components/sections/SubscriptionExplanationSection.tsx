import { useLanguage } from '@/contexts/LanguageContext';
import { CreditCard, Package, Calendar, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import ScrollReveal from '@/components/ui/scroll-reveal';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const SubscriptionExplanationSection = () => {
  const { t, isRTL } = useLanguage();
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(timelineRef, { once: true, margin: '-100px' });

  const steps = [
    {
      icon: CreditCard,
      title: t('subscription.step1.title'),
      desc: t('subscription.step1.desc'),
      color: 'from-gradient-purple to-pink-500',
    },
    {
      icon: Package,
      title: t('subscription.step2.title'),
      desc: t('subscription.step2.desc'),
      color: 'from-gradient-blue to-cyan-500',
    },
    {
      icon: Calendar,
      title: t('subscription.step3.title'),
      desc: t('subscription.step3.desc'),
      color: 'from-gradient-purple to-gradient-blue',
    },
    {
      icon: XCircle,
      title: t('subscription.step4.title'),
      desc: t('subscription.step4.desc'),
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <section className="py-28 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-gradient-purple/5 to-gradient-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-gradient-purple/30 text-gradient-purple bg-gradient-purple/5">
            <RefreshCw className="w-3 h-3 mr-1" />
            {isRTL ? 'كيف يعمل الاشتراك' : 'How Subscription Works'}
          </Badge>
          <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${isRTL ? 'font-cairo' : 'font-sans'}`}>
            <span className="gradient-text">{t('subscription.title')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('subscription.subtitle')}
          </p>
        </ScrollReveal>

        <div ref={timelineRef} className={`max-w-4xl mx-auto ${isRTL ? 'direction-rtl' : ''}`}>
          <div className="relative">
            {/* Animated vertical line */}
            <motion.div 
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ transformOrigin: 'top' }}
              className={`absolute ${isRTL ? 'right-6' : 'left-6'} top-0 bottom-0 w-0.5 bg-gradient-to-b from-gradient-purple to-gradient-blue md:left-1/2 md:-translate-x-1/2 md:right-auto`} 
            />

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                className={`relative flex items-start gap-6 mb-12 last:mb-0 ${
                  isRTL ? 'flex-row-reverse' : ''
                } ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.3 + index * 0.15,
                    type: 'spring',
                    stiffness: 200
                  }}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center z-10 flex-shrink-0 shadow-lg ${
                    isRTL ? '' : ''
                  } md:absolute md:left-1/2 md:-translate-x-1/2`}
                >
                  <step.icon className="w-7 h-7 text-white" />
                </motion.div>

                <div className={`flex-1 glass rounded-2xl p-6 gradient-border hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 hover:shadow-xl hover:shadow-gradient-purple/5 ${
                  index % 2 === 0 ? 'md:mr-auto md:ml-0 md:pr-20' : 'md:ml-auto md:mr-0 md:pl-20'
                } md:w-[calc(50%-3rem)]`}>
                  <h3 className={`text-xl font-semibold mb-3 ${isRTL ? 'font-cairo text-right' : 'font-sans'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-muted-foreground leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionExplanationSection;
