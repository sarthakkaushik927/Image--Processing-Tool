import React from 'react'; // React ko import karna hamesha acchi practice hai
import { motion } from 'framer-motion';
import { ArrowLeft, Download } from 'lucide-react';

// =======================================================================
//  DownloadsView (Updated with Download Button)
// =======================================================================
function DownloadsView({ setPage, images }) {

  // Yeh function gallery se image ko re-download karne ke liye hai
  const handleRedownload = (url, name) => {
    const link = document.createElement('a');
    link.href = url; // Yeh 'dataUrl' hai
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      key="downloads-view" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      transition={{ duration: 0.3 }}
      className="p-0 md:p-0 text-white"
    >
      {/* Back to Home Button */}
      <button onClick={() => setPage(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"> 
        <ArrowLeft size={18} /> Back to Home 
      </button>
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 md:mb-8">
        <span className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></span>
        
      </div>
      <h2 className="text-4xl font-bold mb-10">Downloaded Images</h2>

      {/* Images Grid */}
      {images && images.length > 0 ? (
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {images.map((image) => (
            <motion.div
              key={image.id}
              className="relative aspect-video bg-[#2a2a4a]/50 rounded-lg overflow-hidden border-2 border-gray-700/50 group" // 'relative' aur 'group' zaroori hai
              whileHover={{ scale: 1.05, borderColor: '#a855f7' }} // Purple-500 on hover
              layout // Grid animation ke liye
            >
              <img 
                src={image.url} 
                alt={image.name} 
                className="w-full h-full object-cover" 
                // Fallback image agar 'dataUrl' corrupt ho
                onError={(e) => e.target.src = 'https://placehold.co/300x200/222244/ffffff?text=Error'}
              />
              
              {/* Image ke upar Download Button */}
              <button
                onClick={() => handleRedownload(image.url, image.name)}
                className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Download image"
              >
                <Download size={18} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // Placeholder jab koi image downloaded nahi hai
        <div className="flex flex-col items-center justify-center h-60 bg-[#1f1f3d]/50 rounded-lg border-2 border-dashed border-gray-700">
          <Download size={48} className="text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-400">No downloaded images yet.</h3>
          <p className="text-gray-500">Start editing to see your creations here!</p>
        </div>
      )}
    </motion.div>
  );
}

// Agar aap ise alag file mein rakh rahe hain, toh 'export default' ka istemaal karein
export default DownloadsView;