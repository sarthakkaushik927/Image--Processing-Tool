import React from 'react';
import { motion } from 'framer-motion';

const reviews = [
  { text: "It literally saved me hours of photoshop work.", author: "Alex D.", role: "Photographer" },
  { text: "The generative fill is pure magic. I don't know how it works, but I love it.", author: "Sarah J.", role: "Influencer" },
  { text: "Best API implementation I've seen for image processing.", author: "Mike T.", role: "DevOps" },
  { text: "FotoFix replaced three different tools in my workflow.", author: "Emily R.", role: "Designer" },
];

export default function TestimonialsSection() {
  return (
    <section className="relative z-10 py-24 overflow-hidden border-y border-white/5 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h2 className="text-3xl font-bold text-white">Loved by Creators.</h2>
      </div>

      <div className="flex overflow-hidden mask-gradient-to-r">
        <motion.div 
          className="flex gap-8 px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...reviews, ...reviews, ...reviews].map((review, i) => (
            <div 
              key={i} 
              className="w-[350px] flex-shrink-0 p-8 rounded-3xl bg-[#111] border border-white/10 hover:border-white/20 transition-colors"
            >
              <p className="text-gray-300 text-lg mb-6">"{review.text}"</p>
              <div>
                <p className="text-white font-bold text-sm">{review.author}</p>
                <p className="text-gray-500 text-xs">{review.role}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}