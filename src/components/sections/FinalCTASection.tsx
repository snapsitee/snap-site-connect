import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const FinalCTASection = () => {
  const { t, isRTL } = useLanguage();

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-bg opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${isRTL ? 'font-cairo' : 'font-sans'}`}>
            <span className="gradient-text">{t('cta.title')}</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {t('cta.subtitle')}
          </p>
          <Button
            size="lg"
            onClick={scrollToContact}
            className="gradient-bg hover:opacity-90 transition-opacity text-lg px-8 py-6 group"
          >
            {t('cta.button')}
            {isRTL ? (
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
