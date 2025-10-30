import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, LogOut, Home, Download, UserCircle, Menu, X 
} from 'lucide-react';

// --- Helper Component: NavItem ---
function NavItem({ icon, text, active = false, onClick }) {
    const content = (<> {icon} <span className="font-medium">{text}</span> </>);
    const classes = `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-white/70 hover:bg-gray-700/50 hover:text-white'}`;
    return (<div onClick={onClick} className={classes}> {content} </div>);
}

// =======================================================================
// Header Navigation Component
// =======================================================================
export default function HeaderNav({ isAuthenticated, onLogout, setPage, page, profileImage }) {
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
                    onError={(e) => e.target.src = 'https://placehold.co/40x40/7c3aed/ffffff?text=U'} // Fallback
                />
                {/* 🚨 IMPORTANT: This onClick calls the global modal trigger (handleLogoutTrigger) in App.jsx */}
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
                                {/* 🚨 IMPORTANT: This onClick calls the global modal trigger */}
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
