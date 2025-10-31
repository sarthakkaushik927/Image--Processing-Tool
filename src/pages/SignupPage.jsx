import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

// ⬇️ Step 1: Imports
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// (Aapke component imports)
// ⬇️ FIX: Reverting to relative paths
import AuthButton from '../components/AuthButton';
import AuthPageWrapper from '../components/AuthPageWrapper';

// ⬇️ Step 2: Validation Schema banayein
const SignupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPass: z.string().min(1, "Please confirm your password"),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms",
  }),
}).refine(data => data.password === data.confirmPass, {
  // Yeh error 'confirmPass' field par dikhega
  message: "Passwords don't match",
  path: ["confirmPass"], 
});

export default function SignupPage({ setPage, onSignup }) {
  // Sirf password visibility aur loading state rakhein
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ⬇️ Step 3: useForm hook setup karein
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(SignupSchema),
    mode: 'onChange', // ✨ YEH LINE BADAL GAYI HAI - Validation 'onChange' par trigger hogi
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPass: "",
      terms: false,
    }
  });

  // ⬇️ Step 4: Yeh function tabhi chalega jab validation pass hoga
  const onFormSubmit = (data) => {
    setIsLoading(true);
    // 'data' object mein { username, email, password, confirmPass, terms } hai
    // Purane manual checks ki zaroorat nahi
    onSignup(data.username, data.email, data.password)
      .catch(() => {
        // Error App.jsx mein handle ho raha hai
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AuthPageWrapper>
      <h2 className="text-3xl font-bold text-white mb-4">Create an account</h2>
      
      {/* Google Sign-in (pehle jaisa) */}
      <AuthButton
        text="Sign in with Google"
        icon={
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google"
            className="w-5 h-5"
          />
        }
        isSecondary={true}
        onClick={() => console.log("Google Sign-in clicked")} // Add your Google sign-in logic here
      />
      <div className="flex items-center space-x-2 my-6">
        <div className="flex-1 h-px bg-gray-700"></div>
        <span className="text-gray-500 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-700"></div>
      </div>
      
      {/* ⬇️ Step 5: 'handleSubmit' ko form ke 'onSubmit' mein wrap karein */}
      <form className="space-y-5" onSubmit={handleSubmit(onFormSubmit)}>

        {/* --- Username Input --- */}
        <div>
          <div className="flex items-center bg-gray-900/50 border-2 border-gray-700 rounded-lg px-4 py-3 focus-within:border-purple-500">
            <User size={20} className="text-white/50 mr-3" />
            <input 
              type="text" 
              placeholder="Username"
              className="bg-transparent w-full text-white placeholder-white/50 focus:outline-none"
              {...register("username")} // ⬅️ Step 6: 'register'
            />
          </div>
          {/* ⬇️ Step 7: Error message */}
          {errors.username && (
            <p className="text-red-400 text-xs mt-1 ml-2">{errors.username.message}</p>
          )}
        </div>

        {/* --- Email Input --- */}
        <div>
          <div className="flex items-center bg-gray-900/50 border-2 border-gray-700 rounded-lg px-4 py-3 focus-within:border-purple-500">
            <Mail size={20} className="text-white/50 mr-3" />
            <input 
              type="email" 
              placeholder="Email"
              className="bg-transparent w-full text-white placeholder-white/50 focus:outline-none"
              {...register("email")} // ⬅️ Step 6: 'register'
            />
          </div>
          {/* ⬇️ Step 7: Error message */}
          {errors.email && (
            <p className="text-red-400 text-xs mt-1 ml-2">{errors.email.message}</p>
          )}
        </div>

        {/* --- Password Input --- */}
        <div>
          <div className="flex items-center bg-gray-900/50 border-2 border-gray-700 rounded-lg px-4 py-3 focus-within:border-purple-500">
            <Lock size={20} className="text-white/50 mr-3" />
            <input 
              type={showPass ? "text" : "password"}
              placeholder="Enter Your Password"
              className="bg-transparent w-full text-white placeholder-white/50 focus:outline-none"
              {...register("password")} // ⬅️ Step 6: 'register'
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="focus:outline-none text-white/50">
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {/* ⬇️ Step 7: Error message */}
          {errors.password && (
            <p className="text-red-400 text-xs mt-1 ml-2">{errors.password.message}</p>
          )}
        </div>
        
        {/* --- Confirm Password Input --- */}
        <div>
          <div className="flex items-center bg-gray-900/50 border-2 border-gray-700 rounded-lg px-4 py-3 focus-within:border-purple-500">
            <Lock size={20} className="text-white/50 mr-3" />
            <input 
              type={showConfirmPass ? "text" : "password"}
              placeholder="Confirm Password"
              className="bg-transparent w-full text-white placeholder-white/50 focus:outline-none"
              {...register("confirmPass")} // ⬅️ Step 6: 'register'
            />
            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="focus:outline-none text-white/50">
              {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {/* ⬇️ Step 7: Error message */}
          {errors.confirmPass && (
            <p className="text-red-400 text-xs mt-1 ml-2">{errors.confirmPass.message}</p>
          )}
        </div>
        

        {/* --- Terms Checkbox --- */}
        <div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 rounded bg-gray-800 border-gray-700 focus:ring-purple-500 text-purple-600"
              {...register("terms")} // ⬅️ Step 6: 'register'
            />
            <label htmlFor="terms" className="text-sm text-white/70">
              I agree with the <a href="#" className="font-bold text-white hover:underline">Terms & Conditions</a>
            </label>
          </div>
          {/* ⬇️ Step 7: Error message */}
          {errors.terms && (
            <p className="text-red-400 text-xs mt-1 ml-2">{errors.terms.message}</p>
          )}
        </div>

        <AuthButton text="Continue" isLoading={isLoading} isGradient={true} type="submit" />

        <p className="text-center text-sm text-white/70">
          Already have an account?{' '}
          <button
            disabled={isLoading}
            type="button"
            onClick={() => setPage('login')}
            className="font-bold text-white hover:underline focus:outline-none"
          >
            Login
          </button>
        </p>
      </form>
    </AuthPageWrapper>
  );
}




