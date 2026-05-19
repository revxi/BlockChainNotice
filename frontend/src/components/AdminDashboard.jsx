import React, { useState } from 'react';
import {
  Shield, LayoutDashboard, FileText, PlusCircle, CheckCircle2,
  BarChart2, Settings, Building, ChevronDown, Bell, LogOut,
  File, Cube, Users, Calendar, Clipboard, Book, Copy, ChevronRight,
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
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 transition-colors cursor-not-allowed opacity-50">
              <FileText size={18} />
              <span className="text-sm">My Notices</span>
            </button>
            <button onClick={() => setActiveTab('create')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'create' ? 'bg-blue-900/30 text-blue-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}>
              <PlusCircle size={18} />
              <span className="text-sm">Create Notice</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 transition-colors cursor-not-allowed opacity-50">
              <CheckCircle2 size={18} />
              <span className="text-sm">Verified Records</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 transition-colors cursor-not-allowed opacity-50">
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
            <p className="text-sm text-slate-400 mt-1">Here's what's happening in your department.</p>
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
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <File size={20} className="text-blue-400" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-medium text-slate-400 mb-1">Total Notices</p>
                <h3 className="text-2xl font-bold text-slate-100 mb-3">12</h3>
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 transition-colors">
                  → View all notices
                </a>
              </div>
              {/* Sparkline Placeholder */}
              <div className="absolute right-0 bottom-0 w-24 h-16 opacity-20 pointer-events-none flex items-end justify-between px-2 pb-2 gap-1">
                <div className="w-2 bg-blue-400 rounded-t h-4"></div>
                <div className="w-2 bg-blue-400 rounded-t h-6"></div>
                <div className="w-2 bg-blue-400 rounded-t h-3"></div>
                <div className="w-2 bg-blue-400 rounded-t h-8"></div>
                <div className="w-2 bg-blue-400 rounded-t h-5"></div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-emerald-400" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-medium text-slate-400 mb-1">Verified Notices</p>
                <h3 className="text-2xl font-bold text-slate-100 mb-3">12</h3>
                <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  100% Verified
                </p>
              </div>
              {/* Sparkline Placeholder */}
              <div className="absolute right-0 bottom-0 w-24 h-16 opacity-20 pointer-events-none flex items-end justify-between px-2 pb-2 gap-1">
                <div className="w-full h-8 border-t-2 border-emerald-400 rounded-tl-full bg-gradient-to-t from-emerald-400/20 to-transparent"></div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Cube size={20} className="text-purple-400" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-medium text-slate-400 mb-1">On-Chain Records</p>
                <h3 className="text-2xl font-bold text-slate-100 mb-3">12</h3>
                <p className="text-xs text-purple-400 font-medium flex items-center gap-1.5">
                  <Database size={12} />
                  Immutable
                </p>
              </div>
              {/* Sparkline Placeholder */}
              <div className="absolute right-0 bottom-0 w-24 h-16 opacity-20 pointer-events-none flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-purple-400 border-t-transparent border-r-transparent rotate-45"></div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Users size={20} className="text-amber-400" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-medium text-slate-400 mb-1">Total Views</p>
                <h3 className="text-2xl font-bold text-slate-100 mb-3">248</h3>
                <p className="text-xs text-amber-400 font-medium flex items-center gap-1">
                  ↗ +18% this week
                </p>
              </div>
              {/* Sparkline Placeholder */}
              <div className="absolute right-0 bottom-0 w-24 h-16 opacity-20 pointer-events-none flex items-end justify-between px-2 pb-2 gap-1">
                <svg viewBox="0 0 100 50" className="w-full h-full stroke-amber-400 fill-none" strokeWidth="4">
                  <path d="M0 40 L20 35 L40 45 L60 20 L80 25 L100 5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Main Content Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (Recent Notices) */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full">
                <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-100">Recent Notices</h3>
                  <button className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors">
                    View all
                  </button>
                </div>

                <div className="divide-y divide-slate-800/60 flex-1">
                  {/* Item 1 */}
                  <div className="p-4 hover:bg-slate-800/30 transition-colors flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-slate-700 transition-colors">
                      <Calendar size={18} className="text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-slate-200 truncate">Mid Sem Examination Schedule</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                          Examination
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>May 18, 2026 • 2:30 PM</span>
                        <span className="flex items-center gap-1 text-emerald-400/80">
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 group-hover:border-slate-700 transition-colors">
                        Block # 19876543
                        <Copy size={12} className="text-slate-500 hover:text-slate-300 cursor-pointer" />
                      </div>
                    </div>
                    <div className="pl-2">
                      <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="p-4 hover:bg-slate-800/30 transition-colors flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-slate-700 transition-colors">
                      <Book size={18} className="text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-slate-200 truncate">Updated Syllabus for Semester 6</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                          Academics
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>May 15, 2026 • 10:15 AM</span>
                        <span className="flex items-center gap-1 text-emerald-400/80">
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 group-hover:border-slate-700 transition-colors">
                        Block # 19875421
                        <Copy size={12} className="text-slate-500 hover:text-slate-300 cursor-pointer" />
                      </div>
                    </div>
                    <div className="pl-2">
                      <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="p-4 hover:bg-slate-800/30 transition-colors flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-slate-700 transition-colors">
                      <Clipboard size={18} className="text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-slate-200 truncate">Project Submission Guidelines</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                          Guidelines
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>May 10, 2026 • 4:45 PM</span>
                        <span className="flex items-center gap-1 text-emerald-400/80">
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 group-hover:border-slate-700 transition-colors">
                        Block # 19871105
                        <Copy size={12} className="text-slate-500 hover:text-slate-300 cursor-pointer" />
                      </div>
                    </div>
                    <div className="pl-2">
                      <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="p-4 hover:bg-slate-800/30 transition-colors flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-slate-700 transition-colors">
                      <Calendar size={18} className="text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-slate-200 truncate">Annual Tech Fest Dates Announced</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                          Events
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>May 02, 2026 • 9:00 AM</span>
                        <span className="flex items-center gap-1 text-emerald-400/80">
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 group-hover:border-slate-700 transition-colors">
                        Block # 19864092
                        <Copy size={12} className="text-slate-500 hover:text-slate-300 cursor-pointer" />
                      </div>
                    </div>
                    <div className="pl-2">
                      <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right Column (Context Panels) */}
            <div className="lg:col-span-1 space-y-6">

              {/* Department Info Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
                    <Building size={32} className="text-slate-300" />
                  </div>
                </div>
                <h3 className="text-center font-semibold text-slate-100 mb-2">Computer Engineering Department</h3>
                <p className="text-center text-sm text-slate-400 mb-6 leading-relaxed">
                  Manage and publish official departmental notices. All records are permanently secured on the blockchain ledger.
                </p>
                <button className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700 hover:border-slate-600">
                  Department Settings
                </button>
              </div>

              {/* Blockchain Status Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <Activity size={16} className="text-blue-400" />
                  Blockchain Status
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Network</span>
                    <span className="font-medium text-slate-200">Ethereum Mainnet</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Last Sync</span>
                    <span className="font-medium text-slate-200">2 mins ago</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Smart Contract</span>
                    <span className="font-medium text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Verified
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Status</span>
                    <span className="font-medium text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Operational
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex gap-3">
                  <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-emerald-400 mb-1">All systems operational</h4>
                    <p className="text-xs text-emerald-400/80 leading-relaxed">
                      Your notices are secure and immutable. The blockchain ledger is actively syncing.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto py-6 border-t border-slate-800">
          <p className="text-center text-xs text-slate-500">
            © 2026 BlockNotice. Secured by Ethereum Blockchain.
          </p>
        </footer>
      </main>
    </div>
  );
}
