import React from 'react';
import { motion } from 'framer-motion';
import { MailCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Import this
import AuthButton from '../components/AuthButton';
import AuthPageWrapper from '../components/AuthPageWrapper';

export default function ForgotPasswordSuccessPage() { // 2. Remove { setPage } prop
  const navigate = useNavigate(); // 3. Initialize the hook

  return (
    <AuthPageWrapper>
      <div className="flex flex-col items-center text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: { type: 'spring', delay: 0.2 } }}
          className="p-4 bg-green-500 rounded-full"
        >
          <MailCheck size={60} className="text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-white mt-6">Check your email</h2>
        <p className="text-white/70 mt-2 mb-8">
          We have sent a password reset link to your email address. Please check your inbox (and spam folder).
        </p>
        
        <AuthButton 
          text="Back to Login" 
          onClick={() => navigate('/login')} // 4. Use navigate instead of setPage
          iconAfter={<ArrowRight size={18} />}
          isGradient={true}
        />
      </div>
    </AuthPageWrapper>
  );
}