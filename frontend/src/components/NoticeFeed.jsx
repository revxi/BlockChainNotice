import React from "react";
import { SearchX } from "lucide-react";
import NoticeCard from "../NoticeCard";

export default function NoticeFeed({ filteredNotices, searchQuery }) {
  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {filteredNotices && filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <NoticeCard key={notice.id} {...notice} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
            <div className="bg-slate-800/50 p-4 rounded-full mb-4">
              <SearchX size={40} className="text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No notices found</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              {searchQuery
                ? `We couldn't find any notices matching "${searchQuery}". Try a different keyword or ID.`
                : "There are currently no notices published on the blockchain ledger."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
