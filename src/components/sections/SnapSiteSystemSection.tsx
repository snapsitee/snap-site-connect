import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, MousePointerClick, LayoutDashboard } from 'lucide-react';
import ScrollReveal from '@/components/ui/scroll-reveal';
import StaggerContainer, { StaggerItem } from '@/components/ui/stagger-container';

const SnapSiteSystemSection = () => {
  const { isRTL } = useLanguage();

  const cards = [
    {
      icon: Globe,
      titleEn: 'A Website That Sells For You',
      titleAr: 'موقع بيبيعلك',
      descEn: 'Designed to convert visitors into paying customers, not just look pretty.',
      descAr: 'مصمم يحوّل الزوار لعملاء يدفعوا، مش بس شكل حلو.',
      iconBg: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: MousePointerClick,
      titleEn: 'Customers Book & Contact Easily',
      titleAr: 'عملاءك بيحجزوا ويتواصلوا بسهولة',
      descEn: 'One-click booking, WhatsApp, and contact forms — your customers take action instantly.',
      descAr: 'حجز بضغطة، واتساب، وفورم تواصل — عملاءك بياخدوا أكشن فوراً.',
      iconBg: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: LayoutDashboard,
      titleEn: 'Everything Organized In One Place',
      titleAr: 'كل حاجة منظمة قدامك',
      descEn: 'See all your leads, bookings, and customer info in a simple dashboard.',
      descAr: 'شوف كل العملاء المحتملين والحجوزات وبياناتهم في لوحة تحكم بسيطة.',
      iconBg: 'from-cyan-400 to-cyan-500',
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-6">
              {isRTL ? 'نظام SnapSite' : 'The SnapSite System'}
            </span>
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 gradient-text ${isRTL ? 'font-cairo' : ''}`}>
              {isRTL ? 'كل اللي محتاجه عشان تجيب عملاء أكتر' : 'Everything You Need to Get More Customers'}
            </h2>
            <p className={`text-muted-foreground text-lg max-w-2xl mx-auto ${isRTL ? 'font-cairo' : ''}`}>
              {isRTL
                ? 'مش مجرد موقع — نظام كامل بيشتغل ٢٤/٧ عشانك'
                : 'Not just a website — a complete system that works for you 24/7'}
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {cards.map((card, i) => (
            <StaggerItem key={i}>
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
                <div className={`p-8 flex flex-col items-center text-center gap-4 min-h-[280px] ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center shadow-lg`}>
                    <card.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mt-2">
                    {isRTL ? card.titleAr : card.titleEn}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {isRTL ? card.descAr : card.descEn}
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

export default SnapSiteSystemSection;
