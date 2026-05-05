import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useAccount, useConnect, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import ABI from "./utils/abi.json";
import { findInjectedConnector, isMetaMaskInstalled } from "./utils/connectors";
import { generateIPFSHash } from "./utils/ipfs";
import { Search, Shield, Wallet, User, AlertCircle } from "lucide-react";
import AdminPanel from "./components/AdminPanel";
import NoticeFeed from "./components/NoticeFeed";
import Login from "./components/Login";

const CONTRACT_ADDRESS = "0x5FbDB2315678afccb333f8a9c6122f65385ba4c8a";

export default function App() {
  const { address: account } = useAccount();
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
          ? "Connection rejected."
          : "Failed to connect wallet."
      );
    }
  }, [connectError]);

  const { data: noticesData, refetch: fetchNotices } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getAllNotices",
  });

  const { data: adminAddress } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "admin",
  });

  useEffect(() => {
    if (isConfirmed) fetchNotices();
  }, [isConfirmed, fetchNotices]);

  const notices = useMemo(() => {
    if (!noticesData) return [];
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

  if (!userRole) return <Login onLogin={setUserRole} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#c9a84c" }}>
              <Shield size={14} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-sm tracking-tight">BlockNotice</span>
            {userRole === "admin" && (
              <span className="ml-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                Admin
              </span>
            )}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-all bg-slate-50"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {walletError && (
              <div className="flex items-center gap-1.5 text-red-600 text-xs bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                <AlertCircle size={12} className="shrink-0" />
                <span className="hidden sm:inline truncate max-w-[160px]">{walletError}</span>
              </div>
            )}

            <button
              onClick={() => {
                setWalletError("");
                if (!isMetaMaskInstalled()) {
                  setWalletError("MetaMask not found.");
                  window.open("https://metamask.io/download/", "_blank");
                  return;
                }
                const connector = findInjectedConnector(connectors);
                if (connector) { connect({ connector }); return; }
                window.ethereum?.request({ method: "eth_requestAccounts" }).catch((err) => {
                  setWalletError(err.code === 4001 ? "Connection rejected." : "Failed to connect.");
                });
              }}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
              style={
                account
                  ? { borderColor: "#e2e8f0", color: "#475569", backgroundColor: "#f8fafc" }
                  : { backgroundColor: "#0f172a", color: "white", borderColor: "#0f172a" }
              }
            >
              {account ? (
                <>
                  <User size={12} />
                  <span className="font-mono">{account.substring(0, 6)}…{account.substring(38)}</span>
                </>
              ) : (
                <>
                  <Wallet size={12} />
                  Connect
                </>
              )}
            </button>

            <button
              onClick={() => setUserRole(null)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Sub-header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-bold text-slate-800">Official Notice Board</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {notices.length} notice{notices.length !== 1 ? "s" : ""} published on-chain
              {searchQuery && filteredNotices.length !== notices.length && (
                <> · <span className="text-slate-600 font-medium">{filteredNotices.length} result{filteredNotices.length !== 1 ? "s" : ""}</span></>
              )}
            </p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Connected to blockchain" />
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
    </div>
  );
}
