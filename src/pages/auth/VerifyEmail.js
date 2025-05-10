import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../../api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function VerifyEmail() {
  const query = useQuery();
  const token = query.get('token');
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided.');
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage('Email verified! You can now access the dashboard.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Verification failed.');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded shadow p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Verify Email</h1>
        {status === 'verifying' && <div className="text-gray-600">Verifying your email...</div>}
        {status === 'success' && (
          <div>
            <div className="text-green-700 font-semibold mb-2">{message}</div>
          </div>
        )}
        {status === 'error' && (
          <div className="text-red-600 font-semibold">{message}</div>
        )}
      </div>
    </div>
  );
} 