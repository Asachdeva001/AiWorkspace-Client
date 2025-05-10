import React from 'react';

export default function TeamSection({
  team,
  teamLoading,
  teamError,
  onInviteClick,
  showInviteModal,
  InviteMemberModal,
  handleInviteMember,
  inviteLoading,
  handleUpdateRole,
  handleRemoveMember,
  isAdmin
}) {
  return (
    <section className="mb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Team Members</h2>
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={onInviteClick}
        >
          Invite Member
        </button>
      </div>
      <div className="w-full bg-white rounded shadow overflow-hidden p-6 text-gray-700">
        {teamLoading ? (
          <div className="text-gray-500">Loading team...</div>
        ) : teamError ? (
          <div className="text-red-600">{teamError}</div>
        ) : team.length === 0 ? (
          <div className="text-gray-500">No team members found.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2 px-4">
                    {member.user.name || <span className="italic text-gray-400">-</span>}
                  </td>
                  <td className="py-2 px-4">{member.user.email || <span className="italic text-gray-400">-</span>}</td>
                  <td className="py-2 px-4">
                    {member.role === 'Admin' ? (
                      <span className="text-gray-700">Admin</span>
                    ) : isAdmin ? (
                      <select
                        className="border rounded px-2 py-1"
                        value={member.role}
                        onChange={(e) => handleUpdateRole(member._id, e.target.value)}
                      >
                        <option value="Viewer">Viewer</option>
                        <option value="Editor">Editor</option>
                        <option value="Admin">Admin</option>
                      </select>
                    ) : (
                      <span className="text-gray-700">{member.role}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {isAdmin && member.role !== 'Admin' && (
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleRemoveMember(member._id)}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {InviteMemberModal}
    </section>
  );
} 