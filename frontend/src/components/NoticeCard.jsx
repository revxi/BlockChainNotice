import React from "react";
import { CheckCircle2, Calendar, Hash, ExternalLink } from "lucide-react";

export default function NoticeCard({ id, title, hash, date }) {
  return (
    <div className="rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden flex flex-col bg-primary border-theme">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-navy-700" />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header row */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md border font-mono bg-secondary text-secondary border-theme">
            Notice #{id}
          </span>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <CheckCircle2 size={12} />
            <span>Verified</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold mb-4 line-clamp-2 flex-1 text-primary" title={title}>
          {title}
        </h3>

        {/* Meta info */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-tertiary">
            <Calendar size={12} className="shrink-0" />
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-tertiary">
            <Hash size={12} className="shrink-0" />
            <span className="truncate" title={hash}>{hash}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t pt-3 border-theme">
          <button
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors py-2 rounded-lg border bg-secondary border-theme text-secondary hover:bg-navy-700 hover:text-white hover:border-navy-700"
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
