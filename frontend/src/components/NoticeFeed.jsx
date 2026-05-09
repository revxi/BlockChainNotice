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
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed shadow-sm" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-color)" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 border" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
            {searchQuery ? (
              <SearchX size={24} style={{ color: "var(--text-tertiary)" }} />
            ) : (
              <FileText size={24} style={{ color: "var(--text-tertiary)" }} />
            )}
          </div>
          <h3 className="text-base font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            {searchQuery ? "No Results Found" : "No Notices Published Yet"}
          </h3>
          <p className="text-sm max-w-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
            {searchQuery
              ? `No notices match "${searchQuery}". Try searching by title, ID, or date.`
              : "No official notices have been published to the blockchain ledger."}
          </p>
        </div>
      )}
    </div>
  );
}
