import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Trash2, X } from 'lucide-react';

// --- Global Download Management ---
const DOWNLOAD_STORAGE_KEY = 'fotoFixDownloads';

/**
 * Retrieves the list of processed images from session storage.
 * @returns {Array} List of saved image objects.
 */
const getSavedDownloads = () => {
    try {
        const stored = sessionStorage.getItem(DOWNLOAD_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to read downloads from session storage:", e);
        return [];
    }
};

/**
 * Saves the current list of images back to session storage.
 * @param {Array} downloads 
 */
const saveDownloads = (downloads) => {
    try {
        sessionStorage.setItem(DOWNLOAD_STORAGE_KEY, JSON.stringify(downloads));
    } catch (e) {
        console.error("Failed to save downloads to session storage:", e);
    }
};


// =======================================================================
//  Downloads View (Gallery)
// =======================================================================
export default function DownloadsView({ setPage }) {
    const [downloads, setDownloads] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        // Load data on component mount
        setDownloads(getSavedDownloads());
    }, []);

    const handleDownloadClick = (dataUrl, filename) => {
        // Triggers download of the image data locally
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleDelete = (id) => {
        const updatedDownloads = downloads.filter(d => d.id !== id);
        setDownloads(updatedDownloads);
        saveDownloads(updatedDownloads);
    };

    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to delete all saved processed images? This action cannot be undone.")) {
            setDownloads([]);
            sessionStorage.removeItem(DOWNLOAD_STORAGE_KEY);
        }
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
            <button onClick={() => setPage(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                <ArrowLeft size={18} /> Back to Home
            </button>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-bold">Your Downloads</h2>
                <motion.button 
                    onClick={handleClearAll}
                    disabled={downloads.length === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-red-400 hover:bg-red-500/20 py-2 px-4 rounded-full disabled:opacity-50"
                >
                    <Trash2 size={20} /> Clear All ({downloads.length})
                </motion.button>
            </div>
            

            {downloads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-[#1f1f3d]/50 rounded-2xl border-2 border-gray-700/50">
                    <Download size={48} className="text-gray-500 mb-4" />
                    <p className="text-gray-400 text-lg">No processed images found for this session.</p>
                    <p className="text-sm text-gray-500 mt-2">Processed images are saved here automatically, but only until you close the browser.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {downloads.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)' }}
                            className="group relative bg-[#1f1f3d] rounded-xl overflow-hidden cursor-pointer aspect-square shadow-xl"
                            onClick={() => setSelectedImage(item)}
                        >
                            <img src={item.dataUrl} alt={item.filename} className="w-full h-full object-cover" />
                            
                            {/* Overlay for quick action */}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Download size={32} className="text-white" />
                            </div>
                            
                            {/* Footer text */}
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 text-xs truncate">
                                {item.filename}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal for large preview */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
                    <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.5 }}
                        className="relative max-w-4xl max-h-[90vh] p-4"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                    >
                        <img 
                            src={selectedImage.dataUrl} 
                            alt={selectedImage.filename} 
                            className="max-w-full max-h-[80vh] rounded-xl shadow-2xl border-4 border-white" 
                        />
                        <motion.button 
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-2 right-2 bg-red-600 p-2 rounded-full text-white shadow-lg"
                        >
                            <X size={24} />
                        </motion.button>
                        <div className="mt-4 flex justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDownloadClick(selectedImage.dataUrl, selectedImage.filename)}
                                className="bg-purple-600 text-white py-2 px-6 rounded-full font-semibold flex items-center gap-2"
                            >
                                <Download size={20} /> Download Original
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDelete(selectedImage.id)}
                                className="bg-gray-700 text-white py-2 px-6 rounded-full font-semibold flex items-center gap-2"
                            >
                                <Trash2 size={20} /> Delete
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
