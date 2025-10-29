import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sun, UploadCloud, Download } from 'lucide-react';

// =======================================================================
//  AUXILIARY COMPONENT (Must be defined before it's used)
//  If this was missing in your file, it would cause the white screen error.
// =======================================================================
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
//  Brightness Workspace
// =======================================================================
export default function BrightnessWorkspace({ setPage }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [brightnessValue, setBrightnessValue] = useState(100); // 100% is neutral
    const imgRef = useRef(null); // Ref to hold the image element

    const handleImageUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setImageSrc(URL.createObjectURL(file));
        }
    };

    const handleDownload = () => {
        const image = imgRef.current;
        if (!image || !imageSrc) {
            alert("Please upload an image first.");
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            alert("Canvas context error.");
            return;
        }

        // 1. Apply the dedicated brightness filter to the Canvas Context
        ctx.filter = `brightness(${brightnessValue}%)`;

        // 2. Draw the image (with the filter applied by the context)
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // 3. Trigger Download
        canvas.toBlob((blob) => {
            if (!blob) {
                alert('Failed to create image blob for download.');
                return;
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `fotofix_brightened_${brightnessValue}.png`;
            link.href = url;
            
            link.click();
            URL.revokeObjectURL(url);
            
        }, 'image/png'); 
    };


    return (
        <motion.div
            key="brightness-workspace"
            className="p-0 md:p-0 text-white max-w-2xl mx-auto"
        >
            <div className="flex items-center gap-4 text-gray-400 mb-6">
                <button onClick={() => setPage('tools')} className="flex items-center gap-2 hover:text-white">
                    <ArrowLeft size={24} /> <span className="text-xl font-medium">Tools</span>
                </button>
            </div>
            
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="bg-[#1f1f3d] p-4 rounded-full border border-purple-500 shadow-xl">
                    <Sun size={48} className="text-purple-400" />
                </div>
                <h2 className="text-4xl font-bold mt-4">Brightness</h2>
            </div>

            <div className="bg-[#1f1f3d]/50 p-6 flex flex-col items-center border-2 border-indigo-400/30 rounded-2xl">
                <div className="w-full h-72 flex items-center justify-center bg-[#1a1834] rounded-lg overflow-hidden relative mb-6">
                    {imageSrc ? (
                        <img 
                            ref={imgRef}
                            src={imageSrc} 
                            alt="Input" 
                            className="max-w-full max-h-full object-contain"
                            // Applying filter visually for the user
                            style={{ filter: `brightness(${brightnessValue}%)` }} 
                        />
                    ) : (
                        <p className="text-gray-400">Upload an image to adjust brightness</p>
                    )}
                </div>

                <div className='w-full p-4'>
                    <label className='block text-lg font-semibold mb-2' htmlFor="brightness-slider">Brightness: {brightnessValue}%</label>
                    <input
                        type="range"
                        id="brightness-slider"
                        min="0"
                        max="200"
                        value={brightnessValue}
                        onChange={(e) => setBrightnessValue(parseInt(e.target.value))}
                        className="w-full h-2 bg-gradient-to-r from-gray-900 via-gray-400 to-white rounded-lg appearance-none cursor-pointer"
                    />
                    <div className='text-sm text-gray-400 mt-2 flex justify-between'>
                        <span>Dark (0%)</span>
                        <span>Neutral (100%)</span>
                        <span>Bright (200%)</span>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 w-full mt-4">
                    <input type="file" id="bright-upload" onChange={handleImageUpload} accept="image/*" className="hidden" />
                    <label htmlFor="bright-upload" className="w-full md:w-auto px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform cursor-pointer bg-transparent border-2 border-gray-400 text-gray-300 hover:bg-gray-700/50 flex items-center justify-center gap-2">
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