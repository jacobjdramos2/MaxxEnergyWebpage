import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL query parameters or localStorage
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    
    // Try to get token from URL first, then from localStorage
    const resetToken = tokenFromUrl || localStorage.getItem('resetToken');
    
    if (resetToken) {
      setToken(resetToken);
      validateToken(resetToken);
    } else {
      setIsValidating(false);
      setMessage('No reset token found. Please request a new password reset.');
    }
  }, [location.search]);

  // Validate the token with the backend
  const validateToken = async (resetToken) => {
    try {
      const response = await fetch(`http://localhost:8081/api/auth/validate-reset-token?token=${resetToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setIsTokenValid(true);
      } else {
        setMessage(data.error || 'Invalid or expired token. Please request a new password reset.');
      }
    } catch (error) {
      console.error('Error validating token:', error);
      setMessage('An error occurred while validating your token. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    // Validate passwords
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Create form data
      const formData = new URLSearchParams();
      formData.append('token', token);
      formData.append('newPassword', newPassword);

      // Send request to backend
      const response = await fetch('http://localhost:8081/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setMessage('Your password has been reset successfully.');
        // Clear the token from localStorage
        localStorage.removeItem('resetToken');
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage(data.error || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while validating token
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
          <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
          <p>Validating your reset token...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
        
        {!isTokenValid ? (
          <div className="text-center">
            <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
              {message}
            </div>
            <Link 
              to="/forgot-password" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Request a new password reset
            </Link>
          </div>
        ) : isSuccess ? (
          <div className="text-center">
            <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
              {message}
            </div>
            <p className="mb-4">
              You will be redirected to the login page shortly.
            </p>
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-600">
              Please enter your new password below.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  required
                  minLength="6"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  required
                  minLength="6"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 rounded-lg transition ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Processing...' : 'Reset Password'}
              </button>
            </form>
            
            {message && (
              <p className="mt-4 text-center text-sm text-red-600">{message}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;