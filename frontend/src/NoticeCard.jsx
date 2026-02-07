import React from "react";
import { ShieldCheck, Calendar, Hash, ArrowUpRight } from "lucide-react";

export default function NoticeCard({ id, title, hash, date }) {
  return (
    <div className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all duration-500" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20 shadow-sm">
            ID: #{id}
          </span>
          <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
            <ShieldCheck size={14} />
            <span>Verified</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2" title={title}>
          {title}
        </h3>

        <div className="flex flex-col gap-2 text-sm text-slate-400 font-mono mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-500" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Hash size={14} className="text-slate-500" />
            <span className="truncate" title={hash}>
              {hash}
            </span>
          </div>
        </div>

        <button
          className="w-full mt-auto flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group-hover:shadow-lg border border-white/5 group-hover:border-blue-500/50"
          aria-label={`View notice ${id} on IPFS`}
          onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${hash}`, "_blank")}
        >
          View on IPFS
          <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
}
