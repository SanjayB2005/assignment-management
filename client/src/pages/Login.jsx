import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, BookOpen, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import GoogleOAuthLogin from '../components/GoogleOAuthLogin';
import GoogleLoginInfo from '../components/GoogleLoginInfo';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const { login, user, clearStorage } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate(user.role === 'TEACHER' ? '/teacher' : '/student');
    }
  }, [user, navigate]);

  // Check for OAuth errors in URL params
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error) {
      switch (error) {
        case 'oauth_failed':
          setError('Google OAuth authentication failed. Please try again.');
          break;
        case 'no_code':
          setError('No authorization code received from Google.');
          break;
        case 'auth_failed':
          setError('Authentication with our server failed. Please try again.');
          break;
        case 'callback_error':
          setError('An error occurred during Google OAuth callback.');
          break;
        default:
          setError('An OAuth error occurred. Please try again.');
      }
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Navigation will be handled by the useEffect above
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <Header />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-20 pb-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
              className="flex justify-center items-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-3xl shadow-glass">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Welcome Back
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Sign in to your assignment management account
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Fast</span>
              </div>
              <div className="flex items-center space-x-1">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>Smart</span>
              </div>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-glass p-8 hover:shadow-glow transition-all duration-500"
          >
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl"
                >
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                  {error.includes('JSON') || error.includes('token') || error.includes('400') ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        clearStorage();
                        setError('');
                        window.location.reload();
                      }}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline underline-offset-2"
                    >
                      Clear cache and retry
                    </motion.button>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                    focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'
                  }`}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    required
                    className={`block w-full pl-12 pr-4 py-4 bg-gray-50/50 backdrop-blur-sm border rounded-2xl transition-all duration-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white/80 hover:bg-white/60 ${
                      focusedField === 'email' 
                        ? 'border-blue-500 shadow-glow bg-white/80' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                  <motion.div
                    initial={false}
                    animate={{ 
                      scale: focusedField === 'email' ? 1 : 0,
                      opacity: focusedField === 'email' ? 1 : 0 
                    }}
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative group">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                    focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'
                  }`}>
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    required
                    className={`block w-full pl-12 pr-12 py-4 bg-gray-50/50 backdrop-blur-sm border rounded-2xl transition-all duration-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white/80 hover:bg-white/60 ${
                      focusedField === 'password' 
                        ? 'border-blue-500 shadow-glow bg-white/80' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </motion.button>
                  <motion.div
                    initial={false}
                    animate={{ 
                      scale: focusedField === 'password' ? 1 : 0,
                      opacity: focusedField === 'password' ? 1 : 0 
                    }}
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 overflow-hidden ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-glow'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  {loading ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 group">
                      <span>Sign In</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-r from-white via-gray-50 to-white text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </motion.div>

            {/* Google Login */}
            <motion.div variants={itemVariants} className="space-y-4">
              <GoogleLoginInfo />
              <div className="transform hover:scale-[1.02] transition-transform duration-200">
                <GoogleOAuthLogin
                  onSuccess={(userData) => {
                    // Navigation will be handled by the AuthContext and useEffect
                    console.log('Google login successful:', userData);
                  }}
                  onError={(error) => {
                    setError(error);
                  }}
                />
              </div>
            </motion.div>

            {/* Register Link */}
            <motion.div variants={itemVariants} className="text-center pt-6">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text hover:from-blue-700 hover:to-purple-700 transition-all duration-200 relative group"
                >
                  Create one here
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </p>
            </motion.div>

            {/* Additional Features */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
              <div className="text-center group cursor-pointer">
                <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors mb-2">
                  <Shield className="h-5 w-5 text-blue-600 mx-auto" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Secure Login</p>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="bg-green-50 p-3 rounded-xl group-hover:bg-green-100 transition-colors mb-2">
                  <Zap className="h-5 w-5 text-green-600 mx-auto" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Lightning Fast</p>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="bg-purple-50 p-3 rounded-xl group-hover:bg-purple-100 transition-colors mb-2">
                  <Sparkles className="h-5 w-5 text-purple-600 mx-auto" />
                </div>
                <p className="text-xs text-gray-600 font-medium">AI Powered</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Footer Note */}
          <motion.div variants={itemVariants} className="text-center pt-8">
            <p className="text-xs text-gray-400 leading-relaxed">
              By signing in, you agree to our Terms of Service and Privacy Policy.<br />
              © 2024 AssignmentHub. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;