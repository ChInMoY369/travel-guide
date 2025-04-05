import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getUserProfile } from '../utils/api';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Fetch user profile using token
          const response = await getUserProfile();
          console.log('AuthContext - Retrieved user profile on mount:', {
            id: response.data._id,
            email: response.data.email,
            role: response.data.role
          });
          
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          console.log('AuthContext - No token found, user not authenticated');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Failed to authenticate token:', err);
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await loginUser(credentials);
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      
      // Set user data
      const userData = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        profilePicture: response.data.profilePicture,
        bio: response.data.bio,
        preferences: response.data.preferences
      };
      
      console.log('Setting user data after login:', userData);
      setUser(userData);
      setIsAuthenticated(true);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await registerUser(userData);
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      
      // Set user data
      const registeredUser = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        profilePicture: response.data.profilePicture,
        bio: response.data.bio,
        preferences: response.data.preferences
      };
      
      console.log('Setting user data after registration:', registeredUser);
      setUser(registeredUser);
      setIsAuthenticated(true);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user in context
  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 