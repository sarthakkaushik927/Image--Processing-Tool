import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react'; 

export default function GradientButton({ 
  text, 
  isBlue = false, 
  isOutline = false, 
  className = "", 
  onClick, 
  disabled, 
  icon: Icon
}) {

  const defaultClasses = `
    w-full md:w-auto px-8 py-3 rounded-full font-semibold flex items-center justify-center gap-2 
    transform transition-all duration-100 ease-in-out 
    hover:scale-[1.03] hover:-translate-y-0.5 
    active:scale-[0.98] active:translate-y-0
  `;
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : '';
  const blueGradientHover = "hover:shadow-xl hover:shadow-blue-500/40";
  const purpleGradientHover = "hover:shadow-xl hover:shadow-purple-500/40";
  const outlineAnimationClasses = "hover:border-purple-300 hover:text-white hover:shadow-lg hover:shadow-purple-400/50";
  const blueGradient = `bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg ${blueGradientHover}`;
  const purpleGradient = `bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg ${purpleGradientHover}`;
  const outlineBase = "bg-transparent border-2 border-purple-400 text-purple-300";
  const outline = `${outlineBase} ${outlineAnimationClasses}`;
  const buttonClasses = isOutline ? outline : (isBlue ? blueGradient : purpleGradient);

  return (
    <motion.button
      
      onClick={onClick}
      disabled={disabled}
      className={`${defaultClasses} ${buttonClasses} ${className} ${disabledClasses}`}
    >
      {Icon && (
        <Icon 
          size={20} 
           
          className={disabled && Icon === Loader2 ? "animate-spin" : ""} 
        />
      )}
      {text}
    </motion.button>
  );
}

