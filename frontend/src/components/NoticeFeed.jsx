import { Calendar, Hash } from "lucide-react";

export default function NoticeFeed({ filteredNotices, searchQuery }) {
  return (
    <div className={filteredNotices ? "lg:col-span-3" : "lg:col-span-2"}>
      <div className="space-y-4">
        {filteredNotices && filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl flex justify-between items-start hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-900/40 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter border border-blue-800">
                    ID: #{notice.id}
                  </span>
                  <span className="text-slate-500 text-xs flex items-center gap-1">
                    <Calendar size={12} /> {notice.date}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-1">
                  {notice.title}
                </h4>
                <p className="text-xs text-slate-500 font-mono">
                  HASH: {notice.hash}
                </p>
              </div>
              <button className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 text-blue-400">
                <Hash size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500">
            <p>No notices found</p>
            {searchQuery && <p className="text-sm mt-2">Try a different search</p>}
          </div>
        )}
      </div>
    </div>
  );
}
