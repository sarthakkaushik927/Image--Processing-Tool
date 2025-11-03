import React from 'react';
import { motion } from 'framer-motion';
import GradientButton from './GradientButton';
import SmallButton from './SmallButton';

 
export default function MainView({ setShowHelp, setPage, isAuthenticated }) {
  
  const handleCreateClick = () => {
    if (isAuthenticated) {
      setPage('tools');
    } else {
      setPage('login'); 
    }
  };
  
  const handleGenerateClick = () => {
    if (isAuthenticated) {
      setPage('search');
    } else {
      setPage('login');
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="flex flex-col lg:flex-row items-center gap-10 md:gap-20 lg:gap-40 justify-center py-20" >
      <div className="flex flex-col gap-8 text-center lg:text-center">
        <div>
        <h2 className="text-4xl md:text-5xl font-bold">Edit, Enhance and Empower!</h2>
        <p className="text-lg text-gray-400 mt-4 mb-8"> Experience seamless image processing </p></div>
        <div className="flex flex-col items-center lg:items-center gap-4">
          <div className=''>
          <div className="flex items-center gap-4 my-4">
            <GradientButton className='lg:px-20' text="Discover" isBlue onClick={() => setPage('discover')}/>
            <GradientButton className='lg:px-20' text="Create" isOutline onClick={handleCreateClick} />
          </div>
          <GradientButton 
            text="SearchTools" 
            className="lg:px-57 px-33 max-w-40 lg:min-w-60 justfy-center items-center text-center flex flex-col"
            onClick={handleGenerateClick} 
          />
        </div>
        <div className="mt-12 flex justify-center iten lg:justify-center gap-4 items-center">
          <SmallButton className="h-16" onClick={() => setPage('about')}>
            <span className="font-semibold px-6">About</span>
          </SmallButton>
          
          <SmallButton className="h-16" onClick={() => setShowHelp(true)}>
            <span className="font-semibold px-6">Help?</span>
          </SmallButton>
          </div>
        </div>

      </div>
      <div className="flex-1 w-full max-w-lg lg:max-w-none">
        <motion.div whileHover={{ scale: 1.03 }} className="w-full h-[450px] bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-indigo-400/30">
          <img src="/home.svg" alt="Forest and clouds" className="w-full h-full object-cover object-" onError={(e) => e.target.src = 'https://placehold.co/600x400/1f2937/9ca3af?text=Image+Not+Found'} />
        </motion.div>
      </div>
    </motion.div>
  );
}