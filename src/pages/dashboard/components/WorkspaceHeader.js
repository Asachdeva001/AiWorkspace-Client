import React from 'react';

export default function WorkspaceHeader({
  workspace,
  workspaces,
  id,
  loading,
  actionLoading,
  onEdit,
  onDelete,
  onNavigate,
  onShowEditModal
}) {
  return (
    <div className="flex items-center justify-between mb-6 gap-4 bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-4">
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2" 
          onClick={() => onNavigate('/workspaces')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        {workspaces.length > 0 && (
          <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <select
              className="bg-transparent pr-8 py-1 text-gray-800 font-medium focus:ring-0 focus:outline-none cursor-pointer"
              value={id}
              onChange={e => onNavigate(`/workspaces/${e.target.value}`)}
            >
              {workspaces.map(w => (
                <option key={w._id} value={w._id}>{w.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      {!loading && workspace && (
        <div className="flex items-center gap-2">
          <button 
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 flex items-center gap-2" 
            onClick={onShowEditModal} 
            disabled={actionLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </button>
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2" 
            onClick={onDelete} 
            disabled={actionLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
} 