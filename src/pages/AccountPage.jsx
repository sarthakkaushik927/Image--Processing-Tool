import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, LogOut, ArrowLeft } from 'lucide-react'; 

 
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


export default function AccountPage({ onLogout, username, userEmail, setPage }) {
  
  
  const userData = {
    name: username,  
    phone: "9528316559",  
    email: userEmail,  
    backupEmail: userEmail, 
    password: "••••••••",
    securityKey: "2678 8746 3827",
  };

   
  const handleLogoutClick = () => {
    onLogout();  
  };

  return (
      <motion.div
        key="account-page" 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="p-6 md:p-10 text-white min-h-screen pt-24" 
      >
         
        <div className="flex items-center mb-8">
          <motion.button
              onClick={() => setPage(null)}  
              whileHover={{ x: -3 }}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={28} className="-ml-2" /> 
          </motion.button>
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogoutClick}  
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
            >
              <LogOut size={20} />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.div>
  );
}
