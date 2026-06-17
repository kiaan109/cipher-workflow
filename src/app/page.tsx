'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import CustomCursor from '@/components/landing/CustomCursor';
import LoadingScreen from '@/components/landing/LoadingScreen';
import ParticleCanvas from '@/components/landing/ParticleCanvas';
import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import BandIntegrationSection from '@/components/landing/BandIntegrationSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import IntegrationsSection from '@/components/landing/IntegrationsSection';
import StatsSection from '@/components/landing/StatsSection';
import JudgesSection from '@/components/landing/JudgesSection';
import FooterSection from '@/components/landing/FooterSection';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="landing-page" style={{ background: '#000', minHeight: '100dvh', overflowX: 'hidden' }}>
      <CustomCursor />

      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          <ParticleCanvas />
          <LandingNavbar />
          <main>
            <HeroSection />
            <HowItWorksSection />
            <BandIntegrationSection />
            <FeaturesSection />
            <IntegrationsSection />
            <StatsSection />
            <JudgesSection />
          </main>
          <FooterSection />
        </>
      )}
    </div>
  );
}
