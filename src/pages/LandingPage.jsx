import React from 'react';
import { Toaster } from 'react-hot-toast';

// --- Core Components ---
import Navbar from '../components/Navbar';
import CustomCursor from '../components/CustomCursor';

// --- Sections ---
import Hero3DBackground from '../components/landing/Hero3DBackground'; // New 3D BG
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';   // New Bento Grid
import ShowcaseSection from '../components/landing/ShowcaseSection';   // The Visual Cards
import StepsSection from '../components/landing/StepsSection';         // How it works
import TestimonialsSection from '../components/landing/TestimonialsSection'; // Marquee
import PricingSection from '../components/landing/PricingSection';     // Pricing Cards
import ContactSection from '../components/landing/ContactSection';

export default function LandingPage({ isAuthenticated, onLogout }) {
  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden cursor-none selection:bg-cyan-500/30">
      
      {/* 1. Global Overlays */}
      <CustomCursor />
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#111', color: '#fff', border: '1px solid #333' },
      }}/>

      {/* 2. Interactive 3D Background (Fixed Z-0) */}
      <Hero3DBackground />

      {/* 3. Navigation (Fixed Z-999) */}
      <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      
      {/* 4. Main Scrollable Content (Relative Z-10) */}
      <main className="relative z-10">
        
        {/* Header */}
        <HeroSection isAuthenticated={isAuthenticated} />
        
        {/* The new Bento Grid you provided */}
        <FeaturesSection />
        
        {/* Visual Proof */}
        <ShowcaseSection />
        
        {/* How it Works */}
        <StepsSection />
        
        {/* Social Proof */}
        <TestimonialsSection />
        
        {/* Costs */}
        <PricingSection />
        
        {/* Support */}
        <ContactSection />
        
      </main>

      {/* 5. Footer */}
      <footer className="relative z-10 py-12 text-center text-gray-500 text-sm border-t border-white/5 bg-black/90 backdrop-blur-xl">
        <p>© {new Date().getFullYear()} FotoFix AI. Engineered for the future.</p>
      </footer>

    </div>
  );
}