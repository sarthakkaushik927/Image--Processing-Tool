import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Crop, UploadCloud, Download, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

// ✅ Import Layout Component
import BubblesBackground from './BubblesBackground'; 

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

export default function CropWorkspace() {
  const navigate = useNavigate();
  
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [aspect, setAspect] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setCrop(undefined);
      setCompletedCrop(undefined);

      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result.toString() || ''));
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

  const onImageLoad = (e) => {
    imgRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;

    const initialCrop = centerCrop(
      makeAspectCrop(
        { unit: '%', width: 50 },
        aspect,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  };

  const handleApplyCrop = () => {
    if (!completedCrop || !imgRef.current) {
      toast.error("Please load an image and define a crop area first.");
      return;
    }
    toast.success(`Crop selection saved! Ready to download.`);
  };

  const handleDownload = () => {
    if (!completedCrop || !imgRef.current || !imageSrc) {
      toast.error("No image loaded or no crop area defined.");
      return;
    }

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const canvas = document.createElement('canvas');
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      toast.error("Canvas context failed to initialize.");
      return;
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const mimeType = 'image/png';
    const dataUrl = canvas.toDataURL(mimeType);
    const filename = 'fotofix_cropped_image.png';

    // Optional: Integrate with app download history if needed
    // onImageDownloaded(dataUrl, filename);

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  const handleAspectChange = (e) => {
    const newAspect = parseFloat(e.target.value);
    setAspect(newAspect);

    if (imgRef.current && newAspect !== 0) {
      const { width, height } = imgRef.current;
      const newCrop = centerCrop(
        makeAspectCrop(
          { unit: '%', width: 90 },
          newAspect,
          width,
          height
        ),
        width,
        height
      );
      setCrop(newCrop);
    } else if (newAspect === 0) {
      setCrop(prevCrop => prevCrop ? { ...prevCrop, aspect: undefined } : undefined);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white">
      {/* Background */}
      <BubblesBackground />
      
      <motion.div
        key="crop-workspace"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 p-6 md:p-12 max-w-6xl mx-auto"
      >
        {/* Back Button */}
        <button 
          onClick={() => navigate('/tools')} 
          className="group relative flex items-center gap-2 px-5 py-2.5 mb-8 rounded-full 
                     bg-[#1a1a2e]/80 backdrop-blur-md border border-white/10 
                     shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] 
                     hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_4px_12px_rgba(124,58,237,0.3)]
                     transition-all duration-300 active:scale-95"
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/5 to-transparent opacity-100 group-hover:opacity-80 transition-opacity" />
          <ArrowLeft size={16} className="text-gray-300 group-hover:text-white transition-colors relative z-10" />
          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors relative z-10">
            Back to Tools
          </span>
        </button>

        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-purple-900/50 to-[#1f1f3d]/50 backdrop-blur-md border border-purple-500/30 shadow-xl mb-4">
            <Crop size={40} className="text-purple-400" />
          </div>
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-gray-400">
            Image Cropper
          </h2>
          <p className="text-gray-400 mt-2">Resize and frame your images perfectly.</p>
        </div>

        {/* Main Work Area */}
        <div className="bg-[#1f1f3d]/50 backdrop-blur-md p-6 md:p-8 border border-white/10 rounded-3xl shadow-2xl">

          <div className="flex flex-col lg:flex-row w-full gap-8">

            {/* Canvas Area */}
            <div className="flex-1 w-full flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-300">Edit Canvas</h3>

              <div
                className={`
                  w-full h-full min-h-[400px] flex items-center justify-center bg-[#1a1834]/60 backdrop-blur-sm rounded-2xl overflow-hidden relative
                  transition-all duration-300
                  ${isDragging ? 'border-2 border-dashed border-purple-500 bg-purple-900/20' : 'border border-white/10'}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imageSrc ? (
                  <ReactCrop
                    crop={crop}
                    onChange={c => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect === 0 ? undefined : aspect}
                    minWidth={10}
                    minHeight={10}
                    className='!max-h-[60vh] !w-auto p-4'
                  >
                    <img
                      ref={imgRef}
                      src={imageSrc}
                      onLoad={onImageLoad}
                      alt="Image to crop"
                      className="max-w-full max-h-full object-contain"
                    />
                  </ReactCrop>
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

            {/* Sidebar Controls */}
            <div className="lg:w-80 w-full bg-[#1f1f3d]/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 h-fit">
              <h4 className="text-lg font-bold mb-4 border-b border-white/10 pb-3 text-white">Crop Settings</h4>

              <div className="space-y-6">

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Change Image</label>
                  <input
                    type="file"
                    id="sidebar-upload"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
                  <select
                    value={aspect}
                    onChange={handleAspectChange}
                    className="w-full p-2.5 rounded-lg bg-[#2a2a4a] border border-gray-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  >
                    <option value={0}>Freeform (No Aspect)</option>
                    <option value={1}>1:1 (Square)</option>
                    <option value={16 / 9}>16:9 (Landscape)</option>
                    <option value={4 / 3}>4:3 (Standard)</option>
                    <option value={9 / 16}>9:16 (Story)</option>
                  </select>
                </div>

                {completedCrop && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-sm font-semibold text-gray-300 mb-2">Current Selection:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 font-mono">
                       <div className="bg-black/20 p-2 rounded">W: {Math.round(completedCrop.width)}px</div>
                       <div className="bg-black/20 p-2 rounded">H: {Math.round(completedCrop.height)}px</div>
                    </div>
                  </div>
                )}

              </div>
              
              <div className="mt-8 flex flex-col gap-3">
                 <GradientButton
                    text="Apply Crop"
                    isOutline
                    onClick={handleApplyCrop}
                    disabled={!completedCrop}
                    icon={Crop}
                    className="w-full"
                  />
                  <GradientButton
                    text="Download"
                    isBlue
                    onClick={handleDownload}
                    disabled={!completedCrop}
                    icon={Download}
                    className="w-full"
                  />
              </div>

            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}