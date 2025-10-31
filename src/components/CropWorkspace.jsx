import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'; 
import {
  ArrowLeft, Crop, UploadCloud, Download,
} from 'lucide-react';

// =======================================================================
//  AUXILIARY COMPONENT (Must be defined before it's used)
// =======================================================================
function GradientButton({ text, isBlue = false, isOutline = false, className = "", onClick, disabled }) {
  const blueGradient = "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500";
  const purpleGradient = "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700";
  const outline = "bg-transparent border-2 border-purple-400 text-purple-300 hover:bg-purple-900/50";
  const buttonClasses = isOutline ? outline : (isBlue ? blueGradient : purpleGradient);
  const defaultClasses = "w-full md:w-auto px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform";
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <motion.button 
      whileHover={{ scale: disabled ? 1 : 1.05 }} 
      whileTap={{ scale: disabled ? 1 : 0.95 }} 
      onClick={onClick}
      disabled={disabled}
      className={`${defaultClasses} ${buttonClasses} ${className} ${disabledClasses}`}
    > 
      {text} 
    </motion.button>
  );
}

// =======================================================================
//  Crop Workspace Component
// =======================================================================
// ⬇️ 'onImageDownloaded' prop ko yahan accept karein
export default function CropWorkspace({ setPage, onImageDownloaded }) {
  // === 1. State and Refs ===
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [aspect, setAspect] = useState(0); 

  // === 2. Handler Functions ===
  
  // Handles image upload
  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setCrop(undefined); 
      setCompletedCrop(undefined);
      
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result.toString() || ''));
      reader.readAsDataURL(file);
    }
  };

  // Initializes crop area when image is loaded
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
  
  // Handles Apply Crop button click
  const handleApplyCrop = () => {
    if (!completedCrop || !imgRef.current) {
        alert("Please load an image and define a crop area first.");
        return;
    }
    console.log("Applying crop:", completedCrop);
    alert(`Crop Applied! Ready for download. Size: ${Math.round(completedCrop.width)} x ${Math.round(completedCrop.height)}`);
  };

  // ⬇️ --- (FIXED) 'handleDownload' FUNCTION --- ⬇️
  const handleDownload = () => {
      // 1. Basic Checks
      if (!completedCrop || !imgRef.current || !imageSrc) {
          alert("No image loaded or no crop area defined.");
          return;
      }

      const image = imgRef.current;
      
      // 2. Scale aur Canvas setup
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const canvas = document.createElement('canvas');
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
          alert("Canvas context failed to initialize.");
          return;
      }
      
      // 3. Cropped section draw karein
      ctx.drawImage(
          image,
          completedCrop.x * scaleX,         // Source X
          completedCrop.y * scaleY,         // Source Y
          completedCrop.width * scaleX,     // Source Width
          completedCrop.height * scaleY,    // Source Height
          0,                                // Destination X
          0,                                // Destination Y
          canvas.width,                     // Destination Width
          canvas.height                     // Destination Height
      );

      // 4. ⬇️ Data URL banayein (toBlob ki jagah) ⬇️
      const mimeType = 'image/png';
      const dataUrl = canvas.toDataURL(mimeType); // ⬅️ YEH HAI BADLAV
      const filename = 'fotofix_cropped_image.png';

      // 5. ⭐️ HomePage ko 'dataUrl' bhej dein ⭐️
      if (onImageDownloaded) {
          onImageDownloaded(dataUrl, filename); // ⬅️ YAHAN 'dataUrl' PASS KAREIN
      }

      // 6. Download trigger karein (ab 'dataUrl' se)
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl; // ⬅️ YAHAN BHI 'dataUrl' USE KAREIN
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // Handles Aspect Ratio changes
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
        setCrop(prevCrop => prevCrop ? {...prevCrop, aspect: undefined} : undefined);
    }
  };


  // === 3. JSX Return Block ===
  return (
    <motion.div
      key="crop-workspace"
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
            <Crop size={48} className="text-purple-400" />
        </div>
        <h2 className="text-4xl font-bold mt-4">Crop</h2>
      </div>

      {/* Main Editing Area */}
      <div className="bg-[#1f1f3d]/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center min-h-[500px] max-w-6xl mx-auto border-2 border-indigo-400/30">
        
        <div className="flex flex-col lg:flex-row w-full gap-8">
            
            {/* Image View Area (Center) */}
            <div className="flex-1 w-full flex flex-col items-center justify-center">
                <h3 className="text-2xl font-semibold mb-4 text-center text-purple-300">Edit Canvas</h3>
                
                <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-[#1a1834] rounded-lg overflow-hidden relative">
                    {imageSrc ? (
                        <ReactCrop
                            crop={crop}
                            onChange={c => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect === 0 ? undefined : aspect} 
                            minWidth={10}
                            minHeight={10}
                            className='!max-h-[60vh] !w-auto'
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
                        <div className="text-center p-10">
                            <UploadCloud size={64} className="text-gray-500 mx-auto" />
                            <p className="text-gray-400 mt-4">Upload an image to start cropping.</p>
                            <input 
                                type="file" 
                                id="initial-upload" 
                                onChange={handleImageUpload} 
                                accept="image/*" 
                                className="hidden" 
                            />
                            <label 
                                htmlFor="initial-upload" 
                                className="mt-4 inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            >
                                <UploadCloud size={20} className='mr-2' /> Select File
                            </label>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Tool Options Sidebar (Right) */}
            <div className="lg:w-72 w-full lg:h-full bg-[#1f1f3d]/50 p-5 rounded-2xl border border-gray-700/50">
              <h4 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Crop Settings</h4>
              
              <div className="space-y-6">
                
                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-white mb-2">Change Image</label>
                    <input 
                        type="file" 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" 
                    />
                </div>

                {/* Aspect Ratio */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Aspect Ratio</label>
                    <select 
                        value={aspect} 
                        onChange={handleAspectChange} 
                        className="w-full p-3 rounded-lg bg-[#2a2a4a] border border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
                    >
                        <option value={0}>Freeform (No Aspect)</option>
                        <option value={1}>1:1 (Square)</option>
                        <option value={16 / 9}>16:9</option>
                        <option value={4 / 3}>4:3</option>
                    </select>
                </div>
                
                {/* Crop Details Display */}
                {completedCrop && (
                    <div className="pt-4 border-t border-gray-700/50">
                        <p className="text-sm font-semibold text-gray-300">Current Crop Area:</p>
                        <p className="text-xs text-gray-400">W: {Math.round(completedCrop.width)}px</p>
                        <p className="text-xs text-gray-400">H: {Math.round(completedCrop.height)}px</p>
                    </div>
                )}
                
              </div>
            </div>
        </div>

          {/* Bottom Controls */}
          <div className="mt-8 flex gap-4 w-full justify-center">
            <GradientButton 
                text="Apply Crop" 
                className="px-10" 
                isBlue 
                onClick={handleApplyCrop} 
                disabled={!completedCrop} 
            />
            <GradientButton 
                text="Download" 
                className="px-10" 
                isBlue={false} 
                onClick={handleDownload} 
                disabled={!completedCrop} 
            />
            <GradientButton 
                text="Reset Crop" 
                isOutline 
                className="px-8" 
                onClick={() => setCrop(undefined)} 
                disabled={!crop}
            />
          </div>
      </div>
    </motion.div>
  );
}