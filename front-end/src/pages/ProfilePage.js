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

  // ----- Change Password state -----
  const [showPwForm, setShowPwForm] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSaving, setPwSaving] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });

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

  const validatePw = (p) => {
    const e = {};
    const cur = p.current || '';
    const nxt = p.next || '';
    const cfm = p.confirm || '';
    if (!cur) e.current = 'Current password is required.';
    if (!nxt) e.next = 'New password is required.';
    else {
      if (nxt.length < 8) e.next = 'Minimum 8 characters.';
      if (/\s/.test(nxt)) e.next = 'No spaces allowed.';
    }
    if (nxt && cur && nxt === cur) e.next = 'New password must be different.';
    if (!cfm) e.confirm = 'Please confirm your new password.';
    else if (nxt !== cfm) e.confirm = 'Passwords do not match.';
    return e;
  };

  useEffect(() => {
    if (editMode) setErrors(validate(user));
  }, [user, editMode]);

  useEffect(() => {
    if (showPwForm) setPwErrors(validatePw(pw));
  }, [pw, showPwForm]);

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
  const onPwChange = (e) => setPw((p) => ({ ...p, [e.target.name]: e.target.value }));

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

  // ----- Change Password submit -----
  const submitPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    const v = validatePw(pw);
    setPwErrors(v);
    if (Object.keys(v).length > 0) return;

    const id = getUserId();
    if (!id) return navigate('/login', { replace: true });

    setPwSaving(true);
    try {
      if (!USE_MOCK) {
        const res = await fetch(`${API_BASE}/api/users/${id}/password`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword: pw.current,
            newPassword: pw.next,
          }),
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          console.error('PW UPDATE FAIL', res.status, txt);
          if (res.status === 400 || res.status === 401) {
            setMessage('❌ Current password is incorrect or new password invalid.');
          } else {
            setMessage('❌ Failed to change password.');
          }
          return;
        }
      } else {
        await new Promise((r) => setTimeout(r, 300));
      }
      setPw({ current: '', next: '', confirm: '' });
      setShowPwForm(false);
      setMessage('✅ Password updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to change password.');
    } finally {
      setPwSaving(false);
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

          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <button onClick={startEdit}>Edit Profile</button>
            <button
              type="button"
              onClick={() => {
                setShowPwForm((s) => !s);
                setPwErrors({});
                setPw({ current: '', next: '', confirm: '' });
              }}
            >
              {showPwForm ? 'Cancel Password Change' : 'Change Password'}
            </button>
          </div>

          {showPwForm && (
            <form onSubmit={submitPassword} noValidate style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
              <h3 style={{ marginTop: 0 }}>Change Password</h3>

              <div style={{ marginBottom: 12 }}>
                <label htmlFor="current">Current password</label><br />
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    id="current"
                    name="current"
                    type={showPw.current ? 'text' : 'password'}
                    value={pw.current}
                    onChange={onPwChange}
                    aria-invalid={!!pwErrors.current}
                    aria-describedby="current-error"
                    autoComplete="current-password"
                    required
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={() => setShowPw((s) => ({ ...s, current: !s.current }))}>
                    {showPw.current ? 'Hide' : 'Show'}
                  </button>
                </div>
                {pwErrors.current && (
                  <div id="current-error" style={{ color: 'crimson', fontSize: 12 }}>{pwErrors.current}</div>
                )}
              </div>

              <div style={{ marginBottom: 12 }}>
                <label htmlFor="next">New password</label><br />
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    id="next"
                    name="next"
                    type={showPw.next ? 'text' : 'password'}
                    value={pw.next}
                    onChange={onPwChange}
                    aria-invalid={!!pwErrors.next}
                    aria-describedby="next-error"
                    autoComplete="new-password"
                    required
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={() => setShowPw((s) => ({ ...s, next: !s.next }))}>
                    {showPw.next ? 'Hide' : 'Show'}
                  </button>
                </div>
                {pwErrors.next && (
                  <div id="next-error" style={{ color: 'crimson', fontSize: 12 }}>{pwErrors.next}</div>
                )}
              </div>

              <div style={{ marginBottom: 12 }}>
                <label htmlFor="confirm">Confirm new password</label><br />
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    id="confirm"
                    name="confirm"
                    type={showPw.confirm ? 'text' : 'password'}
                    value={pw.confirm}
                    onChange={onPwChange}
                    aria-invalid={!!pwErrors.confirm}
                    aria-describedby="confirm-error"
                    autoComplete="new-password"
                    required
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={() => setShowPw((s) => ({ ...s, confirm: !s.confirm }))}>
                    {showPw.confirm ? 'Hide' : 'Show'}
                  </button>
                </div>
                {pwErrors.confirm && (
                  <div id="confirm-error" style={{ color: 'crimson', fontSize: 12 }}>{pwErrors.confirm}</div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" disabled={pwSaving || Object.keys(pwErrors).length > 0}>
                  {pwSaving ? 'Updating…' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPwForm(false);
                    setPw({ current: '', next: '', confirm: '' });
                    setPwErrors({});
                  }}
                  disabled={pwSaving}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
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
