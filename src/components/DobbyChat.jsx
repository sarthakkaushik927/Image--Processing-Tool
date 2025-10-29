import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bot, Send, ArrowUp } from 'lucide-react'; // ⬅️ ICON CHANGED to Bot

export default function DobbyChat({ setPage }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim() === '') return;
        
        const userMessage = { text: input, sender: 'user' };
        setMessages([...messages, userMessage]);
        setInput('');

        // Simulate Dobby's response after a short delay
        setTimeout(() => {
            const botMessage = { text: "Hello! I am Dobby. How can I help you with your image editing today?", sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        }, 1000);
    };

    return (
        <motion.div
            key="dobby-chat-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-[80vh] max-w-3xl mx-auto p-4 md:p-8 bg-[#1c1c3a]/50 rounded-2xl shadow-xl border-2 border-indigo-400/30"
        >
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-4">
                <button onClick={() => setPage(null)} className="flex items-center gap-2 text-gray-400 hover:text-white">
                    <ArrowLeft size={24} /> <span className="text-2xl font-bold">HEYY!</span>
                </button>
                <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold">Dobby</h2>
                    <div className="bg-[#1f1f3d] p-2 rounded-xl border border-purple-500">
                        <Bot size={24} className="text-white" />
                        {/* ⬅️ ICON USAGE CORRECTED */}
                    </div>
                </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 pt-10">
                        Ask Dobby anything about image editing or FotoFix!
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-md 
                                ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-[#333355] text-gray-200'}`}
                            >
                                {msg.text}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Input Box (Matching Screenshot) */}
            <div className="mt-6">
                <div className="flex items-center bg-[#1f1f3d] rounded-full p-1.5 shadow-lg border border-purple-500/50">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type...."
                        className="flex-1 px-4 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                    />
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSend}
                        className="p-2 bg-purple-600 rounded-full text-white"
                    >
                        <ArrowUp size={20} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}