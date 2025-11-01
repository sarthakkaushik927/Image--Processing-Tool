import React from 'react';
import { motion } from 'framer-motion';

export default function SmallButton({ children, onClick, className = "" }) {
  return (
    <motion.button 
      // REMOVED whileHover and whileTap props
      onClick={onClick} 
      className={`
        p-[2px] rounded-2xl 
        bg-gradient-to-r from-blue-500 to-purple-600 
        relative overflow-hidden 
        transform transition-all duration-100 ease-in-out 
        hover:scale-[1.03] hover:-translate-y-0.5 
        active:scale-[0.98] active:translate-y-0
        ${className}
      `}
    >
      <div className="bg-[#1c1c3a] h-full w-full rounded-[14px] flex items-center justify-center"> 
        {children} 
      </div>
    </motion.button>
  );
}
