import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AuthButton from '../components/AuthButton';
import AuthPageWrapper from '../components/AuthPageWrapper';


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

export default function SignupPage({ setPage, onSignup }) {
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

 
  const onFormSubmit = (data) => {
    setIsLoading(true);
  
    onSignup(data.username, data.email, data.password)
      .catch(() => {
        
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AuthPageWrapper>
      <h2 className="text-3xl font-bold text-white mb-4">Create an account</h2>
      
       
      {/* <AuthButton
        text="Sign in with Google"
        icon={
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google"
            className="w-5 h-5"
          />
        }
        isSecondary={true}
        onClick={() => console.log("Google Sign-in clicked")} 
      /> */}
      <div className="flex items-center space-x-2 my-6">
        <div className="flex-1 h-px bg-gray-700"></div>
        <span className="text-gray-500 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-700"></div>
      </div>
      
       
      <form className="space-y-5" onSubmit={handleSubmit(onFormSubmit)}>

         
        <div>
          <div className="flex items-center bg-gray-900/50 border-2 border-gray-700 rounded-lg px-4 py-3 focus-within:border-purple-500">
            <User size={20} className="text-white/50 mr-3" />
            <input 
              type="text" 
              placeholder="Username"
              className="bg-transparent w-full text-white placeholder-white/50 focus:outline-none"
              {...register("username")}  
            />
          </div>
           
          {errors.username && (
            <p className="text-red-400 text-xs mt-1 ml-2">{errors.username.message}</p>
          )}
        </div>

        
        <div>
          <div className="flex items-center bg-gray-900/50 border-2 border-gray-700 rounded-lg px-4 py-3 focus-within:border-purple-500">
            <Mail size={20} className="text-white/50 mr-3" />
            <input 
              type="email" 
              placeholder="Email"
              className="bg-transparent w-full text-white placeholder-white/50 focus:outline-none"
              {...register("email")} 
            />
          </div>
         
          {errors.email && (
            <p className="text-red-400 text-xs mt-1 ml-2">{errors.email.message}</p>
          )}
        </div>

        
        <div>
          <div className="flex items-center bg-gray-900/50 border-2 border-gray-700 rounded-lg px-4 py-3 focus-within:border-purple-500">
            <Lock size={20} className="text-white/50 mr-3" />
            <input 
              type={showPass ? "text" : "password"}
              placeholder="Enter Your Password"
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
        
        <div>
          <div className="flex items-center bg-gray-900/50 border-2 border-gray-700 rounded-lg px-4 py-3 focus-within:border-purple-500">
            <Lock size={20} className="text-white/50 mr-3" />
            <input 
              type={showConfirmPass ? "text" : "password"}
              placeholder="Confirm Password"
              className="bg-transparent w-full text-white placeholder-white/50 focus:outline-none"
              {...register("confirmPass")} 
            />
            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="focus:outline-none text-white/50">
              {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
         
          {errors.confirmPass && (
            <p className="text-red-400 text-xs mt-1 ml-2">{errors.confirmPass.message}</p>
          )}
        </div>
        

       
        <div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 rounded bg-gray-800 border-gray-700 focus:ring-purple-500 text-purple-600"
              {...register("terms")}
            />
            <label htmlFor="terms" className="text-sm text-white/70">
              I agree with the <a href="#" className="font-bold text-white hover:underline">Terms & Conditions</a>
            </label>
          </div>
          
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




