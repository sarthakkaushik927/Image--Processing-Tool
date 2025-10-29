import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, Eye, EyeOff, CheckCircle, ArrowRight, Home,
  Download, UserCircle, Search, ArrowLeft, Settings, HelpCircle, LogOut,
  Image as ImageIcon, Loader2
} from 'lucide-react';

// === Import Pages ===
// Extensions wapas add kar diye hain
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import VerifyCodePage from './pages/VerifyCodePage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import PasswordChangedPage from './pages/PasswordChangedPage.jsx';
import HomePage from './pages/HomePage.jsx';
import AccountPage from './pages/AccountPage.jsx';
// === Import Components ===
import AuthCard from './components/AuthCard.jsx';

// =======================================================================
//  API Configuration
// =======================================================================
const API_BASE_URL = 'https://user-registeration-and-user-login-1-vpa5.onrender.com';


// =======================================================================
//  Main App Component (State-Based Navigation)
// =======================================================================
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [page, setPage] = useState('login'); // 'login', 'signup', 'forgotPassword', 'verifyCode', 'resetPassword', 'passwordChanged', 'account', 'downloads', 'search', or null
  const [username, setUsername] = useState("Keshu");
  const [profileImage, setProfileImage] = useState("https://placehold.co/40x40/7c3aed/ffffff?text=U");


  const handleLogin = async (email, password) => {
    console.log("Attempting login with:", { email, password });
    /* // --- AXIOS API CALL - COMMENTED OUT ---
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      setIsAuthenticated(true); 
      setPage(null); // Go to Home
    } catch (error) {
      alert(error.response?.data?.message || "Login failed.");
      throw error; 
    }
    */
    // Simulate login
    return new Promise(resolve => setTimeout(() => {
        setIsAuthenticated(true);
        setPage(null); // Go to Home
        resolve();
     }, 500));
  };

  const handleSignup = async (username, email, password) => {
    console.log("Attempting signup with:", { username, email, password });
    /* // --- AXIOS API CALL - COMMENTED OUT ---
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, { username, email, password });
      alert("Signup successful! Please log in.");
      setPage('login'); // Signup ke baad login page par bhejein
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed.");
      throw error;
    }
    */
    // Simulate signup
     return new Promise(resolve => setTimeout(() => {
        setPage('login');
        resolve();
     }, 500));
  };

  const handleForgotPassword = async (email) => {
    /* // API Call */
    return new Promise(resolve => setTimeout(() => { setPage('verifyCode'); resolve(); }, 500));
  };

  const handleVerifyCode = async (code) => {
    /* // API Call */
    return new Promise(resolve => setTimeout(() => { setPage('resetPassword'); resolve(); }, 500));
  };

  const handleResetPassword = async (newPassword) => {
    /* // API Call */
    return new Promise(resolve => setTimeout(() => { setPage('passwordChanged'); resolve(); }, 500));
  };

  const handleLogout = () => {
    console.log("Logging out...");
    setIsAuthenticated(false);
    setPage('login'); // Logout ke baad Login page par wapas
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
            onLogout={handleLogout}
            setPage={setPage} // <-- YEH FIX HAI
            page={page}      // <-- YEH FIX HAI
            username={username}
            setUsername={setUsername}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

