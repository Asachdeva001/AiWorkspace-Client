import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../../api';

function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Sign in failed');
      setCookie('token', data.data.token);
      const redirect = searchParams.get('redirect');
      if (redirect) {
        navigate(redirect, { replace: true });
      } else {
        navigate('/workspaces');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // OAuth handlers
  const handleOAuth = (provider) => {
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form className="w-full max-w-xs space-y-4" onSubmit={handleSubmit}>
        <input className="w-full border px-3 py-2 rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <div className="relative">
          <input
            className="w-full border px-3 py-2 rounded pr-10"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
            tabIndex={-1}
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m1.664-2.13A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.403 3.22-1.125 4.575m-1.664 2.13A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m1.664-2.13A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.403 3.22-1.125 4.575m-1.664 2.13A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )}
          </button>
        </div>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-blue-600 text-sm hover:underline">Forgot Password?</Link>
        </div>
        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      </form>
      <div className="my-4">or</div>
      <div className="space-y-2 w-full max-w-xs">
        <button type="button" onClick={() => handleOAuth('google')} className="w-full bg-red-500 text-white px-4 py-2 rounded">Sign in with Google</button>
        <button type="button" onClick={() => handleOAuth('linkedin')} className="w-full bg-blue-700 text-white px-4 py-2 rounded">Sign in with LinkedIn</button>
        <button type="button" onClick={() => handleOAuth('facebook')} className="w-full bg-blue-800 text-white px-4 py-2 rounded">Sign in with Facebook</button>
      </div>
      <p className="mt-4 text-sm">
        Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
      </p>
    </div>
  );
} 