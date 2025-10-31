import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import localforage from 'localforage'; // 'localForage' import

// ⬇️ ESSENTIAL: Importing all external components ⬇️
import CropWorkspace from '../components/CropWorkspace';
import TextExtractorWorkspace from '../components/TextExtractorWorkspace';
import FindObjectWorkspace from '../components/FindObjectWorkspace';
import MagicBrushWorkspace from '../components/MagicBrushWorkspace';
import SharpnessWorkspace from '../components/SharpnessWorkspace';
import AngleSliderWorkspace from '../components/AngleSliderWorkspace';
import SplashPage from '../components/SplashPage';
import AboutUsView from '../components/AboutUsView';
import DobbyChat from '../components/DobbyChat';
import DobbyIntro from '../components/DobbyIntro';
import AdjustmentsWorkspace from '../components/AdjustmentsWorkspace';
import FormatConverterWorkspace from '../components/FormatConverterWorkspace';
import AccountPage from '../pages/AccountPage'; 

import {
  Search, LogOut, ArrowLeft, Rocket, Wrench, FileText, Settings,
  LifeBuoy, Star, Home, Download, UserCircle, UploadCloud, Edit,
  PlusCircle, BookOpen, Menu, X, // 'X' icon delete ke liye
  ChevronRight, Edit2, LogIn, Trash2, // ⬅️ 'Trash2' icon add kiya hai
  Crop, Repeat, RefreshCw, Wand2, Sun // Lucide icons
} from 'lucide-react';

// localForage storage ka naam configure karein
localforage.config({
  name: 'FotoFixDB',
  storeName: 'downloaded_images_store'
});


// =======================================================================
//  Home Page (Main Component)
// =======================================================================
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

  // DATA LOAD KARNE KA useEffect
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

  // DATA SAVE KARNE KA useEffect
  useEffect(() => {
    if (isStorageLoaded) { 
      localforage.setItem('fotofix-downloads', downloadedImages).catch(err => {
        console.error("Failed to save images to IndexedDB:", err);
      });
    }
  }, [downloadedImages, isStorageLoaded]); 

  // Nayi image ko list mein add karne ka handler
  const handleImageDownload = (imageUrl, name = 'edited-image.png') => {
    const newImage = { id: Date.now(), url: imageUrl, name: name };
    setDownloadedImages(prevImages => [newImage, ...prevImages]);
    
    // Yahan App.jsx se mile onSaveDownload ko call karein
    if (onSaveDownload) {
      onSaveDownload(imageUrl, name);
    } else {
      console.warn("onSaveDownload prop is missing from HomePage.");
    }
  };

  // DELETE IMAGE HANDLER
  const handleDeleteImage = (idToDelete) => {
    setDownloadedImages(prevImages => 
      prevImages.filter(image => image.id !== idToDelete)
    );
  };

  // DELETE ALL HANDLER
  const handleDeleteAllImages = () => {
    setDownloadedImages([]);
  };

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer); 
  }, [isAuthenticated]);

  // Reset showHelp on page change
  useEffect(() => {
    if (page !== null) {
      setShowHelp(false);
    }
  }, [page]);


  // RENDER SPLASH SCREEN IF ACTIVE
  if (showSplash) {
    return <SplashPage />;
  }

  return (
    <motion.div
      className="flex min-h-screen bg-gradient-to-b from-[#1c1c3a] to-[#121c3a] text-white relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <BubblesBackground />
      {/* ⬇️ NAYA NAVBAR YAHAN HAI ⬇️ */}
      <HeaderNav
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        setPage={setPage}
        page={page}
        profileImage={profileImage}
      />
      
      <main className="flex-1 p-6 md:p-10 relative z-10 w-full overflow-y-auto pt-24"> 
      {/* ⬆️ pt-24 add kiya taaki content navbar ke niche se start ho */}
        
        <div className="mt-10 md:mt-20"> 
          <AnimatePresence mode="wait">
            
            {page === 'login' ? (
              <LoginView 
                key="login" 
                setPage={setPage} 
                onLogin={onLogin} 
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


// =======================================================================
//  Header Navigation (Naya Interactive Design V2)
// =======================================================================
function HeaderNav({ isAuthenticated, onLogout, setPage, page, profileImage }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Navigation logic (Protected routes ke saath)
  const handleNavClick = (pageNameOrPath) => {
    if (!isAuthenticated && ['downloads', 'account', 'profile'].includes(pageNameOrPath)) {
      setPage('login'); // Agar logged-in nahi hain toh login par bhejein
    } else {
      setPage(pageNameOrPath);
    }
    setIsOpen(false);
  }

  // Links ki list
  const navLinks = [
    { name: "Home", page: null, icon: <Home size={18} /> },
    { name: "Downloads", page: "downloads", icon: <Download size={18} /> },
    { name: "Account", page: "account", icon: <UserCircle size={18} /> },
    { name: "Search", page: "search", icon: <Search size={18} /> }
  ];

  return (
    <nav 
      className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#1c1c3a] via-[#1c1c3a]/90 to-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* 1. Left Side: Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 md:gap-4 cursor-pointer" 
            onClick={() => handleNavClick(null)}
          >
            <img src="logo.svg" alt="FotoFix Logo" className="h-9 w-auto" onError={(e) => e.target.style.display = 'none'} />
            <span className="text-2xl font-bold text-white tracking-wide">FotoFix</span>
          </motion.div>

          {/* 2. Center: Desktop Navigation (Naya "Pill" Design) */}
          <ul className="hidden md:flex items-center gap-2 bg-black/20 p-2 rounded-full border border-white/10">
            {navLinks.map((link) => (
              <NavItem
                key={link.name}
                text={link.name}
                icon={link.icon}
                isActive={page === link.page}
                onClick={() => handleNavClick(link.page)}
              />
            ))}
          </ul>

          {/* 3. Right Side: Auth & Mobile Menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              // --- Logged-In View ---
              <>
                <motion.button 
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLogout} 
                  className="p-2.5 rounded-full text-gray-300 hover:text-white transition-colors hidden md:block" 
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </motion.button>
                
                <motion.img
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 0 15px rgba(168, 85, 247, 0.8), 0 0 5px rgba(59, 130, 246, 0.6)" // ⬅️ Naya Glow
                  }} 
                  transition={{ type: "spring", stiffness: 300 }}
                  src={profileImage}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-purple-500 cursor-pointer object-cover"
                  onClick={() => handleNavClick('profile')}
                  onError={(e) => e.target.src = 'https://placehold.co/40x40/7c3aed/ffffff?text=U'}
                />
              </>
            ) : (
              // --- Logged-Out View ---
              <div className="hidden md:block">
                <GradientButton 
                  text="Login / Signup" 
                  onClick={() => handleNavClick('login')}
                  className="px-6 py-2.5 text-sm" // Chhota button
                />
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu} 
              className="p-2 md:hidden focus:outline-none" 
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* 4. Animated Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <AnimatedMobileMenu 
            page={page}
            isAuthenticated={isAuthenticated}
            onLogout={() => { onLogout(); setIsOpen(false); }}
            handleNavClick={handleNavClick}
            navLinks={navLinks}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}

// -----------------------------------------------------------------------
// Helper Component: NavItem (Desktop links ke liye "Pill" style)
// -----------------------------------------------------------------------
function NavItem({ text, icon, isActive, onClick }) {
  return (
    <li
      onClick={onClick}
      className="relative px-4 py-2 rounded-full cursor-pointer transition-colors"
      style={{
        WebkitTapHighlightColor: "transparent", // Mobile par tap highlight hatayein
      }}
    >
      {/* 2. Yeh hai Naya Sliding Gradient Pill */}
      {isActive && (
        <motion.div
          layoutId="active-pill" // Yeh animation ko possible banata hai
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg"
          style={{ borderRadius: 9999 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}
      
      {/* Text aur Icon */}
      <span className="relative z-10 flex items-center gap-2 text-sm font-medium">
        {icon}
        {text}
      </span>
    </li>
  );
}

// -----------------------------------------------------------------------
// Helper Component: AnimatedMobileMenu
// -----------------------------------------------------------------------
const menuVariants = {
  closed: { opacity: 0, height: 0 },
  open: { 
    opacity: 1, 
    height: 'auto',
    transition: { 
      when: "beforeChildren", 
      staggerChildren: 0.05 
    } 
  }
};

const itemVariants = {
  closed: { opacity: 0, y: -10 },
  open: { opacity: 1, y: 0 }
};

function AnimatedMobileMenu({ page, isAuthenticated, onLogout, handleNavClick, navLinks }) {
  return (
    <motion.div 
      variants={menuVariants}
      initial="closed"
      animate="open"
      exit="closed"
      // Naya glassmorphism background
      className="absolute top-full left-0 right-0 md:hidden bg-[#1c1c3a]/90 backdrop-blur-lg shadow-lg overflow-hidden border-t border-white/10"
    >
      <ul className="flex flex-col p-4 space-y-2">
        {navLinks.map(link => (
          <motion.li variants={itemVariants} key={link.name}>
            <MobileNavItem 
              text={link.name} 
              icon={link.icon} 
              isActive={page === link.page} 
              onClick={() => handleNavClick(link.page)} 
            />
          </motion.li>
        ))}
        
        <hr className="border-gray-700 my-2" />
        
        {isAuthenticated ? (
          <motion.li variants={itemVariants}>
            <button onClick={onLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300">
              <LogOut size={20} /> <span className="font-medium">Logout</span>
            </button>
          </motion.li>
        ) : (
          <motion.li variants={itemVariants}>
            <button onClick={() => handleNavClick('login')} className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-blue-300 hover:bg-blue-500/20 hover:text-blue-200">
              <LogIn size={20} /> <span className="font-medium">Login / Signup</span>
            </button>
          </motion.li>
        )}
      </ul>
    </motion.div>
  );
}

// -----------------------------------------------------------------------
// Helper Component: MobileNavItem
// -----------------------------------------------------------------------
function MobileNavItem({ icon, text, isActive, onClick }) {
  return (
    <div 
      onClick={onClick} 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer 
                  ${isActive ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-white/70 hover:bg-gray-700/50 hover:text-white'}`}
    > 
      {icon} <span className="font-medium">{text}</span> 
    </div>
  );
}

// -----------------------------------------------------------------------
// ⬇️ GradientButton ki definition yahan *NAHI* thi, isliye error aa raha tha
// Maine ise neeche AUXILIARY COMPONENTS section mein rakha hai.
// -----------------------------------------------------------------------


// =======================================================================
//  Main View
// =======================================================================
function MainView({ setShowHelp, setPage, isAuthenticated }) {
  
  const handleCreateClick = () => {
    if (isAuthenticated) {
      setPage('tools');
    } else {
      setPage('login'); 
    }
  };
  
  const handleGenerateClick = () => {
    if (isAuthenticated) {
      alert("Generate feature coming soon!"); 
    } else {
      setPage('login');
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="flex flex-col lg:flex-row items-center gap-10 md:gap-20" >
      <div className="flex-1 text-center lg:text-center">
        <h2 className="text-4xl md:text-5xl font-bold">Edit, Enhance and Empower!</h2>
        <p className="text-lg text-gray-400 mt-4 mb-8"> Experience seamless image processing </p>
        <div className="flex flex-col items-center lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <GradientButton className='lg:px-20' text="Discover" isBlue />
            <GradientButton className='lg:px-20' text="Create" isOutline onClick={handleCreateClick} />
          </div>
          <GradientButton 
            text="GenerateImage" 
            className="lg:px-57 px-33 max-w-40 lg:min-w-60 justfy-center items-center text-center flex flex-col"
            onClick={handleGenerateClick} 
          />
        </div>
        <div className="mt-12 flex justify-center iten lg:justify-center gap-4 items-center">
          <SmallButton className="h-16" onClick={() => setPage('about')}>
            <span className="font-semibold px-6">About</span>
          </SmallButton>
          <SmallButton className="w-16 h-16" onClick={() => setPage('dobby-intro')}>
            <img className='h-12 w-12' src="/chatbot.png" alt="Dobby" onError={(e) => e.target.style.display = 'none'} />
          </SmallButton>
          <SmallButton className="h-16" onClick={() => setShowHelp(true)}>
            <span className="font-semibold px-6">Help?</span>
          </SmallButton>
        </div>

      </div>
      <div className="flex-1 w-full max-w-lg lg:max-w-none">
        <motion.div whileHover={{ scale: 1.03 }} className="w-full h-[450px] bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-indigo-400/30">
          <img src="/home.svg" alt="Forest and clouds" className="w-full h-full object-cover object-" onError={(e) => e.target.src = 'https://placehold.co/600x400/1f2937/9ca3af?text=Image+Not+Found'} />
        </motion.div>
      </div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------

// =======================================================================
//  Help View
// =======================================================================
function HelpView({ setShowHelp }) {
  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} >
      <button onClick={() => setShowHelp(false)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"> <ArrowLeft size={18} /> Back </button>
      <h2 className="text-3xl md:text-4xl font-bold text-center">Hello, How Can We Help YOU</h2>
      <div className="relative w-full max-w-2xl mx-auto my-8">
        <input type="text" placeholder="Search your keyword here..." className="w-full pl-12 pr-16 py-4 rounded-full bg-[#2a2a4a]/70 backdrop-blur-sm border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-lg" />
        <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"> <Search size={20} className="text-white" /> </button>
      </div>
      <div className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HelpCard icon={<Rocket size={32} className="text-blue-400" />} title="Getting Started" text="Helps you to know how to start your editing journey" />
          <HelpCard icon={<Wrench size={32} className="text-purple-400" />} title="Dobby" text="Helps you to know how to start your editing journey" />
          <HelpCard icon={<FileText size={32} className="text-green-400" />} title="Key Concepts" text="This helps you to enhance your editing skills" />
        </div>

      </div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------

// =======================================================================
//  InfoField (Used in AccountView/ProfileView)
// =======================================================================
function InfoField({ label, value, isPassword = false }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <div className="bg-gradient-to-r from-blue-500/30 to-purple-600/30 p-3 rounded-lg text-white font-medium shadow-inner">
        {isPassword ? '••••••••' : value}
      </div>

    </div>
  );
}

// -----------------------------------------------------------------------

// =======================================================================
//  Profile View
// =======================================================================
function ProfileView({ setPage, username, setUsername, profileImage, setProfileImage }) {
  const [nickname, setNickname] = useState(username);
  const [localProfileImage, setLocalProfileImage] = useState(profileImage);
  const fileInputRef = useRef(null);

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setLocalProfileImage(newImageUrl);
    }
  };

  const handleSave = () => {
    setUsername(nickname);
    setProfileImage(localProfileImage);
    setPage(null); // Go back to home
  };

  return (
    <motion.div
      key="profile-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-0 md:p-0 text-white"
    >
      <button onClick={() => setPage(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={18} /> Back to Home
      </button>
      <h2 className="text-4xl font-bold text-center mb-10">Profile</h2>
      <div className="max-w-md mx-auto flex flex-col items-center gap-6">
        <div className="relative">
          <img
            src={localProfileImage}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-gray-700"
            onError={(e) => e.target.src = 'https://placehold.co/150x150/222244/ffffff?text=Error'}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleImageUploadClick}
            className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-900"
            aria-label="Change profile picture"
          >
            <Edit2 size={24} className="text-white" />
          </motion.button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png, image/jpeg"
            className="hidden"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-400 mb-2 text-center">Nickname</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname"
            className="w-full p-4 rounded-lg text-center font-medium text-white text-lg bg-gradient-to-r from-blue-500/30 to-purple-600/30 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="w-full mt-4">
          <GradientButton text="Save Changes" onClick={handleSave} />
        </div>
      </div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------

// =======================================================================
//  SearchView
// =======================================================================
function SearchView({ setPage }) {
   return (
    <motion.div key="search-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
      className="p-0 md:p-0 text-white">
      <button onClick={() => setPage(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"> <ArrowLeft size={18} /> Back to Home </button>
      <h2 className="text-4xl font-bold text-center mb-10">Search Page</h2>
      <p className="text-center text-gray-400">This is the Search page content.</p>
      <p className="text-center text-gray-500 mt-4">(Search functionality will be added here)</p>
    </motion.div>
  );
}

// -----------------------------------------------------------------------

// =======================================================================
//  DownloadsView (UPDATED with Delete Buttons)
// =======================================================================
function DownloadsView({ setPage, images, onDeleteImage, onDeleteAll }) {

  const handleRedownload = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      key="downloads-view" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      transition={{ duration: 0.3 }}
      className="p-0 md:p-0 text-white"
    >
      <button onClick={() => setPage(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"> 
        <ArrowLeft size={18} /> Back to Home 
      </button>
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></span>
          <h1 className="text-3xl font-bold">Downloads</h1>
        </div>
        {images && images.length > 0 && (
          <button
            onClick={onDeleteAll}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600/50 text-red-300 rounded-lg text-sm font-semibold hover:bg-red-600 hover:text-white transition-colors"
          >
            <Trash2 size={16} /> Delete All
          </button>
        )}
      </div>
      <h2 className="text-4xl font-bold mb-10">Downloaded Images</h2>

      {images && images.length > 0 ? (
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {images.map((image) => (
            <motion.div
              key={image.id}
              className="relative aspect-video bg-[#2a2a4a]/50 rounded-lg overflow-hidden border-2 border-gray-700/50 group"
              whileHover={{ scale: 1.05, borderColor: '#a855f7' }}
              layout
            >
              <img 
                src={image.url} 
                alt={image.name} 
                className="w-full h-full object-cover" 
                onError={(e) => e.target.src = 'https://placehold.co/300x200/222244/ffffff?text=Error'}
              />
              
              <button
                onClick={() => handleRedownload(image.url, image.name)}
                className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Download image"
              >
                <Download size={18} />
              </button>

              <button
                onClick={() => onDeleteImage(image.id)}
                className="absolute top-2 left-2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/50 hover:text-white"
                aria-label="Delete image"
              >
                <X size={18} /> 
              </button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center h-60 bg-[#1f1f3d]/50 rounded-lg border-2 border-dashed border-gray-700">
          <Download size={48} className="text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-400">No downloaded images yet.</h3>
          <p className="text-gray-500">Start editing to see your creations here!</p>
        </div>
      )}
    </motion.div>
  );
}

// -----------------------------------------------------------------------

// =======================================================================
//  Tools View Sub-Component
// =======================================================================
function ToolsView({ setPage }) {
  return (
    <motion.div
      key="tools-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-0 md:p-0 text-white max-w-5xl mx-auto" 
    >
      <button onClick={() => setPage(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-bold text-center">Tools</h2>
        <span className="bg-purple-600/50 text-purple-300 border border-purple-400 rounded-full px-4 py-1 text-sm font-semibold">
          Special Features
        </span>
      </div>

      <h3 className="text-2xl font-semibold text-purple-300 mb-4">Featured Tool</h3>
      <FeaturedToolCard
        icon={<Sun size={40} />}
        title="Image Adjustments"
        description="Fine-tune brightness, contrast, saturation, and more with our most powerful tool."
        onClick={() => setPage('adjustments')}
      />

      <h3 className="text-2xl font-semibold text-purple-300 mt-12 mb-4">All Tools</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 ">
        
        <StandardToolCard
          icon={<Crop size={32} />}
          title="Crop"
          description="Cut and resize your image."
          onClick={() => setPage('crop')}
        />
        
        <StandardToolCard
          icon={<Repeat size={32} />}
          title="Converter"
          description="Convert to JPG, PNG, WEBP."
          onClick={() => setPage('format-converter')} 
        />
        
        <StandardToolCard
          icon={<Wand2 size={32} />}
          title="Magic Brush"
          description="Coming soon! (AI Editing)"
          onClick={() => setPage('magic-brush')}
        />
        
        <StandardToolCard
          icon={<FileText size={32} />}
          title="Text Extractor"
          description="Pull text from any image."
          onClick={() => setPage('text-extractor')}
        />
        
        <StandardToolCard
          icon={<Search size={32} />}
          title="Find Object"
          description="Detect objects in your photo."
          onClick={() => setPage('find-object')}
        />

        <StandardToolCard
          icon={<Repeat size={32} className="rotate-90" />}
          title="Angle Slider"
          description="Straighten and rotate."
          onClick={() => setPage('angle-slider')}
        />
      </div>
    </motion.div>
  );
}


// =======================================================================
//  Naya ToolCard Components
// =======================================================================

function FeaturedToolCard({ icon, title, description, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={onClick}
      className="bg-gradient-to-r from-purple-600/30 to-blue-600/30
                 backdrop-blur-sm rounded-2xl p-6 flex flex-col md:flex-row 
                 items-center gap-6 cursor-pointer transition-all 
                 border-2 border-purple-400/50 hover:border-purple-300 shadow-xl"
    >
      <div className="flex-shrink-0 bg-purple-900/50 p-4 rounded-xl text-purple-200">
        {icon}
      </div>
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
      <div className="text-purple-300">
        <ChevronRight size={32} />
      </div>
    </motion.div>
  );
}

function StandardToolCard({ icon, title, description, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={onClick}
      className="bg-[#1f1f3d]/50 backdrop-blur-sm rounded-2xl p-6 
                 flex flex-col items-center justify-center gap-4 aspect-square 
                 cursor-pointer transition-all 
                 border-2 border-transparent hover:border-purple-500"
    >
      <div className="text-purple-400">
        {icon}
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </div>
    </motion.div>
  );
}
// -----------------------------------------------------------------------
// =======================================================================
//  LoginView Component (Placeholder)
// =======================================================================
function LoginView({ setPage, onLogin }) {
  
  const handleLoginClick = () => {
    if (onLogin) {
      alert("Please use the main login form. This is a fallback.");
    }
  };
  
  return (
    <motion.div
      key="login-view-fallback"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto p-8 bg-[#1f1f3d]/50 rounded-2xl"
    >
      <h2 className="text-4xl font-bold text-center mb-6 text-white">Login Required</h2>
      <p className="text-center text-gray-400 mb-8">
        Please login to continue. (Fallback View)
      </p>
      <GradientButton 
          text="Go to Login"
          isBlue
          className="w-full justify-center"
          onClick={() => setPage('login')} 
      />
    </motion.div>
  );
}
// -----------------------------------------------------------------------

// =======================================================================
//  AUXILIARY COMPONENTS (Used across the file)
// =======================================================================

// BubblesBackground
function BubblesBackground() {
  const bubbles = [
    { id: 1, x: '10%', y: '20%', size: 300, delay: 0, duration: 15 }, { id: 2, x: '80%', y: '30%', size: 200, delay: 2, duration: 20 },
    { id: 3, x: '60%', y: '70%', size: 250, delay: 4, duration: 18 }, { id: 4, x: '20%', y: '80%', size: 150, delay: 6, duration: 22 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute bg-gradient-to-br from-blue-700 to-purple-700 opacity-50 rounded-full filter blur-3xl"
          style={{ width: bubble.size, height: bubble.size, top: bubble.y, left: bubble.x }}
          animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0] }}
          transition={{ duration: bubble.duration, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: bubble.delay }}
        />
      ))}

    </div>
  );
}

// ⬇️ YAHAN HAI WAHID (SINGLE) 'GradientButton' DEFINITION ⬇️
// GradientButton (Navbar aur MainView dono use karte hain)
function GradientButton({ text, isBlue = false, isOutline = false, className = "", onClick, disabled }) {
  const blueGradient = "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500";
  const purpleGradient = "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700";
  const outline = "bg-transparent border-2 border-purple-400 text-purple-300 hover:bg-purple-900/50";
  const buttonClasses = isOutline ? outline : (isBlue ? blueGradient : purpleGradient);
  const defaultClasses = "w-full md:w-auto px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform";
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`${defaultClasses} ${buttonClasses} ${className} ${disabledClasses}`}
    >
      {text}
    </motion.button>
  );
}

// SmallButton
function SmallButton({ children, onClick, className = "" }) {
  return (
    <motion.button whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }} onClick={onClick} className={`p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden transition-all ${className}`}>
      <div className="bg-[#1c1c3a] h-full w-full rounded-[14px] flex items-center justify-center"> {children} </div>
    </motion.button>
  );
}

// HelpCard
function HelpCard({ icon, title, text }) {
  return (
    <motion.div whileHover={{ y: -5, borderColor: 'rgb(59 130 246)' }} className="bg-[#2a2a4a]/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl p-6 transition-all hover:shadow-xl">
      <div className="mb-4"> {icon} </div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-gray-400">{text}</p>
    </motion.div>
  );
}