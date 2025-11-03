import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, Sun, Star, UploadCloud, Download, 
    Droplet, Palette, EyeOff, Minus, RotateCcw, Loader2 
} from 'lucide-react'; 
import GradientButton from '../components/GradientButton';


export default function AdjustmentsWorkspace({ setPage, onImageDownloaded }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [fileName, setFileName] = useState("image.png");
    const [brightnessValue, setBrightnessValue] = useState(100); 
    const [sharpnessValue, setSharpnessValue] = useState(50); 
    const [saturationValue, setSaturationValue] = useState(100); 
    const [hueValue, setHueValue] = useState(0); 
    const [sepiaValue, setSepiaValue] = useState(0); 
    const [grayscaleValue, setGrayscaleValue] = useState(0); 
    const [isDragging, setIsDragging] = useState(false);

    const imgRef = useRef(null); 
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
            alert("Please upload an image file (e.g., png, jpg).");
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

        
        const dataUrl = canvas.toDataURL('image/png');
        const downloadName = `enhanced_${fileName}`;
        
        
        if (onImageDownloaded) {
            onImageDownloaded(dataUrl, downloadName);
        }

        
        const link = document.createElement('a');
        link.download = downloadName;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <motion.div
            key="adjustments-workspace"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }} // ⬅️ Max width badha di hai
        >
            
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

            
            <div className="flex flex-col lg:flex-row gap-8">
                
                
                <div className="lg:w-2/3">
                    
                    <div className="sticky top-28"> 
                        
                        
                        <div 
                            className={`
                                w-full h-[65vh] flex items-center justify-center bg-[#1a1834] rounded-lg overflow-hidden relative 
                                transition-all duration-300
                                ${isDragging ? 'border-4 border-dashed border-purple-500 scale-[1.02]' : 'border-2 border-indigo-400/30'}
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
                                    className="max-w-full max-h-full object-contain pointer-events-none"
                                    
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
                                    <UploadCloud size={64} className={`mx-auto transition-colors ${isDragging ? 'text-purple-400' : 'text-gray-500'}`} />
                                    <p className={`text-gray-400 mt-4 transition-colors ${isDragging ? 'text-white' : 'text-gray-400'}`}>
                                        {isDragging ? "Drop your image here!" : "Drag & drop or upload an image"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                
                <div className="lg:w-1/3">
                   
                    <div className="bg-[#1f1f3d]/50 p-6 border-2 border-indigo-400/30 rounded-2xl">
                        
                        //sliders
                        <div className="lg:h-[65vh] overflow-y-auto pr-2 space-y-4"> 
                            
                           
                            <div className='p-2 border-b border-gray-700'>
                                <label className='block font-semibold mb-2 flex items-center gap-2' htmlFor="brightness-slider">
                                    <Sun size={20} className='text-yellow-400' /> Brightness: {brightnessValue}%
                                </label>
                                <input type="range" id="brightness-slider" min="0" max="200" value={brightnessValue}
                                    onChange={(e) => setBrightnessValue(parseInt(e.target.value))}
                                    disabled={!imageSrc} 
                                    className="w-full h-2 bg-gradient-to-r from-gray-900 via-gray-400 to-white rounded-lg appearance-none cursor-pointer" />
                            </div>

                            
                            <div className='p-2 border-b border-gray-700'>
                                <label className='block font-semibold mb-2 flex items-center gap-2' htmlFor="sharpness-slider">
                                    <Star size={20} className='text-blue-400' /> Contrast: {sharpnessValue}
                                </label>
                                <input type="range" id="sharpness-slider" min="0" max="100" value={sharpnessValue}
                                    onChange={(e) => setSharpnessValue(parseInt(e.target.value))}
                                    disabled={!imageSrc} 
                                    className="w-full h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            
                            
                            <div className='p-2 border-b border-gray-700'>
                                <label className='block font-semibold mb-2 flex items-center gap-2' htmlFor="saturation-slider">
                                    <Droplet size={20} className='text-pink-400' /> Saturation: {saturationValue}%
                                </label>
                                <input type="range" id="saturation-slider" min="0" max="300" value={saturationValue}
                                    onChange={(e) => setSaturationValue(parseInt(e.target.value))}
                                    disabled={!imageSrc} 
                                    className="w-full h-2 bg-gradient-to-r from-gray-500 via-pink-400 to-red-600 rounded-lg appearance-none cursor-pointer" />
                            </div>

                          
                            <div className='p-2 border-b border-gray-700'>
                                <label className='block font-semibold mb-2 flex items-center gap-2' htmlFor="hue-slider">
                                    <Palette size={20} className='text-green-400' /> Hue Rotation: {hueValue}°
                                </label>
                                <input type="range" id="hue-slider" min="0" max="360" value={hueValue}
                                    onChange={(e) => setHueValue(parseInt(e.target.value))}
                                    disabled={!imageSrc} 
                                    className="w-full h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg appearance-none cursor-pointer" />
                            </div>

                            
                            <div className='p-2 border-b border-gray-700'>
                                <label className='block font-semibold mb-2 flex items-center gap-2' htmlFor="sepia-slider">
                                    <EyeOff size={20} className='text-orange-400' /> Sepia: {sepiaValue}%
                                </label>
                                <input type="range" id="sepia-slider" min="0" max="100" value={sepiaValue}
                                    onChange={(e) => setSepiaValue(parseInt(e.target.value))}
                                    disabled={!imageSrc} 
                                    className="w-full h-2 bg-gradient-to-r from-white to-orange-800 rounded-lg appearance-none cursor-pointer" />
                            </div>

                            
                            <div className='p-2'>
                                <label className='block font-semibold mb-2 flex items-center gap-2' htmlFor="grayscale-slider">
                                    <Minus size={20} className='text-gray-400' /> Grayscale: {grayscaleValue}%
                                </label>
                                <input type="range" id="grayscale-slider" min="0" max="100" value={grayscaleValue}
                                    onChange={(e) => setGrayscaleValue(parseInt(e.target.value))}
                                    disabled={!imageSrc} // ⬅️ Disable if no image
                                    className="w-full h-2 bg-gradient-to-r from-gray-900 to-gray-400 rounded-lg appearance-none cursor-pointer" />
                            </div>

                        </div> 
                 
                        <div className="flex flex-col gap-4 w-full justify-center mt-8">
                            <input type="file" id="adjust-upload" onChange={handleImageUpload} accept="image/*" className="hidden" />
                            <label htmlFor="adjust-upload" className="w-full px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform cursor-pointer bg-transparent border-2 border-gray-400 text-gray-300 hover:bg-gray-700/50 flex items-center justify-center gap-2">
                                <UploadCloud size={20} /> {imageSrc ? "Change Image" : "Upload Image"}
                            </label>
                            
                            <div className="flex m-0 flex-col justify-center md:flex-row gap-4">
                                <GradientButton 
                                    text="Reset" 
                                    onClick={handleReset}
                                    isOutline 
                                    disabled={!imageSrc} 
                                    icon={RotateCcw} 
                                    className="w-full" 
                                />
                                <GradientButton 
                                    text="Download" 
                                    onClick={handleDownload}
                                    isBlue 
                                    disabled={!imageSrc} 
                                    icon={Download}
                                    className="w-full" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
