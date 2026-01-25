import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Crop, Wand2, Repeat, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeaderNav from './HeaderNav';
import BubblesBackground from './BubblesBackground';

export default function DiscoverPage({ isAuthenticated, onLogout, profileImage }) {
  const navigate = useNavigate();
   
  // ✅ UPDATED: Fresh, reliable Unsplash Source URLs
  const communityCreations = [
    { 
      id: 1, 
      url: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&w=600&q=80', 
      title: 'Spooky City', 
      author: 'User123' 
    },
    { 
      id: 2, 
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', 
      title: 'Living Dream', 
      author: 'PixelQueen' 
    },
    { 
      id: 3, 
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', 
      title: 'Ocean Sunset', 
      author: 'EditMaster' 
    },
    { 
      id: 4, 
      url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80', 
      title: 'Aesthetic Rain', 
      author: 'FotoFan' 
    },
  ];
  
  const tutorials = [
    { id: 1, title: 'Master Adjustments', description: 'Learn how to use brightness, contrast, and saturation.', icon: <Sun size={24} />, page: 'adjustments' },
    { id: 2, title: 'Perfect Cropping', description: 'Get the perfect frame for your photos.', icon: <Crop size={24} />, page: 'crop' },
    { id: 3, title: 'Remove Backgrounds', description: 'Cut out subjects with one click.', icon: <Wand2 size={24} />, page: 'magic-brush' },
    { id: 4, title: 'Convert Images', description: 'Convert to JPG, PNG, WEBP...', icon: <Repeat size={24} />, page: 'format-converter' },
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white">
      <BubblesBackground />
      <HeaderNav isAuthenticated={isAuthenticated} onLogout={onLogout} profileImage={profileImage} />

      <motion.div
        key="discover-view"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 pt-24 px-6 md:px-12 max-w-7xl mx-auto pb-20"  
      >
        
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-gray-400">
            Discover Your Creativity
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Get inspired by the community gallery and master new skills with our interactive tutorials.
          </p>
        </div>

        {/* --- Tutorials Section (Grid Layout) --- */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1.5 h-8 bg-purple-500 rounded-full"></span>
            Learn the Tools
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tutorials.map(tutorial => (
              <TutorialCard 
                key={tutorial.id}
                icon={tutorial.icon}
                title={tutorial.title}
                description={tutorial.description}
                onClick={() => navigate(`/tools/${tutorial.page}`)}
              />
            ))}
          </div>
        </div>

        {/* --- Community Gallery Section --- */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
             <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
             Community Gallery
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {communityCreations.map(item => (
              <CommunityImageCard 
                key={item.id}
                imageUrl={item.url}
                title={item.title}
                author={item.author}
              />
            ))}
          </div>
        </div>
      
        {/* --- CTA Section --- */}
        <CtaCard onNavigate={() => navigate('/tools')} />

      </motion.div>
    </div>
  );
}
 
// --- Sub Components ---

function CommunityImageCard({ imageUrl, title, author }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="relative rounded-2xl overflow-hidden group cursor-pointer aspect-[3/4] shadow-lg border border-white/5 bg-gray-800"
    >
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        // ✅ ROBUST ERROR HANDLER: Switches to a reliable placeholder if link fails
        onError={(e) => {
          e.currentTarget.onerror = null; // Prevent infinite loop
          e.currentTarget.src = 'https://placehold.co/600x800/1a1a2e/FFF?text=Image+Unavailable';
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 translate-y-4 group-hover:translate-y-0">
        <h4 className="font-bold text-white text-lg leading-tight">{title}</h4>
        <p className="text-purple-300 text-sm mt-1">@{author}</p>
      </div>
    </motion.div>
  );
}

function TutorialCard({ icon, title, description, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-[#1f1f3d]/60 backdrop-blur-md rounded-2xl p-6 
                 flex flex-col gap-4 cursor-pointer border border-white/10 hover:border-purple-500/50 
                 shadow-xl hover:shadow-purple-500/10 transition-all h-full"
    >
      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-300">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-white text-lg mb-1">{title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function CtaCard({ onNavigate }) {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl p-10 flex flex-col md:flex-row justify-between items-center gap-8 border border-white/10">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-md" />
      
      <div className="relative z-10 text-center md:text-left">
        <h2 className="text-3xl font-bold text-white mb-2">Ready to create?</h2>
        <p className="text-lg text-blue-100">Jump into the editor and start your own project today.</p>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNavigate} 
        className="relative z-10 px-8 py-3.5 rounded-full font-bold text-lg bg-white text-purple-700 shadow-xl hover:shadow-white/10"
      >
        Start Editing
      </motion.button>
    </div>
  );
}