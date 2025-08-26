import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/api/entities';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

let authPromise = null; // Global promise to prevent multiple auth requests

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const authenticate = async () => {
    // If there's already an auth request in progress, wait for it
    if (authPromise) {
      console.log("AuthProvider: Auth request already in progress, waiting...");
      try {
        return await authPromise;
      } catch (error) {
        console.log("AuthProvider: Existing auth request failed, will retry");
        authPromise = null; // Clear failed promise
      }
    }

    // Create new auth promise
    authPromise = performAuthentication();
    
    try {
      const result = await authPromise;
      authPromise = null; // Clear successful promise
      return result;
    } catch (error) {
      authPromise = null; // Clear failed promise
      throw error;
    }
  };

  const performAuthentication = async () => {
    try {
      setError(null);
      console.log("AuthProvider: Starting authentication");
      
      const userData = await User.me();
      console.log("AuthProvider: Authentication successful", userData);
      
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("AuthProvider: Authentication failed:", error);
      
      if (error.message && error.message.includes('429')) {
        console.log("AuthProvider: Rate limited, will retry after delay");
        setError({ type: 'rate_limit', message: 'Too many requests, retrying...' });
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Recursive retry for rate limiting
        return await performAuthentication();
      }
      
      setError({ type: 'auth_failed', message: error.message });
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await User.logout();
      setUser(null);
      setError(null);
      
      // Clear storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Force clear state even if logout request fails
      setUser(null);
      setError(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        await authenticate();
      } catch (error) {
        console.log("AuthProvider: Initial auth failed, user likely not logged in");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = {
    user,
    isLoading,
    error,
    authenticate,
    logout,
    setUser // For manual user updates after profile changes
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}