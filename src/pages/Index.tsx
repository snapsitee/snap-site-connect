import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import WhyUsSection from '@/components/sections/WhyUsSection';
import WhatYouGetSection from '@/components/sections/WhatYouGetSection';
import PricingSection from '@/components/sections/PricingSection';
import SubscriptionExplanationSection from '@/components/sections/SubscriptionExplanationSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ContactSection from '@/components/sections/ContactSection';
import FAQSection from '@/components/sections/FAQSection';
import FinalCTASection from '@/components/sections/FinalCTASection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <WhyUsSection />
        <WhatYouGetSection />
        <PricingSection />
        <SubscriptionExplanationSection />
        <TestimonialsSection />
        <ContactSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
