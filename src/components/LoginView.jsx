// src/components/LoginView.js

import React from 'react';
import { motion } from 'framer-motion';
import GradientButton from './GradientButton'; // ⬅️ Import the button

// =======================================================================
//  LoginView Component (Placeholder)
// =======================================================================
export default function LoginView({ setPage, onLogin }) {
  
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