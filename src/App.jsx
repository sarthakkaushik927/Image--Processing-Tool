import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { LogOut } from 'lucide-react';
import { 
  Routes, 
  Route, 
  Navigate, 
  useNavigate, 
  useLocation,
  useParams 
} from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

// Page Imports
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import PasswordChangedPage from './pages/PasswordChangedPage.jsx';
import ForgotPasswordSuccessPage from './pages/ForgotPasswordSuccessPage.jsx';
import HomePage from './pages/HomePage.jsx'; 
import AuthCard from './components/AuthCard.jsx';
import DobbyFloatingChat from "./components/DobbyFloatingChat.jsx";

const API_BASE_URL = "https://image-processing-app-sepia.vercel.app";
const DOWNLOAD_STORAGE_KEY = 'fotoFixDownloads';

// --- HELPER 1: Redirect Component ---
// Catches the backend URL and redirects to the frontend URL
const BackendLinkRedirect = () => {
  const { token } = useParams();
  return <Navigate to={`/reset-password/${token}`} replace />;
};

// --- HELPER 2: Standard Utilities ---
const getSavedDownloads = () => {
  try {
    const stored = localStorage.getItem(DOWNLOAD_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) { return []; }
};

const getInitialState = (key, defaultValue) => {
  try {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return defaultValue;
    let parsedValue = JSON.parse(storedValue);
    if (typeof parsedValue === 'string') {
      try { parsedValue = JSON.parse(parsedValue); } catch (e) {}
    }
    return parsedValue;
  } catch (error) { return defaultValue; }
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

// --- Modals ---
function LogoutConfirmationModal({ onLogout, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#1f1f3d]/80 border border-gray-700 rounded-2xl p-8 shadow-xl w-full max-w-xs"
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold mb-4 text-center">Confirm Logout</h3>
          <button onClick={onLogout} className="w-full px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg">
            <LogOut size={20} className="inline mr-2" /> Logout
          </button>
          <button onClick={onCancel} className="w-full px-6 py-3 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg">
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// --- Wrapper for Reset Password to handle URL Params ---
const ResetPasswordWrapper = ({ onResetPassword, setResetToken }) => {
  const { token } = useParams();
  
  useEffect(() => {
    if (token) setResetToken(token);
  }, [token, setResetToken]);

  return <ResetPasswordPage onResetPassword={onResetPassword} />;
};

// --- Layout Helper for Auth Pages ---
const AuthCardPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="min-h-screen flex items-center justify-center bg-black"
  >
    <AuthCard>{children}</AuthCard>
  </motion.div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!Cookies.get('auth_token'));
  
  const initialEmail = getInitialState('userEmail', '');
  const initialUsername = getInitialState('username', getDisplayNameFromEmail(initialEmail) || "Keshav");

  const [username, setUsername] = useState(initialUsername);
  const [profileImage, setProfileImage] = useState(() => getInitialState('profileImage', generateAvatarUrl(initialUsername)));
  const [userEmail, setUserEmail] = useState(initialEmail);
  const [resetEmail, setResetEmail] = useState(''); 
  const [showGlobalLogoutModal, setShowGlobalLogoutModal] = useState(false);
  const [resetToken, setResetToken] = useState(null);

  // Sync state to LocalStorage
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
    localStorage.setItem(DOWNLOAD_STORAGE_KEY, JSON.stringify([newDownload, ...downloads]));
    return newDownload;
  };

  // --- Auth Handlers ---
  const handleLogin = async (email, password) => {
    const loadingToastId = toast.loading('Logging in...');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, { email, password });
      const token = response.data?.token || 'mock-token';
      const apiUsername = response.data?.user?.userName || getDisplayNameFromEmail(email);
      const apiEmail = response.data?.user?.email || email;

      Cookies.set('auth_token', token, { expires: 7, secure: true, sameSite: 'Strict' });
      setIsAuthenticated(true);
      setUsername(apiUsername);
      setUserEmail(apiEmail);
      setProfileImage(generateAvatarUrl(apiUsername));
      
      toast.success('Logged in successfully!', { id: loadingToastId });
      navigate('/'); 
      return response;
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed.";
      toast.error(msg, { id: loadingToastId });
      throw new Error(msg);
    }
  };

  const handleSignup = async (username, email, password) => {
    try {
      await toast.promise(
        axios.post(`${API_BASE_URL}/api/v1/auth/register`, { userName: username, email, password, confirmPassword: password }),
        { loading: 'Creating account...', success: 'Signup successful! Please log in.', error: (err) => err.response?.data?.message || "Signup failed." }
      );
      navigate('/login');
    } catch (error) { throw error; }
  };

const handleForgotPassword = async (email) => {
    // ✅ AUTOMATIC: Detects if you are on Localhost or Vercel
    const resetUrl = `${window.location.origin}/reset-password`; 

    try {
      await toast.promise(
        axios.post(`${API_BASE_URL}/api/v1/auth/forgot-password`, { 
          email, 
          resetUrl // The backend will use this to generate the email link
        }),
        { 
          loading: 'Sending link...', 
          success: 'Reset link sent!', 
          error: (err) => err.response?.data?.message || "Failed." 
        }
      );
      setResetEmail(email);
      navigate('/forgot-password-success');
    } catch (error) { throw error; }
  };

  const handleResetPassword = async (newPassword) => {
    if (!resetToken) {
      toast.error("Invalid token. Try again.");
      navigate('/login');
      return;
    }
    try {
      await toast.promise(
        axios.post(`${API_BASE_URL}/api/v1/auth/reset-password/${resetToken}`, { password: newPassword, confirmPassword: newPassword }),
        { loading: 'Resetting...', success: 'Password reset!', error: (err) => err.response?.data?.message || "Failed." }
      );
      setResetToken(null);
      navigate('/password-changed');
    } catch (error) { throw error; }
  };

  const executeLogout = () => {
    Cookies.remove('auth_token');
    localStorage.clear();
    sessionStorage.removeItem('has_seen_splash'); 

    setIsAuthenticated(false);
    setUsername(getDisplayNameFromEmail("") || "Keshav");
    setUserEmail('');
    setProfileImage(generateAvatarUrl("Keshav"));
    setShowGlobalLogoutModal(false);
    toast.success("Logged out.");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence mode="wait">
        <Routes location={location}>
          
          {/* ✅ CRITICAL FIX: Intercept the Backend URL and redirect to Frontend URL */}
          <Route 
            path="/api/v1/auth/reset-password/:token" 
            element={<BackendLinkRedirect />} 
          />
          
          {/* Public Routes */}
          <Route path="/login" element={!isAuthenticated ? (
            <AuthCardPage><LoginPage onLogin={handleLogin} /></AuthCardPage>
          ) : <Navigate to="/" />} />

          <Route path="/signup" element={!isAuthenticated ? (
            <AuthCardPage><SignupPage onSignup={handleSignup} /></AuthCardPage>
          ) : <Navigate to="/" />} />

          <Route path="/forgot-password" element={(
            <AuthCardPage><ForgotPasswordPage onForgot={handleForgotPassword} /></AuthCardPage>
          )} />

          <Route path="/forgot-password-success" element={(
            <AuthCardPage><ForgotPasswordSuccessPage /></AuthCardPage>
          )} />

          <Route path="/reset-password/:token" element={(
            <AuthCardPage>
              <ResetPasswordWrapper onResetPassword={handleResetPassword} setResetToken={setResetToken} />
            </AuthCardPage>
          )} />

          <Route path="/password-changed" element={(
            <AuthCardPage><PasswordChangedPage /></AuthCardPage>
          )} />

          {/* Protected Route */}
          <Route path="/*" element={isAuthenticated ? (
            <HomePage 
              isAuthenticated={isAuthenticated}
              onLogout={() => setShowGlobalLogoutModal(true)}
              username={username}
              setUsername={setUsername}
              userEmail={userEmail}
              profileImage={profileImage}
              setProfileImage={setProfileImage}
              onSaveDownload={handleSaveDownload}
            />
          ) : <Navigate to="/login" />} />
          
        </Routes>
      </AnimatePresence>

      <AnimatePresence>
        {showGlobalLogoutModal && (
          <LogoutConfirmationModal onLogout={executeLogout} onCancel={() => setShowGlobalLogoutModal(false)} />
        )}
      </AnimatePresence>

      <DobbyFloatingChat isAuthenticated={isAuthenticated} />
      <Toaster position="top-right" gutter={12} toastOptions={{ style: { background: '#1f1f3d', color: '#e0e0e0', border: '1px solid #4a4a6a' } }} />
    </div>
  );
}