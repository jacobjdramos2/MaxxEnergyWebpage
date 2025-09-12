import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    // Validate username/email
    if (!username.trim()) {
      setMessage('Please enter your username or email address');
      setIsLoading(false);
      return;
    }

    try {
      // Create form data
      const formData = new URLSearchParams();
      formData.append('username', username);

      // Send request to backend
      const response = await fetch('http://localhost:8081/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setMessage('Password reset instructions have been sent to your email address.');
        
        // In a real application, we would redirect to a confirmation page
        // For demo purposes, we'll store the token in localStorage
        // This is NOT secure and should NOT be done in production
        if (data.token) {
          localStorage.setItem('resetToken', data.token);
        }
      } else {
        setMessage(data.error || 'Failed to process your request. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Forgot Password</h1>
        
        {isSuccess ? (
          <div className="text-center">
            <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
              {message}
            </div>
            <p className="mb-4">
              Please check your email for instructions to reset your password.
            </p>
            <div className="mt-6">
              <Link 
                to="/reset-password" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Go to Reset Password
              </Link>
            </div>
            <div className="mt-2">
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-600">
              Enter your username or email address and we'll send you instructions to reset your password.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username or Email
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  required
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
            
            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;