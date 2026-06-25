'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import CustomCursor from '@/components/landing/CustomCursor';
import LoadingScreen from '@/components/landing/LoadingScreen';
import ParticleCanvas from '@/components/landing/ParticleCanvas';
import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import SearchGraphSection from '@/components/landing/SearchGraphSection';
import WhyCipherSection from '@/components/landing/WhyCipherSection';
import AgentShowcaseSection from '@/components/landing/AgentShowcaseSection';
import BandHowSection from '@/components/landing/BandHowSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import BandIntegrationSection from '@/components/landing/BandIntegrationSection';
import JudgesSection from '@/components/landing/JudgesSection';
import IntegrationsSection from '@/components/landing/IntegrationsSection';
import FooterSection from '@/components/landing/FooterSection';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fallback = window.setTimeout(() => setIsLoading(false), 5000);
    return () => window.clearTimeout(fallback);
  }, []);

  return (
    <div className="landing-page" style={{ background: '#fff', minHeight: '100dvh', overflowX: 'hidden' }}>
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
            <SearchGraphSection />
            <WhyCipherSection />
            <AgentShowcaseSection />
            <BandHowSection />
            <HowItWorksSection />
            <BandIntegrationSection />
            <JudgesSection />
            <IntegrationsSection />
          </main>
          <FooterSection />
        </>
      )}
    </div>
  );
}
