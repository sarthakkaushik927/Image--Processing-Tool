import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Sun } from 'lucide-react';
import { toolsData } from '../toolsData';  
 
export default function ToolsView({ setPage }) {
 
  const featuredTools = toolsData.filter(tool => tool.type === 'featured');
  const standardTools = toolsData.filter(tool => tool.type === 'standard');

  return (
    <motion.div
      key="tools-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-0 md:p-0 text-white max-w-5xl mx-auto" 
    >
      <button onClick={() => setPage(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-bold text-center">Tools</h2>
        <span className="bg-purple-600/50 text-purple-300 border border-purple-400 rounded-full px-4 py-1 text-sm font-semibold">
          Special Features
        </span>
      </div>

      <h3 className="text-2xl font-semibold text-purple-300 mb-4">Featured Tool</h3>
      
       
      {featuredTools.map(tool => (
        <FeaturedToolCard
          key={tool.page}
 
          icon={<Sun size={40} />} 
          title={tool.title}
          description={tool.description}
          onClick={() => setPage(tool.page)}
        />
      ))}

      <h3 className="text-2xl font-semibold text-purple-300 mt-12 mb-4">All Tools</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 ">
        
         
        {standardTools.map(tool => (
          <StandardToolCard
            key={tool.page}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            onClick={() => setPage(tool.page)}
          />
        ))}

      </div>
    </motion.div>
  );
}

 
function FeaturedToolCard({ icon, title, description, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={onClick}
      className="bg-gradient-to-r from-purple-600/30 to-blue-600/30
                 backdrop-blur-sm rounded-2xl p-6 flex flex-col md:flex-row 
                 items-center gap-6 cursor-pointer transition-all 
                 border-2 border-purple-400/50 hover:border-purple-300 shadow-xl"
    >
      <div className="flex-shrink-0 bg-purple-900/50 p-4 rounded-xl text-purple-200">
        {icon}
      </div>
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
      <div className="text-purple-300">
        <ChevronRight size={32} />
      </div>
    </motion.div>
  );
}

function StandardToolCard({ icon, title, description, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={onClick}
      className="bg-[#1f1f3d]/50 backdrop-blur-sm rounded-2xl p-6 
                 flex flex-col items-center justify-center gap-4 aspect-square 
                 cursor-pointer transition-all 
                 border-2 border-transparent hover:border-purple-500"
    >
      <div className="text-purple-400">
        {icon}
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </div>
    </motion.div>
  );
}