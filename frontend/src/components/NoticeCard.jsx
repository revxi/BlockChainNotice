import React from "react";
import { CheckCircle2, Calendar, Hash, ExternalLink } from "lucide-react";

export default function NoticeCard({ id, title, hash, date }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden flex flex-col">
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: '#163068' }} />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header row */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-mono border border-slate-200">
            Notice #{id}
          </span>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <CheckCircle2 size={12} />
            <span>Verified</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-800 mb-4 line-clamp-2 flex-1" title={title}>
          {title}
        </h3>

        {/* Meta info */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar size={12} className="shrink-0 text-slate-400" />
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Hash size={12} className="shrink-0" />
            <span className="truncate" title={hash}>{hash}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 pt-3">
          <button
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors py-2 rounded-lg border border-slate-200 hover:border-navy-600 hover:text-white hover:bg-navy-700 text-slate-600"
            style={{ transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#163068'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#163068'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = ''; }}
            aria-label={`View notice ${id} on IPFS`}
          >
            View on IPFS
            <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
