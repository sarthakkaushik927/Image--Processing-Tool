import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function GradientButton({ text, onClick, isBlue, isOutline, className = "", icon, to }) {
  const [ripples, setRipples] = useState([]);

  // --- LIQUID RIPPLE LOGIC ---
  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = { x, y, size, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
  };

  // Cleanup ripples after animation
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => setRipples([]), 600);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  // Determine styles
  const baseStyles = "relative overflow-hidden rounded-xl font-bold transition-all duration-300 flex items-center justify-center tracking-wide group";
  
  const variantStyles = isOutline 
    ? "bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/40" 
    : isBlue
      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
      : "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/30";

  // Common Content Wrapper
  const ButtonContent = () => (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {text}
      </span>
      
      {/* RIPPLE RENDERING */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: 'absolute',
              top: ripple.y,
              left: ripple.x,
              width: ripple.size,
              height: ripple.size,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.3)', // The "Liquid" color
              pointerEvents: 'none',
              zIndex: 0
            }}
          />
        ))}
      </AnimatePresence>
    </>
  );

  // If 'to' prop exists, render as Link (Router DOM), else render as Button
  if (to) {
    return (
      <Link to={to} onClick={(e) => { createRipple(e); onClick && onClick(e); }}>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }} // <--- THE SQUISH
          className={`${baseStyles} ${variantStyles} ${className}`}
        >
          <ButtonContent />
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }} // <--- THE SQUISH
      onClick={(e) => { createRipple(e); onClick && onClick(e); }}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      <ButtonContent />
    </motion.button>
  );
}