import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, UploadCloud, Download, Loader2 } from 'lucide-react';

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
//  PNG to JPG Converter (Client-side)
// =======================================================================
export default function PngToJpgWorkspace({ setPage }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [fileName, setFileName] = useState("");
    const [isConverting, setIsConverting] = useState(false);
    
    const handleImageUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setFileName(file.name.replace(/\.[^/.]+$/, "") + ".jpg");
            setImageSrc(URL.createObjectURL(file));
        }
    };

    const handleConversion = () => {
        if (!imageSrc) return;

        setIsConverting(true);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Convert canvas content to JPEG Blob (lossy, quality 0.9)
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                
                // Trigger Download
                const link = document.createElement('a');
                link.download = fileName;
                link.href = url;
                link.click();
                
                URL.revokeObjectURL(url);
                setIsConverting(false);
                alert("Conversion complete and download started.");
            }, 'image/jpeg', 0.9); // 0.9 quality for JPEG
        };
        img.src = imageSrc;
    };

    return (
        <motion.div
            key="png-to-jpg-workspace"
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
                    <RefreshCw size={48} className="text-purple-400" />
                </div>
                <h2 className="text-4xl font-bold mt-4">Png to jpg</h2>
            </div>

            <div className="bg-[#1f1f3d]/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 flex flex-col items-center border-2 border-indigo-400/30">
                
                <div className="w-full h-64 flex items-center justify-center bg-[#1a1834] rounded-lg overflow-hidden relative mb-6">
                    {imageSrc ? (
                        <img src={imageSrc} alt="Input Image" className="max-w-full max-h-full object-contain" />
                    ) : (
                        <p className="text-gray-400">Upload a PNG image</p>
                    )}
                </div>

                <input type="file" id="converter-upload" onChange={handleImageUpload} accept="image/png" className="hidden" />
                
                <div className="flex flex-wrap justify-center gap-4 w-full">
                    <label 
                        htmlFor="converter-upload" 
                        className="w-full md:w-auto px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform cursor-pointer bg-transparent border-2 border-gray-400 text-gray-300 hover:bg-gray-700/50 flex items-center justify-center gap-2"
                    >
                        <UploadCloud size={20} /> Select Png File
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