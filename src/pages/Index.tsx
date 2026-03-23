import { forwardRef } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import PainPointsSection from '@/components/sections/PainPointsSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import WhyUsSection from '@/components/sections/WhyUsSection';
import WhatYouGetSection from '@/components/sections/WhatYouGetSection';
import PricingSection from '@/components/sections/PricingSection';
import SubscriptionExplanationSection from '@/components/sections/SubscriptionExplanationSection';
import OurSnapsSection from '@/components/sections/OurSnapsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ContactSection from '@/components/sections/ContactSection';
import FAQSection from '@/components/sections/FAQSection';
import FinalCTASection from '@/components/sections/FinalCTASection';
import Footer from '@/components/Footer';

const Index = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <WhyUsSection />
        <WhatYouGetSection />
        <PricingSection />
        <SubscriptionExplanationSection />
        <OurSnapsSection />
        <TestimonialsSection />
        <ContactSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
