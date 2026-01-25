import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Download, FileType, CheckCircle, Loader2, X } from 'lucide-react';
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

// --- Upload Placeholder ---
function UploadPlaceholder({ onImageUpload }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full h-96 bg-[#1f1f3d]/40 backdrop-blur-md rounded-3xl border-2 border-dashed 
                 flex flex-col items-center justify-center text-gray-400 cursor-pointer transition-all duration-300 group
                 ${isDragging ? 'border-purple-500 bg-purple-900/20' : 'border-gray-600 hover:border-purple-400 hover:bg-[#1f1f3d]/60'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && onImageUpload(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />
      <div className="bg-black/30 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
         <UploadCloud size={48} className={`transition-colors ${isDragging ? 'text-purple-300' : 'text-purple-500'}`} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Upload Image</h3>
      <p className="text-sm text-gray-400">Drag & drop or click to browse</p>
      <div className="mt-4 flex gap-2">
         {['PNG', 'JPG', 'WEBP', 'BMP'].map(fmt => (
            <span key={fmt} className="text-xs font-mono bg-white/5 px-2 py-1 rounded border border-white/5 text-gray-500">{fmt}</span>
         ))}
      </div>
    </motion.div>
  );
}

// --- Format Selector ---
function FormatSelector({ selectedFormat, onFormatChange }) {
  const formats = [
    { id: 'png', name: 'PNG', mime: 'image/png' },
    { id: 'jpeg', name: 'JPEG', mime: 'image/jpeg' },
    { id: 'webp', name: 'WEBP', mime: 'image/webp' },
    { id: 'bmp', name: 'BMP', mime: 'image/bmp' },
    { id: 'ico', name: 'ICO', mime: 'image/x-icon' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
      {formats.map((format) => (
        <motion.button
          key={format.id}
          onClick={() => onFormatChange(format)}
          className={`relative flex flex-col items-center justify-center p-4 rounded-xl font-medium transition-all border
                     ${selectedFormat.id === format.id
            ? 'bg-purple-600/20 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]'
            : 'bg-[#2a2a4a]/40 border-transparent text-gray-400 hover:bg-[#2a2a4a]/80 hover:text-white hover:border-white/10'}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {selectedFormat.id === format.id && (
            <div className="absolute top-2 right-2">
              <CheckCircle size={16} className="text-purple-400" />
            </div>
          )}
          <span className="text-lg font-bold">{format.name}</span>
          <span className="text-xs text-gray-500 font-mono mt-1">.{format.id}</span>
        </motion.button>
      ))}
    </div>
  );
}

export default function ConverterWorkspace({ onImageDownloaded }) {
  const navigate = useNavigate();
  
  const [originalImage, setOriginalImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [targetFormat, setTargetFormat] = useState({ id: 'png', name: 'PNG', mime: 'image/png' });
  const [isConverting, setIsConverting] = useState(false);
  const canvasRef = useRef(null);

  const handleImageUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error("Invalid file type. Please upload an image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target.result);
    };
    reader.readAsDataURL(file);
    setImageName(file.name.split('.').slice(0, -1).join('.'));
  };

  const handleConvertAndDownload = () => {
    if (!originalImage || !canvasRef.current) return;

    setIsConverting(true);
    const toastId = toast.loading(`Converting to ${targetFormat.name}...`);

    const img = new Image();
    img.onload = async () => {
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0);

      // Handle quality for JPEG/WEBP
      const quality = (targetFormat.id === 'jpeg' || targetFormat.id === 'webp') ? 0.92 : undefined;
      
      try {
        const dataUrl = canvas.toDataURL(targetFormat.mime, quality);
        const newFileName = `${imageName}_converted.${targetFormat.id}`;

        // 1. Trigger Browser Download
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = newFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 2. Save to App History (Fix for DownloadsView)
        if (onImageDownloaded) {
           // No need for base64 conversion here as dataUrl IS base64
           onImageDownloaded(dataUrl, newFileName); 
        }

        toast.success('Conversion successful!', { id: toastId });
      } catch (err) {
        toast.error('Format not supported by your browser.', { id: toastId });
        console.error(err);
      } finally {
        setIsConverting(false);
      }
    };
    
    img.onerror = () => {
      setIsConverting(false);
      toast.error('Failed to load image.', { id: toastId });
    }
    img.src = originalImage;
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white">
      {/* Background */}
      <BubblesBackground />
      
      <motion.div
        key="format-converter"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto h-screen flex flex-col"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
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
                  <FileType size={24} className="text-purple-400" />
               </div>
               <h1 className="text-2xl font-bold">Format Converter</h1>
            </div>
            
            <div className="w-[88px]"></div> {/* Spacer for alignment */}
        </div>

        <canvas ref={canvasRef} className="hidden"></canvas>

        {/* Main Content Area */}
        <div className="flex-1 min-h-0"> {/* Enables scroll if needed */}
            {!originalImage ? (
                <div className="h-full flex items-center justify-center">
                    <div className="w-full max-w-2xl">
                        <UploadPlaceholder onImageUpload={handleImageUpload} />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                    
                    {/* Left: Preview Panel */}
                    <div className="bg-[#1f1f3d]/40 backdrop-blur-md rounded-3xl border border-white/10 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ft4.ftcdn.net%2Fjpg%2F02%2F67%2F16%2F58%2F360_F_267165840_q6yJ6C676l618y6a8j4y8j4y8j4y8j4y.jpg&f=1&nofb=1&ipt=b1d6f1c4e7f3c4e7f3c4e7f3c4e7f3c4e7f3c4e7f3c4e7f3c4e7f3c4e7f3c4e7&ipo=images')] opacity-10 pointer-events-none"></div>
                        
                        <motion.img
                            src={originalImage}
                            alt="Preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl z-10"
                        />
                        
                        <div className="absolute top-4 right-4 z-20">
                            <button 
                                onClick={() => setOriginalImage(null)}
                                className="p-2 bg-black/50 hover:bg-red-500/80 backdrop-blur-md rounded-full text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Right: Controls Panel */}
                    <div className="flex flex-col justify-center gap-8 px-4 lg:px-12">
                        
                        <div>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm border border-blue-500/30">1</span>
                                Choose Output Format
                            </h3>
                            <FormatSelector selectedFormat={targetFormat} onFormatChange={setTargetFormat} />
                        </div>

                        <div className="h-px bg-white/10 w-full"></div>

                        <div>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm border border-purple-500/30">2</span>
                                Convert & Save
                            </h3>
                            <GradientButton
                                text={isConverting ? "Converting..." : `Download as ${targetFormat.name}`}
                                onClick={handleConvertAndDownload}
                                disabled={isConverting}
                                isBlue
                                icon={isConverting ? Loader2 : Download}
                                className="w-full py-4 text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                            />
                            <p className="text-center text-gray-500 text-sm mt-4">
                                Files are processed locally in your browser.
                            </p>
                        </div>

                    </div>
                </div>
            )}
        </div>

      </motion.div>
    </div>
  );
}