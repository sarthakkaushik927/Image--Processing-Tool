import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Repeat, UploadCloud, Download } from 'lucide-react';

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

// ⬇️ STEP 1: 'onImageDownloaded' prop ko accept karein
export default function AngleSliderWorkspace({ setPage, onImageDownloaded }) {
    const [imageSrc, setImageSrc] = useState(null); // Yeh dataUrl hoga
    const [angle, setAngle] = useState(0); 
    const [fileName, setFileName] = useState("image.png");
    const imgRef = useRef(null); // ⬅️ img tag ko reference karne ke liye

    // ⬇️ STEP 2: 'handleImageUpload' ko 'FileReader' use karne ke liye update karein
    const handleImageUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => setImageSrc(e.target.result); // ⬅️ dataUrl
            reader.readAsDataURL(file);
        }
    };

    // ⬇️ STEP 3: Naya 'handleDownload' function implement karein
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
        
        const absSin = Math.abs(Math.sin(angleRad));
        const absCos = Math.abs(Math.cos(angleRad));
        canvas.width = Math.ceil(w * absCos + h * absSin);
        canvas.height = Math.ceil(w * absSin + h * absCos);
        
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angleRad);
        ctx.drawImage(image, -w / 2, -h / 2, w, h);
        
        const dataUrl = canvas.toDataURL('image/png');
        const downloadName = `rotated_${fileName}`;
        
        // 1. ⭐️ Storage mein save karein ⭐️
        if (onImageDownloaded) {
            onImageDownloaded(dataUrl, downloadName);
        }
        
        // 2. Download trigger karein
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
            className="p-0 md:p-0 text-white max-w-4xl mx-auto" // ⬅️ Max width
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
                {/* ⬇️ 'min-h' add ki gayi hai ⬇️ */}
                <div className="w-full h-full min-h-[300px] md:min-h-[500px] flex items-center justify-center bg-[#1a1834] rounded-lg overflow-hidden relative mb-6">
                    {imageSrc ? (
                        <img 
                            ref={imgRef} // ⬅️ ref add karein
                            crossOrigin="anonymous" // ⬅️ canvas ke liye zaroori
                            src={imageSrc} 
                            alt="Input" 
                            className="max-w-full max-h-full object-contain transition-transform duration-100 ease-linear"
                            style={{ transform: `rotate(${angle}deg)` }} 
                        />
                    ) : (
                        <div className="text-center p-10">
                            <UploadCloud size={64} className="text-gray-500 mx-auto" />
                            <p className="text-gray-400 mt-4">Upload an image to adjust the angle</p>
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