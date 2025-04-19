import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null,
    stats: {
      points: 0,
      followers: 0,
      following: 0,
      attractions: 0
    },
    loading: true
  });

  // Fetch user stats from API
  const fetchUserStats = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/auth/${email}`);
      const { points, followers, following, attractions } = response.data;
      
      setAuthState(prev => ({
        ...prev,
        stats: {
          points: points || 0,
          followers: followers || 0,
          following: following || 0,
          attractions: attractions || 0
        }
      }));
      
      // Cache in localStorage
      localStorage.setItem('userStats', JSON.stringify({
        points, followers, following, attractions
      }));
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      // Fallback to cached data
      const cachedStats = localStorage.getItem('userStats');
      if (cachedStats) {
        setAuthState(prev => ({
          ...prev,
          stats: JSON.parse(cachedStats)
        }));
      }
    }
  };

  // Update stats after actions (like follow, post creation, etc.)
  const updateStats = (newStats) => {
    setAuthState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        ...newStats
      }
    }));
    // Update localStorage
    localStorage.setItem('userStats', JSON.stringify({
      ...authState.stats,
      ...newStats
    }));
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        const userData = response.data.user;
        
        // Set auth state
        setAuthState({
          isLoggedIn: true,
          user: userData,
          stats: authState.stats, // Keep existing stats
          loading: false
        });

        // Store user data
        localStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('user', JSON.stringify(userData));
        
        // Fetch fresh stats
        await fetchUserStats(userData.email);
        
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
      Swal.fire({
        title: 'Login Failed',
        text: error.response?.data?.message || 'Invalid credentials',
        icon: 'error'
      });
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/logout', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear all auth data
      setAuthState({
        isLoggedIn: false,
        user: null,
        stats: {
          points: 0,
          followers: 0,
          following: 0,
          attractions: 0
        },
        loading: false
      });
      localStorage.removeItem('user');
      localStorage.removeItem('userStats');
      sessionStorage.removeItem('user');
    }
  };

  // Initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check session storage first
        const sessionUser = sessionStorage.getItem('user');
        if (sessionUser) {
          const parsedUser = JSON.parse(sessionUser);
          
          setAuthState(prev => ({
            ...prev,
            isLoggedIn: true,
            user: parsedUser,
            loading: false
          }));
          
          await fetchUserStats(parsedUser.email);
          return;
        }
        
        // Validate session with server
        const response = await axios.get('http://localhost:8080/api/auth/validate', {
          withCredentials: true
        });
        
        if (response.data.authenticated) {
          const userData = response.data.user;
          
          setAuthState({
            isLoggedIn: true,
            user: userData,
            stats: authState.stats,
            loading: false
          });
          
          sessionStorage.setItem('user', JSON.stringify(userData));
          await fetchUserStats(userData.email);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid session
        sessionStorage.removeItem('user');
      } finally {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };
  
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      isLoggedIn: authState.isLoggedIn,
      user: authState.user,
      stats: authState.stats,
      loading: authState.loading,
      login,
      logout,
      updateStats,
      fetchUserStats
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};