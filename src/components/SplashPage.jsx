import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

export default function SplashPage() {
    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-screen 
                       bg-gradient-to-br from-[#121c3a] to-[#2a2a4a] text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            
            <motion.div
                initial={{ scale: 0.5, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                className="p-8 bg-white text-[#1c1c3a] rounded-full shadow-2xl"
            >
                <Camera size={80} strokeWidth={1} />
            </motion.div>
            
            
            <h1 className="text-5xl font-extrabold mt-8 tracking-widest">
                FotoFix
            </h1>
            <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl text-gray-400 mt-2"
            >
                Powered by Team 1
            </motion.p>
        </motion.div>
    );
}