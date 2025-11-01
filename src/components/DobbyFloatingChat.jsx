import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bot, Send, ArrowUp, X } from 'lucide-react'; // Added X


// This component combines your DobbyChat with the floating popup logic
export default function DobbyFloatingChat() {
  // State for the chat window (open/closed)
  const [isOpen, setIsOpen] = useState(false);
  
  // State from your DobbyChat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Optional: Add an initial message when opening
    if (!isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([{ text: "Hello! I am Dobby. How can I help you with your image editing today?", sender: 'bot' }]);
      }, 500);
    }
  };

  const handleSend = () => {
    if (input.trim() === '') return;
    
    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate Dobby's response after a short delay
    setTimeout(() => {
      const botMessage = { text: "Dobby is thinking... This is a placeholder response.", sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* --- CHAT WINDOW (uses your DobbyChat UI) --- */}
      {isOpen && (
        <motion.div
          key="dobby-chat-window"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          // Modified container: Sized for a popup, not a full page
          className="flex flex-col w-80 sm:w-96 h-[600px] max-h-[80vh] bg-[#1c1c3a]/90 backdrop-blur-md rounded-2xl shadow-xl border-2 border-indigo-400/30 p-4"
        >
          {/* Chat Header - Modified from your DobbyChat */}
          <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-3">
              <div className="flex items-center gap-3">
                <div className="bg-[#1f1f3d] p-2 rounded-xl border border-purple-500">
                  <Bot size={20} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Dobby</h2>
              </div>
              <button 
                onClick={toggleChat} // Changed from setPage to toggleChat
                className="text-gray-400 hover:text-white"
              >
                <X size={24} /> 
              </button>
          </div>

          {/* Chat Messages Area - From your DobbyChat */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 pt-10">
                Ask Dobby anything about image editing!
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
                  <div className={`max-w-[85%] p-3 rounded-xl shadow-md 
                    ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-[#333355] text-gray-200'}`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Input Box - From your DobbyChat */}
          <div className="mt-4">
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
      )}

      {/* --- FLOATING TOGGLE BUTTON (Updated to use SmallButton) --- */}
      {!isOpen && (
         <SmallButton className="w-16 h-16" onClick={toggleChat}>
          <img className='h-12 w-12' src="/chatbot.png" alt="Dobby" onError={(e) => e.target.style.display = 'none'} />
        </SmallButton>
      )}
    </div>
  );
}
function SmallButton({ children, onClick, className = "" }) {
  return (
    <motion.button whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }} onClick={onClick} className={`p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden transition-all ${className}`}>
      <div className="bg-[#1c1c3a] h-full w-full rounded-[14px] flex items-center justify-center"> {children} </div>
    </motion.button>
  );
}
