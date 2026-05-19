import React, { useState } from "react";
import { Loader2, Send, Type, FileText, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminPanel({ onPublish, loading }) {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await onPublish(formData);
      setFormData({ title: "", content: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <aside className="lg:col-span-4">
      <div className="rounded-xl border shadow-sm sticky top-24 overflow-hidden" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)" }}>
        {/* Panel header */}
        <div className="px-5 py-4 border-b flex items-center gap-3" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#163068' }}>
            <ShieldCheck size={16} className="text-yellow-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Issue Official Notice</h3>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Admin access only</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-1.5 text-red-600 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="notice-title" className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
              <Type size={12} style={{ color: "var(--text-tertiary)" }} />
              Notice Title
            </label>
            <input
              id="notice-title"
              className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-all"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--input-border)",
                color: "var(--text-primary)",
              }}
              onFocus={e => e.target.style.borderColor = '#163068'}
              onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
              placeholder="e.g. Exam Schedule – Spring 2025"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (error) setError("");
              }}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="notice-content" className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
              <FileText size={12} style={{ color: "var(--text-tertiary)" }} />
              Notice Content
            </label>
            <textarea
              id="notice-content"
              className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-all min-h-[140px] resize-none"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--input-border)",
                color: "var(--text-primary)",
              }}
              onFocus={e => e.target.style.borderColor = '#163068'}
              onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
              placeholder="Enter the full details of this notice..."
              value={formData.content}
              onChange={(e) => {
                setFormData({ ...formData, content: e.target.value });
                if (error) setError("");
              }}
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

          <p className="text-xs text-center pt-1" style={{ color: "var(--text-tertiary)" }}>
            This notice will be permanently recorded on the blockchain and cannot be modified.
          </p>
        </form>
      </div>
    </aside>
  );
}
