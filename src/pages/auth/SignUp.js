import { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../api';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Sign up failed');
      setSuccessMsg('Verification mail sent to your email. Please verify and then log in.');
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
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form className="w-full max-w-xs space-y-4" onSubmit={handleSubmit}>
        <input className="w-full border px-3 py-2 rounded" type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
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
        <button className="w-full bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60" type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        {successMsg && <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded text-center">{successMsg}</div>}
      </form>
      <div className="my-4">or</div>
      <div className="space-y-2 w-full max-w-xs">
        <button type="button" onClick={() => handleOAuth('google')} className="w-full bg-red-500 text-white px-4 py-2 rounded">Sign up with Google</button>
        <button type="button" onClick={() => handleOAuth('linkedin')} className="w-full bg-blue-700 text-white px-4 py-2 rounded">Sign up with LinkedIn</button>
        <button type="button" onClick={() => handleOAuth('facebook')} className="w-full bg-blue-800 text-white px-4 py-2 rounded">Sign up with Facebook</button>
      </div>
      <p className="mt-4 text-sm">
        Already have an account? <Link to="/signin" className="text-blue-600 hover:underline">Sign In</Link>
      </p>
    </div>
  );
} 