import { forwardRef, lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import PainPointsSection from '@/components/sections/PainPointsSection';

const SnapSiteSystemSection = lazy(() => import('@/components/sections/SnapSiteSystemSection'));
const HowItWorksSection = lazy(() => import('@/components/sections/HowItWorksSection'));
const WhyUsSection = lazy(() => import('@/components/sections/WhyUsSection'));
const WhatYouGetSection = lazy(() => import('@/components/sections/WhatYouGetSection'));
const PricingSection = lazy(() => import('@/components/sections/PricingSection'));
const SubscriptionExplanationSection = lazy(() => import('@/components/sections/SubscriptionExplanationSection'));
const OurSnapsSection = lazy(() => import('@/components/sections/OurSnapsSection'));
const TestimonialsSection = lazy(() => import('@/components/sections/TestimonialsSection'));
const ContactSection = lazy(() => import('@/components/sections/ContactSection'));
const FAQSection = lazy(() => import('@/components/sections/FAQSection'));
const FinalCTASection = lazy(() => import('@/components/sections/FinalCTASection'));
const Footer = lazy(() => import('@/components/Footer'));

const Index = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <PainPointsSection />
        <Suspense fallback={null}>
          <SnapSiteSystemSection />
          <HowItWorksSection />
          <WhyUsSection />
          <WhatYouGetSection />
          <PricingSection />
          <SubscriptionExplanationSection />
          <OurSnapsSection />
          <TestimonialsSection />
          <FAQSection />
          <FinalCTASection />
          <ContactSection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
