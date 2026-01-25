import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Bot, User, Sparkles, Stars } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DobbyChat({ setPage }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm Dobby, your creative AI assistant. ✨ I can help you edit photos, remove backgrounds, or just chat about design. How can I help you today?", 
      sender: 'bot' 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Mock AI Response with "Liquid" delay
    setTimeout(() => {
      const responses = [
        "That sounds like a great idea! Have you tried the Magic Brush tool?",
        "I can help with that. Go to the 'Tools' section to get started.",
        "Interesting! Try using the Adjustments workspace to tweak those colors.",
        "I'm still learning, but I think the Object Finder would be perfect for this task."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMsg = { 
        id: Date.now() + 1, 
        text: randomResponse, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 2000);
  };

  const handleBack = () => {
    if (setPage) setPage('home');
    else navigate('/');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto w-full relative z-10"
    >
      {/* --- Liquid Glass Container --- */}
      <div className="flex flex-col h-full w-full bg-gray-900/20 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden relative">
        
        {/* Decorative Internal Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* --- Header --- */}
        <div className="relative z-10 p-5 border-b border-white/10 flex items-center gap-4 bg-white/5 backdrop-blur-md">
          <button 
            onClick={handleBack}
            className="p-3 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95"
          >
            <ArrowLeft size={22} />
          </button>
          
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Bot size={26} className="text-white drop-shadow-md" />
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-[#1c1c3a] rounded-full"></div>
          </div>
          
          <div>
            <h2 className="font-bold text-xl text-white tracking-wide flex items-center gap-2">
              Dobby AI <Stars size={16} className="text-yellow-400" />
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-purple-200/70 font-medium">Creative Assistant</span>
            </div>
          </div>
        </div>

        {/* --- Messages Area --- */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-3 max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                      : 'bg-gradient-to-br from-purple-600 to-pink-600'
                  }`}>
                    {msg.sender === 'user' ? <User size={18} className="text-white" /> : <Sparkles size={18} className="text-white" />}
                  </div>

                  {/* Bubble */}
                  <div className={`p-4 rounded-2xl text-[15px] leading-relaxed backdrop-blur-md shadow-md border ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white rounded-br-none border-white/20' 
                      : 'bg-white/10 text-gray-100 rounded-bl-none border-white/10'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Typing Indicator */}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start ml-14"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/5 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* --- Input Area --- */}
        <form onSubmit={handleSendMessage} className="relative z-10 p-5 bg-white/5 border-t border-white/10 backdrop-blur-xl">
          <div className="flex gap-3 relative items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Dobby to edit, crop, or generate..."
              className="flex-1 bg-black/30 text-white placeholder-white/30 rounded-2xl px-6 py-4 pr-14 
                         border border-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 
                         focus:outline-none transition-all shadow-inner"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="absolute right-2 p-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white 
                         hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:hover:shadow-none
                         transition-all duration-300 group"
            >
              <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
          <div className="text-center mt-3">
             <p className="text-[10px] text-white/20 uppercase tracking-widest">AI Powered Creative Assistant</p>
          </div>
        </form>

      </div>
    </motion.div>
  );
}