import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ArrowUp, X } from 'lucide-react';
import SmallButton from './SmallButton.jsx';
import DobbyIntro from './DobbyIntro.jsx';

export default function DobbyFloatingChat({ isAuthenticated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatView, setChatView] = useState('intro');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenDobbyIntro');
    if (hasSeenIntro) {
      setChatView('chat');
    }
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);

    if (!isOpen && messages.length === 0 && chatView === 'chat') {
      setTimeout(() => {
        setMessages([{ text: "Hello! I am Dobby. How can I help you today?", sender: 'bot' }]);
      }, 300);
    }
  };

  const handleStartChat = () => {
    setChatView('chat');
    localStorage.setItem('hasSeenDobbyIntro', 'true');

    setTimeout(() => {
      setMessages([{ text: "Hello! I am Dobby. How can I help you today?", sender: 'bot' }]);
    }, 300);
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch("https://dobbing-chat-bot.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text })
      });

      const data = await res.json();
      const botResponse = data.reply || "Hmm… I didn’t understand that.";

      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);

    } catch (error) {
      setMessages(prev => [...prev, { text: "⚠ Server unavailable. Try again later.", sender: 'bot' }]);
    }

    setIsLoading(false);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col w-80 sm:w-96 h-[600px] max-h-[80vh] bg-[#1c1c3a]/90 backdrop-blur-lg rounded-2xl shadow-xl border-2 border-purple-500/30"
          >
            {chatView === 'intro' ? (
              <DobbyIntro onStartChat={handleStartChat} />
            ) : (
              <>
                {/* HEADER */}
                <div className="border-b border-gray-700 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1f1f3d] p-2 rounded-xl border border-purple-500">
                      <Bot size={20} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Dobby</h2>
                  </div>
                  <button onClick={toggleChat} className="text-gray-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 px-4 pr-2 overflow-y-auto mt-3 space-y-3">
                  {messages.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className={`px-3 py-2 rounded-xl max-w-[85%] shadow 
                        ${msg.sender === "user" ? "bg-blue-600 ml-auto text-white" : "bg-[#333355] text-gray-200"}
                      `}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <div className="bg-[#333355] text-gray-200 px-3 py-2 rounded-xl w-fit">
                      Dobby is thinking...
                    </div>
                  )}
                </div>

                {/* INPUT */}
                <div className="p-4"> 
                  <div className="flex items-center bg-[#1f1f3d] border border-purple-500/50 rounded-full p-1.5">
                    <input
                      className="flex-1 px-4 bg-transparent text-white placeholder-gray-500 outline-none"
                      placeholder="Type ..."
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <motion.button
                      onClick={handleSend}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-purple-600 text-white"
                    >
                      <ArrowUp size={18} />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <SmallButton className="w-16 h-16" onClick={toggleChat}>
          <img src="/chatbot.png" className="h-12 w-12" alt="Dobby" />
        </SmallButton>
      )}
    </div>
  );
}