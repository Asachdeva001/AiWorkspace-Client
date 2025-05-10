import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function CreateWorkspaceModal({ open, onClose, onCreate, loading }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setError("");
    onCreate({ name, description });
    setName("");
    setDescription("");
  };

  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
      setError("");
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Create New Workspace</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}

function EditWorkspaceModal({ open, onClose, onEdit, loading, workspace }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && workspace) {
      setName(workspace.name);
      setDescription(workspace.description || "");
      setError("");
    }
  }, [open, workspace]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setError("");
    onEdit({ name, description });
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Workspace</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function WorkspaceDashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState("");
  const [resetStatus, setResetStatus] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [usage, setUsage] = useState(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [planError, setPlanError] = useState("");
  const navigate = useNavigate();

  // Fetch user info
  const fetchUserInfo = async () => {
    setUserLoading(true);
    setUserError("");
    const token = getCookie("token");
    if (!token) {
      setUserError("No authentication token found. Please sign in again.");
      setUserLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch user info");
      setUser(data.data.user);
    } catch (err) {
      setUserError(err.message);
    } finally {
      setUserLoading(false);
    }
  };

  // Fetch workspaces
  const fetchWorkspaces = async () => {
    setLoading(true);
    setError("");
    const token = getCookie("token");
    if (!token) {
      setError("No authentication token found. Please sign in again.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/workspaces/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const workspaces = data.data.workspaces;
      setWorkspaces(Array.isArray(workspaces) ? workspaces : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscription plan
  const fetchPlan = async () => {
    setPlanLoading(true);
    setPlanError("");
    const token = getCookie("token");
    if (!token) {
      setPlanError("No authentication token found. Please sign in again.");
      setPlanLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/subscription/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch plan");
      console.log(data);
      setPlan(data.data.plan);
    } catch (err) {
      setPlanError(err.message);
    } finally {
      setPlanLoading(false);
    }
  };

  // Fetch usage stats
  const fetchUsage = async () => {
    const token = getCookie("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/subscription/usage`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) setUsage(data.data.usage);
    } catch {}
  };

  useEffect(() => {
    fetchUserInfo();
    fetchWorkspaces();
    fetchPlan();
    fetchUsage();
  }, []);

  useEffect(() => {
    if (user && user.isEmailVerified === false) {
      // Remove token cookie
      document.cookie = "token=; Max-Age=0; path=/;";
      alert("First verify your email id.");
      window.location.href = "/signin";
    }
  }, [user]);

  // Workspace actions
  const handleCreateWorkspace = async ({ name, description }) => {
    setActionLoading(true);
    const token = getCookie("token");
    try {
      const res = await fetch(`${API_BASE_URL}/workspaces/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error("Failed to create workspace");
      setShowCreateModal(false);
      await fetchWorkspaces();
    } catch (err) {
      console.log(err);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditWorkspace = async ({ name, description }) => {
    setActionLoading(true);
    const token = getCookie("token");
    try {
      const res = await fetch(
        `${API_BASE_URL}/workspaces/${selectedWorkspace._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, description }),
        }
      );
      if (!res.ok) throw new Error("Failed to edit workspace");
      setShowEditModal(false);
      setSelectedWorkspace(null);
      await fetchWorkspaces();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteWorkspace = async (workspaceId) => {
    if (!window.confirm("Are you sure you want to delete this workspace?"))
      return;
    setActionLoading(true);
    const token = getCookie("token");
    try {
      const res = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete workspace");
      await fetchWorkspaces();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetStatus("");
    setResetLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetStatus("Password reset link sent to your email.");
      } else {
        setResetStatus(data.message || "Failed to send reset link.");
      }
    } catch {
      setResetStatus("Failed to send reset link.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-12">
      <CreateWorkspaceModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateWorkspace}
        loading={actionLoading}
      />
      <EditWorkspaceModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedWorkspace(null);
        }}
        onEdit={handleEditWorkspace}
        loading={actionLoading}
        workspace={selectedWorkspace}
      />
      <div className="max-w-3xl mx-auto">
        {/* User Details Section */}
        <div className="mb-8 bg-white rounded shadow p-6">
          <h3 className="text-lg font-semibold mb-2">User Details</h3>
          {userLoading ? (
            <div className="text-gray-500">Loading user details...</div>
          ) : userError ? (
            <div className="text-red-600">{userError}</div>
          ) : user ? (
            <div className="space-y-1">
              <div>
                <span className="font-semibold">Name:</span> {user.name || "-"}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {user.email}
              </div>
              <div>
                <span className="font-semibold">Verified:</span>{" "}
                {user.isEmailVerified ? "Yes" : "No"}
              </div>
            </div>
          ) : (
            <div className="text-gray-500">No user information available</div>
          )}
          {/* Password Reset */}
          <form className="mt-4 space-y-2" onSubmit={handlePasswordReset}>
            <label className="block font-semibold">
              Want to Reset Password
            </label>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
              type="submit"
              disabled={resetLoading}
            >
              {resetLoading ? "Sending..." : "Send Reset Link"}
            </button>
            {resetStatus && (
              <div className="text-sm text-blue-700 mt-1">{resetStatus}</div>
            )}
          </form>
        </div>
        {/* Subscription Info */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-lg font-bold text-gray-800 mb-1">
                Current Plan
              </div>
              {planLoading ? (
                <div className="text-gray-500">Loading plan...</div>
              ) : planError ? (
                <div className="text-red-600">{planError}</div>
              ) : plan ? (
                <div className="text-blue-700 font-semibold text-xl capitalize">
                  {plan.name}
                </div>
              ) : (
                <div className="text-gray-500">No plan found.</div>
              )}
              {usage && (
                <div className="mt-2 text-gray-700 text-sm">
                  <div>
                    Workspaces: {usage.workspaces} / {usage.workspaceLimit}
                  </div>
                  <div>
                    Team Members: {usage.teamMembers} / {usage.teamMemberLimit}
                  </div>
                  {/* Add more usage stats as needed */}
                </div>
              )}
            </div>
            <button
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 text-lg font-semibold"
              onClick={() => navigate("/upgrade-plans")}
            >
              Upgrade Subscription
            </button>
          </div>
        </div>
        {/* Workspaces Section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Your Workspaces
        </h2>
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : workspaces.length === 0 ? (
          <div className="text-gray-500">No workspaces found.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {workspaces.map((w) => (
              <div key={w._id} className="bg-white rounded shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-semibold text-lg">{w.name}</div>
                    <div className="text-gray-500 text-sm mt-1">
                      {w.description}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-gray-600 hover:text-blue-600"
                      onClick={() => {
                        setSelectedWorkspace(w);
                        setShowEditModal(true);
                      }}
                      title="Edit workspace"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      className="text-gray-600 hover:text-red-600"
                      onClick={() => handleDeleteWorkspace(w._id)}
                      title="Delete workspace"
                      disabled={actionLoading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <button
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => navigate(`/workspaces/${w._id}`)}
                >
                  Open Workspace
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          className="mt-8 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowCreateModal(true)}
          disabled={actionLoading}
        >
          Create Workspace
        </button>
      </div>
    </div>
  );
}
