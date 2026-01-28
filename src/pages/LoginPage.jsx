import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Wand2, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Particle Component ---
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
      zIndex: 0 
    }}
  />
);

const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
    defaultValues: { email: "", password: "" }
  });

  const onFormSubmit = async (data) => {
    setIsLoading(true);
    try {
        await onLogin(data.email, data.password);
    } catch (error) {
        // Error handling typically in parent via toast
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden py-10">
      
      {/* --- Background Particles --- */}
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
        // ✅ Seamless integration: Removed background card styles
        className="w-full max-w-md p-8 relative z-10"
      >
        {/* Back Button */}
        <button 
            onClick={() => navigate('/dashboard')} 
            className="absolute -top-12 left-0 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
        </button>

        {/* Clickable Logo */}
        <div 
            className="flex justify-center mb-6 cursor-pointer group"
            onClick={() => navigate('/')}
        >
            <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <Wand2 size={32} className="text-white" />
            </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white mb-2">
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
            <div className={`
              group flex items-center bg-[#15152a] border border-white/10 
              rounded-xl px-4 py-3.5 transition-all duration-300
              focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20
              ${errors.email ? 'border-red-500/50 ring-2 ring-red-500/10' : 'hover:border-gray-600'}
            `}>
              <Mail size={18} className="text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="email" 
                placeholder="Email Address"
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
            <div className={`
              group flex items-center bg-[#15152a] border border-white/10 
              rounded-xl px-4 py-3.5 transition-all duration-300
              focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20
              ${errors.password ? 'border-red-500/50 ring-2 ring-red-500/10' : 'hover:border-gray-600'}
            `}>
              <Lock size={18} className="text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type={showPass ? "text" : "password"}
                placeholder="Password"
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
            
            <div className="flex justify-end pt-1">
                <Link 
                    to="/forgot-password"
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                    Forgot Password?
                </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    "Signing In..."
                ) : (
                    <>
                        <LogIn size={20} /> Sign In
                    </>
                )}
            </button>
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
    </div>
  );
}