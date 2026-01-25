import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Wand2, UserPlus, Check } from 'lucide-react';
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

const SignupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPass: z.string().min(1, "Please confirm your password"),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms",
  }),
}).refine(data => data.password === data.confirmPass, {
  message: "Passwords don't match",
  path: ["confirmPass"], 
});

export default function SignupPage({ onSignup }) {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(SignupSchema),
    mode: 'onChange', 
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPass: "",
      terms: false,
    }
  });

  const onFormSubmit = async (data) => {
    setIsLoading(true);
    try {
        await onSignup(data.username, data.email, data.password);
    } catch (e) {
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
        // ✅ Removed background, border, and shadow classes
        className="w-full max-w-md p-8 relative z-10"
      >
        {/* Back Button */}
        <button 
            onClick={() => navigate('/')} 
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

        <h2 className="text-3xl font-bold text-center text-white mb-2">Join FotoFix</h2>
        <p className="text-center text-gray-400 mb-8">Create an account to unleash your creativity</p>
        
        <form className="space-y-4" onSubmit={handleSubmit(onFormSubmit)}>
          
          {/* Username */}
          <div className="space-y-1">
            <div className={`
              group flex items-center bg-[#15152a] border border-white/10 
              rounded-xl px-4 py-3.5 transition-all duration-300
              focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20
              ${errors.username ? 'border-red-500/50 ring-2 ring-red-500/10' : 'hover:border-gray-600'}
            `}>
              <User size={18} className="text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Username"
                className="bg-transparent w-full ml-3 text-white placeholder-gray-600 focus:outline-none text-sm font-medium"
                {...register("username")} 
              />
            </div>
            {errors.username && (
              <p className="text-red-400 text-xs ml-1">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
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
              <p className="text-red-400 text-xs ml-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
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
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-500 hover:text-white transition-colors">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs ml-1">{errors.password.message}</p>
            )}
          </div>
          
          {/* Confirm Password */}
          <div className="space-y-1">
            <div className={`
              group flex items-center bg-[#15152a] border border-white/10 
              rounded-xl px-4 py-3.5 transition-all duration-300
              focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20
              ${errors.confirmPass ? 'border-red-500/50 ring-2 ring-red-500/10' : 'hover:border-gray-600'}
            `}>
              <Lock size={18} className="text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type={showConfirmPass ? "text" : "password"}
                placeholder="Confirm Password"
                className="bg-transparent w-full ml-3 text-white placeholder-gray-600 focus:outline-none text-sm font-medium"
                {...register("confirmPass")} 
              />
              <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="text-gray-500 hover:text-white transition-colors">
                {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPass && (
              <p className="text-red-400 text-xs ml-1">{errors.confirmPass.message}</p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start space-x-3 pt-2">
            <div className="relative flex items-center h-5">
                <input
                type="checkbox"
                id="terms"
                className="peer h-4 w-4 rounded border-gray-600 bg-[#15152a] text-purple-600 focus:ring-purple-500/50 focus:ring-offset-0 transition-all cursor-pointer appearance-none checked:bg-purple-600 border-2"
                {...register("terms")}
                />
                <Check size={12} className="absolute left-[2px] top-[2px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </div>
            <label htmlFor="terms" className="text-xs text-gray-400">
                I agree with the <a href="#" className="font-bold text-white hover:text-purple-400 transition-colors underline decoration-purple-500/50 hover:decoration-purple-500">Terms & Conditions</a>
            </label>
          </div>
          {errors.terms && (
            <p className="text-red-400 text-xs ml-1">{errors.terms.message}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
                "Creating Account..."
            ) : (
                <>
                    <UserPlus size={20} /> Create Account
                </>
            )}
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-white hover:text-purple-400 transition-colors"
            >
              Login
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}