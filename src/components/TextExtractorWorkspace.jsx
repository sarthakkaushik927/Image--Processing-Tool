import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, FileText, UploadCloud, Download, Loader2 
} from 'lucide-react';

// =======================================================================
// AUXILIARY COMPONENT (Must be defined here or imported)
// =======================================================================
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
//  Text Extractor Workspace Component
// =======================================================================
// ⬇️ STEP 1: 'onImageDownloaded' prop ko accept karein
export default function TextExtractorWorkspace({ setPage, onImageDownloaded }) {
    const [originalImage, setOriginalImage] = useState(null); // Yeh dataUrl hoga
    const [processedImageURL, setProcessedImageURL] = useState(null); // Yeh bhi dataUrl hoga
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState("image.png");

    // --- Handlers ---

    // 1. Handles image file selection
    const handleImageUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setFileName(file.name);
            setProcessedImageURL(null); 
            const reader = new FileReader();
            reader.onload = (e) => setOriginalImage(e.target.result); // ⬅️ dataUrl
            reader.readAsDataURL(file);
        }
    };
    
    // 2. Simulates API call to ML Model
    const handleProcessImage = async () => {
        if (!originalImage) {
            alert("Please upload an image first.");
            return;
        }

        setIsLoading(true);
        setProcessedImageURL(null); 
        console.log(`Sending image for ML processing: ${fileName}`);
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Simulating the ML model returning a processed image
        const mockProcessedURL = originalImage; // ⬅️ Yeh pehle se hi dataUrl hai
        
        setProcessedImageURL(mockProcessedURL);
        setIsLoading(false);
        console.log("ML Processing Complete.");
    };

    // ⬇️ STEP 3: 'handleDownload' function ko update karein
    const handleDownload = () => {
        if (!processedImageURL) return;

        const downloadName = `fotofix_processed_${fileName}`;

        // 1. ⭐️ HomePage ko 'dataUrl' bhej dein (Storage ke liye) ⭐️
        if (onImageDownloaded) {
            onImageDownloaded(processedImageURL, downloadName);
        }

        // 2. User ke liye download trigger karein
        const link = document.createElement('a');
        link.href = processedImageURL;
        link.download = downloadName; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Render ---

    return (
        <motion.div
            key="text-extractor-workspace"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-0 md:p-0 text-white"
        >
            {/* Top Bar */}
            <div className="flex items-center gap-4 text-gray-400 mb-6">
                <button onClick={() => setPage('tools')} className="flex items-center gap-2 hover:text-white">
                    <ArrowLeft size={24} /> <span className="text-xl font-medium">Tools</span>
                </button>
            </div>

            {/* Tool Title */}
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="bg-[#1f1f3d] p-4 rounded-full border border-purple-500 shadow-xl">
                    <FileText size={48} className="text-purple-400" />
                </div>
                <h2 className="text-4xl font-bold mt-4">Text Extractor</h2>
            </div>

            {/* Main Workspace Area */}
            <div className="bg-[#1f1f3d]/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 flex flex-col items-center max-w-4xl mx-auto border-2 border-indigo-400/30">
                
                {/* Image Display Area */}
                <div className="w-full h-96 flex items-center justify-center bg-[#1a1834] rounded-lg overflow-hidden relative mb-6">
                    {originalImage ? (
                        <img
                            src={processedImageURL || originalImage}
                            alt="Image for Text Extraction"
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/600x400/1f2937/9ca3af?text=Image+Load+Error';
                            }}
                        />
                    ) : (
                        <div className="text-center p-10">
                            <UploadCloud size={64} className="text-gray-500 mx-auto" />
                            <p className="text-gray-400 mt-4">Upload an image to start extraction.</p>
                        </div>
                    )}
                    {/* Status Overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                            <Loader2 size={48} className="text-purple-400 animate-spin" />
                            <p className="ml-4 text-xl font-medium">Processing...</p>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex flex-wrap justify-center gap-4 w-full">
                    
                    {/* Upload Button */}
                    <input 
                        type="file" 
                        id="extractor-upload" 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                    />
                    <label 
                        htmlFor="extractor-upload" 
                        className="w-full md:w-auto px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform cursor-pointer bg-transparent border-2 border-gray-400 text-gray-300 hover:bg-gray-700/50 flex items-center justify-center gap-2"
                    >
                        <UploadCloud size={20} /> Upload Image
                    </label>

                    {/* Process Button */}
                    <GradientButton 
                        text={isLoading ? "Processing..." : "Run Text Extractor"}
                        onClick={handleProcessImage} 
                        isBlue
                        disabled={!originalImage || isLoading}
                        icon={isLoading ? Loader2 : FileText}
                    />

                    {/* Download Button */}
                    <GradientButton 
                        text="Download Result"
                        onClick={handleDownload}
                        disabled={!processedImageURL || isLoading}
                        icon={Download}
                    />
                </div>
                
                {/* Result Message */}
                {processedImageURL && (
                    <p className="mt-4 text-green-400 text-sm">Processing complete! The extracted text/image is ready for download.</p>
                )}
            </div>
        </motion.div>
    );
}