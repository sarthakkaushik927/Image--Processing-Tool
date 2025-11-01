import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'; 
import {
    ArrowLeft, Crop, UploadCloud, Download,
} from 'lucide-react';
import GradientButton from '../components/GradientButton';
// =======================================================================
//  Crop Workspace Component
// =======================================================================
export default function CropWorkspace({ setPage, onImageDownloaded }) {
    // === 1. State and Refs ===
    const [imageSrc, setImageSrc] = useState(null);
    const imgRef = useRef(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [aspect, setAspect] = useState(0); 
    const [isDragging, setIsDragging] = useState(false); // ⬅️ 1. New state for drag UI

    // === 2. Handler Functions ===
    
    // ⬇️ 2. Refactored logic into a reusable function
    const processFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            setCrop(undefined); 
            setCompletedCrop(undefined);
            
            const reader = new FileReader();
            reader.addEventListener('load', () => setImageSrc(reader.result.toString() || ''));
            reader.readAsDataURL(file);
        } else if (file) {
            alert("Please upload an image file (e.g., png, jpg).");
        }
    };

    // Handles image upload
    const handleImageUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        processFile(file); // ⬅️ Use new reusable function
    };

    // ⬇️ 3. New Drag & Drop Handlers
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
        processFile(file); // ⬅️ Use new reusable function
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

    const handleDownload = () => {
        if (!completedCrop || !imgRef.current || !imageSrc) {
            alert("No image loaded or no crop area defined.");
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
            alert("Canvas context failed to initialize.");
            return;
        }
        
        ctx.drawImage(
            image,
            completedCrop.x * scaleX,       // Source X
            completedCrop.y * scaleY,       // Source Y
            completedCrop.width * scaleX,   // Source Width
            completedCrop.height * scaleY,  // Source Height
            0,                              // Destination X
            0,                              // Destination Y
            canvas.width,                   // Destination Width
            canvas.height                   // Destination Height
        );

        const mimeType = 'image/png';
        const dataUrl = canvas.toDataURL(mimeType); 
        const filename = 'fotofix_cropped_image.png';

        if (onImageDownloaded) {
            onImageDownloaded(dataUrl, filename);
        }

        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl; 
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
                    
                    {/* ⬇️ 4. Image View Area (This is now the drop zone) ⬇️ */}
                    <div className="flex-1 w-full flex flex-col items-center justify-center">
                        <h3 className="text-2xl font-semibold mb-4 text-center text-purple-300">Edit Canvas</h3>
                        
                        <div 
                            className={`
                                w-full h-full min-h-[400px] flex items-center justify-center bg-[#1a1834] rounded-lg overflow-hidden relative
                                transition-all duration-300
                                ${isDragging ? 'border-4 border-dashed border-purple-500 scale-[1.02]' : 'border-transparent'}
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
                                    className='!max-h-[60vh] !w-auto'
                                >
                                    <img
                                        ref={imgRef}
                                        src={imageSrc}
                                        onLoad={onImageLoad}
                                        alt="Image to crop"
                                        className="max-w-full max-h-full object-contain pointer-events-none" // ⬅️ pointer-events-none
                                    />
                                </ReactCrop>
                            ) : (
                                // ⬇️ Updated empty state for drop zone
                                <div className="text-center p-10 pointer-events-none">
                                    <UploadCloud size={64} className={`mx-auto transition-colors ${isDragging ? 'text-purple-400' : 'text-gray-500'}`} />
                                    <p className={`text-gray-400 mt-4 transition-colors ${isDragging ? 'text-white' : 'text-gray-400'}`}>
                                        {isDragging ? "Drop your image here!" : "Drag & drop or upload an image"}
                                    </p>
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
                                <label className="block text-sm font-medium text-white mb-2" htmlFor='sidebar-upload'>Change Image</label>
                                <input 
                                    type="file" 
                                    id="sidebar-upload"
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
                <div className="mt-8 flex flex-col md:flex-row gap-4 w-full justify-center">
                    <GradientButton 
                        text="Apply Crop" 
                        className="px-10" 
                        isBlue 
                        onClick={handleApplyCrop} 
                        disabled={!completedCrop} 
                        icon={Crop} // ⬅️ Added icon
                    />
                    <GradientButton 
                        text="Download" 
                        className="px-10" 
                        isBlue={false} 
                        onClick={handleDownload} 
                        disabled={!completedCrop} 
                        icon={Download} // ⬅️ Added icon
                    />
                    {/* Note: Resetting crop by setting to 'undefined' is correct,
                        but ReactCrop sometimes holds state. A full image reset
                        (setImageSrc(null)) might be more forceful if needed.
                    */}
                </div>
            </div>
        </motion.div>
    );
}

