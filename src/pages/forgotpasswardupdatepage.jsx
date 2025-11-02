import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import AuthButton from '../components/AuthButton.jsx';
import AuthPageWrapper from '../components/AuthPageWrapper.jsx';

// Validation Schema for new password
const ResetSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], 
});

// This component is shown by App.jsx when a token is found in the URL
export default function ResetPasswordPage({ setPage, onResetPassword }) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ResetSchema),
    mode: 'onChange',
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  // This function calls the new onResetPassword handler from App.jsx
  const onFormSubmit = (data) => {
    setIsLoading(true);
    // onResetPassword (from App.jsx) already has the token from its state
    onResetPassword(data.password).catch(() => {
      // Handle error
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <AuthPageWrapper>
      <h2 className="text-3xl font-bold text-white">Set New Password</h2>
      <p className="text-white/70 mt-2 mb-8">
        Please enter your new password below.
      </p>
      
      <form className="space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
        {/* --- Password Input --- */}
        <div>
          <div className="flex items-center bg-gray-900/50 border-2 border-gray-700 rounded-lg px-4 py-3 focus-within:border-purple-500">
            <Lock size={20} className="text-white/50 mr-3" />
            <input 
              type={showPass ? "text" : "password"}
              placeholder="New Password"
              className="bg-transparent w-full text-white placeholder-white/50 focus:outline-none"
              {...register("password")}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="focus:outline-none text-white/50">
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
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
              placeholder="Confirm New Password"
              className="bg-transparent w-full text-white placeholder-white/50 focus:outline-none"
              {...register("confirmPassword")}
            />
            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="focus:outline-none text-white/50">
              {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1 ml-2">{errors.confirmPassword.message}</p>
          )}
        </div>

        <AuthButton text="Reset Password" isLoading={isLoading} isGradient={true} type="submit" />
      </form>
    </AuthPageWrapper>
  );
}

