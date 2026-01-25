import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import AuthButton from '../components/AuthButton';
import AuthPageWrapper from '../components/AuthPageWrapper';

// --- Particle Component ---
// Simple floating glowing orbs that move in the background
const Particle = ({ delay, duration, xStart, yStart, size }) => (
  <motion.div
    initial={{ x: xStart, y: yStart, opacity: 0 }}
    animate={{ 
      y: [yStart, yStart - 100, yStart], 
      x: [xStart, xStart + 50, xStart],
      opacity: [0, 0.5, 0] 
    }}
    transition={{ 
      duration: duration, 
      repeat: Infinity, 
      delay: delay,
      ease: "easeInOut"
    }}
    className="absolute rounded-full bg-purple-500 blur-xl"
    style={{ 
      width: size, 
      height: size, 
      zIndex: 0 // Behind the form
    }}
  />
);

const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage({ onLogin }) {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
    defaultValues: { email: "", password: "" }
  });

  const onFormSubmit = (data) => {
    setIsLoading(true);
    onLogin(data.email, data.password)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  return (
    <AuthPageWrapper>
      {/* --- Background Particles --- */}
      {/* We place them absolute so they float behind the glass card */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Particle delay={0} duration={8} xStart={-50} yStart={100} size={100} />
        <Particle delay={2} duration={12} xStart={200} yStart={400} size={60} />
        <Particle delay={1} duration={10} xStart={-100} yStart={500} size={80} />
        <Particle delay={4} duration={15} xStart={300} yStart={100} size={120} />
        <Particle delay={3} duration={9} xStart={100} yStart={-50} size={50} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto relative z-10" // z-10 ensures form is above particles
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-sm">
            Enter your credentials to access your workspace.
          </p>
        </div>

        {/* Form Section */}
        <form className="space-y-5" onSubmit={handleSubmit(onFormSubmit)}>
          
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300 ml-1 uppercase tracking-wider">Email Address</label>
            <div className={`
              group flex items-center bg-[#13131f]/80 backdrop-blur-md border border-gray-700/50 
              rounded-xl px-4 py-3.5 transition-all duration-300
              focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:bg-[#1a1a2e]
              ${errors.email ? 'border-red-500/50 ring-2 ring-red-500/10' : 'hover:border-gray-600'}
            `}>
              <Mail size={18} className="text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="email" 
                placeholder="name@example.com"
                className="bg-transparent w-full ml-3 text-white placeholder-gray-600 focus:outline-none text-sm font-medium"
                {...register("email")} 
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs ml-1 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-medium text-gray-300 uppercase tracking-wider">Password</label>
              <Link 
                to="/forgot-password"
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className={`
              group flex items-center bg-[#13131f]/80 backdrop-blur-md border border-gray-700/50 
              rounded-xl px-4 py-3.5 transition-all duration-300
              focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:bg-[#1a1a2e]
              ${errors.password ? 'border-red-500/50 ring-2 ring-red-500/10' : 'hover:border-gray-600'}
            `}>
              <Lock size={18} className="text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="bg-transparent w-full ml-3 text-white placeholder-gray-600 focus:outline-none text-sm font-medium"
                {...register("password")}  
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)} 
                className="focus:outline-none text-gray-500 hover:text-white transition-colors p-1"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs ml-1 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <AuthButton 
              text="Sign In" 
              isLoading={isLoading} 
              isGradient={true} 
              type="submit" 
              iconAfter={!isLoading && <ArrowRight size={18} />}
            />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Don't have an account?{' '}
            <Link 
              to="/signup"
              className="font-bold text-white hover:text-purple-400 transition-colors"
            >
              Create Account
            </Link>
          </p>

        </form>
      </motion.div>
    </AuthPageWrapper>
  );
}