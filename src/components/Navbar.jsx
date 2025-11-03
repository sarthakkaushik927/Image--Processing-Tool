import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  LogOut, LogIn, UserPlus, Menu, X
} from 'lucide-react';

 
function NavItem({ text, active = false, onClick, path = "#" }) { // Added path prop
  return (
     
    <Link
      to={path}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
        active
        ? 'bg-blue-600 text-white shadow-lg'
        : 'text-white/70 hover:bg-gray-700/50 hover:text-white'
      }`}
    >
       
      <img src="/logo2.svg" alt="" className="h-5 w-5" onError={(e) => e.target.style.display='none'} />
      <span className="font-medium">{text}</span>
    </Link>
  );
}

export default function Navbar({ isAuthenticated, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const commonNavLinks = (
    <>
     
      <NavItem text="Home" path="/" onClick={closeMenu} />
      <NavItem text="Downloads" path="/downloads" onClick={closeMenu} />
      <NavItem text="Account" path="/account" onClick={closeMenu} />
    </>
  );

  return (
    
    <nav className="sticky top-0 z-50 w-full flex justify-between items-center bg-[#1f1f3d]/80 backdrop-blur-md p-4 mb-6">
       
      <div className="flex items-center gap-2 md:gap-10">
        <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
            <img src="/logo.png" alt="FotoFix Logo" className="h-8 w-auto" onError={(e) => e.target.style.display='none'} />
            FotoFix
        </Link>
        <div className="hidden md:flex items-center gap-6">
           {commonNavLinks}
        </div>
      </div>

       
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          
          <>
            <img src="https://placehold.co/40x40/7c3aed/ffffff?text=U" alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-blue-500 hidden md:block"/>
            <button onClick={onLogout} className="p-2 hover:bg-red-500/50 rounded-full hidden md:block" aria-label="Logout">
              <LogOut size={20} />
            </button>
            
            <button onClick={toggleMenu} className="p-2 md:hidden focus:outline-none" aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </>
        ) : (
           
          <>
            <div className="hidden md:flex items-center gap-4">
                 
                <Link to="#" onClick={() => setPage('login')} className="px-4 py-2 rounded-full text-white hover:bg-white/10 transition-colors">
                  Login
                </Link>
                <Link to="#" onClick={() => setPage('signup')} className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all">
                  Sign Up
                </Link>
            </div>
              
            <button onClick={toggleMenu} className="p-2 md:hidden focus:outline-none" aria-label="Toggle menu">
               {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </>
        )}
      </div>

       
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 mt-0 md:hidden bg-[#1c1c3a]/95 backdrop-blur-md shadow-lg p-4 z-40 overflow-hidden" // Changed animation and positioning
          >
             
            <ul className="flex flex-col space-y-3">
               
               {commonNavLinks}
              <hr className="border-gray-700 my-2" />
              {isAuthenticated ? (
                 
                <li>  
                  <button onClick={() => { onLogout(); closeMenu(); }} className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300">
                    <LogOut size={20} /> <span className="font-medium">Logout</span>
                  </button>
                </li>
              ) : (
                  
                 <>
                    
                   <li>
                       <Link to="#" onClick={() => { setPage('login'); closeMenu(); }} className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-gray-700/50 hover:text-white cursor-pointer">
                          <LogIn size={20} /> <span className="font-medium">Login</span>
                       </Link>
                   </li>
                    <li>
                       <Link to="#" onClick={() => { setPage('signup'); closeMenu(); }} className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-gray-700/50 hover:text-white cursor-pointer">
                          <UserPlus size={20} /> <span className="font-medium">Sign Up</span>
                       </Link>
                   </li>
                 </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

