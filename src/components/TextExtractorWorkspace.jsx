import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, UploadCloud, Download, Loader2 } from 'lucide-react';

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

export default function TextExtractorWorkspace({ setPage, onImageDownloaded }) {
    const [originalImage, setOriginalImage] = useState(null);
    const [fileObject, setFileObject] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState("image.png");
    const [extractedText, setExtractedText] = useState("");

    const handleImageUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setFileObject(file);
            setFileName(file.name);
            setExtractedText("");
            const reader = new FileReader();
            reader.onload = (e) => setOriginalImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    // 🔥 Integrated OCR API call
    const handleProcessImage = async () => {
        if (!fileObject) {
            alert("Please upload an image first.");
            return;
        }

        setIsLoading(true);
        setExtractedText("");

        try {
            const _id = sessionStorage.getItem("_id") || "anurag11";
            const apiUrl = import.meta.env.VITE_ML_API || "https://ccc.anurag11.me";

            const formData = new FormData();
            formData.append("image", fileObject);
            formData.append("_id", _id);

            const response = await fetch(`${apiUrl}/extract-text`, {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (result.status === "success") {
                setExtractedText(result.extracted_text || "No text detected.");
            } else {
                alert("OCR failed: " + (result.error || "Unknown error"));
            }
        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred while processing the image.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!extractedText) return;
        const blob = new Blob([extractedText], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `extracted_text_${fileName.replace(/\.[^/.]+$/, "")}.txt`;
        link.click();
    };

    return (
        <motion.div
            key="text-extractor-workspace"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-0 md:p-0 text-white max-w-4xl mx-auto"
        >
            <div className="flex items-center gap-4 text-gray-400 mb-6">
                <button onClick={() => setPage('tools')} className="flex items-center gap-2 hover:text-white">
                    <ArrowLeft size={24} /> <span className="text-xl font-medium">Tools</span>
                </button>
            </div>

            <div className="flex flex-col items-center justify-center mb-10">
                <div className="bg-[#1f1f3d] p-4 rounded-full border border-purple-500 shadow-xl">
                    <FileText size={48} className="text-purple-400" />
                </div>
                <h2 className="text-4xl font-bold mt-4">Text Extractor</h2>
            </div>

            <div className="bg-[#1f1f3d]/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 flex flex-col items-center border-2 border-indigo-400/30">
                <div className="w-full h-full min-h-[300px] md:min-h-[400px] flex items-center justify-center bg-[#1a1834] rounded-lg overflow-hidden relative mb-6">
                    {originalImage ? (
                        <img
                            src={originalImage}
                            alt="Uploaded"
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <div className="text-center p-10">
                            <UploadCloud size={64} className="text-gray-500 mx-auto" />
                            <p className="text-gray-400 mt-4">Upload an image to start extraction.</p>
                        </div>
                    )}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                            <Loader2 size={48} className="text-purple-400 animate-spin" />
                            <p className="ml-4 text-xl font-medium">Extracting Text...</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap justify-center gap-4 w-full">
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
                        <UploadCloud size={20} /> {originalImage ? "Change Image" : "Upload Image"}
                    </label>

                    <GradientButton 
                        text={isLoading ? "Processing..." : "Run Text Extractor"}
                        onClick={handleProcessImage} 
                        isBlue
                        disabled={!originalImage || isLoading}
                        icon={isLoading ? Loader2 : FileText}
                    />

                    <GradientButton 
                        text="Download Text"
                        onClick={handleDownload}
                        disabled={!extractedText || isLoading}
                        icon={Download}
                    />
                </div>

                {extractedText && (
                    <div className="mt-6 w-full bg-[#14122b] border border-purple-500/30 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-2 text-purple-400">Extracted Text:</h3>
                        <pre className="whitespace-pre-wrap text-gray-300 text-sm">
                            {extractedText}
                        </pre>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
