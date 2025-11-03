import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wand2, UploadCloud, Download, Loader2, Image as ImageIcon, CheckCircle } from 'lucide-react';
import GradientButton from '../components/GradientButton';

export default function MagicBrushWorkspace({ setPage, onImageDownloaded }) {
    const [originalImage, setOriginalImage] = useState(null); 
    const [processedImageURL, setProcessedImageURL] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState("image.png");
    const [isDragging, setIsDragging] = useState(false);
    const processFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            setFileName(file.name.split('.').slice(0, -1).join('.') + '.png'); 
            setProcessedImageURL(null); 
            const reader = new FileReader();
            reader.onload = (e) => setOriginalImage(e.target.result); 
            reader.readAsDataURL(file);
        } else if (file) {
            alert("Please upload an image file (e.g., png, jpg).");
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        processFile(file); 
    
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        processFile(file);  
    };

     
    const handleRemoveBackground = async () => {
        if (!originalImage) return;
        setIsLoading(true);
        setProcessedImageURL(null);

         
        
         
        const mockProcessedURL = originalImage;  
        
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
             
            <div className="flex items-center gap-4 text-gray-400 mb-6">
                <button onClick={() => setPage('tools')} className="flex items-center gap-2 hover:text-white">
                    <ArrowLeft size={24} /> <span className="text-xl font-medium">Tools</span>
                </button>
            </div>
            
            
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="bg-[#1f1f3d] p-4 rounded-full border border-purple-500 shadow-xl">
                    <Wand2 size={48} className="text-purple-400" />
                </div>
                <h2 className="text-4xl font-bold mt-4">Magic Background Remover</h2>
            </div>

             
            <div className="bg-[#1f1f3d]/50 p-4 md:p-6 flex flex-col items-center border-2 border-indigo-400/30 rounded-2xl">
                
                 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                    
                    
                    <div 
                        className="flex flex-col bg-[#1a1834] rounded-lg p-4 transition-all duration-300"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <h3 className="text-lg font-semibold text-gray-400 mb-2 text-center">Original</h3>
                        <div 
                            className={`
                                w-full h-full min-h-[300px] md:min-h-[400px] flex items-center justify-center overflow-hidden rounded-md
                                transition-all duration-300
                                ${isDragging ? 'border-4 border-dashed border-purple-500 scale-[1.02]' : 'border-transparent'}
                            `}
                        >
                            {originalImage ? (
                                <img src={originalImage} alt="Original Input" className="max-w-full max-h-full object-contain pointer-events-none" />
                            ) : (
                                <div className="text-center text-gray-500 p-4 pointer-events-none">
                                    <UploadCloud size={64} className={`mx-auto transition-colors ${isDragging ? 'text-purple-400' : 'text-gray-500'}`} />
                                    <p className={`mt-2 transition-colors ${isDragging ? 'text-white' : 'text-gray-500'}`}>
                                        {isDragging ? "Drop your image here!" : "Upload image to start"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                     
                    <div className="flex flex-col bg-[#1a1834] rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-400 mb-2 text-center">Result</h3>
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
