import React from 'react';
import { motion } from 'framer-motion';



export default function BubblesBackground() {
  const bubbles = [
     { id: 1, x: '10%', y: '20%', size: 300, delay: 0, duration: 15 }, { id: 2, x: '80%', y: '30%', size: 200, delay: 2, duration: 20 },
     { id: 3, x: '60%', y: '70%', size: 250, delay: 4, duration: 18 }, { id: 4, x: '20%', y: '80%', size: 150, delay: 6, duration: 22 },
   ];
  return (
    
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Bubble 1 */}
      <motion.div 
        className="absolute w-96 h-96 bg-purple-800 rounded-full filter blur-3xl"
        initial={{ x: '-10rem', y: '-10rem' }}
        animate={{ 
          x: ['-10rem', '0rem', '-10rem'], 
          y: ['-10rem', '10rem', '-10rem'], 
          scale: [1, 1.2, 1], 
        }}
        transition={{
          duration: 15, 
          repeat: Infinity, 
          ease: 'easeInOut',
        }}
      />
      {/* Bubble 2 */}
      <motion.div 
        className="absolute w-96 h-96 bg-blue-800 rounded-full filter blur-3xl"
        initial={{ x: '30rem', y: '15rem' }} 
        animate={{ 
          x: ['30rem', '20rem', '30rem'],
          y: ['30rem', '40rem', '30rem'],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 20, 
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5, 
        }}
      />
       {/* Bubble 3 */}
      <motion.div 
        className="absolute w-80 h-80 bg-indigo-800 rounded-full filter blur-3xl"
        initial={{ x: '10rem', y: '5rem' }} 
        animate={{ 
          x: ['70rem', '45rem', '70rem'],
          y: ['30rem', '20rem', '30rem'],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 10,
        }}
      />
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute bg-gradient-to-br from-blue-700 to-purple-700 opacity-50 rounded-full filter blur-3xl"
          style={{ width: bubble.size, height: bubble.size, top: bubble.y, left: bubble.x }}
          animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0] }}
          transition={{ duration: bubble.duration, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", delay: bubble.delay }}
        />
      ))}

    </div>
    </div>
  );
}
