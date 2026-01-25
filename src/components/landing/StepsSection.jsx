import React from 'react';
import { motion } from 'framer-motion';

export default function StepsSection() {
  const steps = [
    { num: '01', title: 'Upload', desc: 'Drag & drop any image format.' },
    { num: '02', title: 'Select', desc: 'Brush over the area you want to change.' },
    { num: '03', title: 'Generate', desc: 'Type a prompt or let AI auto-enhance.' },
  ];

  return (
    <section className="relative z-10 py-32 border-t border-white/5 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <h1 className="text-8xl font-black text-white/5 group-hover:text-purple-600/20 transition-colors duration-500">
                {step.num}
              </h1>
              <div className="absolute top-12 left-4">
                <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}