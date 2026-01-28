import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, Download, X, Image as ImageIcon, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import localforage from 'localforage'; // ✅ 1. Import

// Import Layout Components
import HeaderNav from './HeaderNav'; 
import BubblesBackground from './BubblesBackground'; 

const DOWNLOAD_STORAGE_KEY = 'fotoFixDownloads';

export default function DownloadsView({ isAuthenticated, onLogout, profileImage }) {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 2. ASYNC Load
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const stored = await localforage.getItem(DOWNLOAD_STORAGE_KEY);
        if (stored && Array.isArray(stored)) {
          setImages(stored);
        }
      } catch (e) { 
        console.error("Failed to load downloads", e); 
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // ✅ 3. ASYNC Delete
  const handleDeleteImage = async (id) => {
    const updated = images.filter(img => img.id !== id);
    setImages(updated); // Update UI
    await localforage.setItem(DOWNLOAD_STORAGE_KEY, updated); // Update Storage
  };

  const handleDeleteAll = async () => {
    if(window.confirm("Are you sure you want to delete all history?")) {
      setImages([]);
      await localforage.removeItem(DOWNLOAD_STORAGE_KEY);
    }
  };

  const handleRedownload = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white">
      <BubblesBackground />
      <HeaderNav isAuthenticated={isAuthenticated} onLogout={onLogout} profileImage={profileImage} />

      <motion.div 
        key="downloads-view" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -20 }} 
        transition={{ duration: 0.3 }}
        className="relative z-10 pt-24 px-6 md:px-12 max-w-7xl mx-auto pb-20"
      >
        <button 
          onClick={() => navigate('/dashboard')} 
          className="group flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        > 
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} /> 
          </div>
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-6 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-gray-400 mb-2">
              Your Library
            </h1>
            <p className="text-gray-400">
              You have {images.length} saved {images.length === 1 ? 'image' : 'images'}.
            </p>
          </div>
          
          {images.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-400 rounded-xl text-sm font-semibold hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
            >
              <Trash2 size={16} /> Clear History
            </button>
          )}
        </div>

        {loading ? (
           <div className="text-center text-gray-500 mt-20">Loading...</div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {images.map((image) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={image.id}
                  className="group relative bg-[#1f1f3d]/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all shadow-lg hover:shadow-2xl hover:shadow-purple-500/10"
                >
                  <div className="aspect-[4/3] bg-black/50 relative overflow-hidden">
                    <img 
                      src={image.dataUrl} 
                      alt={image.filename} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      onError={(e) => e.target.src = 'https://placehold.co/400x300/222244/ffffff?text=Image+Error'}
                    />
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleRedownload(image.dataUrl, image.filename)}
                        className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg"
                        title="Download"
                      >
                        <Download size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-white truncate mb-1" title={image.filename}>
                      {image.filename || "Untitled Image"}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>{image.date ? new Date(image.date).toLocaleDateString() : 'Just now'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-96 bg-[#1f1f3d]/30 rounded-3xl border-2 border-dashed border-gray-700/50"
          >
            <div className="bg-black/20 p-6 rounded-full mb-6">
               <ImageIcon size={48} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No downloads yet</h3>
            <p className="text-gray-500 max-w-sm text-center">
              Images you process and download in the tools section will appear here automatically.
            </p>
            <button 
              onClick={() => navigate('/tools')}
              className="mt-8 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-semibold transition-colors"
            >
              Go to Tools
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}