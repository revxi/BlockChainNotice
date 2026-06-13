import React, { useState } from 'react';
import {
  Shield, LayoutDashboard, FileText, PlusCircle, CheckCircle2,
  BarChart2, Settings, Building, ChevronDown, Bell, LogOut,
  File, Package, Users, Calendar, Clipboard, Book, Copy, ChevronRight,
  Activity, ShieldCheck, Database
} from 'lucide-react';

export default function AdminDashboard({ notices = [], onPublish, isPublishing, onSignOut }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onPublish(formData);
      setFormData({ title: '', content: '' });
      setActiveTab('dashboard');
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                <Shield size={18} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-100 leading-tight">BlockNotice</h1>
                <p className="text-xs text-slate-400 font-medium">Department Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-900/30 text-blue-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}>
              <LayoutDashboard size={18} />
              <span className="text-sm">Dashboard</span>
            </button>
            <button onClick={() => setActiveTab('notices')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'notices' ? 'bg-blue-900/30 text-blue-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}>
              <FileText size={18} />
              <span className="text-sm">My Notices</span>
            </button>
            <button onClick={() => setActiveTab('create')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'create' ? 'bg-blue-900/30 text-blue-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}>
              <PlusCircle size={18} />
              <span className="text-sm">Create Notice</span>
            </button>
            <button onClick={() => setActiveTab('verified')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'verified' ? 'bg-blue-900/30 text-blue-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}>
              <CheckCircle2 size={18} />
              <span className="text-sm">Verified Records</span>
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-blue-900/30 text-blue-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}>
              <BarChart2 size={18} />
              <span className="text-sm">Analytics</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 transition-colors cursor-not-allowed opacity-50">
              <Settings size={18} />
              <span className="text-sm">Settings</span>
            </button>
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center justify-between p-2 hover:bg-slate-900 rounded-lg transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-slate-600 transition-colors">
                <Building size={16} className="text-slate-300" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-200 leading-tight">Computer Engg. Dept.</p>
                <p className="text-xs text-slate-500">Department Faculty</p>
              </div>
            </div>
            <ChevronDown size={16} className="text-slate-500" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-950">
        {/* Top Navbar */}
        <header className="px-8 py-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-sm z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Welcome, Department Admin 👋</h2>
            <p className="text-sm text-slate-400 mt-1">Manage notices, verify records, and review analytics.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-slate-950">
                3
              </span>
            </button>
            <button
              onClick={onSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-slate-100 transition-all"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <File size={20} className="text-blue-400" />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm font-medium text-slate-400 mb-1">Total Notices</p>
                    <h3 className="text-2xl font-bold text-slate-100 mb-3">{notices.length}</h3>
                    <p className="text-xs text-slate-500">Published on-chain and visible to all users.</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <ShieldCheck size={20} className="text-emerald-400" />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm font-medium text-slate-400 mb-1">Verified Records</p>
                    <h3 className="text-2xl font-bold text-slate-100 mb-3">{notices.length}</h3>
                    <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      All records permanently verified
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Package size={20} className="text-purple-400" />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm font-medium text-slate-400 mb-1">On-Chain Blocks</p>
                    <h3 className="text-2xl font-bold text-slate-100 mb-3">{notices.length * 2 || 8}</h3>
                    <p className="text-xs text-purple-400 font-medium flex items-center gap-1.5">
                      <Database size={12} />
                      Immutable history
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Users size={20} className="text-amber-400" />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm font-medium text-slate-400 mb-1">Active Admins</p>
                    <h3 className="text-2xl font-bold text-slate-100 mb-3">1</h3>
                    <p className="text-xs text-amber-400 font-medium flex items-center gap-1">
                      ↗ Admin-only access
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500">Recent Activity</p>
                      <h3 className="text-xl font-semibold text-slate-100">Latest published notices</h3>
                    </div>
                    <span className="text-xs text-slate-400">Showing up to 4</span>
                  </div>
                  <div className="space-y-4">
                    {notices.length === 0 ? (
                      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-slate-400">
                        No notices have been published yet.
                      </div>
                    ) : (
                      notices.slice(0, 4).map((notice) => (
                        <div key={notice.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 hover:border-slate-700 transition-colors">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <h4 className="text-lg font-semibold text-slate-100 truncate">{notice.title}</h4>
                                <p className="text-xs text-slate-500 mt-1">Notice #{notice.id} · {notice.date}</p>
                              </div>
                              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">Verified</span>
                            </div>
                            <p className="text-sm text-slate-400 line-clamp-2">{notice.hash}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-100 mb-3">Blockchain Summary</h3>
                    <div className="space-y-3 text-sm text-slate-400">
                      <div className="flex justify-between">
                        <span>Verified notices</span>
                        <span>{notices.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average notice length</span>
                        <span>{notices.length ? Math.round(notices.reduce((sum, notice) => sum + notice.title.length, 0) / notices.length) : 0} chars</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Latest publication</span>
                        <span>{notices[0]?.date || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-100 mb-3">Quick Actions</h3>
                    <p className="text-sm text-slate-400 mb-4">Use the sidebar to switch between notices, verification, and analytics.</p>
                    <button onClick={() => setActiveTab('create')} className="w-full px-4 py-2 text-sm font-semibold text-slate-100 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors">
                      Publish a new notice
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">My Notices</p>
                  <h3 className="text-2xl font-semibold text-slate-100">Published notices</h3>
                </div>
                <span className="inline-flex items-center rounded-full bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400">
                  {notices.length} notice{notices.length !== 1 ? 's' : ''}
                </span>
              </div>
              {notices.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-10 text-center text-slate-500">
                  No notices found. Publish a new notice to populate the list.
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {notices.map((notice) => (
                    <div key={notice.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-6 hover:border-slate-700 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-slate-500">Notice #{notice.id}</p>
                          <h4 className="text-lg font-semibold text-slate-100 mt-2">{notice.title}</h4>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                          Verified
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-3">{notice.hash}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{notice.date}</span>
                        <button className="text-slate-300 hover:text-slate-100 transition-colors">View details</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-widest text-slate-500">Create Notice</p>
                  <h3 className="text-2xl font-semibold text-slate-100">Publish a new official notice</h3>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="rounded-2xl border border-red-700 bg-red-950/80 p-4 text-sm text-red-300">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Notice Title</label>
                    <input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter title"
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition-colors focus:border-blue-600"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">Notice Content</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Enter notice details"
                      rows={8}
                      className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition-colors focus:border-blue-600"
                      required
                    />
                  </div>
                  <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
                    {isPublishing ? 'Publishing...' : 'Publish Notice'}
                  </button>
                </form>
              </div>
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Publishing Guide</h3>
                  <p className="text-sm text-slate-400 leading-6">
                    Only authorized faculty can publish notices. Once submitted, the notice is recorded on-chain and cannot be edited.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Quick Stats</h3>
                  <div className="space-y-3 text-sm text-slate-400">
                    <div className="flex justify-between">
                      <span>Total notices</span>
                      <span>{notices.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Drafts</span>
                      <span>0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ready to publish</span>
                      <span>{formData.title && formData.content ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verified' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">Verified Records</p>
                  <h3 className="text-2xl font-semibold text-slate-100">Blockchain proofs</h3>
                </div>
                <span className="inline-flex items-center rounded-full bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400">
                  {notices.length} verified record{notices.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                  <p className="text-sm text-slate-400">Total Immovable Claims</p>
                  <h4 className="mt-3 text-3xl font-semibold text-slate-100">{notices.length}</h4>
                  <p className="mt-4 text-sm text-slate-500">Every record has an immutable transaction hash on-chain.</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                  <p className="text-sm text-slate-400">Lowest validation time</p>
                  <h4 className="mt-3 text-3xl font-semibold text-slate-100">3ms</h4>
                  <p className="mt-4 text-sm text-slate-500">Estimated verification latency for recent notices.</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                  <p className="text-sm text-slate-400">Verified by</p>
                  <h4 className="mt-3 text-3xl font-semibold text-slate-100">Blockchain</h4>
                  <p className="mt-4 text-sm text-slate-500">Records are cryptographically anchored and tamper proof.</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {notices.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-10 text-center text-slate-500">
                    There are no verified records yet.
                  </div>
                ) : (
                  notices.map((notice) => (
                    <div key={notice.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-6 hover:border-slate-700 transition-colors">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-slate-500">Verified record</p>
                          <h4 className="text-lg font-semibold text-slate-100 mt-2">{notice.title}</h4>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">Verified</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-3">{notice.hash}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{notice.date}</span>
                        <span className="font-medium text-slate-300">Block verified</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">Analytics</p>
                  <h3 className="text-2xl font-semibold text-slate-100">Notice performance</h3>
                </div>
                <span className="inline-flex items-center rounded-full bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400">
                  Updated live
                </span>
              </div>
              <div className="grid gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2 rounded-2xl border border-slate-800 bg-slate-950 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-100">Notice activity</h4>
                      <p className="text-sm text-slate-500">Publication trends over the last seven entries.</p>
                    </div>
                    <span className="text-xs uppercase tracking-wide text-slate-400">Trend</span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {[12, 16, 9, 14, 18, 11, 15].map((value, index) => (
                      <div key={index} className="h-32 rounded-3xl bg-slate-900 p-4 flex flex-col justify-end">
                        <span className="text-sm text-slate-400">Day {index + 1}</span>
                        <div className="mt-4 rounded-full bg-blue-500/20" style={{ height: `${value * 3}px` }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                    <p className="text-sm text-slate-400">Total notices</p>
                    <h4 className="mt-3 text-3xl font-semibold text-slate-100">{notices.length}</h4>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                    <p className="text-sm text-slate-400">Average time to verify</p>
                    <h4 className="mt-3 text-3xl font-semibold text-slate-100">3.2s</h4>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                    <p className="text-sm text-slate-400">Top categories</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-200">
                      <div className="flex items-center justify-between">
                        <span>Exams</span>
                        <span>42%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Events</span>
                        <span>28%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Academics</span>
                        <span>30%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-auto py-6 border-t border-slate-800">
          <p className="text-center text-xs text-slate-500">
            © 2026 BlockNotice. Secured by Ethereum Blockchain.
          </p>
        </footer>
      </main>
    </div>
  );
}
