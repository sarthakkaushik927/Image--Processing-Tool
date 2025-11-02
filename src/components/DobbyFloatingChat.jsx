import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, ArrowUp, X } from 'lucide-react';
// 1. FIX: Add .jsx extension to imports
import SmallButton from './SmallButton.jsx';
import DobbyIntro from './DobbyIntro.jsx';

// 2. FIX: Destructure props by adding { }
export default function DobbyFloatingChat({ isAuthenticated }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // 3. State to manage 'intro' or 'chat' view
  const [chatView, setChatView] = useState('intro'); // 'intro' or 'chat'
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // 4. Check localStorage when component loads
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenDobbyIntro');
    if (hasSeenIntro) {
      setChatView('chat');
    }
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Add initial message ONLY if we are in chat view
    if (!isOpen && messages.length === 0 && chatView === 'chat') {
      setTimeout(() => {
        setMessages([{ text: "Hello! I am Dobby. How can I help you today?", sender: 'bot' }]);
      }, 500);
    }
  };

  // 5. Function for Intro component to call
  const handleStartChat = () => {
    setChatView('chat');
    localStorage.setItem('hasSeenDobbyIntro', 'true');
    // Add initial message when chat starts
    setTimeout(() => {
      setMessages([{ text: "Hello! I am Dobby. How can I help you today?", sender: 'bot' }]);
    }, 500);
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

  // 6. THE FIX: This check will now work correctly!
  if (!isAuthenticated) {
    return null; // Render nothing if the user is not logged in
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {/* --- CHAT WINDOW (Conditionally renders Intro or Chat) --- */}
        {isOpen && (
          <motion.div
            key="dobby-chat-window"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            // Container for popup
            className="flex flex-col w-80 sm:w-96 h-[600px] max-h-[80vh] bg-[#1c1c3a]/90 backdrop-blur-md rounded-2xl shadow-xl border-2 border-indigo-400/30"
          >
            {/* 7. Render Intro or Chat based on state */}
            {chatView === 'intro' ? (
              // Pass the function to the Intro component
              <DobbyIntro onStartChat={handleStartChat} />
            ) : (
              // This is your previous chat UI, wrapped in a fragment
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-3 p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1f1f3d] p-2 rounded-xl border border-purple-500">
                      <Bot size={20} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Dobby</h2>
                  </div>
                  <button 
                    onClick={toggleChat} 
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={24} /> 
                  </button>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 px-4 pr-2">
                  {messages.map((msg, index) => (
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
                  ))}
                </div>

                {/* Input Box */}
                <div className="mt-4 p-4 pt-0">
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
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FLOATING TOGGLE BUTTON --- */}
      {/* This button is now controlled by the `isOpen` state */}
      {!isOpen && (
         <SmallButton className="w-16 h-16" onClick={toggleChat}>
           <img className='h-12 w-12' src="/chatbot.png" alt="Dobby" onError={(e) => e.target.style.display = 'none'} />
         </SmallButton>
      )}
    </div>
  );
}

