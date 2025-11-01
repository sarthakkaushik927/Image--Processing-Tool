import React from 'react';
import { motion } from 'framer-motion';

// We need Loader2 to handle the disabled/loading state
import { Loader2 } from 'lucide-react'; 

/**
 * A reusable gradient button with fast, responsive CSS animations.
 *
 * Props:
 * - text: The text to display on the button.
 * - isBlue: (boolean) If true, uses the blue gradient.
 * - isOutline: (boolean) If true, uses the outline style.
 * - className: (string) Additional classes to apply.
 * - onClick: Function to call on click.
 * - disabled: (boolean) Disables the button.
 * - icon: (Component) A lucide-react icon component (or Loader2).
 */
export default function GradientButton({ 
  text, 
  isBlue = false, 
  isOutline = false, 
  className = "", 
  onClick, 
  disabled, 
  icon: Icon // This is how you pass a component as a prop
}) {

  // --- Animation & Style Definitions ---

  // Base classes for all buttons
  // - duration-100: Very fast transition
  // - hover:scale-[1.03] hover:-translate-y-0.5: Subtle "lift" on hover
  // - active:scale-[0.98] active:translate-y-0: "Squish" effect on click
  const defaultClasses = `
    w-full md:w-auto px-8 py-3 rounded-full font-semibold flex items-center justify-center gap-2 
    transform transition-all duration-100 ease-in-out 
    hover:scale-[1.03] hover:-translate-y-0.5 
    active:scale-[0.98] active:translate-y-0
  `;
  
  // Classes for the disabled state
  // Disabled buttons won't have hover/active effects
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : '';

  // --- NEW SATISFYING ANIMATIONS ---

  // 1. For Gradient Buttons (Blue & Purple):
  //    - On hover, the shadow lifts (shadow-xl) and gets a color matching the button.
  const blueGradientHover = "hover:shadow-xl hover:shadow-blue-500/40";
  const purpleGradientHover = "hover:shadow-xl hover:shadow-purple-500/40";

  // 2. For the Outline Button:
  //    - On hover, the border and text get brighter.
  //    - A strong purple glow (shadow) appears, making it "pop".
  const outlineAnimationClasses = "hover:border-purple-300 hover:text-white hover:shadow-lg hover:shadow-purple-400/50";

  // --- Style Logic ---

  // Define the base styles
  const blueGradient = `bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg ${blueGradientHover}`;
  const purpleGradient = `bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg ${purpleGradientHover}`;
  
  // Base outline style
  const outlineBase = "bg-transparent border-2 border-purple-400 text-purple-300";
  // Combine base outline with its new animation
  const outline = `${outlineBase} ${outlineAnimationClasses}`;
  
  // Determine which style to use
  const buttonClasses = isOutline ? outline : (isBlue ? blueGradient : purpleGradient);

  return (
    // We still use motion.button for layout animations (if you use AnimatePresence)
    // but the hover/tap animations are now handled by CSS.
    <motion.button
      // REMOVED whileHover and whileTap props
      
      onClick={onClick}
      disabled={disabled}
      
      // CSS transitions will handle all the fast animations
      className={`${defaultClasses} ${buttonClasses} ${className} ${disabledClasses}`}
    >
      {/* Icon rendering logic from your other components */}
      {Icon && (
        <Icon 
          size={20} 
          // This will automatically spin if the icon is Loader2 and button is disabled
          className={disabled && Icon === Loader2 ? "animate-spin" : ""} 
        />
      )}
      {text}
    </motion.button>
  );
}

