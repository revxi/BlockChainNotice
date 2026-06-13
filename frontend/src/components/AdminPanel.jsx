import React, { useState, useRef } from "react";
import { Loader2, Send, Type, FileText, GraduationCap, CheckCircle, AlertCircle, Paperclip, X, FileImage, File } from "lucide-react";

const MAX_FILES = 5;
const MAX_SIZE_MB = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];

function FileChip({ file, onRemove }) {
  const isPdf = file.type === "application/pdf";
  return (
    <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 max-w-full">
      {isPdf
        ? <File size={13} className="shrink-0 text-red-500" />
        : <FileImage size={13} className="shrink-0 text-blue-500" />
      }
      <span className="truncate max-w-[140px]" title={file.name}>{file.name}</span>
      <span className="text-slate-400 shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 text-slate-400 hover:text-red-500 transition-colors shrink-0"
      >
        <X size={12} />
      </button>
    </div>
  );
}

export default function AdminPanel({ onPublish, loading }) {
  const [formData, setFormData]   = useState({ title: "", content: "" });
  const [files, setFiles]         = useState([]);
  const [fileError, setFileError] = useState("");
  const [status, setStatus]       = useState(null);
  const inputRef = useRef(null);

  const addFiles = (incoming) => {
    setFileError("");
    const valid = [];
    for (const f of incoming) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        setFileError(`"${f.name}" is not allowed. Only images and PDFs.`);
        continue;
      }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        setFileError(`"${f.name}" exceeds ${MAX_SIZE_MB} MB limit.`);
        continue;
      }
      valid.push(f);
    }
    setFiles((prev) => {
      const combined = [...prev, ...valid];
      if (combined.length > MAX_FILES) {
        setFileError(`Maximum ${MAX_FILES} files per notice.`);
        return combined.slice(0, MAX_FILES);
      }
      return combined;
    });
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setFileError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const result = await onPublish(formData, files);
    if (result.success) {
      setFormData({ title: "", content: "" });
      setFiles([]);
      setFileError("");
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
            <GraduationCap size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Issue Official Notice</h3>
            <p className="text-xs text-slate-500">Faculty access</p>
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
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-amber-400 transition-all bg-white min-h-[120px] resize-none"
              placeholder="Enter the full details of this notice..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
              <Paperclip size={12} className="text-slate-400" />
              Attachments
              <span className="text-slate-400 normal-case font-normal">(images &amp; PDFs, max {MAX_FILES})</span>
            </label>

            <div
              className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/40 transition-all"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <Paperclip size={18} className="mx-auto mb-1.5 text-slate-300" />
              <p className="text-xs text-slate-400">
                <span className="font-semibold text-amber-600">Click to browse</span> or drag &amp; drop
              </p>
              <p className="text-[10px] text-slate-300 mt-0.5">JPG, PNG, GIF, WEBP, PDF · max {MAX_SIZE_MB} MB each</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*,.pdf"
                multiple
                className="hidden"
                onChange={(e) => addFiles(Array.from(e.target.files))}
              />
            </div>

            {files.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {files.map((f, i) => (
                  <FileChip key={i} file={f} onRemove={() => removeFile(i)} />
                ))}
              </div>
            )}

            {fileError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle size={11} /> {fileError}
              </p>
            )}
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
            style={{ backgroundColor: "#c9a84c" }}
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
