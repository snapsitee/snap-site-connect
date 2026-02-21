import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import LiquidEther from '@/components/LiquidEther';

const HeroSection = () => {
  const { t, isRTL } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* LiquidEther animated background */}
      <div className="absolute inset-0">
        <LiquidEther
          colors={['#DC18EE', '#1E8CED', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          resolution={0.5}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-purple/10 border border-gradient-purple/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-gradient-purple" />
            <span className="text-sm font-medium text-gradient-purple">
              {isRTL ? 'مواقع احترافية بسرعة' : 'Professional Websites Fast'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight ${isRTL ? 'font-cairo' : 'font-sans'}`}
          >
            <span className="gradient-text">{t('hero.title')}</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className={`text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto ${isRTL ? 'font-cairo' : 'font-sans'}`}
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}
          >
            <Button
              size="lg"
              onClick={() => scrollToSection('contact')}
              className="gradient-bg hover:opacity-90 transition-all hover:scale-105 text-lg px-8 py-6 shadow-lg shadow-gradient-purple/25"
            >
              {t('hero.cta.start')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('pricing')}
              className="border-gradient-purple/50 hover:bg-gradient-purple/10 hover:border-gradient-purple text-lg px-8 py-6 transition-all hover:scale-105"
            >
              {t('hero.cta.pricing')}
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto"
          >
            {[
              { value: isRTL ? '+٥٠' : '50+', label: isRTL ? 'مشروع مكتمل' : 'Projects Done' },
              { value: isRTL ? '٧-١٠ أيام' : '7-10 Days', label: isRTL ? 'وقت التسليم' : 'Delivery Time' },
              { value: isRTL ? '+٩٨%' : '98%', label: isRTL ? 'رضا العملاء' : 'Satisfaction' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.1 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient line with animation */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gradient-purple/50 to-transparent"
      />
      
    </section>
  );
};

export default HeroSection;
