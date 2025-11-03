import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react'; 
export default function DobbyIntro({ onStartChat }) {
    return (
        <motion.div
            key="dobby-intro-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center h-full text-white p-4"
        >
            <h1 className="text-3xl font-extrabold mb-4">Dobby</h1>
            
            <div className="bg-[#1f1f3d] p-6 rounded-3xl border-4 border-purple-500 shadow-2xl">
                <Bot size={60} className="text-white" />
            </div>
            
            <p className="text-lg text-gray-300 mt-6">Created by Team 1</p>
            <p className="text-md text-center text-gray-400 mt-2 max-w-md">
                Any query, ask to our chatBot and your friend **Dobby**!
            </p>
            
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStartChat}  
                className="mt-6 px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
            >
                Start Chatting
            </motion.button>
        </motion.div>
    );
}

