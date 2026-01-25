import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import localforage from 'localforage';
import toast from 'react-hot-toast';

// Layout Imports
import BubblesBackground from '../components/BubblesBackground';
import HeaderNav from '../components/HeaderNav';
import SplashPage from '../components/SplashPage';
import MainView from '../components/MainView'; // ✅ Just import the view content

localforage.config({
  name: 'FotoFixDB',
  storeName: 'downloaded_images_store'
});

export default function HomePage({
  isAuthenticated, 
  onLogout,
  profileImage,
}) {
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('has_seen_splash'));

  // Splash Screen Logic
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('has_seen_splash', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashPage />;
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white">
      {/* 1. Background */}
      <BubblesBackground />
      
      {/* 2. Navigation */}
      <HeaderNav
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        profileImage={profileImage}
      />

      {/* 3. Main Content (Just render MainView directly) */}
      <motion.main 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="relative z-10 pt-24 px-6 md:px-10 h-screen overflow-y-auto"
      >
         <MainView isAuthenticated={isAuthenticated} />
      </motion.main>
    </div>
  );
}