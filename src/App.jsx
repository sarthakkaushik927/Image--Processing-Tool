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
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
// ⬇️ 1. REMOVED VerifyCodePage ⬇️
// import VerifyCodePage from './pages/VerifyCodePage.jsx'; 
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import PasswordChangedPage from './pages/PasswordChangedPage.jsx';
// ⬇️ 2. ADDED ForgotPasswordSuccessPage ⬇️
import ForgotPasswordSuccessPage from './pages/ForgotPasswordSuccessPage.jsx';
import HomePage from './pages/HomePage.jsx';
import AccountPage from './pages/AccountPage.jsx';
// === Import Components ===
import AuthCard from './components/AuthCard.jsx';
import DobbyFloatingChat from "./components/DobbyFloatingChat.jsx";

// =======================================================================
//  API Configuration
// =======================================================================
const API_BASE_URL = 'https://image-processing-app-sepia.vercel.app';


// --- DOWNLOAD HELPERS (FIXED: Using localStorage) ---
// ... (getSavedDownloads function remains the same) ...
const DOWNLOAD_STORAGE_KEY = 'fotoFixDownloads';

const getSavedDownloads = () => {
    try {
        const stored = localStorage.getItem(DOWNLOAD_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};
// --------------------------

// ... (getInitialState function remains the same) ...
const getInitialState = (key, defaultValue) => {
    try {
        const storedValue = localStorage.getItem(key);
        if (!storedValue) return defaultValue;

        let parsedValue = JSON.parse(storedValue);
        
        if (typeof parsedValue === 'string') {
            try {
                parsedValue = JSON.parse(parsedValue);
            } catch (e) {
                // If secondary parse fails, use the current string
            }
        }
        
        return parsedValue;

    } catch (error) {
        console.error(`Error reading local storage key ${key}`, error);
        return defaultValue;
    }
};

// ... (getDisplayNameFromEmail function remains the same) ...
const getDisplayNameFromEmail = (email) => {
    if (!email) return "Guest";
    const localPart = email.split('@')[0].split(/[.\-_]/)[0];
    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
}

// ... (generateAvatarUrl function remains the same) ...
const generateAvatarUrl = (name) => {
    const initial = name ? name.charAt(0).toUpperCase() : 'U';
    return `https://placehold.co/40x40/7c3aed/ffffff?text=${initial}`;
};

// --- LOGOUT CONFIRMATION MODAL COMPONENT ---
// ... (LogoutConfirmationModal component remains the same) ...
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
//  Main App Component (State-Based Navigation)
// =======================================================================
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
  
  // ⬇️ 3. ADDED New State for the Token ⬇️
  const [resetToken, setResetToken] = useState(null);

  // ⬇️ 4. ADDED useEffect to read URL for token ⬇️
  useEffect(() => {
    // Check the URL when the app loads
    const path = window.location.pathname;
    
    if (path.startsWith('/reset-password/')) {
      // Extract the token from the URL
      // e.g., /reset-password/YOUR_TOKEN_HERE
      const token = path.split('/')[2];
      
      if (token) {
        console.log("Found reset token in URL:", token);
        // We are NOT logged in
        setIsAuthenticated(false);
        Cookies.remove('auth_token');
        localStorage.clear();

        setResetToken(token); // ⬅️ Save the token
        setPage('resetPassword'); // ⬅️ Show the reset password page
      }
    }
  }, []); // ⬅️ The empty array [ ] means this runs only ONCE on load


  // ... (useEffect for syncing user state remains the same) ...
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


  // ... (handleSaveDownload function remains the same) ...
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
    console.log(`Saved new download: ${newDownload.filename}`);
    return newDownload;
  };

  // ... (handleLogin function remains the same) ...
  const handleLogin = async (email, password) => {
    console.log("Attempting LIVE login with:", { email, password });
    
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
      setPage(null); // Go to Home
      return response;

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed.";
      console.error("Backend Login Error:", error.response || error);
      alert(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // ... (handleSignup function remains the same) ...
  const handleSignup = async (username, email, password) => {
    console.log("Attempting LIVE signup with:", { username, email, password });
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/register`, { 
        userName: username, 
        email, 
        password, 
        confirmPassword: password 
      });
      
      alert("Signup successful! Please log in.");
      setPage('login'); 
      return response;

    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                             error.message || 
                             "Signup failed due to invalid data (400 Bad Request).";
      
      console.error("Backend Signup Error:", error.response || error);
      alert(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // ⬇️ 5. UPDATED handleForgotPassword ⬇️
  const handleForgotPassword = async (email) => {
    console.log("Requesting password reset for:", email);
    
    // This is the link your backend will email to the user.
    const resetUrl = "https://image-processing-app-sepia.vercel.app/reset-password";

    try {
        const response = await axios.post(`${API_BASE_URL}/api/v1/auth/forgot-password`, { 
          email,
          resetUrl 
        });
        
        setResetEmail(email); // Keep this
        setPage('forgotPasswordSuccess'); // ⬅️ SHOW THE NEW SUCCESS PAGE
        return response;

    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to send reset link.";
        alert(errorMessage);
        throw new Error(errorMessage);
    }
  };

  // ⬇️ 6. REMOVED handleVerifyCode ⬇️
  // const handleVerifyCode = async (code) => { ... };

  // ⬇️ 7. REPLACED handleResetPassword with new logic ⬇️
  const handleResetPassword = async (newPassword) => {
    console.log("Attempting to reset password with new password...");
    
    if (!resetToken) {
      alert("Invalid or missing reset token. Please try again from the login page.");
      setPage('login');
      return;
    }

    try {
      // Note: The token is in the URL, and the password is in the body
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/reset-password/${resetToken}`, 
        { 
          password: newPassword,
          confirmPassword: newPassword 
        }
      );
      
      alert("Password reset successfully!");
      setPage('passwordChanged'); // ⬅️ Show the final success page
      setResetToken(null); // Clear the token
      return response;

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to reset password. The link may be expired.";
      alert(errorMessage);
      setPage('login'); // Send them to login on failure
      throw new Error(errorMessage);
    }
  };


  // ... (Logout functions remain the same) ...
  const executeLogout = () => {
    console.log("Logging out...");
    Cookies.remove('auth_token');
    
    localStorage.clear(); 
    
    setIsAuthenticated(false);
    setPage('login');
    
    setUsername(getDisplayNameFromEmail("") || "Keshav");
    setProfileImage(generateAvatarUrl("Keshav"));
    setUserEmail('');
    setShowGlobalLogoutModal(false); 
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


  // ======================== RENDER ========================
  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence mode="wait">
        {!isAuthenticated && page !== 'resetPassword' ? ( // ⬅️ 8. UPDATED Condition
          // --- AUTH FLOW ---
          <motion.div
            key="auth-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center bg-black" 
          >
            <AuthCard>
              {/* ⬇️ 9. UPDATED Page Routing Logic ⬇️ */}
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

                {/* --- THIS IS THE NEW PAGE --- */}
                {page === 'forgotPasswordSuccess' && (
                  <ForgotPasswordSuccessPage
                    key="forgotSuccess"
                    setPage={setPage}
                  />
                )}

                {/* --- THIS PAGE IS REMOVED --- */}
                {/* {page === 'verifyCode' && ( ... )} */}
                
                {page === 'passwordChanged' && (
                  <PasswordChangedPage
                    key="changed"
                    setPage={setPage}
                  />
                )}
              </AnimatePresence>
            </AuthCard>
          </motion.div>
        
        ) : (page === 'resetPassword' && !isAuthenticated) ? ( // ⬅️ 10. ADDED This block
          
          // --- RESET PASSWORD FLOW (Must be unauthenticated) ---
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
           // --- HOME PAGE (Authenticated) ---
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
      
      {/* --- GLOBAL LOGOUT MODAL --- */}
      <AnimatePresence>
          {showGlobalLogoutModal && (
            <LogoutConfirmationModal
                onLogout={handleLogoutConfirmation} 
                onCancel={handleLogoutCancel}
            />
          )}
      </AnimatePresence>

      {/* --- GLOBAL CHATBOT --- */}
      <DobbyFloatingChat isAuthenticated={isAuthenticated}/>
    </div>
  );
}

