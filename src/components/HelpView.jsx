import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Rocket, Wrench, FileText } from 'lucide-react';
import HelpCard from './HelpCard';

export default function HelpView({ setShowHelp }) {
  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} >
      <button onClick={() => setShowHelp(false)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"> <ArrowLeft size={18} /> Back </button>
      <h2 className="text-3xl md:text-4xl font-bold text-center">Hello, How Can We Help YOU</h2>
      <div className="relative w-full max-w-2xl mx-auto my-8">
        <input type="text" placeholder="Search your keyword here..." className="w-full pl-12 pr-16 py-4 rounded-full bg-[#2a2a4a]/70 backdrop-blur-sm border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-lg" />
        <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"> <Search size={20} className="text-white" /> </button>
      </div>
      <div className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HelpCard icon={<Rocket size={32} className="text-blue-400" />} title="Getting Started" text="Helps you to know how to start your editing journey" />
          <HelpCard icon={<Wrench size={32} className="text-purple-400" />} title="Dobby" text="Helps you to know how to start your editing journey" />
          <HelpCard icon={<FileText size={32} className="text-green-400" />} title="Key Concepts" text="This helps you to enhance your editing skills" />
        </div>
      </div>
    </motion.div>
  );
}