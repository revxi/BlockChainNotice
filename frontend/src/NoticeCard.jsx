export default function NoticeCard({ title, verified }) {
  return (
    <div className="bg-glass border border-border rounded-xl p-4 relative shadow-lg">
      <span className="absolute top-3 right-3 w-3 h-3 bg-gray-400 rounded-full"></span>

      <span className="text-xs bg-blue-600 px-2 py-1 rounded-md">
        ID: #01
      </span>

      {verified && (
        <div className="mt-2 inline-flex items-center gap-1 text-green-400 text-sm">
          ✅ Verified
        </div>
      )}

      <h3 className="mt-3 font-semibold">
        {title || "Blockchain Notice"}
      </h3>

      <p className="text-sm text-gray-400 mt-2">
        Date: 01/29/2026
      </p>

      <p className="text-xs text-gray-500 mt-1 truncate">
        QmXoyp…asdJ_IPFS
      </p>
    </div>
  );
}
