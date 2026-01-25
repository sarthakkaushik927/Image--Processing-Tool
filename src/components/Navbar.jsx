import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wand2, LayoutDashboard, LogOut } from 'lucide-react';
import LogoutModal from './LogoutModal';

export default function Navbar({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    onLogout(); 
    navigate('/'); 
  };

  return (
    <>
      {/* FIX: z-[999] ensures this stays on top of the 3D Canvas.
         bg-black/40 + backdrop-blur-xl creates the heavy glass effect.
      */}
      <nav className="fixed top-0 w-full z-[999] px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* --- BRANDING: FotoFix --- */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Logo Icon */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform duration-300">
              <Wand2 className="text-white" size={18} />
            </div>
            
            {/* Logo Text */}
            <span className="text-xl font-bold text-white tracking-wide group-hover:text-purple-300 transition-colors">
              FotoFix
            </span>
          </Link>

          {/* --- ACTION BUTTONS --- */}
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              /* LOGGED IN VIEW */
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all backdrop-blur-md"
                >
                  <LayoutDashboard size={16} />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
                
                <button 
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="px-3 py-2 text-red-400 bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all flex items-center justify-center"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              /* GUEST VIEW */
              <div className="flex gap-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="px-6 py-2 text-sm font-bold text-black bg-white rounded-full hover:bg-cyan-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleConfirmLogout} 
      />
    </>
  );
}