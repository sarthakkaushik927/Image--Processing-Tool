import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Repeat, UploadCloud, Download, Loader2 } from 'lucide-react';

// Map output file extensions to their MIME types
const FORMATS = {
    'png': { mime: 'image/png', label: 'PNG (Lossless)' },
    'jpg': { mime: 'image/jpeg', label: 'JPEG (Lossy)' },
    'webp': { mime: 'image/webp', label: 'WebP (Modern)' },
    'bmp': { mime: 'image/bmp', label: 'BMP (Legacy)' },
    'gif': { mime: 'image/gif', label: 'GIF (Animated/Legacy)' }, // ⬅️ NEW FORMAT
    'tiff': { mime: 'image/tiff', label: 'TIFF (High Quality)' }  // ⬅️ NEW FORMAT
};

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
//  Unified Format Converter Workspace
// =======================================================================
export default function FormatConverterWorkspace({ setPage }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [originalFileName, setOriginalFileName] = useState("");
    const [outputFormat, setOutputFormat] = useState('png'); // Default output
    const [isConverting, setIsConverting] = useState(false);
    
    const imgUrlRef = useRef(null); 

    const handleImageUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            imgUrlRef.current = url; 
            setImageSrc(url);
            setOriginalFileName(file.name);
            // Default to PNG if input is JPG, otherwise default to JPG
            if (file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) {
                setOutputFormat('png');
            } else {
                setOutputFormat('jpg');
            }
        }
    };

    const handleConversion = () => {
        const currentUrl = imgUrlRef.current;
        if (!currentUrl || !outputFormat) return;

        setIsConverting(true);
        
        const img = new Image();
        img.crossOrigin = "anonymous"; 
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                alert("Conversion failed: Canvas context error.");
                setIsConverting(false);
                return;
            }

            try {
                // Draw the image
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            } catch (error) {
                console.error("Error drawing image to canvas:", error);
                alert("Could not draw image to canvas. Check browser console.");
                setIsConverting(false);
                return;
            }

            // Get MIME type and extension
            const formatInfo = FORMATS[outputFormat];
            const mimeType = formatInfo.mime;
            
            // Quality is important only for lossy formats (JPEG/WebP)
            const quality = (outputFormat === 'jpg' || outputFormat === 'webp') ? 0.9 : undefined; 

            // Convert canvas data to Blob
            canvas.toBlob((blob) => {
                if (!blob) {
                    alert(`Conversion failed: Could not create ${outputFormat.toUpperCase()} data. Ensure the browser supports this format for conversion.`);
                    setIsConverting(false);
                    return;
                }
                
                const url = URL.createObjectURL(blob);
                
                // 1. Determine new filename
                const baseName = originalFileName.replace(/\.[^/.]+$/, "");
                const newFileName = `${baseName}.${outputFormat}`;

                // 2. Trigger Download
                const link = document.createElement('a');
                link.download = newFileName;
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // 3. Schedule cleanup and state update
                setTimeout(() => {
                    URL.revokeObjectURL(currentUrl);
                    URL.revokeObjectURL(url);
                    setImageSrc(null);
                    imgUrlRef.current = null;
                    setIsConverting(false);
                }, 50); 

            }, mimeType, quality);
        };
        // Use a slight delay to ensure React state updates are processed
        setTimeout(() => {
            img.src = currentUrl; 
        }, 0); 
    };

    return (
        <motion.div
            key="format-converter-workspace"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-0 md:p-0 text-white max-w-2xl mx-auto"
        >
            <div className="flex items-center gap-4 text-gray-400 mb-6">
                <button onClick={() => setPage('tools')} className="flex items-center gap-2 hover:text-white">
                    <ArrowLeft size={24} /> <span className="text-xl font-medium">Tools</span>
                </button>
            </div>
            
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="bg-[#1f1f3d] p-4 rounded-full border border-purple-500 shadow-xl">
                    <Repeat size={48} className="text-purple-400" />
                </div>
                <h2 className="text-4xl font-bold mt-4">Universal Converter</h2>
            </div>

            <div className="bg-[#1f1f3d]/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 flex flex-col items-center border-2 border-indigo-400/30">
                
                <div className="w-full h-64 flex items-center justify-center bg-[#1a1834] rounded-lg overflow-hidden relative mb-6">
                    {imageSrc ? (
                        <img src={imageSrc} alt="Input Image" className="max-w-full max-h-full object-contain" />
                    ) : (
                        <p className="text-gray-400">Upload any image to convert</p>
                    )}
                </div>

                <div className='w-full space-y-4'>
                    <input type="file" id="converter-upload" onChange={handleImageUpload} accept="image/*" className="hidden" />
                    
                    <label 
                        htmlFor="converter-upload" 
                        className="w-full md:w-auto px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform cursor-pointer bg-transparent border-2 border-gray-400 text-gray-300 hover:bg-gray-700/50 flex items-center justify-center gap-2"
                    >
                        <UploadCloud size={20} /> Select File (Any Format)
                    </label>

                    {/* Output Format Dropdown */}
                    <div className='flex items-center gap-4'>
                        <span className='text-gray-400 font-medium'>Convert To:</span>
                        <select
                            value={outputFormat}
                            onChange={(e) => setOutputFormat(e.target.value)}
                            className='flex-1 p-3 rounded-lg bg-[#2a2a4a] border border-purple-600 text-white'
                            disabled={isConverting || !imageSrc}
                        >
                            {Object.entries(FORMATS).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {value.label} (. {key.toUpperCase()})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <GradientButton 
                        text={isConverting ? "Converting..." : "Convert & Download"}
                        onClick={handleConversion} 
                        isBlue
                        disabled={!imageSrc || isConverting}
                        icon={isConverting ? Loader2 : Download}
                    />
                </div>
            </div>
        </motion.div>
    );
}
