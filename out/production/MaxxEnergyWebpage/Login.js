import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login, user, isAuthenticated, loading, error } = useAuth();

  // handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Navigate to the appropriate dashboard based on user role
  const navigateToRoleDashboard = (authorities) => {
    if (!authorities || authorities.length === 0) {
      console.error("No authorities found");
      return;
    }

    // Extract roles from authorities
    const roles = authorities.map(auth => {
      // Remove "ROLE_" prefix if it exists
      return auth.authority.replace('ROLE_', '');
    });

    // Check roles and navigate accordingly
    if (roles.includes('ADMIN')) {
      navigate('/admin-dashboard');
    } else if (roles.includes('ENGINEER')) {
      navigate('/engineer-dashboard');
    } else if (roles.includes('EMPLOYEE')) {
      navigate('/employee-dashboard');
    } else {
      console.error("Unknown role:", roles);
    }
  };

  // Check if user is already authenticated and redirect accordingly
  useEffect(() => {
    if (isAuthenticated && user && user.authorities) {
      navigateToRoleDashboard(user.authorities);
    }
  }, [isAuthenticated, user, navigate]);

  // login function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Check if the username field is empty
    if (form.username === null || form.username.trim() === "") {
      setMessage("❌ Username field cannot be empty.");
      return;
    }

    // Check if the password field is empty
    if (form.password === null || form.password.trim() === "") {
      setMessage("❌ Password field cannot be empty.");
      return;
    }

    try {
      const result = await login(form.username, form.password);

      if (result.success) {
        setMessage("✅ Login successful!");
        // Navigation will happen in the useEffect when isAuthenticated changes
      } else {
        setMessage(result.error || "❌ Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("❌ Server error, try again later");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}

        {user && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">User Information</h2>
            <div className="text-sm">
              <p><span className="font-medium">Username:</span> {user.username}</p>
              <p className="mt-1"><span className="font-medium">Roles:</span> {
                user.authorities && 
                Array.isArray(user.authorities) ? 
                user.authorities.map(auth => auth.authority).join(', ') :
                JSON.stringify(user.authorities)
              }</p>
              <p className="mt-1"><span className="font-medium">Account Status:</span> {
                user.enabled ? "Active" : "Inactive"
              }</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
