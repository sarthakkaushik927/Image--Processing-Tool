import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import {
  Mail, Lock, User, Eye, EyeOff, CheckCircle, ArrowRight, Home,
  Download, UserCircle, Search, ArrowLeft, Settings, HelpCircle, LogOut,
  Image as ImageIcon, Loader2
} from 'lucide-react';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import PasswordChangedPage from './pages/PasswordChangedPage.jsx';
import ForgotPasswordSuccessPage from './pages/ForgotPasswordSuccessPage.jsx';
import HomePage from './pages/HomePage.jsx';
import AuthCard from './components/AuthCard.jsx';
import DobbyFloatingChat from "./components/DobbyFloatingChat.jsx";
import toast, { Toaster } from 'react-hot-toast';


const API_BASE_URL = "https://image-processing-app-sepia.vercel.app";

const DOWNLOAD_STORAGE_KEY = 'fotoFixDownloads';

const getSavedDownloads = () => {
  try {
    const stored = localStorage.getItem(DOWNLOAD_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

const getInitialState = (key, defaultValue) => {
  try {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return defaultValue;

    let parsedValue = JSON.parse(storedValue);

    if (typeof parsedValue === 'string') {
      try {
        parsedValue = JSON.parse(parsedValue);
      } catch (e) {
        
      }
    }

    return parsedValue;

  } catch (error) {
   
    return defaultValue;
  }
};


const getDisplayNameFromEmail = (email) => {
  if (!email) return "Guest";
  const localPart = email.split('@')[0].split(/[.\-_]/)[0];
  return localPart.charAt(0).toUpperCase() + localPart.slice(1);
}


const generateAvatarUrl = (name) => {
  const initial = name ? name.charAt(0).toUpperCase() : 'U';
  return `https://placehold.co/40x40/7c3aed/ffffff?text=${initial}`;
};


function LogoutConfirmationModal({ onLogout, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-[#1f1f3d]/80 border border-gray-700 rounded-2xl p-8 shadow-xl w-full max-w-xs"
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold mb-4 text-center">Confirm Logout</h3>
          <button
            onClick={onLogout}
            className="w-full px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
          >
            <LogOut size={20} className="inline mr-2" /> Logout
          </button>
          <button
            onClick={onCancel}
            className="w-full px-6 py-3 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!Cookies.get('auth_token'));
  const [page, setPage] = useState(() => isAuthenticated ? null : 'login');

  const initialEmail = getInitialState('userEmail', '');
  const initialUsername = getInitialState('username', getDisplayNameFromEmail(initialEmail) || "Keshav");

  const [username, setUsername] = useState(initialUsername);
  const [profileImage, setProfileImage] = useState(() => getInitialState('profileImage', generateAvatarUrl(initialUsername)));
  const [userEmail, setUserEmail] = useState(initialEmail);
  const [resetEmail, setResetEmail] = useState('');
  const [showGlobalLogoutModal, setShowGlobalLogoutModal] = useState(false);
  const [resetToken, setResetToken] = useState(null);

  useEffect(() => {
    const path = window.location.pathname;

    if (path.startsWith('/reset-password/')) {
      const token = path.split('/')[2];

      if (token) {
        
        setIsAuthenticated(false);
        Cookies.remove('auth_token');
        localStorage.clear();

        setResetToken(token);
        setPage('resetPassword');
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('username', JSON.stringify(username));
      localStorage.setItem('profileImage', JSON.stringify(profileImage));
      localStorage.setItem('userEmail', JSON.stringify(userEmail));
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('profileImage');
      localStorage.removeItem('userEmail');
    }
  }, [username, profileImage, userEmail, isAuthenticated]);

  const handleSaveDownload = (dataUrl, filename, extension = 'png') => {
    const downloads = getSavedDownloads();
    const newDownload = {
      id: Date.now(),
      filename: filename || `processed_img_${Date.now()}.${extension}`,
      dataUrl: dataUrl,
      date: new Date().toISOString()
    };
    const newDownloadsList = [newDownload, ...downloads];
    localStorage.setItem(DOWNLOAD_STORAGE_KEY, JSON.stringify(newDownloadsList));
    
    return newDownload;
  };


  const handleLogin = async (email, password) => {
    const loadingToastId = toast.loading('Logging in...');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, { email, password });

      const token = response.data?.token || 'mock-token';
      const apiUsername = response.data?.user?.userName || response.data?.userName || response.data?.user?.username || getDisplayNameFromEmail(email);
      const apiEmail = response.data?.user?.email || email;

      Cookies.set('auth_token', token, { expires: 7, secure: true, sameSite: 'Strict' });

      setIsAuthenticated(true);
      setUsername(apiUsername);
      setUserEmail(apiEmail);
      setProfileImage(generateAvatarUrl(apiUsername));
      setPage(null);

      toast.success('Logged in successfully!', { id: loadingToastId });
      return response;

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed.";
      
      toast.error(errorMessage, { id: loadingToastId });
      throw new Error(errorMessage);
    }
  };


  const handleSignup = async (username, email, password) => {
    

    const signupPromise = axios.post(`${API_BASE_URL}/api/v1/auth/register`, {
      userName: username,
      email,
      password,
      confirmPassword: password
    });

    try {
      const response = await toast.promise(signupPromise, {
        loading: 'Creating your account...',
        success: 'Signup successful! Please log in.',
        error: (error) => error.response?.data?.message || error.message || "Signup failed."
      });

      setPage('login');
      return response;

    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Signup failed.");
      throw error;
    }
  };

  const handleForgotPassword = async (email) => {
    

    const resetUrl = "https://image-processing-app-sepia.vercel.app/reset-password";

    const forgotPasswordPromise = axios.post(`${API_BASE_URL}/api/v1/auth/forgot-password`, {
      email,
      resetUrl
    });

    try {
      const response = await toast.promise(forgotPasswordPromise, {
        loading: 'Sending reset link...',
        success: 'Reset link sent! Check your email.',
        error: (error) => error.response?.data?.message || error.message || "Failed to send reset link."
      });

      setResetEmail(email);
      setPage('forgotPasswordSuccess');
      return response;

    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to send reset link.");
      throw error;
    }
  };


  const handleResetPassword = async (newPassword) => {
    

    if (!resetToken) {
      toast.error("Invalid or missing reset token. Please try again from the login page.");
      setPage('login');
      return;
    }

    const resetPasswordPromise = axios.post(
      `${API_BASE_URL}/api/v1/auth/reset-password/${resetToken}`,
      {
        password: newPassword,
        confirmPassword: newPassword
      }
    );

    try {
      const response = await toast.promise(resetPasswordPromise, {
        loading: 'Resetting your password...',
        success: 'Password reset successfully!',
        error: (error) => error.response?.data?.message || error.message || "Failed to reset password. The link may be expired."
      });

      setPage('passwordChanged');
      setResetToken(null);
      return response;

    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to reset password. The link may be expired.");
      setPage('login');
      throw error;
    }
  };

  const executeLogout = () => {
    
    Cookies.remove('auth_token');

    localStorage.clear();

    setIsAuthenticated(false);
    setPage('login');

    setUsername(getDisplayNameFromEmail("") || "Keshav");
    setProfileImage(generateAvatarUrl("Keshav"));
    setUserEmail('');
    setShowGlobalLogoutModal(false);
    toast.success("Logged out successfully.");
  };

  const handleLogoutTrigger = () => {
    setShowGlobalLogoutModal(true);
  };

  const handleLogoutConfirmation = () => {
    executeLogout();
  };

  const handleLogoutCancel = () => {
    setShowGlobalLogoutModal(false);
  };


  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence mode="wait">
        {!isAuthenticated && page !== 'resetPassword' ? (

          <motion.div
            key="auth-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center bg-black"
          >
            <AuthCard>
              <AnimatePresence mode="wait">
                {page === 'login' && (
                  <LoginPage
                    key="login"
                    setPage={setPage}
                    onLogin={handleLogin}
                  />
                )}
                {page === 'signup' && (
                  <SignupPage
                    key="signup"
                    setPage={setPage}
                    onSignup={handleSignup}
                  />
                )}
                {page === 'forgotPassword' && (
                  <ForgotPasswordPage
                    key="forgot"
                    setPage={setPage}
                    onForgot={handleForgotPassword}
                  />
                )}
                {page === 'forgotPasswordSuccess' && (
                  <ForgotPasswordSuccessPage
                    key="forgotSuccess"
                    setPage={setPage}
                  />
                )}

                {page === 'passwordChanged' && (
                  <PasswordChangedPage
                    key="changed"
                    setPage={setPage}
                  />
                )}
              </AnimatePresence>
            </AuthCard>
          </motion.div>

        ) : (page === 'resetPassword' && !isAuthenticated) ? (


          <motion.div
            key="reset-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center bg-black"
          >
            <AuthCard>
              <AnimatePresence mode="wait">
                <ResetPasswordPage
                  key="reset"
                  setPage={setPage}
                  onResetPassword={handleResetPassword}
                />
              </AnimatePresence>
            </AuthCard>
          </motion.div>

        ) : (

          <HomePage
            key="home"
            isAuthenticated={isAuthenticated}
            onLogout={handleLogoutTrigger}
            setPage={setPage}
            page={page}
            username={username}
            setUsername={setUsername}
            userEmail={userEmail}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            onSaveDownload={handleSaveDownload}
          />
        )}
      </AnimatePresence>


      <AnimatePresence>
        {showGlobalLogoutModal && (
          <LogoutConfirmationModal
            onLogout={handleLogoutConfirmation}
            onCancel={handleLogoutCancel}
          />
        )}
      </AnimatePresence>


      <DobbyFloatingChat isAuthenticated={isAuthenticated} />
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#1f1f3d',
            color: '#e0e0e0',
            border: '1px solid #4a4a6a',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
            padding: '16px',
            minWidth: '250px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#ffffff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#7c3aed',
              secondary: 'transparent',
            },
          },
        }}
      />
    </div>
  );
}