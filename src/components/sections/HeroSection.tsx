import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

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
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-purple/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-blue/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-gradient-purple/10 to-gradient-blue/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${isRTL ? 'font-cairo' : 'font-sans'}`}>
            <span className="gradient-text">{t('hero.title')}</span>
          </h1>
          
          <p className={`text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto ${isRTL ? 'font-cairo' : 'font-sans'}`}>
            {t('hero.subtitle')}
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Button
              size="lg"
              onClick={() => scrollToSection('contact')}
              className="gradient-bg hover:opacity-90 transition-opacity text-lg px-8 py-6"
            >
              {t('hero.cta.start')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('pricing')}
              className="border-gradient-purple/50 hover:bg-gradient-purple/10 text-lg px-8 py-6"
            >
              {t('hero.cta.pricing')}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gradient-purple/50 to-transparent" />
    </section>
  );
};

export default HeroSection;
