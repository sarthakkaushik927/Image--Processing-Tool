import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, ArrowLeft } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

// ✅ Import Layout Components (Adjust path if needed)
import HeaderNav from '../components/HeaderNav'; 
import BubblesBackground from '../components/BubblesBackground'; 

function InfoField({ label, value, isPassword = false }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-white/5 p-3 rounded-lg text-white font-medium">
        {isPassword ? '••••••••' : value}
      </div>
    </div>
  );
}

export default function AccountPage({ isAuthenticated, onLogout, username, userEmail, profileImage }) {
  const navigate = useNavigate();
  
  const userData = {
    name: username || "Guest",  
    phone: "9528316559",  
    email: userEmail || "guest@example.com",  
    backupEmail: userEmail, 
    password: "••••••••",
    securityKey: "2678 8746 3827",
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white">
      {/* Layout Wrappers */}
      <BubblesBackground />
      <HeaderNav isAuthenticated={isAuthenticated} onLogout={onLogout} profileImage={profileImage} />

      <motion.div
        key="account-page" 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 pt-24 px-6 md:px-10 max-w-4xl mx-auto" 
      >
        <div className="flex items-center mb-8">
          <button
              onClick={() => navigate('/')} 
              className="flex items-center text-gray-400 hover:text-white transition-colors gap-2"
          >
            <ArrowLeft size={24} /> 
            <span className="text-lg">Back</span>
          </button>
        </div>

        <div className="text-center mb-10">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-gray-400 inline-block">
                Account Settings
            </h2>
        </div>
          
        <div className="bg-[#1f1f3d]/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}  
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-semibold shadow-lg transition-all"
            >
              <LogOut size={20} />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}