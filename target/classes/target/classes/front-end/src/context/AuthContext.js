import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/user/info', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else if (response.status === 401 || response.status === 403) {
          // User is not authenticated, this is normal
          setUser(null);
        } else {
          console.error('Unexpected response status:', response.status);
          setUser(null);
        }
      } catch (err) {
        console.error('Error checking auth status:', err);
        // Don't set error for network issues, just set user to null
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        // Fetch user info after successful login
        const userInfoResponse = await fetch('http://localhost:8081/api/user/info', {
          method: 'GET',
          credentials: 'include',
        });

        if (userInfoResponse.ok) {
          const userData = await userInfoResponse.json();
          setUser(userData);
          return { success: true, user: userData };
        } else {
          throw new Error('Failed to fetch user info');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid credentials');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        return { success: true };
      } else {
        throw new Error('Logout failed');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Get user role
  const getUserRole = () => {
    if (!user || !user.authorities || user.authorities.length === 0) {
      return null;
    }

    // Extract roles from authorities
    const roles = user.authorities.map(auth => {
      // Remove "ROLE_" prefix if it exists
      return auth.authority.replace('ROLE_', '');
    });

    // Return the first role (assuming a user has only one primary role)
    return roles[0];
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!user || !user.authorities) return false;

    return user.authorities.some(auth => 
      auth.authority === role || auth.authority === `ROLE_${role}`
    );
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    getUserRole,
    hasRole,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
