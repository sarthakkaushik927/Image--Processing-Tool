import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Repeat, UploadCloud, Download, Loader2 } from 'lucide-react'; // Added Loader2 for button
import GradientButton from '../components/GradientButton';
// =======================================================================
//  Angle Slider Workspace Component
// =======================================================================
export default function AngleSliderWorkspace({ setPage, onImageDownloaded }) {
    const [imageSrc, setImageSrc] = useState(null); // Yeh dataUrl hoga
    const [angle, setAngle] = useState(0); 
    const [fileName, setFileName] = useState("image.png");
    const imgRef = useRef(null); 
    const [isDragging, setIsDragging] = useState(false); // ⬅️ 1. New state for drag UI

    // ⬇️ 2. Refactored logic into a reusable function
    const processFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            setFileName(file.name);
            setAngle(0); // Reset angle on new image
            const reader = new FileReader();
            reader.onload = (e) => setImageSrc(e.target.result); // ⬅️ dataUrl
            reader.readAsDataURL(file);
        } else if (file) {
            alert("Please upload an image file (e.g., png, jpg).");
        }
    };

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

    const handleDownload = () => {
        const image = imgRef.current;
        if (!image || !imageSrc) {
            alert("Please upload an image first.");
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const w = image.naturalWidth;
        const h = image.naturalHeight;
        const angleRad = angle * (Math.PI / 180);
        
        // Calculate new canvas size to fit the rotated image
        const absSin = Math.abs(Math.sin(angleRad));
        const absCos = Math.abs(Math.cos(angleRad));
        canvas.width = Math.ceil(w * absCos + h * absSin);
        canvas.height = Math.ceil(w * absSin + h * absCos);
        
        // Translate to the center, rotate, and draw the image off-center
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angleRad);
        ctx.drawImage(image, -w / 2, -h / 2, w, h);
        
        const dataUrl = canvas.toDataURL('image/png');
        const downloadName = `rotated_${fileName}`;
        
        if (onImageDownloaded) {
            onImageDownloaded(dataUrl, downloadName);
        }
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = downloadName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div
            key="angle-slider-workspace"
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
                    <Repeat size={48} className="rotate-90 text-purple-400" />
                </div>
                <h2 className="text-4xl font-bold mt-4">Angle Slider</h2>
            </div>

            <div className="bg-[#1f1f3d]/50 p-6 flex flex-col items-center border-2 border-indigo-400/30 rounded-2xl">
                
                {/* ⬇️ 4. This is now the drop zone ⬇️ */}
                <div 
                    className={`
                        w-full h-full min-h-[300px] md:min-h-[500px] flex items-center justify-center 
                        bg-[#1a1834] rounded-lg overflow-hidden relative mb-6
                        transition-all duration-300
                        ${isDragging ? 'border-4 border-dashed border-purple-500 scale-[1.02]' : 'border-transparent'}
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
                            className="max-w-full max-h-full object-contain transition-transform duration-100 ease-linear pointer-events-none"
                            style={{ transform: `rotate(${angle}deg)` }} 
                        />
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

                <div className='w-full p-4'>
                    <label className='block text-lg font-semibold mb-2' htmlFor="angle-slider">Angle: {angle}°</label>
                    <input
                        type="range"
                        id="angle-slider"
                        min="-180"
                        max="180"
                        value={angle}
                        onChange={(e) => setAngle(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        disabled={!imageSrc} // ⬅️ Disable slider if no image
                    />
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 w-full mt-4">
                    <input type="file" id="angle-upload" onChange={handleImageUpload} accept="image/*" className="hidden" />
                    <label htmlFor="angle-upload" className="w-full md:w-auto px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform cursor-pointer bg-transparent border-2 border-gray-400 text-gray-300 hover:bg-gray-700/50 flex items-center justify-center gap-2">
                        <UploadCloud size={20} /> {imageSrc ? "Change Image" : "Upload Image"}
                    </label>
                    <GradientButton 
                        text="Download Result" 
                        onClick={handleDownload}
                        isBlue 
                        disabled={!imageSrc}
                        icon={Download} 
                    />
                </div>
            </div>
        </motion.div>
    );
}
