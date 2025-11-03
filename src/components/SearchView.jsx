import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import { toolsData } from '../toolsData';  

export default function SearchView({ setPage }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTools, setFilteredTools] = useState(toolsData);

   
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredTools(toolsData); 
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
       
      const results = toolsData.filter(tool => 
        tool.title.toLowerCase().includes(lowerCaseQuery) ||
        tool.description.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredTools(results);
    }
  }, [searchQuery]);  

   
  const handleResultClick = (page) => {
    setPage(page);
  };

  return (
    <motion.div 
      key="search-view" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      transition={{ duration: 0.3 }}
      className="p-0 md:p-0 text-white max-w-3xl mx-auto" 
    >
      <button onClick={() => setPage(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"> 
        <ArrowLeft size={18} /> Back to Home 
      </button>

      <h2 className="text-4xl font-bold text-center mb-8">Search Tools</h2>

      
      <div className="relative w-full mb-10">
        <input 
          type="text" 
          placeholder="Search for tools (e.g., 'Crop', 'Background')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-full bg-[#2a2a4a]/70 backdrop-blur-sm border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-lg"
        />
        <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
      </div>

      {/* The Search Results */}
      <div className="flex flex-col gap-4">
        {filteredTools.length > 0 ? (
          filteredTools.map(tool => (
            <SearchResultCard 
              key={tool.page} 
              tool={tool} 
              onClick={() => handleResultClick(tool.page)} 
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            <h3 className="text-xl font-semibold">No tools found</h3>
            <p>Try searching for a different keyword.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

 
function SearchResultCard({ tool, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, borderColor: '#a855f7' }}
      onClick={onClick}
      className="flex items-center gap-5 p-5 bg-[#1f1f3d]/50 rounded-2xl border-2 border-gray-700/50 cursor-pointer transition-colors"
    >
      <div className="text-purple-400 flex-shrink-0">
        {tool.icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{tool.title}</h3>
        <p className="text-gray-400 text-sm">{tool.description}</p>
      </div>
    </motion.div>
  );
}