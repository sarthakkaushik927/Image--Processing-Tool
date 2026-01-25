import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Repeat, UploadCloud, Download, Loader2, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

export default function AngleSliderWorkspace({ onImageDownloaded }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [imageSrc, setImageSrc] = useState(null);
  const [angle, setAngle] = useState(0);
  const [fileName, setFileName] = useState("image.png");
  const imgRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      setAngle(0);
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

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const w = image.naturalWidth;
    const h = image.naturalHeight;
    const angleRad = angle * (Math.PI / 180);

    // Calculate new canvas size to fit rotated image without clipping
    const absSin = Math.abs(Math.sin(angleRad));
    const absCos = Math.abs(Math.cos(angleRad));
    canvas.width = Math.ceil(w * absCos + h * absSin);
    canvas.height = Math.ceil(w * absSin + h * absCos);

    // Draw image centered
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angleRad);
    ctx.drawImage(image, -w / 2, -h / 2, w, h);

    try {
      // Get Blob for saving
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const base64Data = await blobToBase64(blob); // Convert to persistable format
      const downloadName = `rotated_${fileName}`;

      // Trigger Browser Download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Save to App History
      if (onImageDownloaded) {
        onImageDownloaded(base64Data, downloadName);
      }

      toast.success("Image downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save image.");
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white">
      {/* Background */}
      <BubblesBackground />
      
      <motion.div
        key="angle-slider-workspace"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto h-screen flex flex-col"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
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
                  <RotateCw size={24} className="text-purple-400" />
               </div>
               <h1 className="text-2xl font-bold">Angle Slider</h1>
            </div>
            
            <div className="w-[88px]"></div> {/* Spacer */}
        </div>

        {/* Main Content (Split Layout) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
            
            {/* Left: Canvas Area */}
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
                        className="max-w-full max-h-full object-contain transition-transform duration-100 ease-linear pointer-events-none p-8"
                        style={{ transform: `rotate(${angle}deg)` }}
                    />
                    ) : (
                    <div className="text-center p-10 pointer-events-none">
                        <UploadCloud size={64} className={`mx-auto mb-4 transition-colors ${isDragging ? 'text-purple-400' : 'text-gray-500'}`} />
                        <p className={`text-lg font-medium transition-colors ${isDragging ? 'text-white' : 'text-gray-400'}`}>
                        {isDragging ? "Drop it here!" : "Drag & drop an image"}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">or use the buttons below</p>
                    </div>
                    )}
                </div>
            </div>

            {/* Right: Controls Panel */}
            <div className="bg-[#1f1f3d]/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col gap-8 shadow-2xl h-fit">
                
                {/* Slider Control */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <label className='text-lg font-bold text-white flex items-center gap-2'>
                            Rotation Angle
                        </label>
                        <span className="bg-purple-500/20 text-purple-300 px-4 py-1 rounded-lg font-mono text-sm border border-purple-500/30">
                            {angle}°
                        </span>
                    </div>
                    
                    <div className="relative pt-6 pb-2">
                        <input
                            type="range"
                            min="-180"
                            max="180"
                            value={angle}
                            onChange={(e) => setAngle(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 disabled:opacity-50"
                            disabled={!imageSrc}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-3 font-mono">
                            <span>-180°</span>
                            <span className="cursor-pointer hover:text-white" onClick={() => setAngle(0)}>0° (Reset)</span>
                            <span>180°</span>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-white/10 w-full"></div>

                {/* Actions */}
                <div className="space-y-4">
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    
                    <GradientButton 
                        text={imageSrc ? "Replace Image" : "Upload Image"} 
                        isOutline 
                        icon={UploadCloud} 
                        className="w-full" 
                        onClick={() => fileInputRef.current.click()} 
                    />
                    
                    <GradientButton
                        text="Download Result"
                        onClick={handleDownload}
                        isBlue
                        disabled={!imageSrc}
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