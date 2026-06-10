import FeaturesSection from '@/components/FeaturesSection'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import OnboardingSection from '@/components/OnboardingSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import React from 'react'

export default function page() {
  return (
    <div>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <OnboardingSection />
      <TestimonialsSection />
      <Footer />
    </div>
  )
}
