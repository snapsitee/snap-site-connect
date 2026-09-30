import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import LightRays from '@/components/LightRays';

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const HeroSection = () => {
  const { isRTL } = useLanguage();
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const font = isRTL ? 'font-cairo' : 'font-sans';

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 bg-background">
      <div className="absolute inset-0 overflow-hidden opacity-25" aria-hidden="true">
        <LightRays raysOrigin="top-center" raysSpeed={1} lightSpread={0.5} rayLength={3} followMouse mouseInfluence={0.1} noiseAmount={0} distortion={0} pulsating={false} fadeDistance={1} saturation={1} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div {...fade(0.05)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-card/40 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {isRTL ? 'Core Studio · وكالة رقمية متكاملة' : 'Core Studio · Full-Service Digital Agency'}
            </span>
          </motion.div>

          <motion.h1 {...fade(0.15)} className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6 text-foreground ${font}`}>
            {isRTL ? 'ابني، أتمت، وكبّر.' : 'Build, Automate, and Scale.'}
          </motion.h1>

          <motion.p {...fade(0.25)} className={`text-base md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed ${font}`}>
            {isRTL
              ? 'Core Studio هو المحرك الرقمي الكامل لبيزنسك. بنجمعلك مواقع بنظام الاشتراك، أتمتة قوية للباك إند بـ n8n، تصميم جرافيك عالي المستوى، ونمو مستهدف على السوشيال ميديا — في شراكة واحدة متكاملة.'
              : 'Core Studio is your complete digital engine. We combine custom Web-as-a-Service, powerful n8n backend automation, high-end graphic design, and targeted social media growth into one cohesive partnership.'}
          </motion.p>

          <motion.div {...fade(0.35)} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => go('pricing')} className="text-base px-8 py-6 gap-2">
              {isRTL ? 'شوف الباقات' : 'View Packages'}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => go('contact')} className="text-base px-8 py-6 border-border/60 bg-transparent hover:bg-card">
              {isRTL ? 'تواصل معانا' : 'Contact Us'}
            </Button>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};

export default HeroSection;
