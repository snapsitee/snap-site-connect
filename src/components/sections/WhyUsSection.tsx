import { useLanguage } from '@/contexts/LanguageContext';
import { Zap, Wallet, Target, Headphones, TrendingUp, ShieldCheck } from 'lucide-react';
import ScrollReveal from '@/components/ui/scroll-reveal';
import StaggerContainer, { StaggerItem } from '@/components/ui/stagger-container';
import BorderGlow from '@/components/ui/BorderGlow';

const WhyUsSection = () => {
  const { isRTL } = useLanguage();

  const features = [
    {
      icon: Zap,
      titleEn: 'Ready in 7 Days, Not Months',
      titleAr: 'جاهز في ٧ أيام مش شهور',
      descEn: 'While agencies take weeks, your system is live and getting you customers in just 7 days',
      descAr: 'بينما الشركات بتاخد أسابيع، نظامك بيكون شغّال وبيجيبلك عملاء في ٧ أيام بس',
      iconBg: 'from-amber-500 to-orange-500',
    },
    {
      icon: Wallet,
      titleEn: 'No Huge Upfront Cost',
      titleAr: 'من غير تكاليف ضخمة مقدماً',
      descEn: 'Start with a small setup fee instead of paying 40,000+ EGP upfront to an agency',
      descAr: 'ابدأ برسوم إعداد بسيطة بدل ما تدفع +٤٠,٠٠٠ ج.م مقدم لشركة',
      iconBg: 'from-emerald-500 to-green-600',
    },
    {
      icon: Target,
      titleEn: 'Built to Get You Customers',
      titleAr: 'مصمم يجيبلك عملاء',
      descEn: 'Every page, every button is designed to convert visitors into paying customers',
      descAr: 'كل صفحة وكل زر مصمم يحوّل الزوار لعملاء يدفعوا',
      iconBg: 'from-pink-500 to-rose-500',
    },
    {
      icon: Headphones,
      titleEn: 'Ongoing Support Included',
      titleAr: 'دعم مستمر معاك',
      descEn: 'Updates, fixes, and improvements — we handle everything so you focus on your business',
      descAr: 'تحديثات وإصلاحات وتحسينات — بنتولى كل حاجة عشان تركز على شغلك',
      iconBg: 'from-purple-500 to-fuchsia-500',
    },
    {
      icon: TrendingUp,
      titleEn: 'Designed to Convert',
      titleAr: 'مصمم للنتائج',
      descEn: 'Not just a pretty website — a system engineered for real business results',
      descAr: 'مش مجرد موقع حلو — نظام مهندس لنتائج بيزنس حقيقية',
      iconBg: 'from-cyan-500 to-teal-500',
    },
    {
      icon: ShieldCheck,
      titleEn: 'Secure & Reliable',
      titleAr: 'آمن وموثوق',
      descEn: 'We ensure your website and data are protected with the latest security standards',
      descAr: 'بنتأكد إن موقعك وبياناتك محمية بأحدث معايير الأمان',
      iconBg: 'from-blue-500 to-indigo-500',
    },
  ];

  return (
    <section id="why-us" className="py-28 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-gradient-purple/5 to-gradient-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-purple/10 border border-gradient-purple/30 text-gradient-purple mb-6">
            {isRTL ? 'ليه SnapSite' : 'Why SnapSite'}
          </span>
          <h2 className={`text-3xl md:text-5xl font-bold mb-4 gradient-text ${isRTL ? 'font-cairo' : ''}`}>
            {isRTL ? 'إيه اللي يخلّي SnapSite مختلف' : 'Why SnapSite Is Different'}
          </h2>
          <p className={`text-muted-foreground text-lg max-w-2xl mx-auto ${isRTL ? 'font-cairo' : ''}`}>
            {isRTL ? 'مصمم للنتائج، مش بس الشكل' : 'Built for results, not just aesthetics'}
          </p>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.08} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <StaggerItem key={index} className="h-full">
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
                <div className={`p-6 h-full ${isRTL ? 'font-cairo text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.iconBg} flex items-center justify-center shrink-0 shadow-lg`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      {isRTL ? feature.titleAr : feature.titleEn}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {isRTL ? feature.descAr : feature.descEn}
                  </p>
                </div>
              </BorderGlow>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default WhyUsSection;
