import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

// ⬇️ Step 1: Imports
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// (Aapke Auth component imports)
// ⬇️ FIX: Trying a different relative path
import AuthButton from '../components/AuthButton';
import AuthPageWrapper from '../components/AuthPageWrapper';

// ⬇️ Step 2: Validation Schema banayein
const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage({ setPage, onLogin }) {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // IsLoading ko form se alag rakhein

  // ⬇️ Step 3: useForm hook setup karein
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange', // ✨ Validation 'onChange' par trigger hogi
    defaultValues: {   // ✨ Default values add karein
      email: "",
      password: "",
    }
  });

  // ⬇️ Step 4: Yeh function tabhi chalega jab validation pass hoga
  const onFormSubmit = (data) => {
    setIsLoading(true);
    // 'data' object mein { email, password } hai
    onLogin(data.email, data.password)
      .catch(() => {
        // Error (jaise "Invalid credentials") App.jsx mein handle ho raha hai
        // Yahan sirf loading state ko false karein
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AuthPageWrapper>
      <h2 className="text-3xl font-bold text-white mb-2">Hello Welcome</h2>
      <p className="text-white/70 mb-8">Login</p>
      
      {/* ⬇️ Step 5: 'handleSubmit' ko form ke 'onSubmit' mein wrap karein */}
      <form className="space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
        
        {/* --- Email Input --- */}
        <div>
          <div className="flex items-center bg-gray-900/50 border-2 border-gray-700 rounded-lg px-4 py-3 focus-within:border-purple-500">
            <Mail size={20} className="text-white/50 mr-3" />
            <input 
              type="email" 
              placeholder="Email or Phone number"
              className="bg-transparent w-full text-white placeholder-white/50 focus:outline-none"
              {...register("email")} // ⬅️ Step 6: 'register' ka istemaal karein
            />
          </div>
          {/* ⬇️ Step 7: Error message dikhayein */}
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
              placeholder="Password"
              className="bg-transparent w-full text-white placeholder-white/50 focus:outline-none"
              {...register("password")} // ⬅️ Step 6: 'register' ka istemaal karein
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="focus:outline-none text-white/50">
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {/* ⬇️ Step 7: Error message dikhayein */}
          {errors.password && (
            <p className="text-red-400 text-xs mt-1 ml-2">{errors.password.message}</p>
          )}
        </div>
        
        <div className="text-right">
          <button 
            type="button" 
            onClick={() => setPage('forgotPassword')}
            className="text-sm text-white/80 hover:text-white focus:outline-none"
          >
            Forgot Password?
          </button>
        </div>
        
        <AuthButton text="Sign In" isLoading={isLoading} isGradient={true} type="submit" />
        
        <p className="text-center text-sm text-white/70">
          Don't have an account?{' '}
          <button 
            disabled={isLoading}
            type="button" 
            onClick={() => setPage('signup')}
            className="font-bold text-white hover:underline focus:outline-none"
          >
            Sign up
          </button>
        </p>
      </form>
    </AuthPageWrapper>
  );
}

