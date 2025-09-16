import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || '';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // firstName + password (replaces email)
  const [form, setForm] = useState({ firstName: '', password: '' });
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState(
    location.state?.justSignedUp ? '✅ Account created. Please log in.' : ''
  );
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setMessage('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const fn = form.firstName.trim();
    const pw = form.password; // allow spaces in pw
    if (!fn) return setMessage('❌ First name is required.');
    if (!pw) return setMessage('❌ Password is required.');

    setSubmitting(true);
    try {
      // Backend endpoint: POST /api/users/login?firstName=...&password=...
      const url = `${API_BASE}/api/users/login?firstName=${encodeURIComponent(fn)}&password=${encodeURIComponent(pw)}`;
      const res = await fetch(url, { method: 'POST' });

      if (res.ok) {
        const user = await res.json();
        (remember ? localStorage : sessionStorage).setItem('authUserId', String(user.id));
        navigate('/profile', { replace: true });
      } else if (res.status === 401) {
        setMessage('❌ Invalid first name or password.');
      } else {
        const text = await res.text().catch(() => '');
        setMessage(`❌ Login failed. ${text || ''}`.trim());
      }
    } catch {
      setMessage('❌ Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h2>Log in</h2>
      {message && <p>{message}</p>}

      <form onSubmit={onSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="firstName">First Name</label><br />
          <input
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            required
            autoComplete="given-name"
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Password</label><br />
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={onChange}
              required
              autoComplete="current-password"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Remember me
        </label>

        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Checking…' : 'Log in'}
          </button>

          {/* Sign Up button that routes to /signup */}
          <button type="button" onClick={() => navigate('/signup')}>
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}
