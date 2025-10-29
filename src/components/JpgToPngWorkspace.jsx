import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Repeat, UploadCloud, Download, Loader2 } from 'lucide-react';

// --- AUXILIARY COMPONENT (Reuse) ---
function GradientButton({ text, isBlue = false, isOutline = false, className = "", onClick, disabled, icon: Icon }) {
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
      {Icon && <Icon size={20} className={disabled ? "animate-spin" : ""} />}
      {text} 
    </motion.button>
  );
}

// =======================================================================
//  JPG to PNG Converter (Client-side)
// =======================================================================
export default function JpgToPngWorkspace({ setPage }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [fileName, setFileName] = useState("");
    const [isConverting, setIsConverting] = useState(false);
    
    // Ref to hold the temporary file URL for reliable access during download
    const imgUrlRef = useRef(null); 

    const handleImageUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            // Store the stable URL in the ref and component state
            imgUrlRef.current = url; 
            setImageSrc(url);
            setFileName(file.name.replace(/\.[^/.]+$/, "") + ".png");
        }
    };

    const handleConversion = () => {
        const currentUrl = imgUrlRef.current;
        if (!currentUrl) return;

        setIsConverting(true);
        
        const img = new Image();
        img.crossOrigin = "anonymous"; 
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            // Draw image on canvas
            try {
                ctx.drawImage(img, 0, 0);
            } catch (error) {
                console.error("Error drawing image to canvas:", error);
                alert("Could not draw image to canvas. Check browser console.");
                setIsConverting(false);
                return;
            }

            // Convert canvas content to PNG Blob (lossless)
            canvas.toBlob((blob) => {
                if (!blob) {
                    alert("Conversion failed: Could not create PNG data.");
                    setIsConverting(false);
                    return;
                }
                
                const url = URL.createObjectURL(blob);
                
                // 1. Trigger Download
                const link = document.createElement('a');
                link.download = fileName;
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // 2. Schedule cleanup and state update to ensure download initiates first
                setTimeout(() => {
                    // Revoke both the source and the blob URL for comprehensive cleanup
                    URL.revokeObjectURL(currentUrl);
                    URL.revokeObjectURL(url);
                    
                    // Reset component state completely after download and cleanup
                    setImageSrc(null);
                    imgUrlRef.current = null;
                    setIsConverting(false);
                    setFileName("");
                    
                    // Optional: Show alert after cleanup is complete
                    // alert("Conversion complete and download started.");
                }, 50); // Small delay before clean-up

            }, 'image/png');
        };
        // Use a timeout to ensure state/ref updates are processed before source is set
        setTimeout(() => {
            img.src = currentUrl; 
        }, 0); 
    };

    return (
        <motion.div
            key="jpg-to-png-workspace"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-0 md:p-0 text-white max-w-2xl mx-auto"
        >
            <div className="flex items-center gap-4 text-gray-400 mb-6">
                <button onClick={() => setPage('tools')} className="flex items-center gap-2 hover:text-white">
                    <ArrowLeft size={24} /> <span className="text-xl font-medium">Tools</span>
                </button>
            </div>
            
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="bg-[#1f1f3d] p-4 rounded-full border border-purple-500 shadow-xl">
                    <Repeat size={48} className="text-purple-400" />
                </div>
                <h2 className="text-4xl font-bold mt-4">Jpg to png</h2>
            </div>

            <div className="bg-[#1f1f3d]/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 flex flex-col items-center border-2 border-indigo-400/30">
                
                <div className="w-full h-64 flex items-center justify-center bg-[#1a1834] rounded-lg overflow-hidden relative mb-6">
                    {imageSrc ? (
                        <img src={imageSrc} alt="Input Image" className="max-w-full max-h-full object-contain" />
                    ) : (
                        <p className="text-gray-400">Upload a JPG image</p>
                    )}
                </div>

                <input type="file" id="converter-upload" onChange={handleImageUpload} accept="image/jpeg" className="hidden" />
                
                <div className="flex flex-wrap justify-center gap-4 w-full">
                    <label 
                        htmlFor="converter-upload" 
                        className="w-full md:w-auto px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform cursor-pointer bg-transparent border-2 border-gray-400 text-gray-300 hover:bg-gray-700/50 flex items-center justify-center gap-2"
                    >
                        <UploadCloud size={20} /> Select Jpg File
                    </label>

                    <GradientButton 
                        text={isConverting ? "Converting..." : "Convert"}
                        onClick={handleConversion} 
                        isBlue
                        disabled={!imageSrc || isConverting}
                        icon={isConverting ? Loader2 : Download}
                    />
                </div>
            </div>
        </motion.div>
    );
}