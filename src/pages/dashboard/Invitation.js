import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../../api';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export default function Invitation() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const userToken = getCookie('token');
    if (!userToken) {
      // Redirect to signin, preserving the invitation token
      navigate(`/signin?redirect=/accept-invitation?token=${token}`);
      return;
    }
    const fetchInvitation = async () => {
      if (!token) {
        setError('Invalid invitation link');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/team/invitations/verify/${token}`);
        const contentType = res.headers.get('content-type');
        if (!res.ok) {
          let errorMsg = 'Unknown error';
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            errorMsg = data.message || JSON.stringify(data);
          } else {
            errorMsg = await res.text();
          }
          throw new Error(errorMsg);
        }
        const data = await res.json();
        const found = data.data?.invitation;
        if (!found) throw new Error('Invitation not found or has expired');
        setInvitation(found);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitation();
  }, [token, navigate]);

  const handleAccept = async () => {
    setActionLoading(true);
    const userToken = getCookie('token');
    try {
      const res = await fetch(`${API_BASE_URL}/team/invitations/accept/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        }
      });
      const contentType = res.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        throw new Error(await res.text());
      }
      if (!res.ok) throw new Error(data.message || 'Failed to accept invitation');
      navigate(`/workspaces/${invitation.workspace._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    setActionLoading(true);
    const userToken = getCookie('token');
    try {
      const res = await fetch(`${API_BASE_URL}/team/invitations/decline/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        }
      });
      const contentType = res.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        throw new Error(await res.text());
      }
      if (!res.ok) throw new Error(data.message || 'Failed to decline invitation');
      navigate('/workspaces');
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading invitation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate('/workspaces')}
          >
            Go to Workspaces
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Team Invitation</h1>
        <div className="space-y-4 mb-6">
          <div>
            <h2 className="font-semibold text-gray-700">Workspace</h2>
            <p className="text-gray-600">{invitation.workspace.name}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700">Role</h2>
            <p className="text-gray-600">{invitation.role}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700">Invited By</h2>
            <p className="text-gray-600">{invitation.inviter.name} ({invitation.inviter.email})</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            onClick={handleAccept}
            disabled={actionLoading}
          >
            {actionLoading ? 'Accepting...' : 'Accept Invitation'}
          </button>
          <button
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-60"
            onClick={handleDecline}
            disabled={actionLoading}
          >
            {actionLoading ? 'Declining...' : 'Decline'}
          </button>
        </div>
      </div>
    </div>
  );
} 