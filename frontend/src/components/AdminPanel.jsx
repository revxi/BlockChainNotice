import React, { useState } from "react";
import { Loader2, PenTool, Type, FileText } from "lucide-react";

export default function AdminPanel({ onPublish, loading }) {
  const [formData, setFormData] = useState({ title: "", content: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onPublish(formData);
    setFormData({ title: "", content: "" });
  };

  return (
    <aside className="lg:col-span-4 transition-all duration-300">
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-2xl sticky top-24 shadow-2xl">
        <div className="mb-6 pb-4 border-b border-slate-800">
          <h3 className="text-white font-bold text-xl flex items-center gap-3">
            <span className="p-2 bg-blue-500/10 rounded-lg text-blue-500 border border-blue-500/20">
              <PenTool size={20} />
            </span>
            Issue New Notice
          </h3>
          <p className="text-slate-400 text-sm mt-2 ml-1">
            Publish official announcements to the blockchain ledger.
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
                <span>Publishing to Blockchain...</span>
              </>
            ) : (
              <>
                <span className="group-hover:scale-105 transition-transform">Publish Notice</span>
              </>
            )}
          </button>
        </form>
      </div>
    </aside>
  );
}
