import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Validate user data structure
        if (parsedUser && parsedUser.email && parsedUser.id) {
          setUser(parsedUser);
        } else {
          console.warn('Invalid user data format, clearing storage');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const clearStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
  };

  const login = async (emailOrUserData, password) => {
    try {
      // Check if this is an OAuth login (first parameter is a user data object with accessToken)
      if (typeof emailOrUserData === 'object' && emailOrUserData !== null && emailOrUserData.accessToken) {
        // This is OAuth login - user data is already provided
        const userData = emailOrUserData;
        
        // Store the token and user data
        localStorage.setItem('token', userData.accessToken);
        const userInfo = {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);
        
        return { success: true };
      }
      
      // Regular email/password login
      // Clear any existing tokens before login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Debug incoming parameters
      console.log('Raw login params:', { email: typeof emailOrUserData, emailValue: emailOrUserData, password: typeof password });
      
      // Ensure clean credentials with better validation
      let cleanEmail = '';
      let cleanPassword = '';
      
      if (typeof emailOrUserData === 'object' && emailOrUserData !== null) {
        // If email is an object, try to extract string value
        cleanEmail = emailOrUserData.target ? emailOrUserData.target.value : (emailOrUserData.value || String(emailOrUserData));
      } else {
        cleanEmail = String(emailOrUserData || '').trim();
      }
      
      if (typeof password === 'object' && password !== null) {
        // If password is an object, try to extract string value  
        cleanPassword = password.target ? password.target.value : (password.value || String(password));
      } else {
        cleanPassword = String(password || '');
      }
      
      const credentials = {
        email: cleanEmail,
        password: cleanPassword
      };
      
      console.log('Cleaned login attempt:', { email: credentials.email, passwordLength: credentials.password.length });
      
      // Validate credentials before sending
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          error: 'Email and password are required'
        };
      }
      
      const response = await authAPI.login(credentials);
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      // Clear storage on error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    clearStorage();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    clearStorage,
    loading,
    isAuthenticated: !!user,
    isTeacher: user?.role === 'TEACHER',
    isStudent: user?.role === 'STUDENT'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};