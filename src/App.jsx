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
import localforage from 'localforage'; 

// --- Pages ---
import LandingPage from './pages/LandingPage.jsx'; // ✅ New Landing Page
import HomePage from './pages/HomePage.jsx';       // ✅ Main Dashboard
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import AccountPage from './pages/AccountPage.jsx';

// --- Auth Pages ---
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import PasswordChangedPage from './pages/PasswordChangedPage.jsx';
import ForgotPasswordSuccessPage from './pages/ForgotPasswordSuccessPage.jsx';

// --- Views/Components ---
import DiscoverPage from './components/DiscoverView.jsx'; 
import DownloadsView from './components/DownloadsView.jsx';
import HelpView from './components/HelpView.jsx';
import AboutUsView from './components/AboutUsView.jsx';
import ToolsView from './components/ToolsView.jsx';
import AuthCard from './components/AuthCard.jsx';
import DobbyFloatingChat from "./components/DobbyFloatingChat.jsx";

// --- Tool Workspaces ---
import TextExtractorWorkspace from './components/TextExtractorWorkspace.jsx';
import MagicBrushWorkspace from './components/MagicBrushWorkspace.jsx';
import FindObjectWorkspace from './components/FindObjectWorkspace.jsx';
import CropWorkspace from './components/CropWorkspace.jsx';
import AdjustmentsWorkspace from './components/AdjustmentsWorkspace.jsx';
import FormatConverterWorkspace from './components/FormatConverterWorkspace.jsx'; 
import AngleSliderWorkspace from './components/AngleSliderWorkspace.jsx';

// --- Configuration ---
const API_BASE_URL = "https://image-processing-app-sepia.vercel.app";
const DOWNLOAD_STORAGE_KEY = 'fotoFixDownloads';

// ✅ Configure IndexedDB (Fixes Storage Limit Error)
localforage.config({
  name: 'FotoFixDB',
  storeName: 'downloads_store'
});

// --- Helpers ---
const BackendLinkRedirect = () => {
  const { token } = useParams();
  return <Navigate to={`/reset-password/${token}`} replace />;
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

// --- Logout Modal ---
function LogoutConfirmationModal({ onLogout, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#1f1f3d]/90 border border-gray-700 rounded-2xl p-8 shadow-xl w-full max-w-xs backdrop-blur-md"
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold mb-4 text-center text-white">Confirm Logout</h3>
          <button onClick={onLogout} className="w-full px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg flex items-center justify-center gap-2 transition-colors">
            <LogOut size={20} /> Logout
          </button>
          <button onClick={onCancel} className="w-full px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold shadow-lg transition-colors">
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// --- Auth Wrappers ---
const ResetPasswordWrapper = ({ onResetPassword, setResetToken }) => {
  const { token } = useParams();
  useEffect(() => { if (token) setResetToken(token); }, [token, setResetToken]);
  return <ResetPasswordPage onResetPassword={onResetPassword} />;
};

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
  
  const getInitial = (key, def) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : def;
    } catch { return def; }
  };

  const [username, setUsername] = useState(() => getInitial('username', 'User'));
  const [profileImage, setProfileImage] = useState(() => getInitial('profileImage', generateAvatarUrl('User')));
  const [userEmail, setUserEmail] = useState(() => getInitial('userEmail', ''));
  const [showGlobalLogoutModal, setShowGlobalLogoutModal] = useState(false);
  const [resetToken, setResetToken] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('username', JSON.stringify(username));
      localStorage.setItem('profileImage', JSON.stringify(profileImage));
      localStorage.setItem('userEmail', JSON.stringify(userEmail));
    }
  }, [username, profileImage, userEmail, isAuthenticated]);

  // ✅ Async Download Handler (Uses IndexedDB)
  const handleSaveDownload = async (dataUrl, filename) => {
    try {
      const existing = await localforage.getItem(DOWNLOAD_STORAGE_KEY);
      const downloads = existing ? existing : [];
      
      const newDownload = {
        id: Date.now(),
        filename: filename || `image_${Date.now()}.png`,
        dataUrl: dataUrl,
        date: new Date().toISOString()
      };
      
      const updated = [newDownload, ...downloads];
      await localforage.setItem(DOWNLOAD_STORAGE_KEY, updated);
      
      return newDownload;
    } catch (error) {
      console.error("Failed to save download:", error);
      toast.error("Could not save to library.");
    }
  };

  const handleLogin = async (email, password) => {
    const loadingToastId = toast.loading('Logging in...');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, { email, password });
      const token = response.data?.token;
      const apiUsername = response.data?.user?.userName || getDisplayNameFromEmail(email);
      const apiEmail = response.data?.user?.email || email;

      Cookies.set('auth_token', token, { expires: 7, secure: true, sameSite: 'Strict' });
      setIsAuthenticated(true);
      setUsername(apiUsername);
      setUserEmail(apiEmail);
      setProfileImage(generateAvatarUrl(apiUsername));
      
      toast.success('Welcome back!', { id: loadingToastId });
      // ✅ Redirect to Dashboard after login
      navigate('/dashboard'); 
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed.";
      toast.error(msg, { id: loadingToastId });
    }
  };

  const handleSignup = async (username, email, password) => {
    try {
      await toast.promise(
        axios.post(`${API_BASE_URL}/api/v1/auth/register`, { userName: username, email, password, confirmPassword: password }),
        { loading: 'Creating account...', success: 'Account created! Please log in.', error: (err) => err.response?.data?.message || "Signup failed." }
      );
      navigate('/login');
    } catch (error) { throw error; }
  };

  const handleForgotPassword = async (email) => {
    const resetUrl = `${window.location.origin}/reset-password`; 
    try {
      await toast.promise(
        axios.post(`${API_BASE_URL}/api/v1/auth/forgot-password`, { email, resetUrl }),
        { loading: 'Sending link...', success: 'Reset link sent!', error: "Failed to send link." }
      );
      navigate('/forgot-password-success');
    } catch (error) { throw error; }
  };

  const handleResetPassword = async (newPassword) => {
    if (!resetToken) return toast.error("Invalid session.");
    try {
      await toast.promise(
        axios.post(`${API_BASE_URL}/api/v1/auth/reset-password/${resetToken}`, { password: newPassword, confirmPassword: newPassword }),
        { loading: 'Resetting...', success: 'Password reset!', error: "Reset failed." }
      );
      navigate('/password-changed');
    } catch (error) { throw error; }
  };

  const executeLogout = () => {
    Cookies.remove('auth_token');
    localStorage.clear(); 
    // localforage.clear(); // Keep downloads even after logout? Optional.
    setIsAuthenticated(false);
    setShowGlobalLogoutModal(false);
    toast.success("Logged out.");
    // ✅ Redirect to Landing Page after logout
    navigate('/');
  };

  const pageProps = {
    isAuthenticated,
    onLogout: () => setShowGlobalLogoutModal(true),
    username,
    userEmail,
    profileImage
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          <Route path="/api/v1/auth/reset-password/:token" element={<BackendLinkRedirect />} />
          
          {/* ✅ 1. Landing Page (Default Public Route) */}
          <Route path="/" element={<LandingPage isAuthenticated={isAuthenticated} />} />

          {/* ✅ 2. Dashboard (Protected Main Route) */}
          <Route path="/dashboard" element={isAuthenticated ? (
            <HomePage {...pageProps} setUsername={setUsername} setProfileImage={setProfileImage} />
          ) : <Navigate to="/login" />} />

          {/* Auth Routes - Redirect to dashboard if already logged in */}
          <Route path="/login" element={!isAuthenticated ? <AuthCardPage><LoginPage onLogin={handleLogin} /></AuthCardPage> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!isAuthenticated ? <AuthCardPage><SignupPage onSignup={handleSignup} /></AuthCardPage> : <Navigate to="/dashboard" />} />
          
          {/* Password Recovery */}
          <Route path="/forgot-password" element={<AuthCardPage><ForgotPasswordPage onForgot={handleForgotPassword} /></AuthCardPage>} />
          <Route path="/forgot-password-success" element={<AuthCardPage><ForgotPasswordSuccessPage /></AuthCardPage>} />
          <Route path="/reset-password/:token" element={<AuthCardPage><ResetPasswordWrapper onResetPassword={handleResetPassword} setResetToken={setResetToken} /></AuthCardPage>} />
          <Route path="/password-changed" element={<AuthCardPage><PasswordChangedPage /></AuthCardPage>} />

          {/* Protected Navigation */}
          <Route path="/tools" element={isAuthenticated ? <ToolsView /> : <Navigate to="/login" />} />
          <Route path="/discover" element={isAuthenticated ? <DiscoverPage {...pageProps} /> : <Navigate to="/login" />} />
          <Route path="/downloads" element={isAuthenticated ? <DownloadsView {...pageProps} /> : <Navigate to="/login" />} />
          <Route path="/account" element={isAuthenticated ? <AccountPage {...pageProps} /> : <Navigate to="/login" />} />
          <Route path="/help" element={isAuthenticated ? <HelpView {...pageProps} /> : <Navigate to="/login" />} />
          <Route path="/about" element={isAuthenticated ? <AboutUsView {...pageProps} /> : <Navigate to="/login" />} />

          {/* Tool Routes - Passing the async save handler */}
          <Route path="/tools/text-extractor" element={isAuthenticated ? <TextExtractorWorkspace onImageDownloaded={handleSaveDownload} /> : <Navigate to="/login" />} />
          <Route path="/tools/magic-brush" element={isAuthenticated ? <MagicBrushWorkspace onImageDownloaded={handleSaveDownload} /> : <Navigate to="/login" />} />
          <Route path="/tools/find-object" element={isAuthenticated ? <FindObjectWorkspace onImageDownloaded={handleSaveDownload} /> : <Navigate to="/login" />} />
          <Route path="/tools/crop" element={isAuthenticated ? <CropWorkspace onImageDownloaded={handleSaveDownload} /> : <Navigate to="/login" />} />
          <Route path="/tools/adjustments" element={isAuthenticated ? <AdjustmentsWorkspace onImageDownloaded={handleSaveDownload} /> : <Navigate to="/login" />} />
          <Route path="/tools/format-converter" element={isAuthenticated ? <FormatConverterWorkspace onImageDownloaded={handleSaveDownload} /> : <Navigate to="/login" />} />
          <Route path="/tools/angle-slider" element={isAuthenticated ? <AngleSliderWorkspace onImageDownloaded={handleSaveDownload} /> : <Navigate to="/login" />} />

          {/* Catch-all redirect to Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
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