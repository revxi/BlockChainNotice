import React from "react";
import { SearchX, FileText } from "lucide-react";
import NoticeCard from "./NoticeCard";

export default function NoticeFeed({ filteredNotices, searchQuery }) {
  return (
    <div className="flex-1">
      {filteredNotices && filteredNotices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredNotices.map((notice) => (
            <NoticeCard key={notice.id} {...notice} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dashed border-slate-300 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4 border border-slate-200">
            {searchQuery ? (
              <SearchX size={24} className="text-slate-400" />
            ) : (
              <FileText size={24} className="text-slate-400" />
            )}
          </div>
          <h3 className="text-base font-bold text-slate-700 mb-1">
            {searchQuery ? "No Results Found" : "No Notices Published Yet"}
          </h3>
          <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
            {searchQuery
              ? `No notices match "${searchQuery}". Try searching by title, ID, or date.`
              : "No official notices have been published to the blockchain ledger."}
          </p>
        </div>
      )}
    </div>
  );
}
