import React, { useState, useMemo } from "react";
import { useAccount, useConnect, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useAccount, useConnect, useDisconnect, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { injected } from "wagmi/connectors";
import ABI from "./utils/abi.json";
import { Search, ShieldCheck, User, Wallet, LayoutGrid } from "lucide-react";
import AdminPanel from "./components/AdminPanel";
import NoticeFeed from "./components/NoticeFeed";
import Login from "./components/Login";

const CONTRACT_ADDRESS = "0x5FbDB2315678afccb333f8a9c6122f65385ba4c8a";

export default function App() {
  const { address: account } = useAccount();
  const { connect } = useConnect();
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState(null); // 'user' | 'admin' | null
  const [isPublishing, setIsPublishing] = useState(false);

  const fetchNotices = async () => {
    if (contract) {
      try {
        const count = await contract.getNoticeCount();
        const promises = [];
        for (let i = 0; i < count; i++) {
          promises.push(contract.allNotices(i));
          const n = await contract.notices(i);
          temp.push({
            id: n.id.toString(),
            title: n.title,
            hash: n.content,
            date: new Date(Number(n.timestamp) * 1000).toLocaleDateString(),
          });
        }
        const noticesData = await Promise.all(promises);
        const temp = noticesData.map((n) => ({
          id: n.id.toString(),
          title: n.title,
          hash: n.ipfsHash,
          date: new Date(Number(n.timestamp) * 1000).toLocaleDateString(),
        }));
        setNotices(temp.reverse());
      } catch (err) { console.error("Fetch error:", err); }
    }
  };

  // Write Contract Hook
  const { writeContractAsync, data: hash, isPending: isWritePending } = useWriteContract();

  // Wait for Transaction Hook
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const isPublishing = isWritePending || isConfirming;

  // Read Notice Count
  const { data: noticeCount, refetch: refetchCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getNoticeCount',
  });

  // Prepare calls for all notices
  const noticeContracts = useMemo(() => {
    if (!noticeCount) return [];
    const count = Number(noticeCount);
    return Array.from({ length: count }, (_, i) => ({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'getNotice',
      args: [BigInt(i)],
    }));
  }, [noticeCount]);

  // Read all notices in parallel
  const { data: noticesData, refetch: refetchNotices } = useReadContracts({
    contracts: noticeContracts,
  });

  // Memoized fetch function for notices
  const fetchNotices = useCallback(() => {
    refetchCount();
    refetchNotices();
  }, [refetchCount, refetchNotices]);

  // Refetch notices when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      fetchNotices();
    }
  }, [isConfirmed, fetchNotices]);

  // Process notices data
  const notices = useMemo(() => {
    if (!noticesData) return [];
    return noticesData
      .map((result) => result.result)
      .filter((n) => n)
      .map((n) => ({
        id: n.id.toString(),
        title: n.title,
        hash: n.content, // Using 'content' field as hash
        date: new Date(Number(n.timestamp) * 1000).toLocaleDateString(),
      }))
      .reverse();
  }, [noticesData]);

  // Search Logic (ID, Date, or Title)
  const filteredNotices = useMemo(() => {
    return notices.filter(n => 
      n.id.includes(searchQuery) || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.date.includes(searchQuery)
    );
  }, [notices, searchQuery]);

  const handlePublish = useCallback(async (formData) => {
    if (!account) return alert("Connect Wallet!");
    if (userRole !== "admin") return alert("Unauthorized: Admins only.");

    try {
      // Simulate IPFS Hashing of content
      const mockHash = "Qm" + Math.random().toString(36).substring(2, 15);
      const tx = await contract.postNotice(formData.title, mockHash);
      await tx.wait();
      fetchNotices();
    } catch (err) { alert("Only the admin wallet can publish notices!"); }
    setIsPublishing(false);
  };

      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'postNotice',
        args: [formData.title, mockHash],
      });
    } catch (err) {
      console.error("Publish error:", err);
      alert("Error publishing notice (Check console for details)");
    }
  }, [account, userRole, writeContractAsync]);

  if (!userRole) {
    return <Login onLogin={setUserRole} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300 font-sans selection:bg-blue-500/30 selection:text-blue-200 flex flex-col">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-96 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl translate-y-1/3 pointer-events-none" />

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
              <ShieldCheck className="text-blue-500 relative z-10" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight leading-none group-hover:text-blue-200 transition-colors">BlockNotice</h1>
              <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase">Decentralized Ledger</span>
            </div>
          </div>

          <button 
            onClick={() => connect({ connector: injected() })}
            className="relative overflow-hidden bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 text-white flex items-center gap-2 group hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:border-blue-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            {account ? (
              <>
                <User size={16} className="text-blue-400" />
                <span className="font-mono text-xs">{account.substring(0,6)}...{account.substring(38)}</span>
              </>
            ) : (
              <>
                <Wallet size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                Connect Wallet
              </>
            )}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 relative z-10 w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div className="w-full md:max-w-xl">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <LayoutGrid className="text-slate-500" /> Notice Board
            </h2>
            <p className="text-slate-400 mb-6">Browse verified notices anchored to the blockchain.</p>

            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-xl group-hover:bg-blue-500/10 transition-all" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
              <input
                className="w-full bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-lg placeholder:text-slate-600 text-white"
                placeholder="Search by Notice ID, Title, or Date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Admin Panel - Only visible when logged in as admin */}
          {userRole === "admin" && (
             <AdminPanel onPublish={handlePublish} loading={isPublishing} />
          )}

          {/* Notice Feed - Spans full width if not admin, else takes remaining space */}
          <div className={`${userRole === "admin" ? "lg:col-span-8" : "lg:col-span-12"} transition-all duration-500`}>
             <NoticeFeed filteredNotices={filteredNotices} searchQuery={searchQuery} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-900/50 backdrop-blur-sm py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck size={16} className="text-slate-600" />
            Secured by Ethereum Blockchain & IPFS
          </p>
          <p>&copy; {new Date().getFullYear()} BlockNotice Decentralized System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
