import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart } from 'lucide-react';

export default function AboutUsView({ setPage }) {
    return (
        <motion.div
            key="about-us-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-0 md:p-0 text-white max-w-4xl mx-auto"
        >
            <button onClick={() => setPage(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
                <ArrowLeft size={18} /> Back to Home
            </button>
            <h1 className="text-4xl font-bold mb-10">About Us</h1>

            <div className="bg-[#1f1f3d]/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border-2 border-indigo-400/30 flex flex-col md:flex-row gap-8">
                
                
                <div className="md:w-1/3 flex-shrink-0">
                    
                    <motion.div
                        initial={{ rotateY: -90 }}
                        animate={{ rotateY: 0 }}
                        transition={{ type: 'spring', stiffness: 100 }}
                        className="w-full h-80 md:h-full bg-gray-700 rounded-lg overflow-hidden border-4 border-white"
                    >
                        <img 
                            src="/aboutus.jpg" 
                            alt="Collage of Photos" 
                            className="w-full h-full object-cover" 
                        />
                    </motion.div>
                </div>
                
                
                <div className="flex flex-col justify-between">
                    <p className="text-gray-200 text-lg leading-relaxed">
                        Welcome to <b>**FotoFix**</b>, your one-stop solution for smart and simple image processing. We make editing effortless—crop images, enhance sharpness, adjust contrast, and even convert between JPG and PNG formats with ease. Our tools also help you extract text from images instantly.
                    </p>
                    <p className="text-gray-200 text-lg leading-relaxed mt-4">
                        At FotoFix, we combine accuracy, speed, and creativity to help you make every image picture-perfect.
                    </p>
                    
                    <p className="text-lg mt-8 text-white font-semibold">
                        Contact Us: <span className="text-purple-400">Team 1, CCC, AKGEC.</span> <Heart size={18} className="inline text-red-500" />
                    </p>
                </div>
            </div>
        </motion.div>
    );
}