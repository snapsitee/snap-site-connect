import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/ui/scroll-reveal';
import StaggerContainer, { StaggerItem } from '@/components/ui/stagger-container';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    name: { en: 'Ahmed Hassan', ar: 'أحمد حسن' },
    role: { en: 'Restaurant Owner', ar: 'صاحب مطعم' },
    rating: 5,
    review: {
      en: "SnapSite transformed our online presence completely. The website they built increased our orders by 40% in just two months. Highly recommended!",
      ar: "غيّر SnapSite تواجدنا على الإنترنت بالكامل. الموقع اللي بنوه زوّد طلباتنا ٤٠٪ في شهرين بس. أنصح بيهم جداً!"
    },
    initials: 'AH',
  },
  {
    name: { en: 'Fatma El-Sayed', ar: 'فاطمة السيد' },
    role: { en: 'Café Owner', ar: 'صاحبة كافيه' },
    rating: 5,
    review: {
      en: "Professional team that truly understands design. They delivered our café website faster than expected and the monthly support is excellent.",
      ar: "فريق محترف فاهم التصميم فعلاً. سلّموا موقع الكافيه أسرع من المتوقع والدعم الشهري ممتاز."
    },
    initials: 'FE',
  },
  {
    name: { en: 'Mohamed Adel', ar: 'محمد عادل' },
    role: { en: 'Gym Owner', ar: 'صاحب جيم' },
    rating: 5,
    review: {
      en: "The subscription model is perfect for my business. No huge upfront costs and they handle everything. My members love the booking system!",
      ar: "نظام الاشتراك مثالي لشغلي. مفيش تكاليف ضخمة مقدماً وهما بيتعاملوا مع كل حاجة. أعضائي بيحبوا نظام الحجز!"
    },
    initials: 'MA',
  },
  {
    name: { en: 'Nour Ibrahim', ar: 'نور إبراهيم' },
    role: { en: 'Dental Clinic Manager', ar: 'مديرة عيادة أسنان' },
    rating: 5,
    review: {
      en: "From day one, SnapSite impressed us with their professionalism. The website looks premium and our patient bookings have increased significantly.",
      ar: "من أول يوم، SnapSite أبهرونا باحترافيتهم. الموقع شكله فخم وحجوزات المرضى زادت بشكل ملحوظ."
    },
    initials: 'NI',
  },
  {
    name: { en: 'Karim Mostafa', ar: 'كريم مصطفى' },
    role: { en: 'Real Estate Agent', ar: 'وكيل عقارات' },
    rating: 5,
    review: {
      en: "The team created an amazing property showcase website. Clean design, fast loading, and the unlimited updates feature is a game-changer!",
      ar: "الفريق عمل موقع عرض عقارات مذهل. تصميم نظيف، تحميل سريع، وميزة التحديثات غير المحدودة حاجة رهيبة!"
    },
    initials: 'KM',
  },
  {
    name: { en: 'Sara Mahmoud', ar: 'سارة محمود' },
    role: { en: 'Photography Studio Owner', ar: 'صاحبة استوديو تصوير' },
    rating: 5,
    review: {
      en: "My portfolio website is stunning! SnapSite understood exactly what I needed. The responsive design works perfectly on all devices.",
      ar: "موقع معرض أعمالي مذهل! SnapSite فهموا بالظبط اللي محتاجاه. التصميم المتجاوب شغال تمام على كل الأجهزة."
    },
    initials: 'SM',
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
          }`}
        />
      ))}
    </div>
  );
};

const TestimonialsSection = () => {
  const { t, isRTL, language } = useLanguage();

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-primary">
                {isRTL ? 'آراء عملائنا' : 'Client Reviews'}
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {isRTL ? 'ماذا يقول عملاؤنا' : 'What Our Clients Say'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isRTL
                ? 'انضم لمئات العملاء السعداء الذين حوّلوا أعمالهم مع SnapSite'
                : 'Join hundreds of happy clients who transformed their business with SnapSite'}
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="h-full p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 relative group"
              >
                {/* Quote icon */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-12 h-12 text-primary" />
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Review */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.review[language]}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-auto">
                  <Avatar className="w-12 h-12 bg-gradient-to-br from-primary to-accent">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name[language]}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role[language]}
                    </p>
                  </div>
                </div>

                {/* Gradient border effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Trust indicators */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="flex -space-x-2">
                {['AH', 'FE', 'MA', 'NI'].map((initials, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-semibold text-primary-foreground border-2 border-background"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {isRTL ? 'تقييم ٤.٩ من ٥ من أكثر من ٥٠ عميل' : '4.9/5 rating from 50+ clients'}
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;
