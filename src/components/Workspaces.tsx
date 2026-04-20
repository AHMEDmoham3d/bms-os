import React, { useState } from 'react';
import { Layers, Plus, Trash2, SwitchCamera, Folder, Edit } from 'lucide-react';
import { useWorkspaces } from '../lib/useWorkspaces';
import type { Workspace } from '../lib/types';

export default function Workspaces() {
  const {
    workspaces,
    currentWorkspaceId,
    loading,
    error,
    createWorkspace,
    switchWorkspace: switchWs,
    deleteWorkspace,
    updateWorkspace
  } = useWorkspaces();
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const switchWorkspace = (id: number) => {
    switchWs(id);
  };

  const currentWsId = currentWorkspaceId || 0;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading workspaces...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-0">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 rounded-2xl shadow-2xl mb-6">
          <Layers className="w-8 h-8 text-white" />
          <h1 className="text-3xl lg:text-4xl font-black text-white drop-shadow-lg">Workspaces</h1>
        </div>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Organize your notes, projects, and teams across multiple workspaces. Switch seamlessly between contexts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Stats */}
        <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl border border-slate-200 shadow-xl hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <Layers className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{workspaces.length}</p>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Workspaces</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-3xl border border-emerald-200 shadow-xl hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <SwitchCamera className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-black text-emerald-900">{workspaces.length}</p>
              <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Active Contexts</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-1 bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl border border-blue-200 shadow-xl hover:shadow-2xl transition-all">
          <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-2xl shadow-sm">
            <Plus className="w-5 h-5 text-blue-600" />
            <button 
              onClick={() => setNewWorkspaceName('New Workspace')}
              className="font-semibold text-blue-700 hover:text-blue-900 text-sm"
            >
              Add New →
            </button>
          </div>
        </div>
      </div>

      {/* Create New */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl mb-12">
        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
          <Plus className="w-8 h-8 text-indigo-600" />
          Create New Workspace
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <input
            value={newWorkspaceName}
            onChange={e => setNewWorkspaceName(e.target.value)}
            placeholder="e.g. Marketing Team, Q4 Projects..."
            className="flex-1 p-4 border border-slate-300 rounded-2xl focus:ring-4 ring-indigo-500/20 focus:border-indigo-500 text-lg font-semibold"
          />
          <button
            onClick={async () => {
              const newWs = await createWorkspace(newWorkspaceName);
              if (newWs) {
                setNewWorkspaceName('');
              }
            }}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all border border-indigo-500"
            disabled={!newWorkspaceName.trim()}
          >
            Create Workspace
          </button>
        </div>
      </div>

      {/* Workspaces List */}
      <div className="space-y-4">
        {workspaces.map((workspace) => (
          <div key={workspace.id} className={`group bg-gradient-to-r from-slate-50 to-white p-6 rounded-3xl border border-slate-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all ${currentWsId === workspace.id ? 'ring-4 ring-indigo-500/30 shadow-indigo-500/25 border-indigo-300 bg-indigo-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
                  <Folder className="w-7 h-7 text-white" />
                </div>
                {editingId === workspace.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      className="flex-1 p-3 border-2 border-indigo-300 rounded-xl focus:ring-2 ring-indigo-500 focus:border-indigo-500 font-semibold text-lg"
                      autoFocus
                    />
                    <button
                      onClick={async () => {
                        if (editName.trim()) {
                          await updateWorkspace(workspace.id, editName.trim());
                          setEditingId(null);
                          setEditName('');
                        }
                      }}
                      className="p-2 hover:bg-indigo-100 rounded-xl transition-colors"
                    >
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => { setEditingId(null); setEditName(''); }}
                      className="p-2 hover:bg-red-100 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-black text-slate-900 truncate">{workspace.name}</h3>
                      {workspace.is_default && (
                        <p className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold mt-1 inline-block">Default</p>
                      )}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      currentWsId === workspace.id 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    }`}>
                      <SwitchCamera className="w-3 h-3" />
                      {currentWsId === workspace.id ? 'Current' : 'Switch'}
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                {editingId !== workspace.id && !workspace.is_default && (
                  <button
                    onClick={() => { setEditingId(workspace.id); setEditName(workspace.name); }}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                    title="Rename"
                  >
                    <Edit className="w-5 h-5 text-slate-500" />
                  </button>
                )}
                {!workspace.is_default && (
                  <button
                    onClick={async () => await deleteWorkspace(workspace.id)}
                    className="p-3 hover:bg-red-100 rounded-2xl transition-all group"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 text-red-500 group-hover:text-red-700" />
                  </button>
                )}
                <button
                  onClick={() => switchWorkspace(workspace.id)}
                  className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-semibold flex items-center gap-2"
                >
                  <SwitchCamera className="w-4 h-4" />
                  {currentWsId === workspace.id ? 'Active' : 'Switch'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl text-center">
        <h3 className="text-2xl font-black mb-4">Workspace Notes Integration</h3>
        <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
          Notes will be scoped to your current workspace. Future updates will add automatic filtering.
        </p>
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl font-bold border border-white/30 hover:bg-white/30 transition-all">
          Current Workspace ID: <span className="bg-white/30 px-3 py-1 rounded-xl font-mono">{currentWsId}</span>
        </div>
      </div>
    </main>
  );
}
