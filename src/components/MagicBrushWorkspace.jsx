import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Wand2, UploadCloud, Download, Loader2, Image as ImageIcon
} from "lucide-react";
import toast from 'react-hot-toast';

// ✅ Import Layout Components
import BubblesBackground from './BubblesBackground'; 

export const ML_SERVER = import.meta.env.VITE_ML_API || "http://127.0.0.1:5000";

// --- Helper: Convert Blob to Base64 (Crucial for DownloadsView) ---
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// --- Reusable Button ---
function GradientButton({
  text,
  isBlue = false,
  isOutline = false,
  className = "",
  onClick,
  disabled,
  icon: Icon,
}) {
  const blueGradient = "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white border-none";
  const purpleGradient = "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none";
  const outline = "bg-transparent border border-gray-500 text-gray-300 hover:bg-gray-800/50 hover:border-gray-400 backdrop-blur-sm";
  
  const buttonClasses = isOutline ? outline : isBlue ? blueGradient : purpleGradient;

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2.5 rounded-xl font-medium shadow-lg transition-all flex items-center justify-center gap-2 ${buttonClasses} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {Icon && <Icon size={18} className={disabled && Icon === Loader2 ? "animate-spin" : ""} />}
      {text}
    </motion.button>
  );
}

export default function MagicBrushWorkspace({ onImageDownloaded }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImageURL, setProcessedImageURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("image.png");
  const [fileObj, setFileObj] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // --- Drag & Drop Handlers ---
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
    if (file) processFile(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    setFileName(file.name.split(".").slice(0, -1).join(".") + ".png");
    setProcessedImageURL(null);
    setFileObj(file);
    const reader = new FileReader();
    reader.onload = (e) => setOriginalImage(e.target.result);
    reader.readAsDataURL(file);
  };

  // --- API Call ---
  const handleRemoveBackground = async () => {
    if (!fileObj) {
      toast.error("Please upload an image first.");
      return;
    }
    setIsLoading(true);
    setProcessedImageURL(null);
    const toastId = toast.loading('Removing background...');

    try {
      const formData = new FormData();
      formData.append("image", fileObj);
      formData.append("_id", "anurag"); // Placeholder ID

      const res = await fetch(`${ML_SERVER}/remove-bg`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      if (data.status === "success" && data.output_url) {
        const outputUrl = `${ML_SERVER}${data.output_url}`;
        setProcessedImageURL(outputUrl);
        toast.success('Background removed!', { id: toastId });
      } else {
        throw new Error("Failed to process image");
      }
    } catch (err) {
      toast.error("Background removal failed.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Download Handler ---
  const handleDownload = async () => {
    if (!processedImageURL) {
      toast.error("No image to download.");
      return;
    }

    const downloadName = `removed_bg_${fileName}`;
    const toastId = toast.loading('Downloading...');
    try {
      // 1. Fetch the processed image
      const response = await fetch(processedImageURL, { mode: "cors" });
      const blob = await response.blob();
      
      // 2. Convert to Base64 for persistent storage
      const base64Data = await blobToBase64(blob);

      // 3. Trigger Browser Download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      // 4. Save to App History
      if (onImageDownloaded) {
        onImageDownloaded(base64Data, downloadName); 
      }

      toast.success("Download complete!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Download failed.", { id: toastId });
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Background */}
      <BubblesBackground />

      {/* Main Content */}
      <motion.div
        key="magic-brush-workspace"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto h-screen flex flex-col"
      >
        {/* Header Section */}
        <div className="flex-shrink-0 flex items-center justify-between mb-6">
            <button 
                onClick={() => navigate('/tools')} 
                className="group flex items-center gap-2 px-4 py-2 rounded-full 
                            bg-[#1a1a2e]/80 border border-white/10 hover:border-purple-500/50
                            transition-all duration-300"
            >
                <ArrowLeft size={18} className="text-gray-400 group-hover:text-white" />
                <span className="text-sm font-medium text-gray-400 group-hover:text-white">Back</span>
            </button>

            <div className="flex items-center gap-3">
               <div className="bg-purple-900/30 p-2 rounded-lg">
                  <Wand2 size={24} className="text-purple-400" />
               </div>
               <h1 className="text-2xl font-bold">Magic Background Remover</h1>
            </div>
            
            <div className="w-[88px]"></div> {/* Spacer */}
        </div>

        {/* --- Work Area (Split Layout) --- */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
            
            {/* Left: Original / Upload */}
            <div className="flex flex-col h-full bg-[#1f1f3d]/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <h3 className="text-lg font-semibold text-gray-300 mb-4 ml-1">Original Image</h3>
                
                <div
                    className={`flex-1 flex items-center justify-center rounded-2xl overflow-hidden relative transition-all duration-300 backdrop-blur-sm
                        ${isDragging ? "border-2 border-dashed border-purple-500 bg-purple-900/20" : "bg-[#1a1834]/60 border border-white/10 hover:border-purple-500/30"}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {originalImage ? (
                        <img
                            src={originalImage}
                            alt="Original"
                            className="max-w-full max-h-full object-contain p-4"
                        />
                    ) : (
                        <div className="text-center p-8 pointer-events-none">
                            <ImageIcon size={48} className={`mx-auto mb-4 transition-colors ${isDragging ? "text-purple-400" : "text-gray-600"}`} />
                            <p className="text-gray-400 font-medium">
                                {isDragging ? "Drop it here!" : "Drag & drop an image"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Upload Controls */}
                <div className="mt-6 flex flex-col gap-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    
                    <div className="flex gap-3">
                        <GradientButton 
                            text="Upload Image" 
                            isOutline 
                            icon={UploadCloud} 
                            className="flex-1" 
                            onClick={() => fileInputRef.current.click()} 
                        />
                        <GradientButton
                            text={isLoading ? "Processing..." : "Remove BG"}
                            onClick={handleRemoveBackground}
                            isBlue
                            disabled={!originalImage || isLoading}
                            icon={isLoading ? Loader2 : Wand2}
                            className="flex-1"
                        />
                    </div>
                </div>
            </div>

            {/* Right: Result */}
            <div className="flex flex-col h-full bg-[#1f1f3d]/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <h3 className="text-lg font-semibold text-gray-300 mb-4 ml-1">Result</h3>

                <div className="flex-1 flex items-center justify-center rounded-2xl overflow-hidden relative border border-white/10 bg-[#1a1834]/80">
                    
                    {/* Checkerboard Pattern for Transparency */}
                    <div className="absolute inset-0 opacity-20" 
                         style={{ 
                             backgroundImage: "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                             backgroundSize: "20px 20px",
                             backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px" 
                         }} 
                    />

                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-20">
                            <Loader2 size={48} className="text-purple-400 animate-spin mb-3" />
                            <p className="text-white font-medium animate-pulse">Working magic...</p>
                        </div>
                    )}

                    {processedImageURL ? (
                        <img
                            src={processedImageURL}
                            alt="Processed"
                            className="relative z-10 max-w-full max-h-full object-contain p-4"
                        />
                    ) : (
                        !isLoading && (
                            <div className="relative z-10 text-center text-gray-500 opacity-50">
                                <Wand2 size={48} className="mx-auto mb-2" />
                                <p>Processed image will appear here</p>
                            </div>
                        )
                    )}
                </div>

                <div className="mt-6">
                    <GradientButton
                        text="Download Result"
                        onClick={handleDownload}
                        disabled={!processedImageURL || isLoading}
                        icon={Download}
                        className="w-full"
                    />
                </div>
            </div>

        </div>

      </motion.div>
    </div>
  );
}