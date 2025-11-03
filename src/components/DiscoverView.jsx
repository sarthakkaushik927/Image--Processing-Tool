import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Crop, Wand2, Repeat } from 'lucide-react';
 
export default function DiscoverView({ setPage }) {

   
  const communityCreations = [
    { id: 1, url: '/1.svg', title: 'Spooky City', author: 'User123' },
    { id: 2, url: '/2.svg', title: 'Living Dream', author: 'PixelQueen' },
    { id: 3, url: '/3.svg', title: 'Ocean Sunset', author: 'EditMaster' },
    { id: 4, url: '/4.svg', title: 'Asthetic Rain', author: 'FotoFan' },
  ];

  
  const tutorials = [
    { id: 1, title: 'Master Adjustments', description: 'Learn how to use brightness, contrast, and saturation.', icon: <Sun size={24} />, page: 'adjustments' },
    { id: 2, title: 'Perfect Cropping', description: 'Get the perfect frame for your photos.', icon: <Crop size={24} />, page: 'crop' },
    { id: 3, title: 'Remove Backgrounds', description: 'Cut out subjects with one click.', icon: <Wand2 size={24} />, page: 'magic-brush' },
    { id: 3, title: 'Convert Images', description: 'Convert to JPG, PNG, WEBP...', icon: <Repeat size={24} />, page: 'format-converter' },
  ];

  return (
    <motion.div
      key="discover-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-0 md:p-0 text-white max-w-7xl mx-auto"  
    >
       
      <div className="mb-10">
        <h1 className="text-5xl font-bold mb-2">Discover Your Creativity</h1>
        <p className="text-xl text-gray-400">Get inspired by the community and learn new skills.</p>
      </div>

       
      <h2 className="text-3xl font-semibold text-purple-300 mb-4">Learn the Tools</h2>
      <div className="flex gap-6 overflow-x-auto  pb-6 -mx-6 px-6 pt-6">
        {tutorials.map(tutorial => (
          <TutorialCard 
            key={tutorial.id}
            icon={tutorial.icon}
            title={tutorial.title}
            description={tutorial.description}
            onClick={() => setPage(tutorial.page)}
          />
        ))}
      </div>

       
      <h2 className="text-3xl font-semibold text-purple-300 mt-12 mb-4">Community Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 overflow-y-clip">
        {communityCreations.map(item => (
          <CommunityImageCard 
            key={item.id}
            imageUrl={item.url}
            title={item.title}
            author={item.author}
          />
        ))}
      </div>
      
       
      <CtaCard setPage={setPage} />

    </motion.div>
  );
}
 

function CommunityImageCard({ imageUrl, title, author }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="relative rounded-lg overflow-hidden group cursor-pointer aspect-auto"
    >
      <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
        <h4 className="font-bold text-white text-lg">{title}</h4>
        <p className="text-gray-300 text-sm">by {author}</p>
      </div>
    </motion.div>
  );
}

function TutorialCard({ icon, title, description, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      onClick={onClick}
      className="flex-shrink-0 w-[300px] bg-[#1f1f3d]/50 backdrop-blur-sm rounded-2xl p-6 
                 flex gap-5 items-center cursor-pointer border-2 border-gray-700/50 hover:border-purple-500"
    >
      <div className="flex-shrink-0 text-purple-400">{icon}</div>
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </motion.div>
  );
}

function CtaCard({ setPage }) {
  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-10 mt-16 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Ready to create?</h2>
        <p className="text-lg text-blue-100 mt-1">Jump into the editor and start your own project.</p>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setPage('tools')} 
        className="px-10 py-3 rounded-full font-semibold text-lg bg-white text-purple-700 shadow-lg"
      >
        Start Editing
      </motion.button>
    </div>
  );
}