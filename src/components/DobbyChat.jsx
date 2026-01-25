import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Bot, User, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DobbyChat({ setPage }) { // specific for Route usage
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm Dobby, your AI creative assistant. How can I help you edit your images today?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Mock API Response
    setTimeout(() => {
      const botMsg = { 
        id: Date.now() + 1, 
        text: "I'm currently in demo mode, but I can help you navigate the app! Try going to the 'Tools' page to see what I can do.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleBack = () => {
    if (setPage) setPage('home');
    else navigate('/');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto w-full bg-[#1c1c3a]/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl mt-4">
      
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-[#1f1f3d]">
        <button 
          onClick={handleBack}
          className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
          <Bot size={24} className="text-white" />
        </div>
        <div>
          <h2 className="font-bold text-white">Dobby AI</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-white/60">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' ? 'bg-blue-600' : 'bg-purple-600'
              }`}>
                {msg.sender === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-[#2a2a4a] text-gray-200 rounded-bl-none border border-white/5'
              }`}>
                {msg.text}
              </div>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <div className="flex items-center gap-2 ml-10 text-gray-400 text-sm">
            <Bot size={14} /> Dobby is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-[#1f1f3d] border-t border-white/10">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Dobby anything..."
            className="flex-1 bg-[#15152a] text-white placeholder-white/30 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-white/5"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white hover:opacity-90 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}