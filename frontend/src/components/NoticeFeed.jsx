import React from "react";
import { SearchX, FileText, Loader2 } from "lucide-react";
import NoticeCard from "./NoticeCard";

export default function NoticeFeed({ filteredNotices, searchQuery, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-slate-200">
        <Loader2 size={28} className="text-slate-300 animate-spin mb-3" />
        <p className="text-slate-400 text-sm">Loading notices…</p>
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors duration-200">
        <Loader2 size={28} className="text-slate-300 dark:text-slate-600 animate-spin mb-3" />
        <p className="text-slate-400 dark:text-slate-500 text-sm">Loading notices…</p>
      </div>
    );
  }

  if (!filteredNotices || filteredNotices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dashed border-slate-300">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          {searchQuery ? <SearchX size={24} className="text-slate-400" /> : <FileText size={24} className="text-slate-400" />}
        </div>
        <h3 className="text-base font-bold text-slate-700 mb-1">
          {searchQuery ? "No Results Found" : "No Notices Yet"}
        </h3>
        <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 transition-colors duration-200">
        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
          {searchQuery ? <SearchX size={24} className="text-slate-400 dark:text-slate-500" /> : <FileText size={24} className="text-slate-400 dark:text-slate-500" />}
        </div>
        <h3 className="text-base font-bold text-slate-700 dark:text-slate-200 mb-1">
          {searchQuery ? "No Results Found" : "No Notices Yet"}
        </h3>
        <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xs leading-relaxed">
          {searchQuery
            ? `No notices match "${searchQuery}".`
            : "No official notices have been published yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filteredNotices.map((notice) => (
        <NoticeCard
          key={notice.id}
          id={notice.id}
          title={notice.title}
          hash={notice.content}
          date={new Date(notice.created_at).toLocaleDateString()}
          publishedBy={notice.published_by}
          attachments={notice.attachments || []}
        />
      ))}
    </div>
  );
}
