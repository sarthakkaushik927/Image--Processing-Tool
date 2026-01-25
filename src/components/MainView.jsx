import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, ArrowRight, CircleHelp, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GradientButton from './GradientButton';


const carouselImages = [
  "/home.svg", 
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop"
];

export default function MainView({ setShowHelp, setPage, isAuthenticated }) {
  
  const navigate = useNavigate(); 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 1500); 

    return () => clearInterval(interval);
  }, []);

  
  const handleProtectedAction = (route) => {
    if (isAuthenticated) {
      navigate(route);
    } else {
      navigate('/login');
    }
  };

  return (
 
    <div className="relative w-full lg:max-h-[79vh] h-auto overflow-hidden flex items-center justify-center bg-transparent backdrop-blur-xl shadow-[inset_0_0_40px_rgba(255,255,255,0.05)] border border-white/5 rounded-2xl transform-gpu">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative z-10 py-12"
      >
        
        {/* --- LEFT SIDE --- */}
        <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left max-w-2xl relative z-20">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-purple-200 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.15)] mb-8"
          >
            <Sparkles size={14} className="text-purple-400" /> 
            <span>Next Gen Processing</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg will-change-transform">
              Edit, Enhance <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 drop-shadow-none">
                & Empower.
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-blue-100/70 mb-10 leading-relaxed font-light max-w-lg"
          >
            Experience seamless AI-driven image processing. Remove backgrounds, 
            enhance quality, and generate assets in seconds.
          </motion.p>

          {/* Action Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full flex flex-col items-center lg:items-start gap-6"
          >
            
            {/* Primary Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <GradientButton 
                text="Start Creating" 
                isBlue 
                onClick={() => handleProtectedAction('/tools')}
                className="px-8 py-3 text-base shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-shadow duration-300 w-full sm:w-auto"
              />
              <GradientButton 
                text="Discover Tools" 
                isOutline 
                to="/discover"
                className="px-8 py-3 text-base border-white/20 hover:bg-white/5 w-full sm:w-auto"
              />
            </div>

            {/* Etched Search Bar */}
            <div className="w-full max-w-md mt-2">
              <button 
                onClick={() => handleProtectedAction('/search')}
                className="w-full group flex items-center justify-between p-1 pl-4 pr-2 bg-black/20 hover:bg-black/30 border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-200 active:scale-[0.98] transform-gpu"
              >
                <div className="flex items-center gap-4">
                  <Search size={20} className="text-white/40 group-hover:text-white/80 transition-colors" />
                  <div className="text-left py-2">
                    <div className="text-white/90 font-medium text-sm">Find a specific tool</div>
                    <div className="text-white/30 text-xs">Type to search 50+ AI effects...</div>
                  </div>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-purple-500 group-hover:text-white text-white/30 transition-all">
                  <ArrowRight size={18} />
                </div>
              </button>
            </div>

            {/* Glass Chip Footer */}
            <div className="flex items-center gap-3 mt-4">
               <GradientButton 
                 text="About Us"
                 to="/about"
                 isOutline
                 icon={<Info size={14} />}
                 className="!bg-white/5 !border-white/10 !text-gray-300 hover:!text-white !px-4 !py-2 !text-sm hover:!border-purple-500/30"
               />

               <GradientButton 
                 text="Need Help?"
                 onClick={() => setShowHelp(true)}
                 isOutline
                 icon={<CircleHelp size={14} />}
                 className="!bg-white/5 !border-white/10 !text-gray-300 hover:!text-white !px-4 !py-2 !text-sm hover:!border-blue-500/30"
               />
            </div>

          </motion.div>
        </div>

        {/* --- RIGHT SIDE: 3D Carousel Card --- */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
          {/* Decorative Glow (Reduced size for performance) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-2xl pointer-events-none transform-gpu" />
          
          <motion.div 
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative z-10 w-full h-full rounded-2xl p-2 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 backdrop-blur-xl shadow-2xl overflow-hidden transform-gpu"
          >
            {/* Window Controls */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2 rounded-t-xl z-20 backdrop-blur-sm">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="ml-auto text-[10px] text-gray-500 font-mono">dashboard_preview.exe</div>
            </div>

            {/* --- CAROUSEL CONTAINER --- */}
            {/* ✅ Keeps your requested 'min-h-[400px]' */}
            <div className="relative w-full min-h-[400px] pt-10 bg-gray-900 overflow-hidden rounded-b-xl">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={currentImageIndex} 
                  src={carouselImages[currentImageIndex]}
                  alt="Feature Preview"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  // ✅ FASTER TRANSITION (0.6s) for snappy feel
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover will-change-transform"
                  onError={(e) => e.target.src = 'https://placehold.co/600x500/13131f/9ca3af?text=Preview'}
                />
              </AnimatePresence>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f16] via-transparent to-transparent opacity-30 pointer-events-none" />
              
              {/* Progress Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {carouselImages.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/30'}`}
                  />
                ))}
              </div>
            </div>

          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}