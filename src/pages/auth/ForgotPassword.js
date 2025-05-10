import { useState } from 'react';
import { API_BASE_URL } from '../../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <form className="w-full max-w-xs space-y-4" onSubmit={handleSubmit}>
        <input className="w-full border px-3 py-2 rounded" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center">If your email is registered, a reset link has been sent.</div>}
      </form>
    </div>
  );
} 