import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, UploadCloud, Loader2, Download, Camera, X, CheckCircle, Image as ImageIcon 
} from 'lucide-react';
import toast from 'react-hot-toast';

// ✅ Import Layout Component
import BubblesBackground from './BubblesBackground'; 

export const ML_SERVER = import.meta.env.VITE_ML_API || "http://127.0.0.1:5000";

// --- Helper: Convert Blob to Base64 (Crucial for LocalStorage/DownloadsView) ---
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

// --- Camera Component ---
function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const openCamera = async () => {
    try {
      setIsOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraReady(true);
      }
    } catch (err) {
      toast.error("Unable to access camera. Please check permissions.");
      setIsOpen(false);
    }
  };

  const closeCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(t => t.stop());
    }
    setIsOpen(false);
    setIsCameraReady(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    closeCamera();
    onCapture(dataUrl);
  };

  return (
    <>
      <GradientButton 
        text="Camera" 
        isOutline 
        icon={Camera} 
        onClick={openCamera}
        className="w-full" 
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <div className="bg-[#1f1f3d] p-6 rounded-2xl shadow-2xl border border-white/10 flex flex-col items-center max-w-lg w-full m-4">
              <h3 className="text-xl font-bold text-white mb-4">Capture Image</h3>
              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-purple-500/50 mb-6">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="flex gap-4 w-full">
                <button
                  onClick={closeCamera}
                  className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={captureImage}
                  disabled={!isCameraReady}
                  className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  <Camera size={18} /> Capture
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function FindObjectWorkspace({ onImageDownloaded }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImageURL, setProcessedImageURL] = useState(null);
  const [detections, setDetections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("image.png");
  const [isDragging, setIsDragging] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // --- File Handlers ---
  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name || 'image.png');
      setProcessedImageURL(null);
      setDetections([]);
      setSearchAttempted(false);
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast.error("Please upload an image file (e.g., png, jpg).");
    }
  };

  // ✅ Fixed Upload Trigger using useRef
  const triggerFileUpload = () => {
    if(fileInputRef.current) {
        fileInputRef.current.click();
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

  // --- API Handler ---
  const handleFind = async () => {
    if (!originalImage) {
      toast.error("Please upload or capture an image first.");
      return;
    }

    setIsLoading(true);
    setSearchAttempted(true);
    setProcessedImageURL(null);
    setDetections([]);
    const toastId = toast.loading('Scanning image for objects...');

    try {
      const blob = await (await fetch(originalImage)).blob();
      const formData = new FormData();
      formData.append('image', blob, fileName);
      formData.append('_id', 'anurag'); // Placeholder ID

      const resp = await fetch(`${ML_SERVER}/detect`, {
        method: 'POST',
        body: formData,
      });

      const data = await resp.json();

      if (!resp.ok || data.error) {
        throw new Error(data.error || `Server returned status ${resp.status}`);
      }

      const apiDetections = Array.isArray(data.detections) ? data.detections : [];
      setDetections(apiDetections);

      if (apiDetections.length > 0) {
        let outputUrl = data.output_url || null;
        if (outputUrl) {
           setProcessedImageURL(outputUrl.startsWith('http') ? outputUrl : `${ML_SERVER}${outputUrl}`);
        }
        toast.success(`Found ${apiDetections.length} objects!`, { id: toastId });
      } else {
        toast.success('No specific objects found.', { id: toastId });
      }
    } catch (err) {
      toast.error(`Detection failed. Check server.`, { id: toastId });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Download Handler (Fixed for DownloadsView) ---
  const handleDownload = async () => {
    if (!processedImageURL) {
      toast.error('No result to download.');
      return;
    }

    const toastId = toast.loading('Processing download...');
    try {
      const resp = await fetch(processedImageURL);
      const blob = await resp.blob();
      
      // ✅ Convert to Base64 so it saves correctly in localForage/LocalStorage
      const base64Data = await blobToBase64(blob);
      const downloadName = `detected_${fileName}`;

      // Trigger Browser Download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // ✅ Save to App History using the prop function
      if (onImageDownloaded) {
        onImageDownloaded(base64Data, downloadName);
      }

      toast.success('Saved to Downloads!', { id: toastId });
    } catch (err) {
      toast.error('Download failed.', { id: toastId });
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white">
      {/* Background */}
      <BubblesBackground />
      
      <motion.div
        key="find-object-workspace"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto h-screen flex flex-col"
      >
        {/* Back Button */}
        <div className="flex-shrink-0 mb-6">
            <button 
            onClick={() => navigate('/tools')} 
            className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full 
                        bg-[#1a1a2e]/80 backdrop-blur-md border border-white/10 
                        shadow-md hover:border-purple-500/50
                        transition-all duration-300 active:scale-95 w-fit"
            >
            <ArrowLeft size={16} className="text-gray-300 group-hover:text-white transition-colors" />
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                Back to Tools
            </span>
            </button>
        </div>

        {/* Header */}
        <div className="flex-shrink-0 text-center mb-8">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-purple-200">
            Object Detection
          </h2>
          <p className="text-gray-400 mt-2">Identify items with AI precision</p>
        </div>

        {/* --- Main Workspace (Grid Layout) --- */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
            
            {/* Left: Canvas Area (Takes up 2 cols) */}
            <div className="lg:col-span-2 bg-[#1f1f3d]/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col relative overflow-hidden shadow-2xl">
                
                <div
                    className={`
                    flex-1 flex items-center justify-center bg-[#1a1834]/60 rounded-2xl overflow-hidden relative
                    transition-all duration-300 border-2 border-dashed
                    ${isDragging ? 'border-purple-500 bg-purple-900/20' : 'border-white/5'}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {originalImage ? (
                    <img
                        src={processedImageURL || originalImage}
                        alt="Workspace"
                        className="max-w-full max-h-full object-contain shadow-lg"
                    />
                    ) : (
                    <div className="text-center p-10 pointer-events-none">
                        <div className="bg-black/30 p-4 rounded-full inline-block mb-4">
                            <UploadCloud size={40} className={`transition-colors ${isDragging ? 'text-purple-400' : 'text-gray-500'}`} />
                        </div>
                        <p className={`text-lg font-medium transition-colors ${isDragging ? 'text-white' : 'text-gray-400'}`}>
                        {isDragging ? "Drop image now" : "Drag & drop an image here"}
                        </p>
                    </div>
                    )}

                    {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
                        <Loader2 size={56} className="text-purple-500 animate-spin mb-4" />
                        <p className="text-white font-medium text-lg animate-pulse">Scanning Image...</p>
                    </div>
                    )}
                </div>
            </div>

            {/* Right: Controls & Results (Takes up 1 col) */}
            <div className="bg-[#1f1f3d]/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl overflow-y-auto">
                
                {/* Controls */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Actions</h3>
                    
                    {/* Hidden Input */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                    />

                    <GradientButton 
                        text={originalImage ? "Replace Image" : "Upload Image"} 
                        isOutline 
                        icon={UploadCloud} 
                        className="w-full" 
                        onClick={triggerFileUpload} 
                    />

                    <CameraCapture onCapture={(imgData) => {
                        setOriginalImage(imgData);
                        setProcessedImageURL(null);
                        setDetections([]);
                        setSearchAttempted(false);
                        setFileName('capture.png');
                    }} />

                    <GradientButton
                        text="Detect Objects"
                        onClick={handleFind}
                        isBlue
                        disabled={!originalImage || isLoading}
                        icon={Search}
                        className="w-full"
                    />

                    <GradientButton
                        text="Download Result"
                        onClick={handleDownload}
                        disabled={!processedImageURL || isLoading}
                        icon={Download}
                        className="w-full"
                    />
                </div>

                {/* Results List */}
                <div className="flex-1 min-h-0 flex flex-col">
                    <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-4">Results</h3>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {detections.length > 0 ? (
                            <div className="space-y-2">
                                {detections.map((d, idx) => {
                                    const cls = d.class || d.label || 'Object';
                                    const conf = typeof d.confidence === 'number' ? Math.round(d.confidence * 100) : 'N/A';
                                    return (
                                        <motion.div 
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="bg-black/30 p-3 rounded-xl border border-white/5 flex justify-between items-center"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                                                <span className="font-medium text-gray-200 capitalize">{cls}</span>
                                            </div>
                                            <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/20">
                                                {conf}%
                                            </span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8 bg-black/20 rounded-xl border border-dashed border-gray-700">
                                {searchAttempted ? (
                                    <>
                                        <Search size={24} className="mx-auto mb-2 opacity-50" />
                                        <p>No objects detected.</p>
                                    </>
                                ) : (
                                    <p>Run detection to see results here.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>

      </motion.div>
    </div>
  );
}