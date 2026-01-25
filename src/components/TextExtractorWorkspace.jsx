import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import { 
  ArrowLeft, FileText, UploadCloud, Download, 
  Loader2, Camera, Copy, Check 
} from "lucide-react";
import toast from 'react-hot-toast';
import BubblesBackground from './BubblesBackground'; // ✅ Import Background

export const ML_SERVER = import.meta.env.VITE_ML_API || "http://127.0.0.1:5000";

// --- Reusable Button Component ---
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
  
  const buttonClasses = isOutline
    ? outline
    : isBlue
      ? blueGradient
      : purpleGradient;

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

export default function TextExtractorWorkspace() {
  const navigate = useNavigate();
  
  const [originalImage, setOriginalImage] = useState(null);
  const [processedText, setProcessedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("image.png");
  const [isDragging, setIsDragging] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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

  const processFile = (file) => {
    if (!file) return;
    if (file.type.startsWith("image/")) {
      setFileName(file.name);
      setProcessedText("");
      const reader = new FileReader();
      reader.onload = (e) => setOriginalImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload an image file (e.g., png, jpg).");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    processFile(file);
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files && e.target.files[0];
    processFile(file);
  };

  const handleProcessImage = async () => {
    if (!originalImage) {
      toast.error("Please upload or capture an image first.");
      return;
    }

    const toastId = toast.loading('Extracting text...');
    try {
      setIsLoading(true);
      setProcessedText("");
      setIsCopied(false);

      const blob = await (await fetch(originalImage)).blob();
      const formData = new FormData();
      formData.append("image", blob, fileName);
      formData.append("_id", "anurag"); 

      const response = await fetch(`${ML_SERVER}/extract-text`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to extract text.");

      const data = await response.json();

      if (data.status === "success") {
        setProcessedText(data.extracted_text || "No text detected.");
        toast.success('Text extracted!', { id: toastId });
      } else {
        toast.error("Text extraction failed.", { id: toastId });
      }
    } catch (error) {
      toast.error("Error connecting to OCR API.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!processedText) return;
    const blob = new Blob([processedText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `extracted_${fileName.split('.')[0]}.txt`;
    link.click();
    toast.success("Text downloaded!");
  };

  const handleCopy = () => {
    if (!processedText) return;
    navigator.clipboard.writeText(processedText);
    setIsCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    // ✅ 1. Outer Wrapper with bg-black and overflow-hidden
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      
      {/* ✅ 2. Background Layer */}
      <BubblesBackground />

      {/* ✅ 3. Content Layer (z-10) */}
      <motion.div
        key="text-extractor-workspace"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 p-6 md:p-12 max-w-5xl mx-auto"
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
            <FileText size={40} className="text-purple-400" />
          </div>
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-gray-400">
            Text Extractor
          </h2>
          <p className="text-gray-400 mt-2">Optical Character Recognition (OCR)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Col: Upload & Preview */}
          <div className="flex flex-col gap-6">
            <div
              className={`w-full aspect-[4/3] flex items-center justify-center rounded-2xl overflow-hidden relative transition-all duration-300 backdrop-blur-md
                ${isDragging ? "border-2 border-dashed border-purple-500 bg-purple-900/20" : "bg-[#1a1834]/60 border border-white/10 hover:border-purple-500/30"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {originalImage ? (
                <img
                  src={originalImage}
                  alt="Uploaded"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="text-center p-8 pointer-events-none">
                  <UploadCloud
                    size={48}
                    className={`mx-auto mb-4 transition-colors ${isDragging ? "text-purple-400" : "text-gray-600"}`}
                  />
                  <p className="text-gray-400 font-medium">
                    {isDragging ? "Drop it here!" : "Drag & drop an image"}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">or use the buttons below</p>
                </div>
              )}

              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-10">
                  <Loader2 size={48} className="text-purple-400 animate-spin mb-3" />
                  <p className="text-white font-medium animate-pulse">Scanning text...</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <input
                type="file"
                id="extractor-upload"
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <label htmlFor="extractor-upload" className="flex-1">
                <GradientButton 
                  text="Upload" 
                  isOutline 
                  icon={UploadCloud} 
                  className="w-full cursor-pointer" 
                  onClick={() => {}} 
                />
              </label>

              <input
                type="file"
                id="camera-input"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />
              <label htmlFor="camera-input" className="flex-1">
                <GradientButton 
                  text="Camera" 
                  isOutline 
                  icon={Camera} 
                  className="w-full cursor-pointer"
                  onClick={() => {}}
                />
              </label>
            </div>
            
            <GradientButton
              text={isLoading ? "Processing..." : "Extract Text"}
              onClick={handleProcessImage}
              isBlue
              disabled={!originalImage || isLoading}
              icon={isLoading ? Loader2 : FileText}
              className="w-full py-4 text-lg"
            />
          </div>

          {/* Right Col: Result */}
          <div className="flex flex-col h-full min-h-[400px]">
            <div className="bg-[#1a1834]/60 backdrop-blur-md border border-white/10 rounded-2xl flex-1 flex flex-col overflow-hidden relative">
              <div className="bg-[#1f1f3d]/80 px-4 py-3 border-b border-white/5 flex justify-between items-center">
                <span className="text-gray-400 font-medium text-sm">Extraction Result</span>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    disabled={!processedText}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Copy to Clipboard"
                  >
                    {isCopied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={!processedText}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Download .txt"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>

              <div className="p-4 flex-1 overflow-auto custom-scrollbar">
                {processedText ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-pre-wrap text-gray-300 leading-relaxed font-mono text-sm"
                  >
                    {processedText}
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                    <FileText size={48} className="mb-2" />
                    <p>No text extracted yet</p>
                  </div>
                )}
              </div>
              
              {!processedText && !isLoading && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1834]/50 pointer-events-none" />
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}