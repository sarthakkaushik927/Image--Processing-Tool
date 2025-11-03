import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import localforage from 'localforage'; 
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
import LoginView from '../components/LoginView';



localforage.config({
  name: 'FotoFixDB',
  storeName: 'downloaded_images_store'
});

export default function HomePage({ 
    isAuthenticated, onLogin, onLogout, 
    setPage, page, 
    username, setUsername, 
    profileImage, setProfileImage, 
    userEmail,
    onSaveDownload 
}) {
  const [showHelp, setShowHelp] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [downloadedImages, setDownloadedImages] = useState([]);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);


  useEffect(() => {
    const loadImagesFromStorage = async () => {
      try {
        const storedImages = await localforage.getItem('fotofix-downloads');
        if (storedImages && Array.isArray(storedImages)) {
          setDownloadedImages(storedImages);
        }
      } catch (err) {
        console.error("Failed to load images from storage:", err);
      } finally {
        setIsStorageLoaded(true);
      }
    };
    loadImagesFromStorage();
  }, []);

  
  useEffect(() => {
    if (isStorageLoaded) { 
      localforage.setItem('fotofix-downloads', downloadedImages).catch(err => {
        console.error("Failed to save images to IndexedDB:", err);
      });
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
    setDownloadedImages(prevImages => 
      prevImages.filter(image => image.id !== idToDelete)
    );
  };


  const handleDeleteAllImages = () => {
    setDownloadedImages([]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer); 
  }, [isAuthenticated]);

 
  useEffect(() => {
    if (page !== null) {
      setShowHelp(false);
    }
  }, [page]);



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
        setPage={setPage}
        page={page}
        profileImage={profileImage}
      />
      
      <main className="flex-1 p-6 md:p-10 relative z-10 w-full overflow-y-auto pt-24"> 
        
        <div className="mt-10 md:mt-20"> 
          <AnimatePresence mode="wait">
            
            {page === 'login' ? (
              <LoginView 
                key="login" 
                setPage={setPage} 
                onLogin={onLogin} 
              />
            ) : page === 'discover' ? ( 
              <DiscoverView 
                key="discover"
                setPage={setPage}
              />
            ) : isAuthenticated && page === 'profile' ? (
              <ProfileView
                key="profile"
                setPage={setPage}
                username={username}
                setUsername={setUsername}
                profileImage={profileImage}
                setProfileImage={setProfileImage}
              />
            ) : page === 'about' ? (
              <AboutUsView key="about" setPage={setPage} />
            ) : page === 'dobby-intro' ? (
              <DobbyIntro key="dobby-intro" setPage={setPage} />
            ) : page === 'dobby-chat' ? (
              <DobbyChat key="dobby-chat" setPage={setPage} />
              
            // --- Protected Routes ---
            ) : isAuthenticated && page === 'account' ? (
              <AccountPage 
                key="account" 
                onLogout={onLogout} 
                setPage={setPage}
                username={username} 
                userEmail={userEmail} 
              />
            ) : isAuthenticated && page === 'downloads' ? ( 
              <DownloadsView 
                key="downloads" 
                setPage={setPage} 
                images={downloadedImages}
                onDeleteImage={handleDeleteImage}     
                onDeleteAll={handleDeleteAllImages} 
              />
            ) : page === 'search' ? (
              <SearchView key="search" setPage={setPage} />
              
            ) : isAuthenticated && page === 'tools' ? ( 
              <ToolsView key="tools" setPage={setPage} />
              
            ) : isAuthenticated && page === 'crop' ? ( 
              <CropWorkspace 
                key="crop" 
                setPage={setPage} 
                onImageDownloaded={handleImageDownload}
              />
            ) : isAuthenticated && page === 'text-extractor' ? ( 
              <TextExtractorWorkspace 
                key="text-extractor" 
                setPage={setPage} 
                onImageDownloaded={handleImageDownload}
              />
            ) : isAuthenticated && page === 'find-object' ? ( 
              <FindObjectWorkspace 
                key="find-object" 
                setPage={setPage} 
                onImageDownloaded={handleImageDownload}
              />
            ) : isAuthenticated && page === 'magic-brush' ? ( 
              <MagicBrushWorkspace 
                key="magic-brush" 
                setPage={setPage} 
                onImageDownloaded={handleImageDownload}
              />
            ) : isAuthenticated && page === 'format-converter' ? ( 
              <FormatConverterWorkspace 
                key="format-converter" 
                setPage={setPage} 
                onImageDownloaded={handleImageDownload}
              />
            ) : isAuthenticated && page === 'adjustments' ? ( 
              <AdjustmentsWorkspace 
                key="adjustments" 
                setPage={setPage} 
                onImageDownloaded={handleImageDownload}
              />
            ) : isAuthenticated && page === 'angle-slider' ? ( 
              <AngleSliderWorkspace 
                key="angle-slider" 
                setPage={setPage} 
                onImageDownloaded={handleImageDownload}
              />
              
            ) : showHelp ? (
              <HelpView key="help" setShowHelp={setShowHelp} />

            ) : (
              <MainView 
                key="main" 
                setShowHelp={setShowHelp} 
                setPage={setPage} 
                isAuthenticated={isAuthenticated} 
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
}



