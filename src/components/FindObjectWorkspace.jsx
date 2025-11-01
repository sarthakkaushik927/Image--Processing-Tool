import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, UploadCloud, Loader2, Download } from 'lucide-react';

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

export default function FindObjectWorkspace({ setPage, onImageDownloaded }) {
    const [originalImage, setOriginalImage] = useState(null);
    const [processedImageURL, setProcessedImageURL] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState("image.png");
    const [detections, setDetections] = useState([]);

    const handleImageUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setFileName(file.name);
            setProcessedImageURL(null);
            const reader = new FileReader();
            reader.onload = (e) => setOriginalImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleFind = async () => {
        if (!originalImage) {
            alert("Please upload an image first.");
            return;
        }

        const _id = sessionStorage.getItem("_id") || "anurag11"; // fallback
        setIsLoading(true);
        setProcessedImageURL(null);
        setDetections([]);

        try {
            const formData = new FormData();
            const file = document.querySelector("#find-upload").files[0];
            formData.append("image", file);
            formData.append("_id", _id);

            const res = await fetch(`${import.meta.env.VITE_ML_API}/detect`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.status === "success") {
                const fullURL = `${import.meta.env.VITE_ML_API}${data.output_url}`;
                setProcessedImageURL(fullURL);
                setDetections(data.object_types || []);
            } else {
                alert(data.error || "Detection failed.");
            }
        } catch (err) {
            console.error("Detection error:", err);
            alert("An error occurred while detecting objects.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!processedImageURL) return;
        const downloadName = `find_object_${fileName}`;

        if (onImageDownloaded) {
            onImageDownloaded(processedImageURL, downloadName);
        }

        const link = document.createElement("a");
        link.href = processedImageURL;
        link.download = downloadName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div
            key="find-object-workspace"
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
                    <Search size={48} className="text-purple-400" />
                </div>
                <h2 className="text-4xl font-bold mt-4">Find Object</h2>
            </div>

            <div className="bg-[#1f1f3d]/50 p-6 flex flex-col items-center border-2 border-indigo-400/30 rounded-2xl">
                <div className="w-full h-full min-h-[300px] md:min-h-[500px] flex items-center justify-center bg-[#1a1834] rounded-lg overflow-hidden relative mb-6">
                    {originalImage ? (
                        <img
                            src={processedImageURL || originalImage}
                            alt="Input"
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/600x400/1f2937/9ca3af?text=Image+Load+Error';
                            }}
                        />
                    ) : (
                        <div className="text-center p-10">
                            <UploadCloud size={64} className="text-gray-500 mx-auto" />
                            <p className="text-gray-400 mt-4">Upload an image to detect objects</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-10 rounded-md">
                            <Loader2 size={48} className="text-purple-400 animate-spin" />
                            <p className="ml-4 text-xl font-medium mt-4">Finding objects...</p>
                        </div>
                    )}
                </div>

                <input type="file" id="find-upload" onChange={handleImageUpload} accept="image/*" className="hidden" />

                <div className="flex flex-wrap justify-center gap-4 w-full">
                    <label htmlFor="find-upload" className="w-full md:w-auto px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform cursor-pointer bg-transparent border-2 border-gray-400 text-gray-300 hover:bg-gray-700/50 flex items-center justify-center gap-2">
                        <UploadCloud size={20} /> {originalImage ? "Change Image" : "Upload Image"}
                    </label>

                    <GradientButton
                        text={isLoading ? "Finding..." : "Find Objects"}
                        onClick={handleFind}
                        isBlue
                        disabled={!originalImage || isLoading}
                        icon={isLoading ? Loader2 : Search}
                    />

                    <GradientButton
                        text="Download Result"
                        onClick={handleDownload}
                        disabled={!processedImageURL || isLoading}
                        icon={Download}
                    />
                </div>

                {detections.length > 0 && (
                    <p className="mt-4 text-green-400 text-sm">
                        Detected: {detections.join(', ')}
                    </p>
                )}
            </div>
        </motion.div>
    );
}
