import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, UploadCloud, Download, FileType, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function UploadPlaceholder({ onImageUpload }) {
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-96 bg-[#1f1f3d]/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-700
               flex flex-col items-center justify-center text-gray-400 cursor-pointer
               hover:border-purple-500 hover:bg-[#1f1f3d] transition-colors"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleFileClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <UploadCloud size={64} className="mb-4 text-purple-400" />
      <h3 className="text-2xl font-semibold text-white">Click or drag file to upload</h3>
      <p className="text-lg">Supports: PNG, JPG, WEBP</p>
    </motion.div>
  );
}

function FormatSelector({ selectedFormat, onFormatChange }) {
  const formats = [
    { id: 'png', name: 'PNG', mime: 'image/png' },
    { id: 'jpeg', name: 'JPEG', mime: 'image/jpeg' },
    { id: 'webp', name: 'WEBP', mime: 'image/webp' },
  ];

  return (
    <div className="flex justify-center gap-4">
      {formats.map((format) => (
        <motion.button
          key={format.id}
          onClick={() => onFormatChange(format)}
          className={`relative px-8 py-3 rounded-lg font-semibold transition-all
                     ${selectedFormat.id === format.id
            ? 'bg-purple-600 text-white shadow-lg'
            : 'bg-[#2a2a4a]/70 text-gray-300 hover:bg-purple-900/50'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {selectedFormat.id === format.id && (
            <motion.div
              layoutId="check-bubble"
              className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-[#1c1c3a]"
            >
              <CheckCircle size={16} className="text-white" />
            </motion.div>
          )}
          {format.name}
        </motion.button>
      ))}
    </div>
  );
}

export default function FormatConverterWorkspace({ setPage, onImageDownloaded }) {
  const [originalImage, setOriginalImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [targetFormat, setTargetFormat] = useState({ id: 'png', name: 'PNG', mime: 'image/png' });
  const [isConverting, setIsConverting] = useState(false);
  const canvasRef = useRef(null);

  const handleImageUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error("Invalid file type. Please upload an image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target.result);
    };
    reader.readAsDataURL(file);
    setImageName(file.name.split('.').slice(0, -1).join('.'));
  };

  const handleConvertAndDownload = () => {
    if (!originalImage || !canvasRef.current) return;

    setIsConverting(true);
    const toastId = toast.loading('Converting image...');

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL(targetFormat.mime, 0.95);

      const newFileName = `${imageName}.${targetFormat.id}`;

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = newFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (onImageDownloaded) {
        onImageDownloaded(dataUrl, newFileName);
      }

      setIsConverting(false);
      toast.success('Conversion successful!', { id: toastId });
      setPage('downloads');
    };
    img.onerror = () => {
      setIsConverting(false);
      toast.error('Failed to load image for conversion.', { id: toastId });
    }
    img.src = originalImage;
  };

  return (
    <motion.div
      key="format-converter"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-0 md:p-0 text-white max-w-4xl mx-auto"
    >
      <button onClick={() => setPage('tools')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={18} /> Back to Tools
      </button>

      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold">Image Format Converter</h2>
        <p className="text-lg text-gray-400 mt-2">Convert your images to PNG, JPEG, or WEBP.</p>
      </div>

      <canvas ref={canvasRef} className="hidden"></canvas>

      {!originalImage ? (
        <UploadPlaceholder onImageUpload={handleImageUpload} />
      ) : (
        <div className="flex flex-col items-center gap-10">
          <motion.img
            src={originalImage}
            alt="Uploaded preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-full max-h-[400px] rounded-lg shadow-xl object-contain"
          />

          <div className="w-full p-6 bg-[#1f1f3d]/50 rounded-lg flex flex-col gap-6">
            <h3 className="text-xl font-semibold text-center text-white">1. Select Target Format</h3>
            <FormatSelector selectedFormat={targetFormat} onFormatChange={setTargetFormat} />
          </div>

          <motion.button
            onClick={handleConvertAndDownload}
            disabled={isConverting}
            className="w-full max-w-md px-8 py-4 rounded-full font-semibold text-lg
                       bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                       shadow-lg text-white transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isConverting ? (
              <span className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Converting...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Download size={20} className="mr-2" />
                Convert & Download as {targetFormat.name}
              </span>
            )}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}