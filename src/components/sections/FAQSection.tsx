import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQSection = () => {
  const { t, isRTL } = useLanguage();

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isRTL ? 'font-cairo' : 'font-sans'}`}>
              <span className="gradient-text">{t('faq.title')}</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t('faq.subtitle')}
            </p>
          </div>

          <div className="glass rounded-3xl p-6 md:p-8 gradient-border">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-border"
                >
                  <AccordionTrigger className={`text-left hover:no-underline ${isRTL ? 'flex-row-reverse text-right font-cairo' : 'font-sans'}`}>
                    <span className="font-semibold">{faq.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className={`text-muted-foreground ${isRTL ? 'text-right font-cairo' : 'font-sans'}`}>
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
