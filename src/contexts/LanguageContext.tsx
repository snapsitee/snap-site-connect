import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.howItWorks': 'How It Works',
    'nav.whyUs': 'Why Us',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'nav.getStarted': 'Book a Call',
    
    // Hero Section
    'hero.title': 'Bridging the gap between creative design and technical implementation',
    'hero.subtitle': 'Subscription-based websites without high upfront costs. Professional web design delivered fast, maintained forever.',
    'hero.cta.start': 'Get Started',
    'hero.cta.pricing': 'View Pricing',
    
    // How It Works
    'howItWorks.title': 'How SnapSite Works',
    'howItWorks.subtitle': 'Simple 3-step process to get your website live',
    'howItWorks.step1.title': 'Submit your request',
    'howItWorks.step1.desc': 'Tell us about your business and what you need',
    'howItWorks.step2.title': 'We design & build',
    'howItWorks.step2.desc': 'Our team creates your custom website',
    'howItWorks.step3.title': 'Launch & maintain',
    'howItWorks.step3.desc': 'We launch and handle all updates for you',
    'howItWorks.noContracts': 'No long-term contracts',
    
    // Why Choose Us
    'whyUs.title': 'Why Businesses Choose SnapSite',
    'whyUs.subtitle': 'Everything you need for a successful online presence',
    'whyUs.fastDelivery.title': 'Fast Delivery',
    'whyUs.fastDelivery.desc': 'Get your website live in just 7-10 days',
    'whyUs.subscription.title': 'Subscription Pricing',
    'whyUs.subscription.desc': 'Predictable monthly costs, no surprises',
    'whyUs.noUpfront.title': 'No Large Upfront Payments',
    'whyUs.noUpfront.desc': 'Start with just the setup fee',
    'whyUs.professionalUI.title': 'Professional Modern UI',
    'whyUs.professionalUI.desc': 'Beautiful designs that convert visitors',
    'whyUs.support.title': 'Ongoing Support',
    'whyUs.support.desc': '24/7 maintenance and technical support',
    
    // What You Get
    'whatYouGet.title': 'What You Get',
    'whatYouGet.subtitle': 'Everything included in your subscription',
    'whatYouGet.customWebsite': 'Custom website tailored to your business',
    'whatYouGet.modernDesign': 'Modern professional design',
    'whatYouGet.responsive': 'Fully responsive on all devices',
    'whatYouGet.hosting': 'Hosting & maintenance included',
    'whatYouGet.updates': 'Continuous updates',
    'whatYouGet.support': 'Technical support',
    
    // Pricing
    'pricing.title': 'Invest in Results, Not Upfront Costs',
    'pricing.subtitle': 'Everything you need to start getting customers online',
    'pricing.cardTitle': 'SnapSite Subscription',
    'pricing.setupFee': 'Setup Fee',
    'pricing.oneTime': 'one-time',
    'pricing.monthly': 'Monthly',
    'pricing.perMonth': '/month',
    'pricing.features.customWebsite': 'Custom business website',
    'pricing.features.professionalUI': 'Professional UI/UX',
    'pricing.features.responsive': 'Mobile responsive',
    'pricing.features.hosting': 'Hosting & maintenance',
    'pricing.features.unlimitedEdits': 'Admin Dashboard',
    'pricing.features.support': 'Continuous support',
    'pricing.features.delivery': 'Delivery time: 7-10 Days',
    'pricing.subscribe': 'Subscribe Now',
    'pricing.discount': 'OFF',
    
    // Subscription Explanation
    'subscription.title': 'How Your Subscription Works',
    'subscription.subtitle': 'Simple and flexible - cancel anytime',
    'subscription.step1.title': 'Pay Setup Fee',
    'subscription.step1.desc': 'One-time payment to start your project',
    'subscription.step2.title': 'System Delivered',
    'subscription.step2.desc': 'Your complete system goes live in 7 days',
    'subscription.step3.title': 'Monthly Billing',
    'subscription.step3.desc': 'Billing starts 30 days after delivery',
    'subscription.step4.title': 'Cancel Anytime',
    'subscription.step4.desc': 'No long-term commitment required',
    
    // Contact Form
    'contact.title': 'Get In Touch',
    'contact.subtitle': 'Ready to start? Fill out the form and we\'ll contact you shortly',
    'contact.fullName': 'Full Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.whatsapp': 'WhatsApp',
    'contact.businessDesc': 'Tell us about your business',
    'contact.submit': 'Send Message',
    'contact.success': 'Message sent successfully! We\'ll contact you soon.',
    'contact.error': 'Something went wrong. Please try again.',
    
    // Subscription Popup
    'popup.title': 'Subscribe to SnapSite',
    'popup.subtitle': 'Fill out the form and we\'ll get back to you',
    'popup.name': 'Name',
    'popup.email': 'Email',
    'popup.phone': 'Phone Number',
    'popup.whatsapp': 'WhatsApp Number',
    'popup.businessType': 'Business Type',
    'popup.submit': 'Submit',
    'popup.success': 'Thank you! We\'ll contact you soon.',
    
    // FAQ
    'faq.title': 'Got Questions?',
    'faq.subtitle': 'Here are the answers business owners ask most',
    'faq.q1': 'Is this just a website?',
    'faq.a1': 'No. SnapSite is a complete online system — your website, booking system, lead capture, and customer dashboard all in one. It\'s designed to get you more customers, not just look good.',
    'faq.q2': 'What if I already have a website?',
    'faq.a2': 'Most websites just sit there. SnapSite is built specifically to convert visitors into customers with booking, contact forms, and clear calls-to-action. We can replace or complement your existing site.',
    'faq.q3': 'How is this different from hiring a freelancer?',
    'faq.a3': 'Freelancers take months, often ghost you, and deliver a static page. SnapSite delivers in 7 days with ongoing support, updates, and a system built for results — not just a design.',
    'faq.q4': 'What happens after the 7 days?',
    'faq.a4': 'Your system goes live and starts working for you. We continue providing support, updates, and improvements as part of your monthly subscription.',
    'faq.q5': 'Can I cancel anytime?',
    'faq.a5': 'Yes — no contracts, no penalties. If you ever want to stop, just let us know. But once you see the results, you won\'t want to.',
    
    // Final CTA
    'cta.title': 'Ready to Transform Your Online Presence?',
    'cta.subtitle': 'Join hundreds of businesses already growing with SnapSite',
    'cta.button': 'Get Started Today',
    
    // Footer
    'footer.slogan': 'Engineering Your Digital Success',
    'footer.email': 'Email',
    'footer.phone': 'Phone',
    'footer.terms': 'Terms & Conditions',
    'footer.rights': 'All rights reserved',
    
    // Admin
    'admin.login': 'Admin Login',
    'admin.email': 'Email',
    'admin.password': 'Password',
    'admin.signIn': 'Sign In',
    'admin.signOut': 'Sign Out',
    'admin.dashboard': 'Dashboard',
    'admin.leads': 'Leads',
    'admin.interestedLeads': 'Interested Leads',
    'admin.pricing': 'Pricing',
    'admin.exportExcel': 'Export to Excel',
    'admin.markContacted': 'Mark Contacted',
    'admin.archive': 'Archive',
    'admin.delete': 'Delete',
    'admin.name': 'Name',
    'admin.phone': 'Phone',
    'admin.whatsapp': 'WhatsApp',
    'admin.message': 'Message',
    'admin.date': 'Date',
    'admin.status': 'Status',
    'admin.actions': 'Actions',
    'admin.new': 'New',
    'admin.contacted': 'Contacted',
    'admin.archived': 'Archived',
    'admin.setupFee': 'Setup Fee (EGP)',
    'admin.monthlyFee': 'Monthly Fee (EGP)',
    'admin.enableDiscount': 'Enable Discount',
    'admin.discountPercent': 'Discount Percentage',
    'admin.save': 'Save Changes',
    'admin.businessType': 'Business Type',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.howItWorks': 'كيف نعمل',
    'nav.whyUs': 'لماذا نحن',
    'nav.pricing': 'الأسعار',
    'nav.contact': 'تواصل معنا',
    'nav.getStarted': 'احجز مكالمة',
    
    // Hero Section
    'hero.title': 'نقوم بسد الفجوة بين التصميم الإبداعي والتنفيذ التقني',
    'hero.subtitle': 'مواقع احترافية بنظام الاشتراك بدون تكاليف ضخمة مقدماً. تصميم مواقع احترافي يتم تسليمه بسرعة وصيانته للأبد.',
    'hero.cta.start': 'ابدأ الآن',
    'hero.cta.pricing': 'الأسعار',
    
    // How It Works
    'howItWorks.title': 'كيف يعمل SnapSite',
    'howItWorks.subtitle': '٣ خطوات بسيطة لإطلاق موقعك',
    'howItWorks.step1.title': 'ابعت طلبك',
    'howItWorks.step1.desc': 'أخبرنا عن عملك وما تحتاجه',
    'howItWorks.step2.title': 'نُصمم ونُنفذ',
    'howItWorks.step2.desc': 'فريقنا يصمم موقعك المخصص',
    'howItWorks.step3.title': 'نُطلق ونُتابع',
    'howItWorks.step3.desc': 'نطلق الموقع ونتولى جميع التحديثات',
    'howItWorks.noContracts': 'بدون التزام طويل المدى',
    
    // Why Choose Us
    'whyUs.title': 'لماذا تختار الشركات SnapSite',
    'whyUs.subtitle': 'كل ما تحتاجه لتواجد ناجح على الإنترنت',
    'whyUs.fastDelivery.title': 'تسليم سريع',
    'whyUs.fastDelivery.desc': 'احصل على موقعك خلال ٧-١٠ أيام',
    'whyUs.subscription.title': 'أسعار اشتراك',
    'whyUs.subscription.desc': 'تكاليف شهرية متوقعة بدون مفاجآت',
    'whyUs.noUpfront.title': 'بدون دفعات كبيرة مقدماً',
    'whyUs.noUpfront.desc': 'ابدأ برسوم الإعداد فقط',
    'whyUs.professionalUI.title': 'واجهة مستخدم احترافية',
    'whyUs.professionalUI.desc': 'تصاميم جميلة تحول الزوار لعملاء',
    'whyUs.support.title': 'دعم مستمر',
    'whyUs.support.desc': 'صيانة ودعم تقني على مدار الساعة',
    
    // What You Get
    'whatYouGet.title': 'ما الذي ستحصل عليه',
    'whatYouGet.subtitle': 'كل شيء مشمول في اشتراكك',
    'whatYouGet.customWebsite': 'موقع مخصص لعملك',
    'whatYouGet.modernDesign': 'تصميم احترافي حديث',
    'whatYouGet.responsive': 'متجاوب على جميع الأجهزة',
    'whatYouGet.hosting': 'استضافة وصيانة مشمولة',
    'whatYouGet.updates': 'تحديثات مستمرة',
    'whatYouGet.support': 'دعم تقني',
    
    // Pricing
    'pricing.title': 'استثمر في النتائج، مش في التكاليف المقدمة',
    'pricing.subtitle': 'كل اللي محتاجه عشان تبدأ تجيب عملاء أونلاين',
    'pricing.cardTitle': 'اشتراك SnapSite',
    'pricing.setupFee': 'رسوم الإعداد',
    'pricing.oneTime': 'مرة واحدة',
    'pricing.monthly': 'شهرياً',
    'pricing.perMonth': '/شهر',
    'pricing.features.customWebsite': 'موقع أعمال مخصص',
    'pricing.features.professionalUI': 'واجهة مستخدم احترافية',
    'pricing.features.responsive': 'متجاوب مع الموبايل',
    'pricing.features.hosting': 'استضافة وصيانة',
    'pricing.features.unlimitedEdits': 'لوحة تحكم',
    'pricing.features.support': 'دعم مستمر',
    'pricing.features.delivery': 'وقت التسليم: ٧-١٠ أيام',
    'pricing.subscribe': 'اشترك الآن',
    'pricing.discount': 'خصم',
    
    // Subscription Explanation
    'subscription.title': 'كيف يعمل اشتراكك',
    'subscription.subtitle': 'بسيط ومرن - ألغِ في أي وقت',
    'subscription.step1.title': 'ادفع رسوم الإعداد',
    'subscription.step1.desc': 'دفعة واحدة لبدء مشروعك',
    'subscription.step2.title': 'النظام يتسلم',
    'subscription.step2.desc': 'نظامك الكامل يبدأ يشتغل خلال ٧ أيام',
    'subscription.step3.title': 'الفوترة الشهرية',
    'subscription.step3.desc': 'تبدأ الفوترة بعد ٣٠ يوماً من التسليم',
    'subscription.step4.title': 'ألغِ في أي وقت',
    'subscription.step4.desc': 'لا التزام طويل المدى',
    
    // Contact Form
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'جاهز للبدء؟ املأ النموذج وسنتواصل معك قريباً',
    'contact.fullName': 'الاسم الكامل',
    'contact.email': 'البريد الإلكتروني',
    'contact.phone': 'الهاتف',
    'contact.whatsapp': 'واتساب',
    'contact.businessDesc': 'أخبرنا عن عملك',
    'contact.submit': 'إرسال الرسالة',
    'contact.success': 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.',
    'contact.error': 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    
    // Subscription Popup
    'popup.title': 'اشترك في SnapSite',
    'popup.subtitle': 'املأ النموذج وسنتواصل معك',
    'popup.name': 'الاسم',
    'popup.email': 'البريد الإلكتروني',
    'popup.phone': 'رقم الهاتف',
    'popup.whatsapp': 'رقم الواتساب',
    'popup.businessType': 'نوع العمل',
    'popup.submit': 'إرسال',
    'popup.success': 'شكراً لك! سنتواصل معك قريباً.',
    
    // FAQ
    'faq.title': 'الأسئلة الشائعة',
    'faq.subtitle': 'لديك أسئلة؟ لدينا الإجابات',
    'faq.q1': 'كيف يعمل الاشتراك؟',
    'faq.a1': 'تدفع رسوم إعداد لمرة واحدة ونبني موقعك. بعد التسليم، تبدأ الفوترة الشهرية بعد ٣٠ يوماً. اشتراكك يشمل الاستضافة والصيانة ولوحة تحكم.',
    'faq.q2': 'هل يمكنني الإلغاء في أي وقت؟',
    'faq.a2': 'نعم! لا توجد عقود طويلة المدى. يمكنك إلغاء اشتراكك في أي وقت بدون غرامة.',
    'faq.q3': 'كم يستغرق التسليم؟',
    'faq.a3': 'معظم المواقع يتم تسليمها خلال ٧-١٠ أيام عمل بعد استلام كل المعلومات المطلوبة منك.',
    'faq.q4': 'ماذا يحدث إذا لم أجدد؟',
    'faq.a4': 'إذا ألغيت، سيتم إيقاف موقعك. يمكنك تصدير محتواك قبل الإلغاء إذا أردت.',
    'faq.q5': 'هل يمكنني ترقية الميزات لاحقاً؟',
    'faq.a5': 'بالتأكيد! يمكنك طلب ميزات إضافية أو تغييرات في أي وقت. قد تكون هناك تكاليف إضافية للتطوير المخصص.',
    
    // Final CTA
    'cta.title': 'جاهز لتحويل تواجدك على الإنترنت؟',
    'cta.subtitle': 'انضم لمئات الشركات التي تنمو مع SnapSite',
    'cta.button': 'ابدأ اليوم',
    
    // Footer
    'footer.slogan': 'نهندس نجاحك الرقمي',
    'footer.email': 'البريد الإلكتروني',
    'footer.phone': 'الهاتف',
    'footer.terms': 'الشروط والأحكام',
    'footer.rights': 'جميع الحقوق محفوظة',
    
    // Admin
    'admin.login': 'تسجيل دخول المسؤول',
    'admin.email': 'البريد الإلكتروني',
    'admin.password': 'كلمة المرور',
    'admin.signIn': 'تسجيل الدخول',
    'admin.signOut': 'تسجيل الخروج',
    'admin.dashboard': 'لوحة التحكم',
    'admin.leads': 'العملاء المحتملين',
    'admin.interestedLeads': 'المهتمين بالاشتراك',
    'admin.pricing': 'الأسعار',
    'admin.exportExcel': 'تصدير إلى Excel',
    'admin.markContacted': 'تم التواصل',
    'admin.archive': 'أرشفة',
    'admin.delete': 'حذف',
    'admin.name': 'الاسم',
    'admin.phone': 'الهاتف',
    'admin.whatsapp': 'واتساب',
    'admin.message': 'الرسالة',
    'admin.date': 'التاريخ',
    'admin.status': 'الحالة',
    'admin.actions': 'الإجراءات',
    'admin.new': 'جديد',
    'admin.contacted': 'تم التواصل',
    'admin.archived': 'مؤرشف',
    'admin.setupFee': 'رسوم الإعداد (ج.م)',
    'admin.monthlyFee': 'الرسوم الشهرية (ج.م)',
    'admin.enableDiscount': 'تفعيل الخصم',
    'admin.discountPercent': 'نسبة الخصم',
    'admin.save': 'حفظ التغييرات',
    'admin.businessType': 'نوع العمل',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('snapsite-language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('snapsite-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    if (isRTL) {
      document.body.classList.add('font-cairo');
      document.body.classList.remove('font-sans');
    } else {
      document.body.classList.add('font-sans');
      document.body.classList.remove('font-cairo');
    }
  }, [language, dir, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
