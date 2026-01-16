import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Wand2,
  UploadCloud,
  Download,
  Loader2,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import toast from 'react-hot-toast';

export const ML_SERVER = import.meta.env.VITE_ML_API || "http://127.0.0.1:5000";

function GradientButton({
  text,
  isBlue = false,
  isOutline = false,
  className = "",
  onClick,
  disabled,
  icon: Icon,
}) {
  const blueGradient =
    "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500";
  const purpleGradient =
    "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700";
  const outline =
    "bg-transparent border-2 border-purple-400 text-purple-300 hover:bg-purple-900/50";
  const buttonClasses = isOutline
    ? outline
    : isBlue
      ? blueGradient
      : purpleGradient;
  const defaultClasses =
    "w-full md:w-auto px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform flex items-center justify-center gap-2";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`${defaultClasses} ${buttonClasses} ${className} ${disabledClasses}`}
    >
      {Icon && <Icon size={20} className={disabled && Icon === Loader2 ? "animate-spin" : ""} />}
      {text}
    </motion.button>
  );
}

export default function MagicBrushWorkspace({ setPage, onImageDownloaded }) {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImageURL, setProcessedImageURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("image.png");
  const [fileObj, setFileObj] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    setFileName(file.name.split(".").slice(0, -1).join(".") + ".png");
    setProcessedImageURL(null);
    setFileObj(file);
    const reader = new FileReader();
    reader.onload = (e) => setOriginalImage(e.target.result);
    reader.readAsDataURL(file);
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
    if (file) processFile(file);
  };

  const handleRemoveBackground = async () => {
    if (!fileObj) {
      toast.error("Please upload an image first.");
      return;
    }
    setIsLoading(true);
    setProcessedImageURL(null);
    const toastId = toast.loading('Removing background...');

    try {
      const formData = new FormData();
      formData.append("image", fileObj);
      formData.append("_id", "anurag");

      const res = await fetch(`${ML_SERVER}/remove-bg`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      if (data.status === "success" && data.output_url) {
        const outputUrl = `${ML_SERVER}${data.output_url}`;
        setProcessedImageURL(outputUrl);
        toast.success('Background removed!', { id: toastId });
      } else {
        throw new Error("Failed to process image");
      }
    } catch (err) {
      
      toast.error("Background removal failed. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!processedImageURL) {
      toast.error("No image to download.");
      return;
    }

    const downloadName = `removed_bg_${fileName}`;
    const toastId = toast.loading('Preparing download...');
    try {
      const response = await fetch(processedImageURL, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);

      if (onImageDownloaded) {
        onImageDownloaded(processedImageURL, downloadName);
      }

      toast.success("Image downloaded successfully!", { id: toastId });
    } catch (error) {
      
      toast.error("Download failed. Please try again.", { id: toastId });
    }
  };

  return (
    <motion.div
      key="magic-brush-workspace"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-0 md:p-0 text-white max-w-5xl mx-auto"
    >
      <div className="flex items-center gap-4 text-gray-400 mb-6">
        <button
          onClick={() => setPage("tools")}
          className="flex items-center gap-2 hover:text-white"
        >
          <ArrowLeft size={24} />{" "}
          <span className="text-xl font-medium">Tools</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center mb-10">
        <div className="bg-[#1f1f3d] p-4 rounded-full border border-purple-500 shadow-xl">
          <Wand2 size={48} className="text-purple-400" />
        </div>
        <h2 className="text-4xl font-bold mt-4">Magic Background Remover</h2>
      </div>

      <div className="bg-[#1f1f3d]/50 p-4 md:p-6 flex flex-col items-center border-2 border-indigo-400/30 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col bg-[#1a1834] rounded-lg p-4 border-2 transition-all ${isDragging ? "border-blue-400 bg-blue-950/30" : "border-transparent"
              }`}
          >
            <h3 className="text-lg font-semibold text-gray-400 mb-2 text-center">
              Original
            </h3>
            <div className="w-full h-full min-h-[300px] md:min-h-[400px] flex items-center justify-center overflow-hidden rounded-md">
              {originalImage ? (
                <img
                  src={originalImage}
                  alt="Original Input"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-500 p-4">
                  <ImageIcon size={64} className="mx-auto mb-3" />
                  <p className="text-gray-400 mb-2">Drag & Drop image here</p>
                  <p>or</p>
                  <label
                    htmlFor="magic-upload"
                    className="cursor-pointer text-blue-400 hover:underline"
                  >
                    Click to browse
                  </label>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              id="magic-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="flex flex-col bg-[#1a1834] rounded-lg p-4 relative">
            <h3 className="text-lg font-semibold text-gray-400 mb-2 text-center">
              Result
            </h3>
            <div className="w-full h-full min-h-[300px] md:min-h-[400px] flex items-center justify-center overflow-hidden rounded-md relative">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-10 rounded-md">
                  <Loader2
                    size={48}
                    className="text-purple-400 animate-spin"
                  />
                  <p className="ml-4 text-xl font-medium mt-4">
                    Removing background...
                  </p>
                </div>
              )}
              {processedImageURL ? (
                <img
                  src={processedImageURL}
                  alt="Processed Output"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                !isLoading && (
                  <div className="text-center text-gray-500 p-4">
                    <CheckCircle size={64} className="mx-auto" />
                    <p className="mt-2">Result will appear here</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 w-full mt-8">
          <GradientButton
            text={isLoading ? "Processing..." : "Remove Background"}
            onClick={handleRemoveBackground}
            isBlue
            disabled={!originalImage || isLoading}
            icon={isLoading ? Loader2 : Wand2}
          />

          <GradientButton
            text="Download Result"
            onClick={handleDownload}
            disabled={!processedImageURL || isLoading}
            icon={Download}
          CVs          />
        </div>
      </div>
    </motion.div>
  );
}