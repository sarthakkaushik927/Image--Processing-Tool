import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, LogOut, Home, Download, UserCircle, 
  Menu, X, LogIn, LayoutGrid 
} from 'lucide-react';
import GradientButton from './GradientButton'; 
 
export default function HeaderNav({ isAuthenticated, onLogout, setPage, page, profileImage }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  // Navigation logic
  const handleNavClick = (pageNameOrPath) => {
    // ❗️ Discover page ab unprotected hai (sab dekh sakte hain)
    if (!isAuthenticated && ['downloads', 'account', 'profile'].includes(pageNameOrPath)) {
      setPage('login'); 
    } else {
      setPage(pageNameOrPath);
    }
    setIsOpen(false);
  }

  
  const navLinks = [
    { name: "Home", page: null, icon: <Home size={18} /> },
    { name: "Discover", page: "discover", icon: <LayoutGrid size={18} /> }, 
    { name: "Downloads", page: "downloads", icon: <Download size={18} /> },
    { name: "Account", page: "account", icon: <UserCircle size={18} /> },
    { name: "Search", page: "search", icon: <Search size={18} /> }
  ];

  return (
    <nav 
      className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#1c1c3a] via-[#1c1c3a]/90 to-transparent"
    >
      <div className="max-w-auto mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4">
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 md:gap-4 cursor-pointer" 
            onClick={() => handleNavClick(null)}
          >
            <img src="logo.svg" alt="FotoFix Logo" className="h-9 w-auto" onError={(e) => e.target.style.display = 'none'} />
            <span className="text-2xl font-bold text-white tracking-wide">FotoFix</span>
          </motion.div>

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

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
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
                    boxShadow: "0 0 15px rgba(168, 85, 247, 0.8), 0 0 5px rgba(59, 130, 246, 0.6)"
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
              <div className="hidden md:block">
                <GradientButton 
                  text="Login / Signup" 
                  onClick={() => handleNavClick('login')}
                  className="px-6 py-2.5 text-sm" 
                />
              </div>
            )}
            
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

      <AnimatePresence >
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

 
function NavItem({ text, icon, isActive, onClick }) {
  return (
    <li
      onClick={onClick}
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
      <span className="relative z-10 flex items-center gap-2 text-sm font-medium">
        {icon}
        {text}
      </span>
    </li>
  );
}

 
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

function AnimatedMobileMenu({ page, isAuthenticated, onLogout, handleNavClick, navLinks }) {
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