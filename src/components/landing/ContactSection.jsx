import React, { useState } from 'react';
import { Mail, Zap, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_name: "FotoFix Team"
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => {
        toast.success("Message sent successfully!");
        setFormData({ name: '', email: '', message: '' });
      })
      .catch((error) => {
        console.error('Email Error:', error);
        toast.error("Failed to send. Please check your connection.");
      })
      .finally(() => setIsSending(false));
  };

  return (
    <section className="relative z-10 py-24 px-6 bg-black">
      <div className="max-w-5xl mx-auto">
        
        {/* Liquid Glass Container */}
        <div className="relative bg-[#111] bg-opacity-40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 md:p-16 overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
            <div>
              <h2 className="text-4xl font-black text-white mb-6">Get in Touch</h2>
              <p className="text-gray-400 mb-10 leading-relaxed">
                Questions about our API or Enterprise plans? Send us a message directly.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-gray-300 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Mail size={20} className="text-purple-400" />
                  <span>support@fotofix.com</span>
                </div>
                <div className="flex items-center gap-4 text-gray-300 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Zap size={20} className="text-blue-400" />
                  <span>Typically replies in 2 hours</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="Your Name" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-purple-500/50 text-white placeholder-gray-600 transition-all focus:bg-black/40"
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-purple-500/50 text-white placeholder-gray-600 transition-all focus:bg-black/40"
              />
              <textarea 
                placeholder="How can we help?" 
                rows="4"
                required
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-purple-500/50 text-white placeholder-gray-600 transition-all resize-none focus:bg-black/40"
              />
              
              <button 
                type="submit" 
                disabled={isSending}
                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-white/10"
              >
                {isSending ? 'Sending...' : 'Send Message'}
                {!isSending && <Send size={18} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}