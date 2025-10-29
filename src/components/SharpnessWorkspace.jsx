import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, UploadCloud, Download } from 'lucide-react';

// --- AUXILIARY COMPONENT (Must be defined here or imported) ---
function GradientButton({ text, isBlue = false, isOutline = false, className = "", onClick, disabled }) {
  const blueGradient = "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500";
  const purpleGradient = "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700";
  const outline = "bg-transparent border-2 border-purple-400 text-purple-300 hover:bg-purple-900/50";
  const buttonClasses = isOutline ? outline : (isBlue ? blueGradient : purpleGradient);
  const defaultClasses = "w-full md:w-auto px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform flex items-center justify-center gap-2";
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <motion.button 
      whileHover={{ scale: disabled ? 1 : 1.05 }} 
      whileTap={{ scale: disabled ? 1 : 0.95 }} 
      onClick={onClick}
      disabled={disabled}
      className={`${defaultClasses} ${buttonClasses} ${className} ${disabledClasses}`}
    > 
      {text} 
    </motion.button>
  );
}

// =======================================================================
//  Sharpness Workspace
// =======================================================================
export default function SharpnessWorkspace({ setPage }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [sharpnessValue, setSharpnessValue] = useState(50); // 0 to 100
    const imgRef = useRef(null); // Ref to hold the image element

    const handleImageUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setImageSrc(URL.createObjectURL(file));
        }
    };

    // ⬇️ IMPLEMENTED DOWNLOAD FUNCTION ⬇️
    const handleDownload = () => {
        const image = imgRef.current;
        if (!image || !imageSrc) {
            alert("Please upload an image first.");
            return;
        }

        const canvas = document.createElement('canvas');
        // Use naturalWidth/Height for high-resolution output
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            alert("Canvas context error.");
            return;
        }
        
        // Calculate contrast factor (50 -> 1.0, 100 -> 2.0, 0 -> 0.0)
        // We add a base contrast of 1.0, and then vary it based on the slider.
        // A common way to simulate sharpness is by enhancing contrast.
        const contrastFactor = 1 + (sharpnessValue - 50) / 50; 
        
        // 1. Apply the Sharpness filter (via Canvas Contrast)
        ctx.filter = `contrast(${contrastFactor})`;

        // 2. Draw the image (with the filter baked into the context)
        // Use the original image dimensions for the draw operation
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // 3. Trigger Download
        canvas.toBlob((blob) => {
            if (!blob) {
                alert('Failed to create image blob for download.');
                return;
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `fotofix_sharpness_${sharpnessValue}.png`;
            link.href = url;
            
            link.click();
            URL.revokeObjectURL(url);
            
        }, 'image/png'); 
    };


    return (
        <motion.div
            key="sharpness-workspace"
            className="p-0 md:p-0 text-white max-w-2xl mx-auto"
        >
            <div className="flex items-center gap-4 text-gray-400 mb-6">
                <button onClick={() => setPage('tools')} className="flex items-center gap-2 hover:text-white">
                    <ArrowLeft size={24} /> <span className="text-xl font-medium">Tools</span>
                </button>
            </div>
            
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="bg-[#1f1f3d] p-4 rounded-full border border-purple-500 shadow-xl">
                    <Star size={48} className="text-purple-400" />
                </div>
                <h2 className="text-4xl font-bold mt-4">Sharpness</h2>
            </div>

            <div className="bg-[#1f1f3d]/50 p-6 flex flex-col items-center border-2 border-indigo-400/30 rounded-2xl">
                <div className="w-full h-72 flex items-center justify-center bg-[#1a1834] rounded-lg overflow-hidden relative mb-6">
                    {imageSrc ? (
                        <img 
                            ref={imgRef} // Attaching ref for download function
                            src={imageSrc} 
                            alt="Input" 
                            className="max-w-full max-h-full object-contain"
                            // Applying filter visually for the user
                            style={{ 
                                filter: `contrast(${1 + (sharpnessValue - 50) / 50})` // Simulates sharpness via contrast
                            }} 
                        />
                    ) : (
                        <p className="text-gray-400">Upload an image to adjust sharpness</p>
                    )}
                </div>

                <div className='w-full p-4'>
                    <label className='block text-lg font-semibold mb-2' htmlFor="sharpness-slider">Sharpness</label>
                    <input
                        type="range"
                        id="sharpness-slider"
                        min="0"
                        max="100"
                        value={sharpnessValue}
                        onChange={(e) => setSharpnessValue(parseInt(e.target.value))}
                        className="w-full h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className='text-sm text-gray-400 mt-2 flex justify-between'>
                        <span>Soft (0)</span>
                        <span>Current: {sharpnessValue}</span>
                        <span>Sharp (100)</span>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 w-full mt-4">
                    <input type="file" id="sharp-upload" onChange={handleImageUpload} accept="image/*" className="hidden" />
                    <label htmlFor="sharp-upload" className="w-full md:w-auto px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform cursor-pointer bg-transparent border-2 border-gray-400 text-gray-300 hover:bg-gray-700/50 flex items-center justify-center gap-2">
                        <UploadCloud size={20} /> Upload Image
                    </label>
                    <GradientButton 
                        text="Download Result" 
                        onClick={handleDownload} 
                        isBlue 
                        disabled={!imageSrc} 
                    />
                </div>
            </div>
        </motion.div>
    );
}