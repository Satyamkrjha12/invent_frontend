import FeaturesSection from "@/components/common/FeaturesSection";
import Footer from "@/components/common/Footer";
import LandingHeader from "@/components/common/LandingHeader";
import HeroSection from "@/components/common/HeroSection";
import OnboardingSection from "@/components/common/OnboardingSection";
import TestimonialsSection from "@/components/common/TestimonialsSection";
import React from "react";

export default function Page() {
  return (
    <div>
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <OnboardingSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
