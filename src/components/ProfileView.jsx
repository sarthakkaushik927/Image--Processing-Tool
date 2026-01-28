import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2 } from 'lucide-react';
import GradientButton from './GradientButton';
import { useNavigate } from 'react-router-dom';
 
export default function ProfileView({ setPage, username, setUsername, profileImage, setProfileImage }) {
  const [nickname, setNickname] = useState(username);
  const [localProfileImage, setLocalProfileImage] = useState(profileImage);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setLocalProfileImage(newImageUrl);
    }
  };
  
  const handleSave = () => {
    setUsername(nickname);
    setProfileImage(localProfileImage);
    
  };

  return (
    <motion.div
      key="profile-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-0 md:p-0 text-white"
    >
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={18} /> Back to Home 
      </button>
      <h2 className="text-4xl font-bold text-center mb-10">Profile</h2>
      <div className="max-w-md mx-auto flex flex-col items-center gap-6">
        <div className="relative">
          <img
            src={localProfileImage}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-gray-700"
            onError={(e) => e.target.src = 'https://placehold.co/150x150/222244/ffffff?text=Error'}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleImageUploadClick}
            className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-900"
            aria-label="Change profile picture"
          >
            <Edit2 size={24} className="text-white" />
          </motion.button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png, image/jpeg"
            className="hidden"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-400 mb-2 text-center">Nickname</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname"
            className="w-full p-4 rounded-lg text-center font-medium text-white text-lg bg-gradient-to-r from-blue-500/30 to-purple-600/30 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="w-full mt-4">
          <GradientButton text="Save Changes" onClick={handleSave} />
        </div>
      </div>
    </motion.div>
  );
}