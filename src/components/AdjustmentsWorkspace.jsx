import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Sun, Star, UploadCloud, Download,
  Droplet, Palette, EyeOff, Minus, RotateCcw, Loader2, Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast'; 

// ✅ Import Layout Component
import BubblesBackground from './BubblesBackground'; 

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
      className={`px-6 py-3 rounded-xl font-medium shadow-lg transition-all flex items-center justify-center gap-2 ${buttonClasses} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {Icon && <Icon size={18} className={disabled && Icon === Loader2 ? "animate-spin" : ""} />}
      {text}
    </motion.button>
  );
}

export default function AdjustmentsWorkspace({ onImageDownloaded }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  
  const [imageSrc, setImageSrc] = useState(null);
  const [fileName, setFileName] = useState("image.png");
  const [isDragging, setIsDragging] = useState(false);

  // Filter States
  const [brightnessValue, setBrightnessValue] = useState(100);
  const [sharpnessValue, setSharpnessValue] = useState(50); // Mapped to Contrast
  const [saturationValue, setSaturationValue] = useState(100);
  const [hueValue, setHueValue] = useState(0);
  const [sepiaValue, setSepiaValue] = useState(0);
  const [grayscaleValue, setGrayscaleValue] = useState(0);

  const handleReset = () => {
    setBrightnessValue(100);
    setSharpnessValue(50);
    setSaturationValue(100);
    setHueValue(0);
    setSepiaValue(0);
    setGrayscaleValue(0);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      handleReset();
      const reader = new FileReader();
      reader.onload = (e) => setImageSrc(e.target.result);
      reader.readAsDataURL(file);
    } else if (file) {
      toast.error("Please upload an image file (e.g., png, jpg).");
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

  const handleDownload = async () => {
    const image = imgRef.current;
    if (!image || !imageSrc) {
      toast.error("Please upload an image first.");
      return;
    }

    const toastId = toast.loading("Processing...");

    try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d');

        const contrastFactor = 1 + (sharpnessValue - 50) / 50;
        const filterString = `
          brightness(${brightnessValue}%) 
          contrast(${contrastFactor}) 
          saturate(${saturationValue}%)
          hue-rotate(${hueValue}deg)
          sepia(${sepiaValue}%)
          grayscale(${grayscaleValue}%)
        `;

        ctx.filter = filterString;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Convert to Blob then Base64
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
        const base64Data = await blobToBase64(blob);
        const downloadName = `enhanced_${fileName}`;

        // 1. Browser Download
        const link = document.createElement('a');
        link.download = downloadName;
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 2. Save to App History
        if (onImageDownloaded) {
            onImageDownloaded(base64Data, downloadName);
        }

        toast.success("Image saved!", { id: toastId });
    } catch (err) {
        console.error(err);
        toast.error("Failed to save image.", { id: toastId });
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white">
      {/* Background */}
      <BubblesBackground />
      
      <motion.div
        key="adjustments-workspace"
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
                  <Sun size={24} className="text-purple-400" />
               </div>
               <h1 className="text-2xl font-bold">Image Enhancer</h1>
            </div>
            
            <div className="w-[88px]"></div>
        </div>

        {/* Main Content (Split Layout) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">

          {/* Left Column: Canvas Area */}
          <div className="lg:col-span-2 bg-[#1f1f3d]/40 backdrop-blur-md rounded-3xl border border-white/10 p-6 flex flex-col relative overflow-hidden shadow-2xl">
             <div
                className={`
                  flex-1 flex items-center justify-center bg-[#1a1834]/60 rounded-2xl overflow-hidden relative
                  transition-all duration-300 border-2 border-dashed
                  ${isDragging ? 'border-purple-500 bg-purple-900/20' : 'border-white/5'}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imageSrc ? (
                  <img
                    ref={imgRef}
                    crossOrigin="anonymous"
                    src={imageSrc}
                    alt="Input"
                    className="max-w-full max-h-full object-contain pointer-events-none p-4 transition-all duration-100"
                    style={{
                      filter: `
                        brightness(${brightnessValue}%) 
                        contrast(${1 + (sharpnessValue - 50) / 50}) 
                        saturate(${saturationValue}%)
                        hue-rotate(${hueValue}deg)
                        sepia(${sepiaValue}%)
                        grayscale(${grayscaleValue}%)
                      `
                    }}
                  />
                ) : (
                  <div className="text-center p-10 pointer-events-none">
                    <div className="bg-black/30 p-4 rounded-full inline-block mb-4">
                        <UploadCloud size={40} className={`transition-colors ${isDragging ? 'text-purple-400' : 'text-gray-500'}`} />
                    </div>
                    <p className={`text-lg font-medium transition-colors ${isDragging ? 'text-white' : 'text-gray-400'}`}>
                      {isDragging ? "Drop it here!" : "Drag & drop an image"}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">or click "Upload Image"</p>
                  </div>
                )}
              </div>
          </div>

          {/* Right Column: Controls (Scrollable) */}
          <div className="lg:col-span-1 bg-[#1f1f3d]/60 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden h-full">
            
            <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Palette size={18} className="text-purple-400" /> Adjustments
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                
                {/* --- Sliders --- */}
                <div className='space-y-3'>
                  <label className='flex justify-between text-sm font-semibold text-gray-300'>
                    <span className="flex items-center gap-2"><Sun size={16} className='text-yellow-400' /> Brightness</span>
                    <span className="font-mono text-purple-300">{brightnessValue}%</span>
                  </label>
                  <input type="range" min="0" max="200" value={brightnessValue}
                    onChange={(e) => setBrightnessValue(parseInt(e.target.value))}
                    disabled={!imageSrc}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 disabled:opacity-50" />
                </div>

                <div className='space-y-3'>
                  <label className='flex justify-between text-sm font-semibold text-gray-300'>
                    <span className="flex items-center gap-2"><Star size={16} className='text-blue-400' /> Contrast</span>
                    <span className="font-mono text-purple-300">{sharpnessValue}</span>
                  </label>
                  <input type="range" min="0" max="100" value={sharpnessValue}
                    onChange={(e) => setSharpnessValue(parseInt(e.target.value))}
                    disabled={!imageSrc}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 disabled:opacity-50" />
                </div>

                <div className='space-y-3'>
                  <label className='flex justify-between text-sm font-semibold text-gray-300'>
                    <span className="flex items-center gap-2"><Droplet size={16} className='text-pink-400' /> Saturation</span>
                    <span className="font-mono text-purple-300">{saturationValue}%</span>
                  </label>
                  <input type="range" min="0" max="300" value={saturationValue}
                    onChange={(e) => setSaturationValue(parseInt(e.target.value))}
                    disabled={!imageSrc}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 disabled:opacity-50" />
                </div>

                <div className='space-y-3'>
                  <label className='flex justify-between text-sm font-semibold text-gray-300'>
                    <span className="flex items-center gap-2"><Palette size={16} className='text-green-400' /> Hue</span>
                    <span className="font-mono text-purple-300">{hueValue}°</span>
                  </label>
                  <input type="range" min="0" max="360" value={hueValue}
                    onChange={(e) => setHueValue(parseInt(e.target.value))}
                    disabled={!imageSrc}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 disabled:opacity-50" />
                </div>

                <div className='space-y-3'>
                  <label className='flex justify-between text-sm font-semibold text-gray-300'>
                    <span className="flex items-center gap-2"><EyeOff size={16} className='text-orange-400' /> Sepia</span>
                    <span className="font-mono text-purple-300">{sepiaValue}%</span>
                  </label>
                  <input type="range" min="0" max="100" value={sepiaValue}
                    onChange={(e) => setSepiaValue(parseInt(e.target.value))}
                    disabled={!imageSrc}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 disabled:opacity-50" />
                </div>

                <div className='space-y-3'>
                  <label className='flex justify-between text-sm font-semibold text-gray-300'>
                    <span className="flex items-center gap-2"><Minus size={16} className='text-gray-400' /> Grayscale</span>
                    <span className="font-mono text-purple-300">{grayscaleValue}%</span>
                  </label>
                  <input type="range" min="0" max="100" value={grayscaleValue}
                    onChange={(e) => setGrayscaleValue(parseInt(e.target.value))}
                    disabled={!imageSrc}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 disabled:opacity-50" />
                </div>

            </div>

            {/* --- Action Footer --- */}
            <div className="p-6 border-t border-white/10 bg-black/20 space-y-4">
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                
                <GradientButton 
                    text={imageSrc ? "Replace Image" : "Upload Image"} 
                    isOutline 
                    icon={UploadCloud} 
                    className="w-full" 
                    onClick={() => fileInputRef.current.click()} 
                />

                <div className="flex gap-3">
                    <GradientButton
                    text="Reset"
                    onClick={handleReset}
                    isOutline
                    disabled={!imageSrc}
                    icon={RotateCcw}
                    className="flex-1 !border-red-500/50 hover:!bg-red-500/10 text-red-300"
                    />
                    <GradientButton
                    text="Save"
                    onClick={handleDownload}
                    isBlue
                    disabled={!imageSrc}
                    icon={Download}
                    className="flex-1"
                    />
                </div>
            </div>

          </div>
        </div>

      </motion.div>
    </div>
  );
}