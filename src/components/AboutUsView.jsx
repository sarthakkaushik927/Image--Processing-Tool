import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ Import Layout Components
import HeaderNav from './HeaderNav';
import BubblesBackground from './BubblesBackground';

export default function AboutUsView({ isAuthenticated, onLogout, profileImage }) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white">
      {/* Layout Wrappers */}
      <BubblesBackground />
      <HeaderNav isAuthenticated={isAuthenticated} onLogout={onLogout} profileImage={profileImage} />

      <motion.div
        key="about-us-view"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative z-10 pt-24 px-6 md:px-12 max-w-5xl mx-auto"
      >
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Home
        </button>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-gray-400">
          About Us
        </h1>

        <div className="bg-[#1f1f3d]/50 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl border border-white/10 flex flex-col md:flex-row gap-10 items-center">
          
          {/* Image Section */}
          <div className="md:w-1/3 w-full flex-shrink-0">
            <motion.div
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
              className="w-full aspect-[3/4] md:h-80 bg-gray-800 rounded-2xl overflow-hidden border-4 border-white/10 shadow-xl relative group"
            >
              {/* Fallback image if local file missing */}
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                alt="Our Team" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                onError={(e) => e.target.src = 'https://placehold.co/400x600/2a2a4a/ffffff?text=Team+Photo'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </motion.div>
          </div>
          
          {/* Text Content */}
          <div className="flex flex-col justify-center flex-1">
            <h2 className="text-2xl font-bold mb-4 text-white">Who We Are</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Welcome to <b className="text-white">FotoFix</b>, your one-stop solution for smart and simple image processing. We make editing effortless—crop images, enhance sharpness, adjust contrast, and even convert between JPG and PNG formats with ease. Our tools also help you extract text from images instantly.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed border-l-4 border-purple-500 pl-4 italic bg-purple-500/5 py-2 rounded-r-lg">
              At FotoFix, we combine accuracy, speed, and creativity to help you make every image picture-perfect.
            </p>
            
            <div className="mt-10 pt-6 border-t border-white/10 flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-full">
                <Heart size={20} className="text-red-500 fill-red-500" />
              </div>
              <p className="text-lg text-white font-medium">
                Created by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-bold">Team 1, CCC, AKGEC.</span>
              </p>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}