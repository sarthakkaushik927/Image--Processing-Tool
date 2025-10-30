import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ⬇️ ESSENTIAL: Importing all external components ⬇️
import CropWorkspace from '../components/CropWorkspace';
import TextExtractorWorkspace from '../components/TextExtractorWorkspace';
import JpgToPngWorkspace from '../components/JpgToPngWorkspace';
import PngToJpgWorkspace from '../components/PngToJpgWorkspace';
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
// NOTE: Assuming AccountPage is used directly for 'account' view, or is defined elsewhere.
import AccountPage from '../pages/AccountPage'; 

import {
  Search, LogOut, ArrowLeft, Rocket, Wrench, FileText, Settings,
  LifeBuoy, Star, Home, Download, UserCircle, UploadCloud, Edit,
  PlusCircle, BookOpen, Menu, X,
  ChevronRight, Edit2,
  Crop, Repeat, RefreshCw, Wand2, Sun // Lucide icons used across the app
} from 'lucide-react';


// =======================================================================
//  Home Page (Main Component - Handles Splash Screen)
// =======================================================================
// NOTE: Added userEmail to props to be passed down
export default function HomePage({ isAuthenticated, onLogout, setPage, page, username, setUsername, profileImage, setProfileImage, userEmail }) {
  const [showHelp, setShowHelp] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Splash Screen Timer: Only show for 2 seconds when component mounts
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer 
  }, [isAuthenticated]);

  useEffect(() => {
    // Reset showHelp whenever navigation page changes
    if (page !== null || page === 'about' || page === 'dobby-intro' || page === 'dobby-chat' || page === 'account' || page === 'downloads' || page === 'search' || page === 'profile' || page === 'tools' || page === 'crop' || page === 'text-extractor' || page === 'jpg-to-png' || page === 'png-to-jpg' || page === 'find-object' || page === 'magic-brush' || page === 'sharpness' || page === 'angle-slider') {
      setShowHelp(false);
    }
  }, [page]);


  // ⬇️ RENDER SPLASH SCREEN IF ACTIVE ⬇️
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
      <main className="flex-1 p-6 md:p-10 relative z-10 w-full">
        <HeaderNav
          isAuthenticated={isAuthenticated}
          onLogout={onLogout}
          setPage={setPage}
          page={page}
          profileImage={profileImage}
        />

        <div className="mt-10 md:mt-20">
          <AnimatePresence mode="wait">
            {isAuthenticated && page === 'profile' ? (
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
            ) : isAuthenticated && page === 'account' ? (
              <AccountPage // ⬅️ Correct component name used
                key="account" 
                onLogout={onLogout} 
                setPage={setPage}
                // ⬇️ PASSING DYNAMIC PROPS HERE ⬇️
                username={username} 
                userEmail={userEmail} 
              />
            ) : page === 'downloads' ? (
              <DownloadsView key="downloads" setPage={setPage} />
            ) : page === 'search' ? (
              <SearchView key="search" setPage={setPage} />
            ) : page === 'tools' ? (
              <ToolsView key="tools" setPage={setPage} />
            ) : page === 'crop' ? (
              <CropWorkspace key="crop" setPage={setPage} />
            ) : page === 'text-extractor' ? (
              <TextExtractorWorkspace key="text-extractor" setPage={setPage} />
            ) : page === 'find-object' ? (
              <FindObjectWorkspace key="find-object" setPage={setPage} />
            ) : page === 'magic-brush' ? (
              <MagicBrushWorkspace key="magic-brush" setPage={setPage} />
            ) : page === 'format-converter' ? (
              <FormatConverterWorkspace key="format-converter" setPage={setPage} />
            ) : page === 'adjustments' ? (
              <AdjustmentsWorkspace key="adjustments" setPage={setPage} />
            ) : page === 'angle-slider' ? (
              <AngleSliderWorkspace key="angle-slider" setPage={setPage} />
            ) : showHelp ? (
              <HelpView key="help" setShowHelp={setShowHelp} />

            ) : (
              <MainView key="main" setShowHelp={setShowHelp} setPage={setPage} />
            )}
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
}


// =======================================================================
//  Header Navigation Sub-Component
// =======================================================================
function HeaderNav({ isAuthenticated, onLogout, setPage, page, profileImage }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavClick = (pageNameOrPath) => {
    if (typeof setPage === 'function') {
      setPage(pageNameOrPath);
    } else {
      console.error("setPage prop is not a function inside handleNavClick!");
    }
    setIsOpen(false);
  }

  const commonNavLinks = (
    <>
      <NavItem icon={<Home />} text="Home" active={page === null} onClick={() => handleNavClick(null)} />
      <NavItem icon={<Download />} text="Downloads" active={page === 'downloads'} onClick={() => handleNavClick('downloads')} />
      <NavItem icon={<UserCircle />} text="Account" active={page === 'account'} onClick={() => handleNavClick('account')} />
      <NavItem icon={<Search />} text="Search" active={page === 'search'} onClick={() => handleNavClick('search')} />
    </>
  );

  return (
    <nav className="w-full flex justify-between items-center relative z-20">
      <div className="flex items-center gap-2 md:gap-4">
        <img src="logo.svg" alt="FotoFix Logo" className="h-8 w-auto" onError={(e) => e.target.style.display = 'none'} />
        <span onClick={() => handleNavClick(null)} className="translate-y-1 text-2xl font-bold text-white cursor-pointer">FotoFix</span>
        <div className="hidden md:flex items-center gap-6 ml-4">
          {commonNavLinks}
        </div>
      </div>

      {/* Right Side - Logged In View */}
      <div className="flex items-center gap-4">
        {/* Search button for small screens */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick('search')}
          className={`md:hidden p-2 rounded-full transition-colors 
              ${page === 'search' ? 'bg-purple-600/70' : 'hover:bg-gray-700/50'}
            `}
          aria-label="Search"
        >
          <Search size={20} className={page === 'search' ? 'text-white' : 'text-gray-400'} />
        </motion.button>

        {/* Avatar image */}
        <img
          src={profileImage}
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer object-cover"
          onClick={() => handleNavClick('profile')}
          onError={(e) => e.target.src = '[https://placehold.co/40x40/7c3aed/ffffff?text=U](https://placehold.co/40x40/7c3aed/ffffff?text=U)'} // Fallback
        />
        <button onClick={onLogout} className="p-2 hover:bg-red-500/50 rounded-full hidden md:block" aria-label="Logout"> <LogOut size={20} /> </button>
        <button onClick={toggleMenu} className="p-2 md:hidden focus:outline-none" aria-label="Toggle menu"> {isOpen ? <X size={24} /> : <Menu size={24} />} </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 mt-2 md:hidden bg-[#1c1c3a]/95 backdrop-blur-md shadow-lg p-4 z-40 overflow-hidden" >
            <ul className="flex flex-col space-y-3">
              {commonNavLinks} <hr className="border-gray-700 my-2" />
              {/* Mobile Logout Button */}
              <li>
                <button onClick={() => { onLogout(); setIsOpen(false); }} className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300">
                  <LogOut size={20} /> <span className="font-medium">Logout</span>
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// -----------------------------------------------------------------------

// =======================================================================
//  Main View (Handles links to About and Dobby)
// =======================================================================
function MainView({ setShowHelp, setPage }) {
  return (
    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="flex flex-col lg:flex-row items-center gap-10 md:gap-20" >
      <div className="flex-1 text-center lg:text-center">
        <h2 className="text-4xl md:text-5xl font-bold">Edit, Enhance and Empower!</h2>
        <p className="text-lg text-gray-400 mt-4 mb-8"> Experience seamless image processing </p>
        <div className="flex flex-col items-center lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <GradientButton className='lg:px-20' text="Discover" isBlue />
            <GradientButton className='lg:px-20' text="Create" isOutline onClick={() => setPage('tools')} />
          </div>
          <GradientButton text="GenerateImage" className="lg:px-57 px-33 max-w-40 lg:min-w-60 justfy-center items-center text-center flex flex-col" />
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
          <img src="/home.svg" alt="Forest and clouds" className="w-full h-full object-cover object-" onError={(e) => e.target.src = '[https://placehold.co/600x400/1f2937/9ca3af?text=Image+Not+Found](https://placehold.co/600x400/1f2937/9ca3af?text=Image+Not+Found)'} />
        </motion.div>
      </div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------

// =======================================================================
//  Help View
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
//  Account View
// =======================================================================
function AccountView({ onLogout, setPage }) {
  const userData = {
    name: "Keshav Kumar", phone: "9528316559", email: "Keshav18@gmail.com",
    backupEmail: "krishna18@gmail.com", password: "••••••••", securityKey: "2678 8746 3827",
  };
  return (
    <motion.div key="account-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
      className="p-0 md:p-0 text-white" >
      <button onClick={() => setPage(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={18} /> Back to Home
      </button>
      <div className="flex items-center mb-8">
        <ChevronRight size={28} className="text-gray-400 -ml-2" />
        <h1 className="text-3xl font-bold ml-2">Setting</h1>
      </div>
      <h2 className="text-4xl font-bold text-center mb-10">Account Settings</h2>
      <div className="bg-[#1f1f3d]/50 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div>
            <InfoField label="Name" value={userData.name} />
            <InfoField label="Email" value={userData.email} />
            <InfoField label="Password" value={userData.password} isPassword />
          </div>
          <div>
            <InfoField label="Phone Number" value={userData.phone} />
            <InfoField label="Backup Email" value={userData.backupEmail} />
            <InfoField label="Security Key" value={userData.securityKey} />
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onLogout}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg" >
            <LogOut size={20} /> Logout
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
}

// InfoField (Used in AccountView)
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
//  Profile View
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
      console.log("Selected file:", file.name);
    }
  };

  const handleSave = () => {
    setUsername(nickname);
    setProfileImage(localProfileImage);
    console.log("Saving changes:", { nickname, localProfileImage });
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
            onError={(e) => e.target.src = '[https://placehold.co/150x150/222244/ffffff?text=Error](https://placehold.co/150x150/222244/ffffff?text=Error)'}
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
//  SearchView
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
//  DownloadsView
// =======================================================================
function DownloadsView({ setPage }) {
  return (
    <motion.div key="downloads-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
      className="p-0 md:p-0 text-white">
      <button onClick={() => setPage(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"> <ArrowLeft size={18} /> Back to Home </button>
      <h2 className="text-4xl font-bold text-center mb-10">Downloads Page</h2>
      <p className="text-center text-gray-400">This is where the list of downloads will appear.</p>
    </motion.div>
  );
}

// -----------------------------------------------------------------------

// =======================================================================
//  Tools View Sub-Component (Navigation Hub)
// =======================================================================
function ToolsView({ setPage }) {

  const handleToolClick = (toolName) => {
    // Fallback handler for unlinked tools (not needed since all are linked now)
  };

  return (
    <motion.div
      key="tools-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-0 md:p-0 text-white"
    >
      {/* Back button */}
      <button onClick={() => setPage(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={18} /> Back to Home
      </button>

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-bold text-center">Tools</h2>
        <span className="bg-purple-600/50 text-purple-300 border border-purple-400 rounded-full px-4 py-1 text-sm font-semibold">
          Special Features
        </span>
      </div>

      {/* Tools Grid (3x3 layout) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 ">

        {/* Row 1 */}
        <ToolCard
          icon={<Search size={48} />}
          title="Find Object"
          onClick={() => setPage('find-object')}
        />
        <ToolCard
          icon={<FileText size={48} />}
          title="Text Extractor"
          onClick={() => setPage('text-extractor')}
        />
        {/* <ToolCard
          icon={<Repeat size={48} />}
          title="Jpg to png"
          onClick={() => setPage('jpg-to-png')}
        />

        
        <ToolCard
          icon={<RefreshCw size={48} />}
          title="Png to jpg"
          onClick={() => setPage('png-to-jpg')}
        /> 
        */}

        <ToolCard
          icon={<Wand2 size={48} />}
          title="Magic Brush"
          onClick={() => setPage('magic-brush')}
        />
        <ToolCard
          icon={<Sun size={48} />}
          title="Adjustments"
          onClick={() => setPage('adjustments')} // ⬅️ UPDATED LINK
        />

        <ToolCard
          icon={<Repeat size={48} />}
          title="Converter" // Renamed for clarity
          onClick={() => setPage('format-converter')} // ⬅️ UPDATED LINK
        />
        <ToolCard
          icon={<Crop size={48} />}
          title="Crop"
          onClick={() => setPage('crop')}
        />
        <ToolCard
          icon={<Repeat size={48} className="rotate-90" />}
          title="Angle Slider"
          onClick={() => setPage('angle-slider')}
        />
        {/* <ToolCard 
          icon={<Star size={48} />} 
          title="Sharpness" 
          onClick={() => setPage('sharpness')} 
        /> */}

      </div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------

// =======================================================================
//  AUXILIARY COMPONENTS (Used across the file)
// =======================================================================

// NavItem
function NavItem({ icon, text, active = false, onClick }) {
  const content = (<> {icon} <span className="font-medium">{text}</span> </>);
  const classes = `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-white/70 hover:bg-gray-700/50 hover:text-white'}`;
  return (<div onClick={onClick} className={classes}> {content} </div>);
}

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

// GradientButton
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

// ToolCard (Used in ToolsView)
function ToolCard({ icon, title, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={onClick}
      className="bg-[#1f1f3d]/50 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center gap-4 aspect-square cursor-pointer transition-all border-2 border-transparent hover:border-purple-500"
    >
      <div className="text-purple-400 flex flex-col items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white text-center">{title}</h3>
    </motion.div>
  );
}