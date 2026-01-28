import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, X, 
  Crop, Wand2, ScanText, Sliders, RotateCw, FileType, Grid3X3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BubblesBackground from './BubblesBackground'; 

// Data definitions
const toolsData = [
  { 
    id: 'magic-brush', 
    title: 'Magic Remove', 
    description: 'Remove backgrounds instantly with AI precision.', 
    icon: <Wand2 size={32} />, 
    page: 'magic-brush', 
    type: 'featured',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'object-find', 
    title: 'Object Finder', 
    description: 'Detect and label objects within your images automatically.', 
    icon: <Grid3X3 size={32} />, 
    page: 'find-object', 
    type: 'featured',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'crop', 
    title: 'Smart Crop', 
    description: 'Resize and frame your photos for any social platform.', 
    icon: <Crop size={28} />, 
    page: 'crop', 
    type: 'standard' 
  },
  { 
    id: 'text', 
    title: 'Text Extractor', 
    description: 'Pull text from images using OCR technology.', 
    icon: <ScanText size={28} />, 
    page: 'text-extractor', 
    type: 'standard' 
  },
  { 
    id: 'adjust', 
    title: 'Adjustments', 
    description: 'Fine-tune brightness, contrast, and saturation.', 
    icon: <Sliders size={28} />, 
    page: 'adjustments', 
    type: 'standard' 
  },
  { 
    id: 'convert', 
    title: 'Converter', 
    description: 'Change formats between JPG, PNG, WEBP and more.', 
    icon: <FileType size={28} />, 
    page: 'format-converter', 
    type: 'standard' 
  },
  { 
    id: 'angle', 
    title: 'Angle Fix', 
    description: 'Correct tilted horizons and rotate images.', 
    icon: <RotateCw size={28} />, 
    page: 'angle-slider', 
    type: 'standard' 
  },
];

export default function ToolsView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Logic
  const filteredTools = toolsData.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredTools = filteredTools.filter(tool => tool.type === 'featured');
  const standardTools = filteredTools.filter(tool => tool.type === 'standard');

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
      
      {/* Background */}
      <div className="fixed inset-0 z-0">
         <BubblesBackground />
      </div>

      <div className="relative z-10 pt-24 px-6 md:px-12 max-w-7xl mx-auto pb-20">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover:border-white/20 transition-all">
               <ArrowLeft size={18} /> 
            </div>
            <span className="text-sm font-medium">Back to Home</span>
          </button>

          {/* Search Bar with Clear Button */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <input 
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="relative w-full pl-12 pr-10 py-3 rounded-full bg-[#1c1c3a]/80 backdrop-blur-xl border border-white/10 
                         focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm transition-all text-white placeholder-gray-500"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            
            {/* ✅ Clear Button */}
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-gray-400 mb-2">
            Creative Suite
          </h2>
          <p className="text-gray-400">Everything you need to perfect your images.</p>
        </div>

        {/* --- Featured Section --- */}
        {featuredTools.length > 0 && (
          <div className="mb-16">
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"/> Featured Tools
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {featuredTools.map(tool => (
                  <FeaturedToolCard
                    key={tool.id}
                    tool={tool}
                    onClick={() => navigate(`/tools/${tool.page}`)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* --- Standard Section --- */}
        {standardTools.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"/> Utility Tools
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {standardTools.map(tool => (
                  <StandardToolCard
                    key={tool.id}
                    tool={tool}
                    onClick={() => navigate(`/tools/${tool.page}`)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-20 opacity-50"
          >
            <Search size={48} className="mx-auto mb-4" />
            <p className="text-xl">No tools found matching "{searchQuery}"</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-purple-400 hover:text-purple-300 underline"
            >
              Clear search
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}

// --- Sub Components ---

function FeaturedToolCard({ tool, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative overflow-hidden bg-[#1f1f3d]/40 backdrop-blur-md rounded-3xl p-8 cursor-pointer border border-white/10 hover:border-white/20 transition-all shadow-xl"
    >
      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${tool.color} opacity-10 blur-[80px] rounded-full -mr-16 -mt-16 transition-opacity group-hover:opacity-20`} />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className={`p-5 rounded-2xl bg-gradient-to-br ${tool.color} text-white shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-500`}>
          {tool.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-2">{tool.title}</h3>
          <p className="text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">
            {tool.description}
          </p>
        </div>
        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 text-gray-400 group-hover:text-white transition-all hidden md:block">
          {/* Using a simple CSS arrow if chevron not available, but ChevronRight is imported */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>
    </motion.div>
  );
}

function StandardToolCard({ tool, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group bg-[#1f1f3d]/40 backdrop-blur-sm rounded-2xl p-6 cursor-pointer 
                 border border-white/5 hover:border-white/15 hover:bg-[#1f1f3d]/60 
                 transition-all duration-300 shadow-lg hover:shadow-2xl"
    >
      <div className="mb-6 text-gray-400 group-hover:text-purple-400 group-hover:scale-110 transition-all duration-300 origin-left">
        {tool.icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-200 group-hover:text-white mb-2 transition-colors">
          {tool.title}
        </h3>
        <p className="text-sm text-gray-500 group-hover:text-gray-400 line-clamp-2 transition-colors">
          {tool.description}
        </p>
      </div>
    </motion.div>
  );
}