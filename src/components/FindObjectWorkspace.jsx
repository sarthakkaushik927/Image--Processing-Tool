import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, UploadCloud, Loader2, Download, Camera, X } from 'lucide-react';
import GradientButton from '../components/GradientButton'; // adjust path if necessary

export const ML_SERVER = import.meta.env.VITE_ML_API || "https://34.131.30.185";

// -----------------------------
// Camera capture component
// -----------------------------
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
        console.log('[CameraCapture] camera stream started');
      }
    } catch (err) {
      console.error('[CameraCapture] camera error', err);
      alert("Unable to access camera. Please check permissions or use a supported device.");
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
    console.log('[CameraCapture] camera closed');
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
    console.log('[CameraCapture] captured image dataUrl length:', dataUrl.length);
    onCapture(dataUrl);
  };

  return (
    <div>
      <button
        onClick={openCamera}
        className="px-8 py-3 rounded-full font-semibold border-2 border-blue-400 text-blue-300 hover:bg-blue-700/50 flex items-center justify-center gap-2"
      >
        <Camera size={20} /> Capture from Camera
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative bg-[#1f1f3d] p-4 rounded-xl shadow-lg flex flex-col items-center">
            <video
              ref={videoRef}
              autoPlay
              className="rounded-lg border border-purple-500 max-w-full max-h-[70vh]"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-4 mt-4">
              <button
                onClick={captureImage}
                disabled={!isCameraReady}
                className="px-6 py-2 bg-purple-600 rounded-full hover:bg-purple-700 text-white font-medium"
              >
                Capture
              </button>
              <button
                onClick={closeCamera}
                className="px-6 py-2 bg-gray-600 rounded-full hover:bg-gray-700 text-white font-medium flex items-center gap-2"
              >
                <X size={18} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------
// Main FindObjectWorkspace
// -----------------------------
export default function FindObjectWorkspace({ setPage, onImageDownloaded }) {
  const [originalImage, setOriginalImage] = useState(null); // dataURL
  const [processedImageURL, setProcessedImageURL] = useState(null); // remote processed image URL (only set when detections exist)
  const [detections, setDetections] = useState([]); // array of {class, confidence, bbox}
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("image.png");
  const [isDragging, setIsDragging] = useState(false);

  // Reusable file processor
  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name || 'image.png');
      setProcessedImageURL(null);
      setDetections([]);
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target.result);
        console.log('[processFile] loaded dataUrl length:', e.target.result.length);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("Please upload an image file (e.g., png, jpg).");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    processFile(file);
  };

  // Drag & drop handlers
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

  // Call YOLO detect API
  const handleFind = async () => {
    if (!originalImage) {
      alert("Please upload or capture an image first.");
      return;
    }

    setIsLoading(true);
    setProcessedImageURL(null);
    setDetections([]);
    console.log('[handleFind] starting detection');

    try {
      // Convert dataURL to blob
      const blob = await (await fetch(originalImage)).blob();
      const formData = new FormData();
      formData.append('image', blob, fileName);

      // session fallback: you asked for hardcoded "anurag" if session missing
      const sessionId = (typeof window !== 'undefined' && sessionStorage.getItem('user_id')) || 'anurag';
      formData.append('_id', sessionId);
      console.log('[handleFind] using _id =', sessionId);

      const resp = await fetch(`${ML_SERVER}/detect`, {
        method: 'POST',
        body: formData,
      });

      const data = await resp.json();
      console.log('[handleFind] API response:', data);

      if (!resp.ok || data.error) {
        const errMsg = data.error || `Server returned status ${resp.status}`;
        console.error('[handleFind] detection failed', errMsg);
        alert(`Detection failed: ${errMsg}`);
        setIsLoading(false);
        return;
      }

      const apiDetections = Array.isArray(data.detections) ? data.detections : [];
      setDetections(apiDetections);

      if (apiDetections.length > 0) {
        // set processed image URL only if objects detected
        let outputUrl = data.output_url || null;
        if (outputUrl) {
          // ensure full URL
          if (outputUrl.startsWith('http')) {
            setProcessedImageURL(outputUrl);
          } else {
            setProcessedImageURL(`${ML_SERVER}${outputUrl}`);
          }
          console.log('[handleFind] processed image url set:', outputUrl);
        } else {
          console.warn('[handleFind] API returned detections but no output_url');
          setProcessedImageURL(null);
        }
      } else {
        // No detections: do not store output image anywhere (per your request)
        setProcessedImageURL(null);
        console.log('[handleFind] no objects detected');
      }
    } catch (err) {
      console.error('[handleFind] unexpected error', err);
      alert(`Detection failed: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Download using blob and first detected object as filename
  const handleDownload = async () => {
    if (!processedImageURL) {
      alert('No processed image to download.');
      return;
    }
    if (!detections || detections.length === 0) {
      alert('No detected objects — nothing to download (per settings).');
      return;
    }

    try {
      setIsLoading(true);
      console.log('[handleDownload] fetching processed image blob from:', processedImageURL);
      const resp = await fetch(processedImageURL, { method: 'GET' });
      if (!resp.ok) throw new Error(`Failed to fetch image: ${resp.status}`);
      const blob = await resp.blob();

      const firstClass = detections[0].class || 'detected';
      const ext = blob.type && blob.type.split('/')[1] ? `.${blob.type.split('/')[1].split(';')[0]}` : '.jpg';
      const filename = `${firstClass}${ext}`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('[handleDownload] downloaded as', filename);

      // If you want to propagate saved image to parent (like before) keep this:
      if (onImageDownloaded) {
        onImageDownloaded(processedImageURL, filename);
        console.log('[handleDownload] onImageDownloaded called with', processedImageURL, filename);
      }
    } catch (err) {
      console.error('[handleDownload] download error', err);
      alert(`Download failed: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
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
      {/* Header */}
      <div className="flex items-center gap-4 text-gray-400 mb-6">
        <button onClick={() => setPage('tools')} className="flex items-center gap-2 hover:text-white">
          <ArrowLeft size={24} /> <span className="text-xl font-medium">Tools</span>
        </button>
      </div>

      {/* Title */}
      <div className="flex flex-col items-center justify-center mb-10">
        <div className="bg-[#1f1f3d] p-4 rounded-full border border-purple-500 shadow-xl">
          <Search size={48} className="text-purple-400" />
        </div>
        <h2 className="text-4xl font-bold mt-4">Find Object</h2>
      </div>

      {/* Workspace */}
      <div className="bg-[#1f1f3d]/50 p-6 flex flex-col items-center border-2 border-indigo-400/30 rounded-2xl">
        <div
          className={`w-full h-full min-h-[300px] md:min-h-[500px] flex items-center justify-center bg-[#1a1834] rounded-lg overflow-hidden relative mb-6 transition-all duration-300
            ${isDragging ? 'border-4 border-dashed border-purple-500 scale-[1.02]' : 'border-transparent'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {originalImage ? (
            <img
              src={processedImageURL || originalImage}
              alt="Input"
              className="max-w-full max-h-full object-contain pointer-events-none"
            />
          ) : (
            <div className="text-center p-10 pointer-events-none">
              <UploadCloud size={64} className={`mx-auto transition-colors ${isDragging ? 'text-purple-400' : 'text-gray-500'}`} />
              <p className={`text-gray-400 mt-4 transition-colors ${isDragging ? 'text-white' : 'text-gray-400'}`}>
                {isDragging ? "Drop your image here!" : "Drag & drop, upload, or capture an image"}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-10 rounded-md">
              <Loader2 size={48} className="text-purple-400 animate-spin" />
              <p className="ml-4 text-xl font-medium mt-4">Processing...</p>
            </div>
          )}
        </div>

        {/* Upload input */}
        <input type="file" id="find-upload" onChange={handleImageUpload} accept="image/*" className="hidden" />

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 w-full">
          <label
            htmlFor="find-upload"
            className="w-full md:w-auto px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform cursor-pointer bg-transparent border-2 border-gray-400 text-gray-300 hover:bg-gray-700/50 flex items-center justify-center gap-2"
          >
            <UploadCloud size={20} /> {originalImage ? "Change Image" : "Upload Image"}
          </label>

          <CameraCapture onCapture={(imgData) => setOriginalImage(imgData)} />

          <GradientButton
            text={isLoading ? "Finding..." : "Find Objects"}
            onClick={handleFind}
            isBlue
            disabled={!originalImage || isLoading}
            icon={isLoading ? Loader2 : Search}
          />

          {/* Show Download only if processedImageURL exists AND detections exist */}
          <GradientButton
            text="Download Result"
            onClick={handleDownload}
            disabled={!processedImageURL || isLoading || !detections || detections.length === 0}
            icon={Download}
          />
        </div>

        {/* Detection results */}
        <div className="mt-6 w-full max-w-3xl">
          {detections && detections.length > 0 ? (
            <div className="bg-[#14122b] p-4 rounded-lg border border-purple-500 text-left">
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Objects detected:</h3>
              <ul className="list-disc ml-5 text-gray-200">
                {detections.map((d, idx) => {
                  const cls = d.class || d.label || 'object';
                  const conf = typeof d.confidence === 'number' ? Math.round(d.confidence * 100) : (d.confidence ? Math.round(d.confidence) : 'N/A');
                  return (
                    <li key={idx} className="mb-1">
                      {cls} ({conf}%)
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            // Show message when we attempted detection and there were none OR no detection has been run yet
            processedImageURL === null && detections.length === 0 && originalImage ? (
              <div className="bg-[#14122b] p-4 rounded-lg border border-yellow-500 text-left text-yellow-300">
                <p>No objects detected.</p>
              </div>
            ) : null
          )}
        </div>
      </div>
    </motion.div>
  );
}
