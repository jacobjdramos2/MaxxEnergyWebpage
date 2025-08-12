import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || '';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ firstName: '', email: '' });
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState(location.state?.justSignedUp ? '✅ Account created. Please log in.' : '');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setMessage('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const fn = form.firstName.trim();
    const em = form.email.trim();
    if (!fn) return setMessage('❌ First name is required.');
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return setMessage('❌ Enter a valid email.');

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/search?firstName=${encodeURIComponent(fn)}&email=${encodeURIComponent(em)}`);
      if (res.ok) {
        const user = await res.json();
        (remember ? localStorage : sessionStorage).setItem('authUserId', String(user.id));
        navigate('/profile', { replace: true });   // <-- after login go to Profile
      } else if (res.status === 404) {
        setMessage('❌ No user found with that first name and email.');
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
          <input id="firstName" name="firstName" value={form.firstName} onChange={onChange} required />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">Email</label><br />
          <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
        </div>

        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Remember me
        </label>

        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button type="submit" disabled={submitting}>{submitting ? 'Checking…' : 'Log in'}</button>

          {/* Sign Up button that routes to /signup */}
          <button type="button" onClick={() => navigate('/signup')}>Create account</button>
        </div>
      </form>
    </div>
  );
}
