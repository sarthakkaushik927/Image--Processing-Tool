import React from 'react';
import { motion } from 'framer-motion';

export default function BubblesBackground() {
  const bubbles = [
    { id: 1, x: '10%', y: '20%', size: 300, delay: 0, duration: 15 },
    { id: 2, x: '80%', y: '30%', size: 200, delay: 2, duration: 20 },
    { id: 3, x: '60%', y: '70%', size: 250, delay: 4, duration: 18 },
    { id: 4, x: '20%', y: '80%', size: 150, delay: 6, duration: 22 },
  ];

  return (
    // ✅ FIX: Changed from 'fixed -z-10' to 'absolute inset-0 z-0'
    // This ensures it sits ON TOP of the App's black background, but BEHIND the content.
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-[#0a0a12]" />

      {/* --- Layer 1: Large Ambient Blobs --- */}
      <motion.div 
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/30 rounded-full filter blur-[120px]"
        animate={{ 
          x: ['0%', '10%', '0%'], 
          y: ['0%', '15%', '0%'], 
          scale: [1, 1.1, 1], 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.div 
        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-900/20 rounded-full filter blur-[120px]"
        animate={{ 
          x: ['0%', '-10%', '0%'],
          y: ['0%', '-20%', '0%'],
          scale: [1.1, 1, 1.1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* --- Layer 2: Floating Bubbles --- */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full filter blur-3xl"
          style={{ width: bubble.size, height: bubble.size, top: bubble.y, left: bubble.x }}
          animate={{ 
            x: [0, 30, -30, 0], 
            y: [0, -30, 30, 0] 
          }}
          transition={{ 
            duration: bubble.duration, 
            ease: "easeInOut", 
            repeat: Infinity, 
            repeatType: "mirror", 
            delay: bubble.delay 
          }}
        />
      ))}
    </div>
  );
}