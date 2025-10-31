import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, Sun, Star, UploadCloud, Download, 
    Droplet, Palette, EyeOff, Minus, RotateCcw // 'RotateCcw' (Reset) icon add kiya
} from 'lucide-react'; 

// --- AUXILIARY COMPONENT (Reuse) ---
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

// =======================================================================
//  UNIFIED Adjustments Workspace (Naya 2-Column Design)
// =======================================================================
// ⬇️ STEP 1: 'onImageDownloaded' prop ko accept karein
export default function AdjustmentsWorkspace({ setPage, onImageDownloaded }) {
    const [imageSrc, setImageSrc] = useState(null); // Yeh dataUrl hoga
    const [fileName, setFileName] = useState("image.png");
    
    // States for all six adjustments
    const [brightnessValue, setBrightnessValue] = useState(100); 
    const [sharpnessValue, setSharpnessValue] = useState(50); // Mapped to Contrast
    const [saturationValue, setSaturationValue] = useState(100); 
    const [hueValue, setHueValue] = useState(0); 
    const [sepiaValue, setSepiaValue] = useState(0); 
    const [grayscaleValue, setGrayscaleValue] = useState(0); 

    const imgRef = useRef(null); 

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
    
    // Resets all slider values
    const handleReset = () => {
        setBrightnessValue(100);
        setSharpnessValue(50);
        setSaturationValue(100);
        setHueValue(0);
        setSepiaValue(0);
        setGrayscaleValue(0);
    };

    // ⬇️ STEP 3: 'handleDownload' function ko update karein (dataUrl use karne ke liye)
    const handleDownload = () => {
        const image = imgRef.current;
        if (!image || !imageSrc) {
            alert("Please upload an image first.");
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            alert("Canvas context error.");
            return;
        }

        // 1. Final CSS filter string
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

        // 4. Data URL banayein
        const dataUrl = canvas.toDataURL('image/png');
        const downloadName = `enhanced_${fileName}`;
        
        // 5. HomePage ko 'dataUrl' bhej dein (Storage ke liye)
        if (onImageDownloaded) {
            onImageDownloaded(dataUrl, downloadName);
        }

        // 6. User ke liye download trigger karein
        const link = document.createElement('a');
        link.download = downloadName;
        link.href = dataUrl;
        link.click();
    };


    return (
        <motion.div
            key="adjustments-workspace"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-0 md:p-0 text-white max-w-6xl mx-auto" // ⬅️ Max width badha di hai
        >
            {/* --- TOP BAR --- */}
            <div className="flex items-center gap-4 text-gray-400 mb-6">
                <button onClick={() => setPage('tools')} className="flex items-center gap-2 hover:text-white">
                    <ArrowLeft size={24} /> <span className="text-xl font-medium">Tools</span>
                </button>
            </div>
            
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="bg-[#1f1f3d] p-4 rounded-full border border-purple-500 shadow-xl">
                    <Sun size={48} className="text-purple-400" />
                </div>
                <h2 className="text-4xl font-bold mt-4">Image Enhancement</h2>
            </div>

            {/* ⬇️ --- NAYA 2-COLUMN LAYOUT --- ⬇️ */}
            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* --- COLUMN 1: IMAGE (STICKY) --- */}
                <div className="lg:w-2/3">
                    {/* Sticky container image ko top par rakhega */}
                    <div className="sticky top-28"> {/* ⬅️ 'top-28' aapke navbar ki height ke hisab se adjust karein */}
                        <div className="w-full h-[65vh] flex items-center justify-center bg-[#1a1834] rounded-lg overflow-hidden relative border-2 border-indigo-400/30">
                            {imageSrc ? (
                                <img 
                                    ref={imgRef}
                                    crossOrigin="anonymous" // Canvas ke liye zaroori
                                    src={imageSrc} 
                                    alt="Input" 
                                    className="max-w-full max-h-full object-contain"
                                    // Visual filter preview
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
                                <div className="text-center p-10">
                                    <UploadCloud size={64} className="text-gray-500 mx-auto" />
                                    <p className="text-gray-400 mt-4">Upload an image to start adjusting.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- COLUMN 2: SLIDERS (SCROLLABLE) --- */}
                <div className="lg:w-1/3">
                    {/* Control Panel */}
                    <div className="bg-[#1f1f3d]/50 p-6 border-2 border-indigo-400/30 rounded-2xl">
                        
                        {/* ⬇️ Sliders ke liye scrollable container ⬇️ */}
                        <div className="lg:h-[65vh] overflow-y-auto pr-2 space-y-4"> 
                            
                            {/* 1. BRIGHTNESS SLIDER */}
                            <div className='p-2 border-b border-gray-700'>
                                <label className='block font-semibold mb-2 flex items-center gap-2' htmlFor="brightness-slider">
                                    <Sun size={20} className='text-yellow-400' /> Brightness: {brightnessValue}%
                                </label>
                                <input type="range" id="brightness-slider" min="0" max="200" value={brightnessValue}
                                    onChange={(e) => setBrightnessValue(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gradient-to-r from-gray-900 via-gray-400 to-white rounded-lg appearance-none cursor-pointer" />
                            </div>

                            {/* 2. SHARPNESS (CONTRAST) SLIDER */}
                            <div className='p-2 border-b border-gray-700'>
                                <label className='block font-semibold mb-2 flex items-center gap-2' htmlFor="sharpness-slider">
                                    <Star size={20} className='text-blue-400' /> Contrast: {sharpnessValue}
                                </label>
                                <input type="range" id="sharpness-slider" min="0" max="100" value={sharpnessValue}
                                    onChange={(e) => setSharpnessValue(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            
                            {/* 3. SATURATION SLIDER */}
                            <div className='p-2 border-b border-gray-700'>
                                <label className='block font-semibold mb-2 flex items-center gap-2' htmlFor="saturation-slider">
                                    <Droplet size={20} className='text-pink-400' /> Saturation: {saturationValue}%
                                </label>
                                <input type="range" id="saturation-slider" min="0" max="300" value={saturationValue}
                                    onChange={(e) => setSaturationValue(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gradient-to-r from-gray-500 via-pink-400 to-red-600 rounded-lg appearance-none cursor-pointer" />
                            </div>

                            {/* 4. HUE SLIDER */}
                            <div className='p-2 border-b border-gray-700'>
                                <label className='block font-semibold mb-2 flex items-center gap-2' htmlFor="hue-slider">
                                    <Palette size={20} className='text-green-400' /> Hue Rotation: {hueValue}°
                                </label>
                                <input type="range" id="hue-slider" min="0" max="360" value={hueValue}
                                    onChange={(e) => setHueValue(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg appearance-none cursor-pointer" />
                            </div>

                            {/* 5. SEPIA SLIDER */}
                            <div className='p-2 border-b border-gray-700'>
                                <label className='block font-semibold mb-2 flex items-center gap-2' htmlFor="sepia-slider">
                                    <EyeOff size={20} className='text-orange-400' /> Sepia: {sepiaValue}%
                                </label>
                                <input type="range" id="sepia-slider" min="0" max="100" value={sepiaValue}
                                    onChange={(e) => setSepiaValue(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gradient-to-r from-white to-orange-800 rounded-lg appearance-none cursor-pointer" />
                            </div>

                            {/* 6. GRAYSCALE SLIDER */}
                            <div className='p-2'>
                                <label className='block font-semibold mb-2 flex items-center gap-2' htmlFor="grayscale-slider">
                                    <Minus size={20} className='text-gray-400' /> Grayscale: {grayscaleValue}%
                                </label>
                                <input type="range" id="grayscale-slider" min="0" max="100" value={grayscaleValue}
                                    onChange={(e) => setGrayscaleValue(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gradient-to-r from-gray-900 to-gray-400 rounded-lg appearance-none cursor-pointer" />
                            </div>

                        </div> 
                        {/* --- Scrollable div ends --- */}

                        {/* --- BUTTONS (scroll div ke bahar) --- */}
                        <div className="flex flex-col gap-4 w-full justify-center mt-8">
                            <input type="file" id="adjust-upload" onChange={handleImageUpload} accept="image/*" className="hidden" />
                            <label htmlFor="adjust-upload" className="w-full px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform cursor-pointer bg-transparent border-2 border-gray-400 text-gray-300 hover:bg-gray-700/50 flex items-center justify-center gap-2">
                                <UploadCloud size={20} /> Upload Image
                            </label>
                            
                            <div className="flex m-0 flex-col justify-center md:flex-row gap-4">
                                <GradientButton 
                                    text="Reset" 
                                    onClick={handleReset}
                                    isOutline 
                                    disabled={!imageSrc} 
                                    icon={RotateCcw} // ⬅️ Naya icon
                                    className="w-full" // ⬅️ Aadhi width
                                />
                                <GradientButton 
                                    text="Download" 
                                    onClick={handleDownload}
                                    isBlue 
                                    disabled={!imageSrc} 
                                    icon={Download}
                                    className="w-full" // ⬅️ Aadhi width
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}