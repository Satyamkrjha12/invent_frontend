import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import OnboardingSection from '@/components/OnboardingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import React from 'react'

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      {children}
      <FeaturesSection />
      <OnboardingSection />
      <TestimonialsSection/>
      <Footer />

    </div>
  )
}
