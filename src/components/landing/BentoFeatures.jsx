import React from 'react';
import { motion } from 'framer-motion';
import { Crop, Layers, Zap, Image, Maximize } from 'lucide-react';

const BentoCard = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.02 }}
    className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all ${className}`}
  >
    {children}
  </motion.div>
);

export default function BentoFeatures() {
  return (
    <section className="relative z-10 py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Tools of Tomorrow.</h2>
          <p className="text-gray-400 text-xl">Everything you need, powered by neural networks.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[800px]">
          
          {/* Large Card Left */}
          <BentoCard className="md:col-span-2 md:row-span-2 flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="z-10">
              <div className="p-4 bg-purple-600 rounded-2xl w-fit mb-6"><Zap className="text-white" size={32} /></div>
              <h3 className="text-3xl font-bold text-white mb-2">Magic Remove</h3>
              <p className="text-gray-400">Instantly delete objects, people, or text from any image. The AI reconstructs the background perfectly.</p>
            </div>
            <div className="mt-8 h-64 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden">
               {/* Decorative lines representing AI scanning */}
               <div className="absolute top-1/2 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.8)] animate-pulse" />
            </div>
          </BentoCard>

          {/* Medium Card Top Right */}
          <BentoCard className="md:col-span-2 flex flex-col justify-center" delay={0.1}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-600 rounded-xl"><Layers className="text-white" size={24} /></div>
              <h3 className="text-2xl font-bold text-white">Smart Layers</h3>
            </div>
            <p className="text-gray-400">Separate foreground and background automatically with depth detection.</p>
          </BentoCard>

          {/* Small Card Bottom Right 1 */}
          <BentoCard className="flex flex-col justify-between" delay={0.2}>
            <div className="p-3 bg-pink-600 rounded-xl w-fit"><Crop className="text-white" size={24} /></div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Generative Crop</h3>
              <p className="text-gray-500 text-sm">Expand images beyond their borders.</p>
            </div>
          </BentoCard>

          {/* Small Card Bottom Right 2 */}
          <BentoCard className="flex flex-col justify-between bg-gradient-to-br from-cyan-900/40 to-black" delay={0.3}>
            <div className="p-3 bg-cyan-600 rounded-xl w-fit"><Maximize className="text-white" size={24} /></div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">4K Upscale</h3>
              <p className="text-gray-500 text-sm">Enhance details without losing quality.</p>
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}