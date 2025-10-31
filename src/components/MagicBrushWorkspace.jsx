import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wand2, UploadCloud, Download, Loader2, Image as ImageIcon, CheckCircle } from 'lucide-react';

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
//  Magic Brush (Background Remover) Workspace
// =======================================================================
export default function MagicBrushWorkspace({ setPage, onImageDownloaded }) {
    const [originalImage, setOriginalImage] = useState(null); // Yeh dataUrl hoga
    const [processedImageURL, setProcessedImageURL] = useState(null); // Yeh bhi dataUrl hoga
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState("image.png");

    const handleImageUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setFileName(file.name.split('.').slice(0, -1).join('.') + '.png'); // Force .png output
            setProcessedImageURL(null); 
            const reader = new FileReader();
            reader.onload = (e) => setOriginalImage(e.target.result); // dataUrl
            reader.readAsDataURL(file);
        }
    };
    
    // Simulates Backend API call
    const handleRemoveBackground = async () => {
        if (!originalImage) return;
        setIsLoading(true);
        setProcessedImageURL(null);

        console.log("Sending to backend for background removal...");
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // SIMULATION: Man lete hain backend ne processed image ka dataUrl return kiya
        const mockProcessedURL = originalImage; // (Yahan aapka asli API response aayega)
        
        setProcessedImageURL(mockProcessedURL);
        setIsLoading(false);
        console.log("Backend processing complete.");
    };

    const handleDownload = () => {
        if (!processedImageURL) return;
        
        const downloadName = `removed_bg_${fileName}`;

        if (onImageDownloaded) {
            onImageDownloaded(processedImageURL, downloadName);
        }

        const link = document.createElement('a');
        link.href = processedImageURL;
        link.download = downloadName; 
        link.click();
    };

    return (
        <motion.div
            key="magic-brush-workspace"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-0 md:p-0 text-white max-w-5xl mx-auto" 
        >
            {/* --- TOP BAR --- */}
            <div className="flex items-center gap-4 text-gray-400 mb-6">
                <button onClick={() => setPage('tools')} className="flex items-center gap-2 hover:text-white">
                    <ArrowLeft size={24} /> <span className="text-xl font-medium">Tools</span>
                </button>
            </div>
            
            {/* --- HEADER --- */}
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="bg-[#1f1f3d] p-4 rounded-full border border-purple-500 shadow-xl">
                    <Wand2 size={48} className="text-purple-400" />
                </div>
                <h2 className="text-4xl font-bold mt-4">Magic Background Remover</h2>
            </div>

            {/* --- NAYA SIDE-BY-SIDE LAYOUT (Responsive) --- */}
            <div className="bg-[#1f1f3d]/50 p-4 md:p-6 flex flex-col items-center border-2 border-indigo-400/30 rounded-2xl">
                
                {/* --- IMAGE COMPARISON AREA --- */}
                {/* ⬇️ BADLAV: 'h-[60vh]' hata diya gaya hai ⬇️ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                    
                    {/* 1. Original Image */}
                    <div className="flex flex-col bg-[#1a1834] rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-400 mb-2 text-center">Original</h3>
                        {/* ⬇️ BADLAV: 'min-h' add ki gayi hai, 'flex-1' hata diya gaya hai ⬇️ */}
                        <div className="w-full h-full min-h-[300px] md:min-h-[400px] flex items-center justify-center overflow-hidden rounded-md">
                            {originalImage ? (
                                <img src={originalImage} alt="Original Input" className="max-w-full max-h-full object-contain" />
                            ) : (
                                <div className="text-center text-gray-500 p-4">
                                    <ImageIcon size={64} className="mx-auto" />
                                    <p className="mt-2">Upload image to start</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. Processed Image */}
                    <div className="flex flex-col bg-[#1a1834] rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-400 mb-2 text-center">Result</h3>
                        {/* ⬇️ BADLAV: 'min-h' add ki gayi hai, 'flex-1' hata diya gaya hai ⬇️ */}
                        <div className="w-full h-full min-h-[300px] md:min-h-[400px] flex items-center justify-center overflow-hidden rounded-md relative">
                            {isLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-10 rounded-md">
                                    <Loader2 size={48} className="text-purple-400 animate-spin" />
                                    <p className="ml-4 text-xl font-medium mt-4">Removing background...</p>
                                </div>
                            )}
                            {processedImageURL ? (
                                <img src={processedImageURL} alt="Processed Output" className="max-w-full max-h-full object-contain" />
                            ) : (
                                !isLoading && (
                                    <div className="text-center text-gray-500 p-4">
                                        <CheckCircle size={64} className="mx-auto" />
                                        <p className="mt-2">Result will appear here</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* --- CONTROLS AREA --- */}
                {/* ⬇️ BADLAV: 'flex-col md:flex-row' add kiya gaya hai mobile view ke liye ⬇️ */}
                <div className="flex flex-col md:flex-row justify-center gap-4 w-full mt-8">
                    <input type="file" id="magic-upload" onChange={handleImageUpload} accept="image/*" className="hidden" />
                    <label 
                        htmlFor="magic-upload" 
                        className="w-full md:w-auto px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform cursor-pointer bg-transparent border-2 border-gray-400 text-gray-300 hover:bg-gray-700/50 flex items-center justify-center gap-2"
                    >
                        <UploadCloud size={20} /> {originalImage ? "Change Image" : "Upload Image"}
                    </label>
                    
                    <GradientButton 
                        text={isLoading ? "Processing..." : "Remove Background"} 
                        onClick={handleRemoveBackground} 
                        isBlue 
                        disabled={!originalImage || isLoading} 
                        icon={isLoading ? Loader2 : Wand2} 
                    />
                    
                    <GradientButton 
                        text="Download Result" 
                        onClick={handleDownload} 
                        disabled={!processedImageURL || isLoading} 
                        icon={Download} 
                    />
                </div>
            </div>
        </motion.div>
    );
}