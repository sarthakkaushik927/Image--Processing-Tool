import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie'; 
import {
  Mail, Lock, User, Eye, EyeOff, CheckCircle, ArrowRight, Home,
  Download, UserCircle, Search, ArrowLeft, Settings, HelpCircle, LogOut,
  Image as ImageIcon, Loader2
} from 'lucide-react';

// === Import Pages (Assuming these paths are correct relative to App.jsx) ===
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyCodePage from './pages/VerifyCodePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PasswordChangedPage from './pages/PasswordChangedPage';
import HomePage from './pages/HomePage';
import AccountPage from './pages/AccountPage';
// === Import Components ===
import AuthCard from './components/AuthCard';

// =======================================================================
//  API Configuration
// =======================================================================
const API_BASE_URL = 'https://image-processing-app-sepia.vercel.app';

// --- DOWNLOAD HELPERS ---
const DOWNLOAD_STORAGE_KEY = 'fotoFixDownloads';

const getSavedDownloads = () => {
    try {
        const stored = sessionStorage.getItem(DOWNLOAD_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};
// --------------------------

// Helper function for local session management
const getInitialState = (key, defaultValue) => {
    try {
        const storedValue = sessionStorage.getItem(key);
        if (!storedValue) return defaultValue;

        let parsedValue = JSON.parse(storedValue);
        
        if (typeof parsedValue === 'string') {
            try {
                parsedValue = JSON.parse(parsedValue);
            } catch (e) {
                // Ignore parse errors, use current string value
            }
        }
        
        return parsedValue;

    } catch (error) {
        console.error(`Error reading session storage key ${key}`, error);
        return defaultValue;
    }
};

// Function to derive a user display name from an email (for initial/fallback states)
const getDisplayNameFromEmail = (email) => {
    if (!email) return "Guest";
    const localPart = email.split('@')[0].split(/[.\-_]/)[0];
    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
}

// Helper to generate a placeholder avatar URL
const generateAvatarUrl = (name) => {
    const initial = name ? name.charAt(0).toUpperCase() : 'U';
    return `https://placehold.co/40x40/7c3aed/ffffff?text=${initial}`;
};

// --- LOGOUT CONFIRMATION MODAL COMPONENT (MUST BE DEFINED HERE FOR GLOBAL USE) ---
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
                        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg"
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
// -----------------------------------------------------------------------------------


// =======================================================================
//  Main App Component (State-Based Navigation)
// =======================================================================
export default function App() {
  // ⬇️ INITIAL STATE CHECK: Check for token in cookie and user data in session storage ⬇️
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!Cookies.get('auth_token'));
  const [page, setPage] = useState(() => isAuthenticated ? null : 'login'); 
  
  // Get initial values from storage or set temporary defaults
  const initialEmail = getInitialState('userEmail', '');
  const initialUsername = getInitialState('username', getDisplayNameFromEmail(initialEmail) || "Keshav");

  const [username, setUsername] = useState(initialUsername); 
  const [profileImage, setProfileImage] = useState(() => getInitialState('profileImage', generateAvatarUrl(initialUsername)));
  const [userEmail, setUserEmail] = useState(initialEmail); 
  const [resetEmail, setResetEmail] = useState('');
  const [showGlobalLogoutModal, setShowGlobalLogoutModal] = useState(false);

  // ⬇️ EFFECT: Sync user state changes to session storage ⬇️
  useEffect(() => {
    // Only store dynamic values if authenticated
    if (isAuthenticated) {
        sessionStorage.setItem('username', JSON.stringify(username));
        sessionStorage.setItem('profileImage', JSON.stringify(profileImage));
        sessionStorage.setItem('userEmail', JSON.stringify(userEmail));
    } else {
        // Ensure temporary data is removed if auth is false
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('profileImage');
        sessionStorage.removeItem('userEmail');
    }
  }, [username, profileImage, userEmail, isAuthenticated]);


  // ⬇️ NEW GLOBAL HANDLER: Called by all tool workspaces to save image history ⬇️
  const handleSaveDownload = (dataUrl, filename, extension = 'png') => {
    const downloads = getSavedDownloads();
    const newDownload = {
        id: Date.now(), // Unique ID based on timestamp
        filename: filename || `processed_img_${Date.now()}.${extension}`,
        dataUrl: dataUrl,
        date: new Date().toISOString()
    };

    const newDownloadsList = [newDownload, ...downloads];
    
    // Save to session storage
    sessionStorage.setItem(DOWNLOAD_STORAGE_KEY, JSON.stringify(newDownloadsList));

    console.log(`Saved new download: ${newDownload.filename}`);
    return newDownload;
  };
  // -------------------------------------------------------------------------


  const handleLogin = async (email, password) => {
    console.log("Attempting LIVE login with:", { email, password });
   
    try {
      // ⬇️ LIVE API CALL ⬇️
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, { email, password });
      
      const token = response.data?.token || 'mock-token'; 
      const apiUsername = response.data?.user?.userName || response.data?.userName || response.data?.user?.username || getDisplayNameFromEmail(email);
      const apiEmail = response.data?.user?.email || email;
      
      // 1. SET COOKIE (Persistent Auth)
      Cookies.set('auth_token', token, { expires: 7, secure: true, sameSite: 'Strict' }); 
      
      // 2. SET STATE (Update UI)
      setIsAuthenticated(true); 
      setUsername(apiUsername); // ⬅️ Use robustly found name
      setUserEmail(apiEmail);
      setProfileImage(generateAvatarUrl(apiUsername)); 
      setPage(null); // Go to Home
      return response;

    } catch (error) {
      // If error, check the console and alert the user
      const errorMessage = error.response?.data?.message || error.message || "Login failed.";
      console.error("Backend Login Error:", error.response || error);
      alert(errorMessage);
      throw new Error(errorMessage);
    }
    
    // ⬇️ SIMULATE LOGIN SUCCESS (Uncomment the block below to use simulation) ⬇️
    /*
    return new Promise(resolve => setTimeout(() => {
        const mockToken = 'simulated-auth-token';
        const simulatedName = "TestUser45";
        Cookies.set('auth_token', mockToken, { expires: 7 }); // Set cookie on simulation
        setIsAuthenticated(true); 
        setUsername(simulatedName);
        setUserEmail(email); 
        setProfileImage(generateAvatarUrl(simulatedName)); 
        setPage(null); 
        resolve();
     }, 500));
    */
  };

  const handleSignup = async (username, email, password) => {
    console.log("Attempting LIVE signup with:", { username, email, password });
    
    try {
      // ⬇️ LIVE API CALL ⬇️
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/register`, { 
        userName: username, 
        email, 
        password, 
        confirmPassword: password 
      });
      
      // If successful:
      alert("Signup successful! Please log in.");
      setPage('login'); // Signup ke baad login page par bhejein
      return response;

    } catch (error) {
      // If error (including the 409 Conflict):
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                           "Signup failed due to invalid data (400 Bad Request).";
      
      console.error("Backend Signup Error:", error.response || error);
      alert(errorMessage);
      throw new Error(errorMessage);
    }
    
    // ⬇️ SIMULATE SIGNUP SUCCESS (Uncomment the block below to use simulation) ⬇️
    /*
    return new Promise(resolve => setTimeout(() => { 
        setPage('login'); 
        alert("Simulated: Signup successful. Please proceed to login.");
        resolve(); 
     }, 500));
    */
  };

  const handleForgotPassword = async (email) => {
    console.log("Requesting password reset for:", email);
    
    try {
        // ⬇️ LIVE API CALL ⬇️
        const response = await axios.post(`${API_BASE_URL}/api/v1/auth/forgot-password`, { email });
        setResetEmail(email); // Save email for verification step
        alert("Verification code sent to your email.");
        setPage('verifyCode');
        return response;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to initiate reset.";
        alert(errorMessage);
        throw new Error(errorMessage);
    }
    
    // ⬇️ SIMULATE FORGOT PASSWORD (Uncomment the block below to use simulation) ⬇️
    /*
    return new Promise(resolve => setTimeout(() => { 
        setResetEmail(email);
        setPage('verifyCode'); 
        alert("Simulated: Verification code sent.");
        resolve(); 
    }, 500));
    */
  };

  const handleVerifyCode = async (code) => {
    console.log("Attempting to verify code:", code);
    
    try {
        // ⬇️ LIVE API CALL ⬇️
        const response = await axios.post(`${API_BASE_URL}/api/v1/auth/verify-code`, { email: resetEmail, code });
        alert("Code verified. Please set a new password.");
        setPage('resetPassword');
        return response;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Invalid verification code.";
        alert(errorMessage);
        throw new Error(errorMessage);
    }
    
    // ⬇️ SIMULATE VERIFY CODE (Uncomment the block below to use simulation) ⬇️
    /*
    return new Promise(resolve => setTimeout(() => { 
        setPage('resetPassword'); 
        alert("Simulated: Code verified.");
        resolve(); 
    }, 500));
    */
  };

  const handleResetPassword = async (newPassword) => {
    console.log("Attempting to reset password with new password...");
    
    try {
        // ⬇️ LIVE API CALL ⬇️
        const response = await axios.post(`${API_BASE_URL}/api/v1/auth/reset-password`, { email: resetEmail, newPassword });
        alert("Password reset successfully!");
        setPage('passwordChanged');
        return response;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to reset password.";
        alert(errorMessage);
        throw new new Error(errorMessage);
    }
    
    // ⬇️ SIMULATE RESET PASSWORD (Uncomment the block below to use simulation) ⬇️
    /*
    return new Promise(resolve => setTimeout(() => { 
        setPage('passwordChanged'); 
        alert("Simulated: Password reset.");
        resolve(); 
    }, 500));
    */
  };

  // ⬇️ CORE LOGOUT EXECUTION FUNCTION ⬇️
  const executeLogout = () => {
    console.log("Logging out...");
    Cookies.remove('auth_token');
    sessionStorage.clear(); // Clear all user data
   setIsAuthenticated(false);
    setPage('login');
    
    // Reset state to initial unauthenticated defaults
    setUsername(getDisplayNameFromEmail("") || "Keshav");
    setProfileImage(generateAvatarUrl("Keshav"));
    setUserEmail('');
    setShowGlobalLogoutModal(false); // Close modal after logout
  };
    
  // ⬇️ Function passed to HOMEPAGE (Triggers Modal display) ⬇️
  const handleLogoutTrigger = () => {
      setShowGlobalLogoutModal(true);
  };
    
  // ⬇️ Function passed to Modal for confirmation ⬇️
  const handleLogoutConfirmation = () => {
      executeLogout();
  };
    
  const handleLogoutCancel = () => {
      setShowGlobalLogoutModal(false);
  };


  // ======================== RENDER ========================
  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          // --- AUTH FLOW ---
          <motion.div
            key="auth-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center bg-black" // Centering auth card
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

                {page === 'verifyCode' && (
                  <VerifyCodePage
                    key="verify"
                    setPage={setPage}
                    onVerify={handleVerifyCode}
                  />
                )}
                {page === 'resetPassword' && (
                  <ResetPasswordPage
                    key="reset"
                    setPage={setPage}
                    onResetPassword={handleResetPassword}
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
        ) : (
          // --- HOME PAGE ---
          // YAHAN PAR PROPS ADD KAR DIYE HAIN
       <HomePage
            key="home"
            isAuthenticated={isAuthenticated}
            onLogout={handleLogoutTrigger} // ⬅️ NEW: Header Nav calls this
            setPage={setPage} // <-- YEH FIX HAI
            page={page}      // <-- YEH FIX HAI
            username={username}
            setUsername={setUsername}
            userEmail={userEmail} 
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
        )}
      </AnimatePresence>
      
      {/* ⬇️ GLOBAL LOGOUT CONFIRMATION MODAL ⬇️ */}
      <AnimatePresence>
          {showGlobalLogoutModal && (
            <LogoutConfirmationModal
                onLogout={handleLogoutConfirmation} // Calls executeLogout
                onCancel={handleLogoutCancel}
            />
          )}
      </AnimatePresence>
    </div>
  );
}

