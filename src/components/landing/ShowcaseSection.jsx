import React from 'react';
import { motion } from 'framer-motion';
import { ScanFace, ImagePlus, Eraser } from 'lucide-react';

const showcaseItems = [
  {
    icon: <Eraser />,
    title: "Object Removal",
    before: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600",
    after: "Clean Composition",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: <ScanFace />,
    title: "Portrait Enhance",
    before: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
    after: "Studio Quality",
    color: "from-purple-500 to-indigo-500"
  },
  {
    icon: <ImagePlus />,
    title: "Generative Fill",
    before: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=600",
    after: "Expanded Reality",
    color: "from-cyan-500 to-blue-500"
  }
];

export default function ShowcaseSection() {
  return (
    <section className="relative z-10 py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }}
          className="mb-16 text-center"
        >
          <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase mb-2 block">Capabilities</span>
          <h2 className="text-4xl md:text-5xl font-black text-white">Pixels Perfected.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {showcaseItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="group relative h-[400px] rounded-[2rem] overflow-hidden border border-white/10"
            >
              <img 
                src={item.before} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <div className="text-white">{item.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                <p className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {item.after}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}