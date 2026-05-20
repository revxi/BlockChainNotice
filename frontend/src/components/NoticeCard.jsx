import React, { useState } from "react";
import { CheckCircle2, Calendar, ChevronDown, ChevronUp, Wallet } from "lucide-react";

export default function NoticeCard({ id, title, hash: content, date, publishedBy }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = content && content.length > 180;
  const preview = isLong && !expanded ? content.slice(0, 180).trimEnd() + "…" : content;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden flex flex-col">
      <div className="h-1 w-full" style={{ backgroundColor: "#c9a84c" }} />

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-mono border border-slate-200">
            #{id}
          </span>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <CheckCircle2 size={12} />
            <span>Published</span>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-800 mb-3 line-clamp-2" title={title}>
          {title}
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed flex-1 whitespace-pre-line">
          {preview}
        </p>

        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors self-start"
          >
            {expanded ? <><ChevronUp size={13} />Show less</> : <><ChevronDown size={13} />Read more</>}
          </button>
        )}

        <div className="border-t border-slate-100 mt-4 pt-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar size={12} className="shrink-0" />
            <span>{date}</span>
          </div>
          {publishedBy && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
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
