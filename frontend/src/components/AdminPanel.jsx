import { useState } from "react";
import { Loader2, Hash } from "lucide-react";

export default function AdminPanel({ onPublish, loading }) {
  const [formData, setFormData] = useState({ title: "", content: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onPublish(formData);
    setFormData({ title: "", content: "" });
  };

  return (
    <aside className="lg:col-span-1">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl sticky top-24">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Hash className="text-blue-500" size={18} /> New Notice
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg outline-none focus:border-blue-500"
            placeholder="Notice Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <textarea
            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg outline-none h-32 focus:border-blue-500"
            placeholder="Notice Content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            required
          />
          <button
            disabled={loading}
            className="w-full bg-blue-600 py-3 rounded-lg font-bold text-white flex justify-center items-center gap-2 hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Publishing...
              </>
            ) : (
              "Publish Notice"
            )}
          </button>
        </form>
      </div>
    </aside>
  );
}
