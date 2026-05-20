import React, { useState } from "react";
import { Loader2, Send, Type, FileText, ShieldCheck } from "lucide-react";

export default function AdminPanel({ onPublish, loading }) {
  const [formData, setFormData] = useState({ title: "", content: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onPublish(formData);
    setFormData({ title: "", content: "" });
  };

  return (
    <aside className="lg:col-span-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-24 overflow-hidden">
        {/* Panel header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3" style={{ backgroundColor: '#f8fafc' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#163068' }}>
            <ShieldCheck size={16} className="text-yellow-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Issue Official Notice</h3>
            <p className="text-xs text-slate-500">Admin access only</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="notice-title" className="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
              <Type size={12} className="text-slate-400" />
              Notice Title
            </label>
            <input
              id="notice-title"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 transition-all bg-white"
              style={{ '--tw-ring-color': '#163068' + '33' }}
              onFocus={e => e.target.style.borderColor = '#163068'}
              onBlur={e => e.target.style.borderColor = ''}
              placeholder="e.g. Exam Schedule – Spring 2025"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="notice-content" className="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
              <FileText size={12} className="text-slate-400" />
              Notice Content
            </label>
            <textarea
              id="notice-content"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all bg-white min-h-[140px] resize-none"
              onFocus={e => e.target.style.borderColor = '#163068'}
              onBlur={e => e.target.style.borderColor = ''}
              placeholder="Enter the full details of this notice..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <button
            disabled={loading}
            className="w-full text-white text-sm font-semibold py-2.5 rounded-lg flex justify-center items-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#163068' }}
            onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#0f2050')}
            onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#163068')}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Publishing to Blockchain...
              </>
            ) : (
              <>
                <Send size={16} />
                Publish Notice
              </>
            )}
          </button>

          <p className="text-xs text-center text-slate-400 pt-1">
            This notice will be permanently recorded on the blockchain and cannot be modified.
          </p>
        </form>
      </div>
    </aside>
  );
}
