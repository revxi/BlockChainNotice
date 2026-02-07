import React, { useState } from "react";
import { Loader2, PenTool, Type, FileText, CheckCircle } from "lucide-react";

export default function AdminPanel({ onPublish, loading, proposals, onConfirm }) {
  const [formData, setFormData] = useState({ title: "", content: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onPublish(formData);
    setFormData({ title: "", content: "" });
  };

  return (
    <aside className="lg:col-span-4 transition-all duration-300 space-y-6">
      {/* Submit New Proposal */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-2xl">
        <div className="mb-6 pb-4 border-b border-slate-800">
          <h3 className="text-white font-bold text-xl flex items-center gap-3">
            <span className="p-2 bg-blue-500/10 rounded-lg text-blue-500 border border-blue-500/20">
              <PenTool size={20} />
            </span>
            Issue New Notice
          </h3>
          <p className="text-slate-400 text-sm mt-2 ml-1">
            Submit a proposal for a new notice. Requires admin approval.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="notice-title" className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Type size={14} className="text-blue-400" />
              Notice Title
            </label>
            <input
              id="notice-title"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="e.g. Exam Schedule Spring 2024"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="notice-content" className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <FileText size={14} className="text-blue-400" />
              Content
            </label>
            <textarea
              id="notice-content"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 min-h-[160px] resize-none"
              placeholder="Enter the full details of the notice..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Submitting Proposal...</span>
              </>
            ) : (
              <>
                <span className="group-hover:scale-105 transition-transform">Submit Proposal</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Pending Proposals List */}
      {proposals && proposals.length > 0 && (
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-2xl animate-fadeIn">
          <div className="mb-4 pb-2 border-b border-slate-800">
             <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <CheckCircle size={18} className="text-yellow-500" />
                Pending Approvals
             </h3>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
             {proposals.map(p => (
                 <div key={p.id} className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 hover:border-blue-500/20 transition-colors">
                     <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-white text-sm">{p.title}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">#{p.id}</span>
                     </div>
                     <p className="text-xs text-slate-400 mb-3 font-mono truncate">{p.content}</p>

                     <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/50">
                         <div className="flex items-center gap-2 text-xs text-blue-300">
                             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                             Approvals: <span className="font-bold">{p.approvalCount}</span>
                         </div>
                         <button
                             onClick={() => onConfirm(p.id)}
                             disabled={loading}
                             className="text-xs bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg transition-colors font-semibold shadow-lg shadow-green-900/20"
                         >
                             Confirm
                         </button>
                     </div>
                 </div>
             ))}
          </div>
        </div>
      )}
    </aside>
  );
}
