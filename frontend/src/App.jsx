import React, { useState, useEffect, useMemo } from "react";
import { useWeb3 } from "./context/Web3Context";
import { Search, ShieldCheck, Lock, Calendar, Hash, PlusCircle, User, Loader2 } from "lucide-react";

// Inline NoticeCard Component to prevent "File Not Found" errors
const NoticeCard = ({ id, title, hash, date }) => (
  <div className="group bg-slate-900/40 border border-slate-800 p-5 rounded-2xl hover:border-blue-500/50 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
    <div className="flex justify-between items-start mb-3">
      <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-blue-500/30">
        ID: #{id}
      </span>
      <div className="flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full text-[10px] border border-green-500/20">
        <ShieldCheck size={12} /> Verified
      </div>
    </div>
    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h4>
    <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 mb-4 font-mono">
       <span className="flex items-center gap-1"><Calendar size={12}/> {date}</span>
       <span className="flex items-center gap-1"><Hash size={12}/> {hash.substring(0,12)}...</span>
    </div>
    <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold transition-colors text-slate-300">
      View On IPFS
    </button>
  </div>
);

export default function App() {
  const { account, contract, connectWallet } = useWeb3();
  const [notices, setNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const fetchNotices = async () => {
    if (contract) {
      try {
        const count = await contract.getNoticeCount();
        const temp = [];
        for (let i = 0; i < count; i++) {
          const n = await contract.allNotices(i);
          temp.push({
            id: n.id.toString(),
            title: n.title,
            hash: n.ipfsHash,
            date: new Date(Number(n.timestamp) * 1000).toLocaleDateString(),
          });
        }
        setNotices(temp.reverse());
      } catch (err) { console.error("Fetch error:", err); }
    }
  };

  useEffect(() => { fetchNotices(); }, [contract]);

  // Search Logic (ID, Date, or Title)
  const filteredNotices = useMemo(() => {
    return notices.filter(n => 
      n.id.includes(searchQuery) || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.date.includes(searchQuery)
    );
  }, [notices, searchQuery]);

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!contract) return alert("Connect Wallet!");
    setIsPublishing(true);
    try {
      // Simulate IPFS Hashing of content
      const mockHash = "Qm" + Math.random().toString(36).substring(2, 15);
      const tx = await contract.issueNotice(mockHash, formData.title);
      await tx.wait();
      setFormData({ title: "", content: "" });
      fetchNotices();
    } catch (err) { alert("Only the admin wallet can publish notices!"); }
    setIsPublishing(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300 font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-500" size={28} />
            <h1 className="text-2xl font-bold text-white tracking-tight">BlockNotice</h1>
          </div>
          <button 
            onClick={connectWallet}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-2 rounded-full text-sm font-medium transition-all text-white flex items-center gap-2"
          >
            <User size={16} className="text-blue-400" />
            {account ? `${account.substring(0,6)}...${account.substring(38)}` : "Connect Wallet"}
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-3 text-slate-500" size={20} />
            <input 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500 transition-colors"
              placeholder="Search by ID, Title, or Date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAdminLoggedIn(!isAdminLoggedIn)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${isAdminLoggedIn ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'}`}
          >
            {isAdminLoggedIn ? "Exit Admin Mode" : <><Lock size={18}/> Admin Login</>}
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Admin Panel */}
          {isAdminLoggedIn && (
            <div className="lg:col-span-4">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl sticky top-28">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg">
                  <PlusCircle className="text-blue-500" /> Issue Official Notice
                </h3>
                <form onSubmit={handlePublish} className="space-y-4">
                  <input 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="Notice Title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                  <textarea 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500 h-32 resize-none"
                    placeholder="Content for IPFS hashing..."
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    required
                  />
                  <button 
                    disabled={isPublishing}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
                  >
                    {isPublishing ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                    {isPublishing ? "Publishing..." : "Broadcast to Blockchain"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Notice Grid */}
          <div className={isAdminLoggedIn ? "lg:col-span-8" : "lg:col-span-12"}>
            <div className={`grid gap-4 ${isAdminLoggedIn ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {filteredNotices.length === 0 ? (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                  <p className="text-slate-500">No notices found on the blockchain ledger.</p>
                </div>
              ) : (
                filteredNotices.map((n) => <NoticeCard key={n.id} {...n} />)
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}