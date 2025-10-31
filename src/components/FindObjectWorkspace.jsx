import React, { useState } from 'react';
import { motion } from 'framer-motion';
// ⬇️ 'Download' icon add karein
import { ArrowLeft, Search, UploadCloud, Loader2, Download } from 'lucide-react';

function GradientButton({ text, isBlue = false, isOutline = false, className = "", onClick, disabled, icon: Icon }) {
    // ... (Use the same GradientButton definition from above converters) ...
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

// ⬇️ STEP 1: 'onImageDownloaded' prop ko accept karein
export default function FindObjectWorkspace({ setPage, onImageDownloaded }) {
    const [originalImage, setOriginalImage] = useState(null); // Yeh dataUrl hoga
    const [processedImageURL, setProcessedImageURL] = useState(null); // Yeh bhi dataUrl hoga
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState("image.png");

    // ⬇️ STEP 2: 'handleImageUpload' ko 'FileReader' use karne ke liye update karein
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
    
    const handleFind = async () => {
        if (!originalImage) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        // Simulate API returning image with bounding boxes
        setProcessedImageURL(originalImage); // ⬅️ Simulation: Processed image is same as original (dataUrl)
        setIsLoading(false);
        alert("Object detection complete. Result displayed.");
    };

    // ⬇️ STEP 3: Naya 'handleDownload' function add karein
    const handleDownload = () => {
        if (!processedImageURL) return;
        
        const downloadName = `find_object_${fileName}`;

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

    return (
        <motion.div
            key="find-object-workspace"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-0 md:p-0 text-white max-w-4xl mx-auto" // ⬅️ Max width
        >
            <div className="flex items-center gap-4 text-gray-400 mb-6">
                <button onClick={() => setPage('tools')} className="flex items-center gap-2 hover:text-white">
                    <ArrowLeft size={24} /> <span className="text-xl font-medium">Tools</span>
                </button>
            </div>
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="bg-[#1f1f3d] p-4 rounded-full border border-purple-500 shadow-xl">
                    <Search size={48} className="text-purple-400" />
                </div>
                <h2 className="text-4xl font-bold mt-4">Find Object</h2>
            </div>

            <div className="bg-[#1f1f3d]/50 p-6 flex flex-col items-center border-2 border-indigo-400/30 rounded-2xl">
                {/* ⬇️ BADLAV: 'h-72' ko 'min-h-[300px] md:min-h-[500px]' se badla ⬇️ */}
                <div className="w-full h-full min-h-[300px] md:min-h-[500px] flex items-center justify-center bg-[#1a1834] rounded-lg overflow-hidden relative mb-6">
                    {originalImage ? (
                        <img src={processedImageURL || originalImage} alt="Input" className="max-w-full max-h-full object-contain" />
                    ) : (
                        <div className="text-center p-10">
                            <UploadCloud size={64} className="text-gray-500 mx-auto" />
                            <p className="text-gray-400 mt-4">Upload an image to detect objects</p>
                        </div>
                    )}
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-10 rounded-md">
                            <Loader2 size={48} className="text-purple-400 animate-spin" />
                            <p className="ml-4 text-xl font-medium mt-4">Finding objects...</p>
                        </div>
                    )}
                </div>
                
                <input type="file" id="find-upload" onChange={handleImageUpload} accept="image/*" className="hidden" />
                
                {/* ⬇️ STEP 4: Naya Download button add karein ⬇️ */}
                <div className="flex flex-wrap justify-center gap-4 w-full">
                    <label htmlFor="find-upload" className="w-full md:w-auto px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform cursor-pointer bg-transparent border-2 border-gray-400 text-gray-300 hover:bg-gray-700/50 flex items-center justify-center gap-2">
                        <UploadCloud size={20} /> {originalImage ? "Change Image" : "Upload Image"}
                    </label>
                    <GradientButton text={isLoading ? "Finding..." : "Find Objects"} onClick={handleFind} isBlue disabled={!originalImage || isLoading} icon={isLoading ? Loader2 : Search} />
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