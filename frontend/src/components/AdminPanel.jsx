import React, { useState } from "react";
import { Loader2, Send, Type, FileText, ShieldCheck, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminPanel({ onPublish, loading }) {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [status, setStatus]     = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const result = await onPublish(formData);
    if (result.success) {
      setFormData({ title: "", content: "" });
      setStatus({ ok: true, msg: "Notice published successfully." });
    } else {
      setStatus({ ok: false, msg: result.error || "Failed to publish." });
    }
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <aside className="lg:col-span-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-20 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3" style={{ backgroundColor: "#f8fafc" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#c9a84c" }}>
            <ShieldCheck size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Issue Official Notice</h3>
            <p className="text-xs text-slate-500">Admin access only</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
              <Type size={12} className="text-slate-400" />
              Notice Title
            </label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-amber-400 transition-all bg-white"
              placeholder="e.g. Exam Schedule – Spring 2025"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
              <FileText size={12} className="text-slate-400" />
              Notice Content
            </label>
            <textarea
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-amber-400 transition-all bg-white min-h-[140px] resize-none"
              placeholder="Enter the full details of this notice..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          {status && (
            <div className={`flex items-center gap-2 text-xs p-3 rounded-lg border ${status.ok ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              {status.ok ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
              {status.msg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white text-sm font-semibold py-2.5 rounded-lg flex justify-center items-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#0f172a" }}
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={15} />Publishing…</>
            ) : (
              <><Send size={15} />Publish Notice</>
            )}
          </button>
        </form>
      </div>
    </aside>
  );
}
