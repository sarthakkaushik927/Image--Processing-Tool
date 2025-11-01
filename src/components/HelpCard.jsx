import React from 'react';
import { motion } from 'framer-motion';


export default function HelpCard({ icon, title, text }) {
  return (
    <motion.div 
      whileHover={{ 
        scale: 1.03, 
        borderColor: "rgba(167, 139, 250, 0.7)", 
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)" 
      }}
      className="bg-indigo-900/10 backdrop-blur-sm border-2 border-indigo-400/30 rounded-2xl p-6 transition-all cursor-pointer"
    >
      <div className="mb-4">
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-2 text-white">{title}</h4>
      <p className="text-indigo-200/80">{text}</p>
    </motion.div>
  );
}
