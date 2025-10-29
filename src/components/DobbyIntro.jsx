import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react'; 

export default function DobbyIntro({ setPage }) {
    return (
        <motion.div
            key="dobby-intro-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[80vh] text-white"
        >
            <h1 className="text-5xl font-extrabold mb-8">Dobby</h1>
            
            <div className="bg-[#1f1f3d] p-10 rounded-3xl border-4 border-purple-500 shadow-2xl">
                <Bot size={80} className="text-white" />
            </div>
            
            <p className="text-xl mt-8 text-gray-300">Created by Team 1</p>
            <p className="text-lg text-center text-gray-400 mt-4 max-w-md">
                Any query, ask to our chatBot and your friend **Dobby**!
            </p>
            
            {/* ⬇️ FIX APPLIED HERE: Button now navigates to the 'dobby-chat' page ⬇️ */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage('dobby-chat')} 
                className="mt-8 px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
            >
                Start Chatting
            </motion.button>
        </motion.div>
    );
}