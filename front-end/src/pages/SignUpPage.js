// src/pages/SignUpPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || ''; // '' if you use CRA proxy

export default function SignUpPage() {
    // Storing navigate function for routing
    const navigate = useNavigate();

    // Stores all for field values
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    // Stores error messages for each field after validation
    const [errors, setErrors] = useState({});
    // Tracks if the form is currently sending data to the server (for disabling the submit button & showing "Creating")
    const [submitting, setSubmitting] = useState(false);
    // Stores feedback messsages for the user
    const [message, setMessage] = useState('');

    // Updates the relevant form field based on the name of the input
    // Resets any feedback message when the user starts typing again
    const onChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
        setMessage('');
    };

    // Trims user input and checks if they exist
    // Checks if email is valid and exists
    // Returns object with key/value pars along with their error messages
    const validate = (values) => {
        const e = {};
        const fn = values.firstName.trim();
        const ln = values.lastName.trim();
        const em = values.email.trim();
        const cem = values.confirmEmail.trim();
        const pw = values.password;
        const cpw = values.confirmPassword;

        if (!fn) e.firstName = 'First name is required.';
        if (!ln) e.lastName = 'Last name is required.';
        if (!em) e.email = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) e.email = 'Enter a valid email.';
        if (!cem) e.confirmEmail = 'Confirm email is required.';
        else if (em && cem && em !== cem) e.confirmEmail = 'Emails do not match.';

        if (!pw) e.password = 'Password is required.';
        else if (pw.length < 8) e.password = 'Use at least 8 characters.';
        if (!cpw) e.confirmPassword = 'Confirm password is required.';
        else if (pw && cpw && pw !== cpw) e.confirmPassword = 'Passwords do not match.';
        return e;
    };

    const onSubmit = async (e) => {
        e.preventDefault(); // Stops page refresh
        setMessage('');

        // Validates the form and stops if there are any errors
        const v = validate(form);
        setErrors(v);
        if (Object.keys(v).length > 0) return;

        // Send a POST request to backend /api/users endpoint with the form data
        setSubmitting(true);
        try {
        const res = await fetch(`${API_BASE}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            }),
        });

        // If signup succeeds, redirects to login with a flag (justSignedUp) to show a success message
        if (res.status === 200 || res.status === 201) {
            navigate('/login', { replace: true, state: { justSignedUp: true } });
            return;
        }

        // If email exists (409) or a network/server error occurs and sends message to user
        const text = await res.text().catch(() => '');
        if (res.status === 409) setMessage('❌ That email is already registered.');
        else setMessage(`❌ Failed to sign up. ${text || ''}`.trim());
        } catch {
        setMessage('❌ Network/server error. Please try again.'); 
        } finally {
        setSubmitting(false); // Always stops the loading state in finally
        }
    };

    // Disables the Create Account button if submitting or there are validation errors
    const disableSubmit = submitting || Object.keys(errors).length > 0;

    return (
        <div style={{ padding: 24, maxWidth: 500 }}>
        <h2>Create your account</h2>
        {message && <p>{message}</p>}

        <form onSubmit={onSubmit} noValidate>
            <div style={{ marginBottom: 12 }}>
            <label htmlFor="firstName">First name</label><br />
            <input
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                autoComplete="given-name"
                aria-invalid={!!errors.firstName}
                aria-describedby="firstName-error"
                required
            />
            {errors.firstName && (
                <div id="firstName-error" style={{ color: 'crimson', fontSize: 12 }}>{errors.firstName}</div>
            )}
            </div>

            <div style={{ marginBottom: 12 }}>
            <label htmlFor="lastName">Last name</label><br />
            <input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                autoComplete="family-name"
                aria-invalid={!!errors.lastName}
                aria-describedby="lastName-error"
                required
            />
            {errors.lastName && (
                <div id="lastName-error" style={{ color: 'crimson', fontSize: 12 }}>{errors.lastName}</div>
            )}
            </div>

            <div style={{ marginBottom: 12 }}>
            <label htmlFor="email">Email</label><br />
            <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
                required
            />
            {errors.email && (
                <div id="email-error" style={{ color: 'crimson', fontSize: 12 }}>{errors.email}</div>
            )}
            </div>

            <div style={{ marginBottom: 16 }}>
            <label htmlFor="confirmEmail">Confirm email</label><br />
            <input
                id="confirmEmail"
                name="confirmEmail"
                type="email"
                value={form.confirmEmail}
                onChange={onChange}
                autoComplete="email"
                aria-invalid={!!errors.confirmEmail}
                aria-describedby="confirmEmail-error"
                required
            />
            {errors.confirmEmail && (
                <div id="confirmEmail-error" style={{ color: 'crimson', fontSize: 12 }}>{errors.confirmEmail}</div>
            )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 12 }}>
            <label htmlFor="password">Password</label><br />
            <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={onChange}
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
                required
            />
            {errors.password && (
                <div id="password-error" style={{ color: 'crimson', fontSize: 12 }}>
                {errors.password}
                </div>
            )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 12 }}>
            <label htmlFor="confirmPassword">Confirm password</label><br />
            <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={onChange}
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby="confirmPassword-error"
                required
            />
            {errors.confirmPassword && (
                <div id="confirmPassword-error" style={{ color: 'crimson', fontSize: 12 }}>
                {errors.confirmPassword}
                </div>
            )}
            </div>

            {/* Toggle visibility for both password fields */}
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
            />
            Show password
            </label>


            <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={disableSubmit}>
                {submitting ? 'Creating…' : 'Create account'}
            </button>

            {/* Optional: go back to login without creating an account */}
            <button type="button" onClick={() => navigate('/login')}>
                Back to login
            </button>
            </div>
        </form>
        </div>
    );
}
