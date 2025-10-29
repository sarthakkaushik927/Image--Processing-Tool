import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Home Page ke Views ---
// (Paths update kar diye hain - .jsx extension hata diya hai)
import HeaderNav from '../components/home/HeaderNav';
import MainView from '../components/home/MainView';
import HelpView from '../components/home/HelpView';
import AccountView from '../components/home/AccountView';
import ProfileView from '../components/home/ProfileView';
import ToolsView from '../components/home/ToolsView';
import CropView from '../components/home/CropView';
import DownloadsView from '../components/home/DownloadsView';
import SearchView from '../components/home/SearchView';
import BubblesBackground from '../components/home/BubblesBackground';
import TextExtractorView from '../components/home/TextExtractorView';
import JpgToPngView from '../components/home/JpgToPngView';
import PngToJpgView from '../components/home/PngToJpgView';
import MagicBrushView from '../components/home/MagicBrushView';
import BrightnessView from '../components/home/BrightnessView';
import AngleSliderView from '../components/home/AngleSliderView';
import SharpnessView from '../components/home/SharpnessView';
import FindObjectView from '../components/home/FindObjectView';

// =======================================================================
//  Home Page (Main Component)
// =======================================================================
export default function HomePage({ isAuthenticated, onLogout, setPage, page, username, setUsername, profileImage, setProfileImage }) {
  const [showHelp, setShowHelp] = useState(false);

  // Determine which view to show
  const showAccountView = isAuthenticated && page === 'account';
  const showProfileView = isAuthenticated && page === 'profile';
  const showHelpView = showHelp;
  const showDownloadsView = page === 'downloads';
  const showSearchView = page === 'search';
  const showToolsView = page === 'tools';
  const showCropView = page === 'crop';
  const showTextExtractorView = page === 'text-extractor';
  const showJpgToPngView = page === 'jpg-to-png';
  const showPngToJpgView = page === 'png-to-jpg';
  const showMagicBrushView = page === 'magic-brush';
  const showBrightnessView = page === 'brightness';
  const showAngleSliderView = page === 'angle-slider';
  const showSharpnessView = page === 'sharpness';
  const showFindObjectView = page === 'find-object';
  
  // MainView tabhi dikhega jab koi aur view active na ho
  const showMainView = !showAccountView && !showProfileView && !showHelpView && !showDownloadsView && !showSearchView && !showToolsView && !showCropView && !showTextExtractorView && !showJpgToPngView && !showPngToJpgView && !showMagicBrushView && !showBrightnessView && !showAngleSliderView && !showFindObjectView;


  // Help view ko reset karne ke liye
  useEffect(() => {
    if (page !== null || showHelp) {
       // Jab bhi page change ho (Help ke alawa), Help view ko band kar do
       if(page !== null) setShowHelp(false);
    }
  }, [page, showHelp]);
  

  return (
    <motion.div
      className="flex min-h-screen bg-gradient-to-b from-[#1c1c3a] to-[#121c3a] text-white relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <BubblesBackground />
      <main className="flex-1 p-6 md:p-10 relative z-10 w-full">
        {/* HeaderNav ko props pass kiye */}
        <HeaderNav
          isAuthenticated={isAuthenticated}
          onLogout={onLogout}
          setPage={setPage}
          page={page}
          profileImage={profileImage}
        />

        <div className="mt-10 md:mt-20">
          <AnimatePresence mode="wait">
            {/* Conditional Rendering Logic (Sabhi Views Ke Liye) */}
            {showProfileView ? (
              <ProfileView 
                key="profile" 
                setPage={setPage}
                username={username}
                setUsername={setUsername}
                profileImage={profileImage}
                setProfileImage={setProfileImage}
              />
            ) : showAccountView ? (
              <AccountView key="account" onLogout={onLogout} setPage={setPage} />
            ) : showDownloadsView ? (
              <DownloadsView key="downloads" setPage={setPage} />
            ) : showSearchView ? (
              <SearchView key="search" setPage={setPage} />
            ) : showToolsView ? (
              <ToolsView key="tools" setPage={setPage} />
            ) : showCropView ? (
              <CropView key="crop" setPage={setPage} />
            ) : showTextExtractorView ? (
              <TextExtractorView key="text-extractor" setPage={setPage} />
            ) : showJpgToPngView ? (
              <JpgToPngView key="jpg-to-png" setPage={setPage} />
            ) : showPngToJpgView ? (
              <PngToJpgView key="png-to-jpg" setPage={setPage} />
            ) : showMagicBrushView ? (
              <MagicBrushView key="magic-brush" setPage={setPage} />
            ) : showBrightnessView ? (
              <BrightnessView key="brightness" setPage={setPage} />
            ) : showAngleSliderView ? (
              <AngleSliderView key="angle-slider" setPage={setPage} />
            ) : showSharpnessView ? (
              <SharpnessView key="sharpness" setPage={setPage} />
            ) : showFindObjectView ? (
              <FindObjectView key="find-object" setPage={setPage} />
            ) : showHelpView ? (
              <HelpView key="help" setShowHelp={setShowHelp} />
            ) : ( // Default to MainView
              <MainView key="main" setShowHelp={setShowHelp} setPage={setPage} />
            )}
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
}

