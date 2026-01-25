import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, LogOut, Home, Download, UserCircle, 
  Menu, X, LogIn, LayoutGrid 
  // Wand2 was removed since "Tools" is gone
} from 'lucide-react';
import GradientButton from './GradientButton'; 

export default function HeaderNav({ isAuthenticated, onLogout, profileImage }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const location = useLocation();
  const navigate = useNavigate();

  // Helper to determine active state based on current path
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
    navigate('/login');
  };

  // ✅ Updated Links Array (Removed "Tools")
  const navLinks = [
    { name: "Home", path: "/dashboard", icon: <Home size={18} /> },
    { name: "Discover", path: "/discover", icon: <LayoutGrid size={18} /> }, 
    { name: "Downloads", path: "/downloads", icon: <Download size={18} /> },
    { name: "Account", path: "/account", icon: <UserCircle size={18} /> },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#1c1c3a] via-[#1c1c3a]/90 to-transparent">
      <div className="max-w-auto mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo */}
          <Link to="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 md:gap-4 cursor-pointer" 
            >
              <img src="logo.svg" alt="FotoFix Logo" className="h-9 w-auto" onError={(e) => e.target.style.display = 'none'} />
              <span className="text-2xl font-bold text-white tracking-wide">FotoFix</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-2 bg-black/20 p-2 rounded-full border border-white/10">
            {navLinks.map((link) => (
              <DesktopNavItem
                key={link.name}
                text={link.name}
                icon={link.icon}
                isActive={isActive(link.path)}
                path={link.path}
              />
            ))}
          </ul>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <motion.button 
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout} 
                  className="p-2.5 rounded-full text-gray-300 hover:text-white transition-colors hidden md:block" 
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </motion.button>
                
                <Link to="/account">
                  <motion.img
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 0 15px rgba(168, 85, 247, 0.8), 0 0 5px rgba(59, 130, 246, 0.6)"
                    }} 
                    transition={{ type: "spring", stiffness: 300 }}
                    src={profileImage || 'https://placehold.co/40x40/7c3aed/ffffff?text=U'}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-purple-500 cursor-pointer object-cover"
                    onError={(e) => e.target.src = 'https://placehold.co/40x40/7c3aed/ffffff?text=U'}
                  />
                </Link>
              </>
            ) : (
              <div className="hidden md:block">
                <GradientButton 
                  text="Login / Signup" 
                  onClick={() => navigate('/login')}
                  className="px-6 py-2.5 text-sm" 
                />
              </div>
            )}
            
            {/* Mobile Menu Toggle */}
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu} 
              className="p-2 md:hidden focus:outline-none text-white" 
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <AnimatedMobileMenu 
            isActive={isActive}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            toggleMenu={toggleMenu}
            navLinks={navLinks}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}

// --- Desktop Nav Item Component ---
function DesktopNavItem({ text, icon, isActive, path }) {
  return (
    <Link to={path}>
      <li
        className="relative px-4 py-2 rounded-full cursor-pointer transition-colors"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        {isActive && (
          <motion.div
            layoutId="active-pill" 
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg"
            style={{ borderRadius: 9999 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        )}
        <span className={`relative z-10 flex items-center gap-2 text-sm font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
          {icon}
          {text}
        </span>
      </li>
    </Link>
  );
}

// --- Animation Variants ---
const menuVariants = {
  closed: { opacity: 0, height: 0 },
  open: { 
    opacity: 1, 
    height: 'auto',
    transition: { when: "beforeChildren", staggerChildren: 0.05 } 
  }
};
const itemVariants = {
  closed: { opacity: 0, y: -10 },
  open: { opacity: 1, y: 0 }
};

// --- Mobile Menu Component ---
function AnimatedMobileMenu({ isActive, isAuthenticated, onLogout, toggleMenu, navLinks }) {
  return (
    <motion.div 
      variants={menuVariants}
      initial="closed"
      animate="open"
      exit="closed"
      className="absolute top-full left-0 right-0 md:hidden bg-[#1c1c3a]/90 backdrop-blur-lg shadow-lg overflow-hidden border-t border-white/10"
    >
      <ul className="flex flex-col p-4 space-y-2">
        {navLinks.map(link => (
          <motion.li variants={itemVariants} key={link.name}>
            <Link to={link.path} onClick={toggleMenu}>
              <MobileNavItem 
                text={link.name} 
                icon={link.icon} 
                isActive={isActive(link.path)} 
              />
            </Link>
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
            <Link to="/login" onClick={toggleMenu} className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-blue-300 hover:bg-blue-500/20 hover:text-blue-200">
              <LogIn size={20} /> <span className="font-medium">Login / Signup</span>
            </Link>
          </motion.li>
        )}
      </ul>
    </motion.div>
  );
}

function MobileNavItem({ icon, text, isActive }) {
  return (
    <div 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer 
                  ${isActive ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-white/70 hover:bg-gray-700/50 hover:text-white'}`}
    > 
      {icon} <span className="font-medium">{text}</span> 
    </div>
  );
}