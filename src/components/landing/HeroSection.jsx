import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Wand2, PlayCircle } from 'lucide-react';

export default function HeroSection({ isAuthenticated }) {
  const navigate = useNavigate();

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center text-center px-6 z-10 pointer-events-none">
      {/* pointer-events-none allows clicks to pass through to the 3D background if needed, 
          but we re-enable pointer-events-auto on buttons below */}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-5xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm font-bold mb-8 backdrop-blur-md pointer-events-auto">
          <Wand2 size={14} />
          <span>V2.0 Now Live</span>
        </div>

        <h1 className="text-6xl md:text-9xl font-black text-white leading-tight mb-8 tracking-tighter drop-shadow-2xl mix-blend-overlay">
          IMAGINE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
            REALITY
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          The only AI editor that understands your vision. <br/>
          <strong className="text-white font-medium">Edit. Generate. Transform.</strong>
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pointer-events-auto">
          <button 
            onClick={() => isAuthenticated ? navigate('/dashboard') : navigate('/signup')}
            className="px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.4)] cursor-pointer"
          >
            {isAuthenticated ? 'Open Studio' : 'Start Creating'} 
            <ArrowRight size={20} />
          </button>
          
          <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer">
            <PlayCircle size={20} /> Watch Demo
          </button>
        </div>
      </motion.div>
    </section>
  );
}