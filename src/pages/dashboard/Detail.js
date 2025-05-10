import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../api';
import { jwtDecode } from 'jwt-decode';
import WorkspaceHeader from './components/WorkspaceHeader';
import TeamSection from './components/TeamSection';
import AIContentSection from './components/AIContentSection';
import APIKeySection from './components/APIKeySection';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function getCurrentUserId() {
  const token = getCookie('token');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.id;
  } catch {
    return null;
  }
}

function EditWorkspaceModal({ open, onClose, onEdit, loading, initialName, initialDescription }) {
  const [name, setName] = useState(initialName || '');
  const [description, setDescription] = useState(initialDescription || '');
  const [error, setError] = useState('');

  useEffect(() => {
    setName(initialName || '');
    setDescription(initialDescription || '');
    setError('');
  }, [open, initialName, initialDescription]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setError('');
    onEdit({ name, description });
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Edit Workspace</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea className="w-full border rounded px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}

function InviteMemberModal({ open, onClose, onInvite, loading }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Viewer');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setEmail('');
      setRole('Viewer');
      setError('');
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setError('');
    onInvite({ email, role });
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Invite Team Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input 
              type="email"
              className="w-full border rounded px-3 py-2" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Role</label>
            <select 
              className="w-full border rounded px-3 py-2"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="Viewer">Viewer</option>
              <option value="Editor">Editor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button 
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Sending Invite...' : 'Send Invite'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function WorkspaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const token = getCookie('token');
      try {
        const res = await fetch(`${API_BASE_URL}/workspaces/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const workspaces = data.data?.workspaces || [];
        setWorkspaces(Array.isArray(workspaces) ? workspaces : []);
      } catch {
        setWorkspaces([]);
      }
    };
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    const fetchWorkspace = async () => {
      setLoading(true);
      setError('');
      const token = getCookie('token');
      try {
        const res = await fetch(`${API_BASE_URL}/workspaces/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch workspace');
        setWorkspace(data.data.workspace);
        setTeam(data.data.workspace.members || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setTeamLoading(false);
      }
    };
    fetchWorkspace();
  }, [id]);

  const handleEditWorkspace = async ({ name, description }) => {
    setActionLoading(true);
    const token = getCookie('token');
    try {
      const res = await fetch(`${API_BASE_URL}/workspaces/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) throw new Error('Failed to edit workspace');
      window.location.reload();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!window.confirm('Are you sure you want to delete this workspace?')) return;
    setActionLoading(true);
    const token = getCookie('token');
    try {
      const res = await fetch(`${API_BASE_URL}/workspaces/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete workspace');
      navigate('/workspaces');
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleInviteMember = async ({ email, role }) => {
    setInviteLoading(true);
    const token = getCookie('token');
    try {
      const res = await fetch(`${API_BASE_URL}/team/${id}/invite`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to send invitation');
      setShowInviteModal(false);
      window.location.reload();
    } catch (err) {
      alert(err.message);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    const token = getCookie('token');
    try {
      const res = await fetch(`${API_BASE_URL}/team/${id}/members/${memberId}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Failed to update role');
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) return;
    const token = getCookie('token');
    try {
      const res = await fetch(`${API_BASE_URL}/team/${id}/members/${memberId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to remove team member');
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  // Calculate admin status for TeamSection
  const currentUserId = getCurrentUserId();
  const currentMember = team.find(m => m.user._id === currentUserId);
  const isAdmin = currentMember?.role === 'Admin';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-12">
      <EditWorkspaceModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEdit={handleEditWorkspace}
        loading={actionLoading}
        initialName={workspace?.name}
        initialDescription={workspace?.description}
      />
      <WorkspaceHeader
        workspace={workspace}
        workspaces={workspaces}
        id={id}
        loading={loading}
        actionLoading={actionLoading}
        onDelete={handleDeleteWorkspace}
        onNavigate={navigate}
        onShowEditModal={() => setShowEditModal(true)}
      />
      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
      {workspace && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-black-800 mb-2">{workspace.name}</h2>
            {workspace.description && (
              <div className="text-black-500">{workspace.description}</div>
            )}
          </div>
        </div>
      )}
      <TeamSection
        team={team}
        teamLoading={teamLoading}
        teamError={teamError}
        onInviteClick={() => setShowInviteModal(true)}
        showInviteModal={showInviteModal}
        InviteMemberModal={
          <InviteMemberModal
            open={showInviteModal}
            onClose={() => setShowInviteModal(false)}
            onInvite={handleInviteMember}
            loading={inviteLoading}
          />
        }
        handleInviteMember={handleInviteMember}
        inviteLoading={inviteLoading}
        handleUpdateRole={handleUpdateRole}
        handleRemoveMember={handleRemoveMember}
        isAdmin={isAdmin}
      />
      <AIContentSection />
      <APIKeySection />
    </div>
  );
} 