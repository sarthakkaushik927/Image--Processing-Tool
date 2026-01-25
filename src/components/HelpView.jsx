import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Rocket, Wrench, FileText, 
  ChevronDown, MessageCircle, Mail, Zap 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

// Import Layout Components
import BubblesBackground from './BubblesBackground';

// ✅ EmailJS Configuration (Loaded from .env)
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function HelpView() {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  
  // Support Form State
  const [supportMsg, setSupportMsg] = useState('');
  const [isSending, setIsSending] = useState(false);

  // --- EmailJS Handler ---
  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportMsg.trim()) return;
    setIsSending(true);

    const templateParams = {
      message: supportMsg,
      to_name: "Support Team",
      from_name: "Authenticated User", // You could pass user.email here if you have it in props
      from_email: "user@app.com"
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => {
        toast.success("Support request sent! We'll reply soon.");
        setSupportMsg('');
      })
      .catch((error) => {
        console.error('Email Error:', error);
        toast.error("Failed to send message.");
      })
      .finally(() => setIsSending(false));
  };

  const faqs = [
    { q: "Is FotoFix free to use?", a: "Yes! FotoFix offers a generous free tier that allows you to access basic tools like cropping, adjustments, and filters." },
    { q: "How do I download my edited images?", a: "Simply click the 'Download' button located at the bottom of any tool workspace. Your image will be saved to your device and your 'Downloads' library." },
    { q: "Do you store my photos?", a: "We value your privacy. Images are processed securely. We save a history of your edits in the 'Downloads' section locally on your device using IndexedDB." },
    { q: "Can I use FotoFix on mobile?", a: "Absolutely. FotoFix is fully responsive and works great on smartphones, tablets, and desktop computers." },
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden text-white font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none">
         <BubblesBackground />
      </div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="relative z-10 pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto"
      >
        
        {/* Header */}
        <div className="relative mb-20 text-center">
          <button onClick={() => navigate('/')} className="absolute left-0 top-0 hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5 hover:border-white/20"> 
            <ArrowLeft size={18} /> <span className="font-medium text-sm">Back</span>
          </button>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <h4 className="text-purple-400 font-semibold tracking-wider text-sm uppercase mb-4">Support Center</h4>
            <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200">How can we help you?</h1>
          </motion.div>
          <div className="relative w-full max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <input type="text" placeholder="Search for tools, topics, or keywords..." className="relative w-full pl-14 pr-6 py-5 rounded-full bg-[#1c1c3a]/80 backdrop-blur-xl border border-white/10 focus:border-purple-500/50 text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-2xl" />
            <Search size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
          </div>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <HelpCard icon={<Rocket size={32} className="text-blue-400" />} title="Getting Started" text="Learn the basics of FotoFix interface." colorClass="from-blue-600 to-cyan-600"/>
          <HelpCard icon={<Wrench size={32} className="text-purple-400" />} title="Tools Guide" text="Deep dive into every tool like Magic Brush." colorClass="from-purple-600 to-pink-600"/>
          <HelpCard icon={<FileText size={32} className="text-green-400" />} title="Account & Privacy" text="Manage your settings and data privacy." colorClass="from-green-600 to-emerald-600"/>
        </div>

        {/* FAQ & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="p-2 bg-purple-500/20 rounded-lg"><Zap size={24} className="text-purple-400"/></span>
              Frequently Asked
            </h3>
            <div className="bg-[#1f1f3d]/30 backdrop-blur-md rounded-3xl border border-white/10 p-8">
              {faqs.map((faq, index) => (
                <FaqItem key={index} question={faq.q} answer={faq.a} isOpen={openFaqIndex === index} onClick={() => setOpenFaqIndex(index === openFaqIndex ? -1 : index)} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
             <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="p-2 bg-blue-500/20 rounded-lg"><MessageCircle size={24} className="text-blue-400"/></span>
              Still stuck?
            </h3>
            <div className="bg-gradient-to-b from-[#1f1f3d]/60 to-[#15152a]/80 backdrop-blur-md rounded-3xl border border-white/10 p-8 text-center h-fit">
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Mail size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Contact Support</h4>
              <p className="text-gray-400 mb-6 text-sm">Describe your issue below.</p>
              
              <form onSubmit={handleSupportSubmit}>
                <textarea 
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white mb-4 focus:border-purple-500 outline-none resize-none"
                  rows="3"
                  placeholder="Type your message..."
                  value={supportMsg}
                  onChange={(e) => setSupportMsg(e.target.value)}
                  required
                />
                <button 
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3.5 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors shadow-lg disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

// Sub-Components
const FaqItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <motion.div initial={false} className="border-b border-white/10 last:border-0">
      <button onClick={onClick} className="w-full py-6 flex items-center justify-between text-left group">
        <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-purple-400' : 'text-gray-200 group-hover:text-white'}`}>{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className={`p-2 rounded-full ${isOpen ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-400'}`}>
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="pb-6 text-gray-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

function HelpCard({ icon, title, text, colorClass }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="relative overflow-hidden bg-[#1f1f3d]/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all group cursor-pointer">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClass} opacity-10 blur-2xl rounded-full -mr-10 -mt-10 transition-opacity group-hover:opacity-20`} />
      <div className="bg-white/5 p-4 rounded-2xl w-fit mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-200 transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
    </motion.div>
  );
}