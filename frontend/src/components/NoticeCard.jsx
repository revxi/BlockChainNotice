import React, { useState } from "react";
import { CheckCircle2, Calendar, ChevronDown, ChevronUp, Wallet, Paperclip, FileText, ExternalLink, X } from "lucide-react";

function AttachmentThumb({ att }) {
  const [lightbox, setLightbox] = useState(false);
  const isImage = att.mimetype.startsWith("image/");
  const url = `/uploads/${att.filename}`;

  if (isImage) {
    return (
      <>
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 hover:border-amber-400 dark:hover:border-amber-500 transition-all"
          style={{ width: 72, height: 72 }}
          title={att.original_name}
        >
          <img
            src={url}
            alt={att.original_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
            <ExternalLink size={14} className="text-white opacity-0 group-hover:opacity-100 transition-all" />
          </div>
        </button>

        {lightbox && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/40 rounded-full p-1.5"
              onClick={() => setLightbox(false)}
            >
              <X size={20} />
            </button>
            <img
              src={url}
              alt={att.original_name}
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all text-xs text-slate-600 dark:text-slate-300 font-medium group"
      title={att.original_name}
    >
      <FileText size={14} className="text-red-500 shrink-0" />
      <span className="truncate max-w-[140px]">{att.original_name}</span>
      <ExternalLink size={11} className="text-slate-300 dark:text-slate-600 group-hover:text-amber-500 transition-colors shrink-0 ml-auto" />
    </a>
  );
}

export default function NoticeCard({ id, title, hash: content, date, publishedBy, attachments = [] }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = content && content.length > 180;
  const preview = isLong && !expanded ? content.slice(0, 180).trimEnd() + "…" : content;

  const images = attachments.filter((a) => a.mimetype.startsWith("image/"));
  const pdfs   = attachments.filter((a) => a.mimetype === "application/pdf");

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden flex flex-col">
      <div className="h-1 w-full" style={{ backgroundColor: "#c9a84c" }} />

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-600">
            #{id}
          </span>
          <div className="flex items-center gap-2">
            {attachments.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-600">
                <Paperclip size={11} />
                <span>{attachments.length}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 size={12} />
              <span>Published</span>
            </div>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3 line-clamp-2" title={title}>
          {title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1 whitespace-pre-line">
          {preview}
        </p>

        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-500 hover:text-amber-900 dark:hover:text-amber-400 transition-colors self-start"
          >
            {expanded ? <><ChevronUp size={13} />Show less</> : <><ChevronDown size={13} />Read more</>}
          </button>
        )}

        {images.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {images.map((a) => <AttachmentThumb key={a.id} att={a} />)}
          </div>
        )}

        {pdfs.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {pdfs.map((a) => <AttachmentThumb key={a.id} att={a} />)}
          </div>
        )}

        <div className="border-t border-slate-100 dark:border-slate-700 mt-4 pt-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <Calendar size={12} className="shrink-0" />
            <span>{date}</span>
          </div>
          {publishedBy && (
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-mono">
              <Wallet size={12} className="shrink-0" />
              <span className="truncate" title={publishedBy}>
                {publishedBy.slice(0, 8)}…{publishedBy.slice(-6)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
