import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Save token to cookie (expires in 7 days)
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      // Redirect to dashboard
      navigate('/workspaces', { replace: true });
    } else {
      // If no token, redirect to login
      navigate('/signin', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-lg text-gray-700">Logging you in...</div>
    </div>
  );
} 