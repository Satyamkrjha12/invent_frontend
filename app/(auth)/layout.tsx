import FeaturesSection from '@/components/common/FeaturesSection';
import Footer from '@/components/common/Footer';
import LandingHeader from '@/components/common/LandingHeader';
import OnboardingSection from '@/components/common/OnboardingSection';
import TestimonialsSection from '@/components/common/TestimonialsSection';
import React from 'react'

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <LandingHeader />
      {children}
      <FeaturesSection />
      <OnboardingSection />
      <TestimonialsSection/>
      <Footer />

    </div>
  )
}
