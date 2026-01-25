import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import localforage from 'localforage';
import toast from 'react-hot-toast';

// Component Imports
import CropWorkspace from '../components/CropWorkspace';
import TextExtractorWorkspace from '../components/TextExtractorWorkspace';
import FindObjectWorkspace from '../components/FindObjectWorkspace';
import MagicBrushWorkspace from '../components/MagicBrushWorkspace';
import AngleSliderWorkspace from '../components/AngleSliderWorkspace';
import SplashPage from '../components/SplashPage';
import AboutUsView from '../components/AboutUsView';
import AdjustmentsWorkspace from '../components/AdjustmentsWorkspace';
import FormatConverterWorkspace from '../components/FormatConverterWorkspace';
import AccountPage from '../pages/AccountPage';
import BubblesBackground from '../components/BubblesBackground';
import HeaderNav from '../components/HeaderNav';
import ToolsView from '../components/ToolsView';
import DiscoverView from '../components/DiscoverView';
import MainView from '../components/MainView';
import HelpView from '../components/HelpView';
import ProfileView from '../components/ProfileView';
import DownloadsView from '../components/DownloadsView';
import SearchView from '../components/SearchView';
import DobbyIntro from '../components/DobbyIntro'; 
import DobbyChat from '../components/DobbyChat';

localforage.config({
  name: 'FotoFixDB',
  storeName: 'downloaded_images_store'
});

export default function HomePage({
  isAuthenticated, 
  onLogin, 
  onLogout,
  username, 
  setUsername,
  profileImage, 
  setProfileImage,
  userEmail,
  onSaveDownload
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showHelp, setShowHelp] = useState(false);
  const [downloadedImages, setDownloadedImages] = useState([]);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  // ✅ LOGIC UPDATE: Check session storage to see if we already showed the splash
  const [showSplash, setShowSplash] = useState(() => {
    const hasSeen = sessionStorage.getItem('has_seen_splash');
    return !hasSeen; // If hasSeen is null/false, return true (show splash)
  });

  // --- Compatibility Helper ---
  const setPage = (path) => {
    if (!path) {
      navigate('/');
    } else if (path === 'login') {
      navigate('/login');
    } else if (path === 'home') {
      navigate('/');
    } else {
      navigate(path.startsWith('/') ? path : `/${path}`);
    }
  };

  // --- LocalForage Logic ---
  useEffect(() => {
    const loadImagesFromStorage = async () => {
      try {
        const storedImages = await localforage.getItem('fotofix-downloads');
        if (storedImages && Array.isArray(storedImages)) {
          setDownloadedImages(storedImages);
        }
      } catch (err) {
        toast.error(`Error loading images from storage: ${err.message}`);
      } finally {
        setIsStorageLoaded(true);
      }
    };
    loadImagesFromStorage();
  }, []);

  useEffect(() => {
    if (isStorageLoaded) {
      localforage.setItem('fotofix-downloads', downloadedImages).catch(err => {});
    }
  }, [downloadedImages, isStorageLoaded]);

  const handleImageDownload = (imageUrl, name = 'edited-image.png') => {
    const newImage = { id: Date.now(), url: imageUrl, name: name };
    setDownloadedImages(prevImages => [newImage, ...prevImages]);

    if (onSaveDownload) {
      onSaveDownload(imageUrl, name);
    } else {
      localforage.setItem('fotofix-downloads', [newImage, ...downloadedImages]);
    }
  };

  const handleDeleteImage = (idToDelete) => {
    setDownloadedImages(prevImages => prevImages.filter(image => image.id !== idToDelete));
  };

  const handleDeleteAllImages = () => {
    setDownloadedImages([]);
  };

  // --- Splash Screen Logic ---
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        // ✅ Save to session storage so it doesn't show again until tab close/logout
        sessionStorage.setItem('has_seen_splash', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  // Turn off help when location changes
  useEffect(() => {
    setShowHelp(false);
  }, [location.pathname]);

  if (showSplash) {
    return <SplashPage />;
  }

  return (
    <motion.div
      className="flex min-h-screen bg-linear-to-b from-[#1c1c3a] to-[#121c3a] text-white relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <BubblesBackground />
      
      <HeaderNav
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        profileImage={profileImage}
      />

      <main className="flex-1 p-6 md:p-10 relative z-10 w-full overflow-y-auto pt-24">
        <div className="mt-10 md:mt-20">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              
              <Route index element={
                showHelp ? (
                  <HelpView setShowHelp={setShowHelp} />
                ) : (
                  <MainView
                    setShowHelp={setShowHelp}
                    setPage={setPage}
                    isAuthenticated={isAuthenticated}
                  />
                )
              } />

              <Route path="discover" element={<DiscoverView setPage={setPage} />} />
              <Route path="search" element={<SearchView setPage={setPage} />} />
              <Route path="about" element={<AboutUsView setPage={setPage} />} />
              <Route path="dobby-intro" element={<DobbyIntro setPage={setPage} />} />
              <Route path="dobby-chat" element={<DobbyChat setPage={setPage} />} />

              <Route path="profile" element={
                <ProfileView
                  setPage={setPage}
                  username={username}
                  setUsername={setUsername}
                  profileImage={profileImage}
                  setProfileImage={setProfileImage}
                />
              } />
              
              <Route path="account" element={
                <AccountPage
                  onLogout={onLogout}
                  setPage={setPage}
                  username={username}
                  userEmail={userEmail}
                />
              } />
              
              <Route path="downloads" element={
                <DownloadsView
                  setPage={setPage}
                  images={downloadedImages}
                  onDeleteImage={handleDeleteImage}
                  onDeleteAll={handleDeleteAllImages}
                />
              } />

              <Route path="tools" element={<ToolsView setPage={setPage} />} />
              <Route path="crop" element={<CropWorkspace setPage={setPage} onImageDownloaded={handleImageDownload} />} />
              <Route path="text-extractor" element={<TextExtractorWorkspace setPage={setPage} onImageDownloaded={handleImageDownload} />} />
              <Route path="find-object" element={<FindObjectWorkspace setPage={setPage} onImageDownloaded={handleImageDownload} />} />
              <Route path="magic-brush" element={<MagicBrushWorkspace setPage={setPage} onImageDownloaded={handleImageDownload} />} />
              <Route path="format-converter" element={<FormatConverterWorkspace setPage={setPage} onImageDownloaded={handleImageDownload} />} />
              <Route path="adjustments" element={<AdjustmentsWorkspace setPage={setPage} onImageDownloaded={handleImageDownload} />} />
              <Route path="angle-slider" element={<AngleSliderWorkspace setPage={setPage} onImageDownloaded={handleImageDownload} />} />

              <Route path="*" element={<Navigate to="/" />} />

            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
}