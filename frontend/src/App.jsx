import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useAccount, useConnect, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import ABI from "./utils/abi.json";
import { findInjectedConnector } from "./utils/connectors";
import { generateIPFSHash } from "./utils/ipfs";
import { Search, BookOpen, Wallet, User, Bell, ChevronDown, AlertCircle } from "lucide-react";
import AdminPanel from "./components/AdminPanel";
import NoticeFeed from "./components/NoticeFeed";
import Login from "./components/Login";

const CONTRACT_ADDRESS = "0x5FbDB2315678afccb333f8a9c6122f65385ba4c8a";

export default function App() {
  const { address: account } = useAccount();
  const { connectors, connect } = useConnect();
  const { connectors, connect, error: connectError } = useConnect();

  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [walletError, setWalletError] = useState("");

  const { writeContractAsync, data: hash, isPending: isWritePending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const isPublishing = isWritePending || isConfirming;

  useEffect(() => {
    if (connectError) {
      setWalletError(
        connectError.message?.includes("not installed") || connectError.message?.includes("not found")
          ? "Wallet not found. Please install MetaMask."
          : connectError.message?.includes("rejected") || connectError.message?.includes("denied")
          ? "Connection rejected by user."
          : "Failed to connect wallet. Make sure MetaMask is installed."
      );
    }
  }, [connectError]);

  const { data: noticesData, refetch: fetchNotices } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getAllNotices',
    functionName: "getAllNotices",
  });

  const { data: adminAddress } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'admin',
  });

  // Refetch notices when transaction is confirmed
    functionName: "admin",
  });

  useEffect(() => {
    if (isConfirmed) fetchNotices();
  }, [isConfirmed, fetchNotices]);

  const notices = useMemo(() => {
    if (!noticesData) return [];
    return noticesData.reduceRight((acc, result) => {
      // The result might be wrapped or unwrapped depending on wagmi version,
      // but since it's a single read contract it should be an array of notices directly.
      const n = result?.result || result;
    return noticesData.reduceRight((acc, n) => {
      if (n) {
        acc.push({
          id: n.id.toString(),
          title: n.title,
          hash: n.content,
          date: new Date(Number(n.timestamp) * 1000).toLocaleDateString(),
        });
      }
      return acc;
    }, []);
  }, [noticesData]);

  const filteredNotices = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return notices.filter(
      (n) =>
        n.id.includes(searchQuery) ||
        n.title.toLowerCase().includes(lowerQuery) ||
        n.date.includes(searchQuery)
    );
  }, [notices, searchQuery]);

  const handlePublish = useCallback(
    async (formData) => {
      if (!account) return alert("Connect Wallet!");
      const isAdmin = adminAddress && account.toLowerCase() === adminAddress.toLowerCase();
      if (userRole !== "admin" || !isAdmin) return alert("Unauthorized: Admins only.");
      try {
        const secureHash = await generateIPFSHash(formData.content);
        await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: ABI,
          functionName: "postNotice",
          args: [formData.title, secureHash],
        });
        fetchNotices();
      } catch (err) {
        console.error("Publish error:", err);
        alert("Error publishing notice (Check console for details)");
      }
    },
    [account, userRole, writeContractAsync, fetchNotices, adminAddress]
  );

    try {
      // Securely simulate IPFS Hashing of content
      const secureHash = await generateIPFSHash(formData.content);
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'postNotice',
        args: [formData.title, secureHash],
      });
      fetchNotices();
    } catch (err) {
      console.error("Publish error:", err);
      alert("Error publishing notice (Check console for details)");
    }
  }, [account, userRole, writeContractAsync, fetchNotices, adminAddress]);
  if (!userRole) return <Login onLogin={setUserRole} />;

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top bar */}
      <div className="text-white text-xs py-2 px-6 flex items-center justify-between" style={{ backgroundColor: '#0f2050' }}>
        <span className="font-medium tracking-wide">{today}</span>
        <span className="flex items-center gap-1.5 text-slate-300">
          <Bell size={12} />
          Official Notice Portal &bull; Blockchain Secured
        </span>
      </div>

      {/* Main navbar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-0 flex items-stretch justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 py-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
              style={{ backgroundColor: '#163068' }}
            >
              <BookOpen size={20} className="text-yellow-300" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-800 leading-tight">BlockNotice</div>
              <div className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">
                Decentralized Ledger
              </div>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1 ml-8">
            <a href="#" className="px-4 py-2 text-sm font-semibold text-white rounded-none h-full flex items-center border-b-2 border-yellow-400" style={{ backgroundColor: '#163068' }}>
              Notice Board
            </a>
            <a href="#" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1">
              About
            </a>
            {userRole === "admin" && (
              <a href="#" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center gap-1">
                Admin <ChevronDown size={14} />
              </a>
            )}
          </div>

          {/* Wallet connect */}
          <div className="flex items-center gap-3 ml-auto">
            {walletError && (
              <div className="flex items-center gap-1.5 text-red-600 text-xs bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg max-w-xs">
                <AlertCircle size={13} className="shrink-0" />
                <span className="truncate">{walletError}</span>
              </div>
            )}
            <button
              onClick={() => {
                setWalletError("");
                const injectedConnector = findInjectedConnector(connectors);
                if (!injectedConnector) {
                  setWalletError("No wallet found. Please install MetaMask.");
                  return;
                }
                connect({ connector: injectedConnector });
              }}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border transition-all"
              style={
                account
                  ? { borderColor: '#163068', color: '#163068', backgroundColor: '#eef2ff' }
                  : { backgroundColor: '#163068', color: 'white', borderColor: '#163068' }
              }
            >
              {account ? (
                <>
                  <User size={15} />
                  <span className="font-mono text-xs">
                    {account.substring(0, 6)}...{account.substring(38)}
                  </span>
                </>
              ) : (
                <>
                  <Wallet size={15} />
                  Connect Wallet
                </>
              )}
            </button>

            {userRole && (
              <button
                onClick={() => setUserRole(null)}
                className="text-xs text-slate-500 hover:text-slate-700 font-medium border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Page hero / sub-header */}
      <div className="border-b border-slate-200" style={{ backgroundColor: '#163068' }}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Official Notice Board</h1>
            <p className="text-blue-200 text-sm mt-0.5">
              All notices are permanently recorded on the Ethereum blockchain
            </p>
          </div>
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-blue-200 outline-none focus:bg-white/20 focus:border-white/40 transition-all"
              placeholder="Search by title, ID, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6 text-sm text-slate-600">
          <span>
            <strong className="text-slate-800">{notices.length}</strong> notices published
          </span>
          {searchQuery && (
            <span className="text-slate-500">
              &bull; <strong className="text-slate-700">{filteredNotices.length}</strong> matching results
            </span>
          )}
          {userRole === "admin" && (
            <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <User size={11} />
              Admin Mode
            </span>
          )}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {userRole === "admin" && (
            <AdminPanel onPublish={handlePublish} loading={isPublishing} />
          )}
          <div className={userRole === "admin" ? "lg:col-span-8" : "lg:col-span-12"}>
            <NoticeFeed filteredNotices={filteredNotices} searchQuery={searchQuery} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: '#163068' }}>
              <BookOpen size={14} className="text-yellow-300" />
            </div>
            <span className="font-medium text-slate-700">BlockNotice</span>
            <span className="text-slate-300">&bull;</span>
            <span>Official Decentralized Notice System</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Secured by Ethereum Blockchain</span>
            <span className="text-slate-300">&bull;</span>
            <span>IPFS Content Addressing</span>
            <span className="text-slate-300">&bull;</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
