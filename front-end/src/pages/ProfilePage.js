// src/pages/ProfilePage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || '';
const USE_MOCK = false;

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '' });
  const [origUser, setOrigUser] = useState(null); 
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const fetched = useRef(false);

  const getUserId = () =>
    localStorage.getItem('authUserId') || sessionStorage.getItem('authUserId');

  const validate = (values) => {
    const e = {};
    const fn = (values.firstName || '').trim();
    const ln = (values.lastName || '').trim();
    const em = (values.email || '').trim();
    if (!fn) e.firstName = 'First name is required.';
    if (!ln) e.lastName = 'Last name is required.';
    if (!em) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) e.email = 'Enter a valid email.';
    return e;
  };

  useEffect(() => {
    if (editMode) setErrors(validate(user));
  }, [user, editMode]);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    (async () => {
      const id = getUserId();
      if (!id) {
        navigate('/login', { replace: true });
        return;
      }
      try {
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 150));
          const mock = { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' };
          setUser(mock);
          setOrigUser(mock);
        } else {
          const res = await fetch(`${API_BASE}/api/users/${id}`);
          if (!res.ok) {
            const txt = await res.text().catch(() => '');
            console.error('LOAD FAIL', res.status, txt);
            if (res.status === 404) {
              localStorage.removeItem('authUserId');
              sessionStorage.removeItem('authUserId');
              navigate('/login', { replace: true });
              return;
            }
            throw new Error(`Failed to load: ${res.status}`);
          }
          const data = await res.json();
          const loaded = {
            firstName: data.firstName ?? '',
            lastName: data.lastName ?? '',
            email: data.email ?? '',
          };
          setUser(loaded);
          setOrigUser(loaded);
        }
      } catch (err) {
        console.error(err);
        setMessage('❌ Could not load profile.');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const onChange = (e) => setUser((u) => ({ ...u, [e.target.name]: e.target.value }));

  const startEdit = () => {
    setOrigUser(user); // snapshot
    setEditMode(true);
    setMessage('');
  };

  const cancelEdit = () => {
    setUser(origUser || { firstName: '', lastName: '', email: '' });
    setErrors({});
    setEditMode(false);
    setMessage('');
  };

  const save = async (e) => {
    e.preventDefault();
    setMessage('');
    const v = validate(user);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    const id = getUserId();
    if (!id) return navigate('/login', { replace: true });

    setSaving(true);
    try {
      if (!USE_MOCK) {
        const res = await fetch(`${API_BASE}/api/users/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: user.firstName.trim(),
            lastName: user.lastName.trim(),
            email: user.email.trim(),
          }),
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          console.error('SAVE FAIL', res.status, txt);
          throw new Error('Save failed');
        }
      } else {
        await new Promise((r) => setTimeout(r, 250));
      }
      setOrigUser(user);
      setEditMode(false);
      setMessage('✅ Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      <h2>User Profile</h2>
      {message && <p>{message}</p>}

      {!editMode ? (
        // ===== VIEW MODE =====
        <div>
          <div style={{ marginBottom: 10 }}>
            <strong>First name: </strong>
            <span>{user.firstName || <em>—</em>}</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <strong>Last name: </strong>
            <span>{user.lastName || <em>—</em>}</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>Email: </strong>
            <span>{user.email || <em>—</em>}</span>
          </div>

          <button onClick={startEdit}>Edit Profile</button>
        </div>
      ) : (
        // ===== EDIT MODE =====
        <form onSubmit={save} noValidate>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="firstName">First name</label><br />
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={user.firstName}
              onChange={onChange}
              aria-invalid={!!errors.firstName}
              aria-describedby="firstName-error"
              autoComplete="given-name"
              required
            />
            {errors.firstName && (
              <div id="firstName-error" style={{ color: 'crimson', fontSize: 12 }}>
                {errors.firstName}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor="lastName">Last name</label><br />
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={user.lastName}
              onChange={onChange}
              aria-invalid={!!errors.lastName}
              aria-describedby="lastName-error"
              autoComplete="family-name"
              required
            />
            {errors.lastName && (
              <div id="lastName-error" style={{ color: 'crimson', fontSize: 12 }}>
                {errors.lastName}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor="email">Email</label><br />
            <input
              id="email"
              name="email"
              type="email"
              value={user.email}
              onChange={onChange}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
              autoComplete="email"
              required
            />
            {errors.email && (
              <div id="email-error" style={{ color: 'crimson', fontSize: 12 }}>
                {errors.email}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={saving || Object.keys(errors).length > 0}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={cancelEdit} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
