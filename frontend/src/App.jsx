import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useAccount, useConnect, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import ABI from "./utils/abi.json";
import { findInjectedConnector, isMetaMaskInstalled } from "./utils/connectors";
import { generateIPFSHash } from "./utils/ipfs";
import { Search, Shield, Wallet, User, AlertCircle } from "lucide-react";
import AdminPanel from "./components/AdminPanel";
import AdminDashboard from "./components/AdminDashboard";
import NoticeFeed from "./components/NoticeFeed";
import Login from "./components/Login";
import ThemeSelector from "./components/ThemeSelector";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || process.env.VITE_CONTRACT_ADDRESS;
const ADMIN_ADDRESS = import.meta.env.VITE_ADMIN_ADDRESS || process.env.VITE_ADMIN_ADDRESS;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || process.env.VITE_BACKEND_URL || null;
if (!CONTRACT_ADDRESS) {
  console.warn("VITE_CONTRACT_ADDRESS environment variable is not defined");
}
if (!ADMIN_ADDRESS) {
  console.warn("VITE_ADMIN_ADDRESS environment variable is not defined");
}

export default function App() {
  const { address: account } = useAccount();
  const { connectors, connect, error: connectError } = useConnect();

  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [walletError, setWalletError] = useState("");

  if (!CONTRACT_ADDRESS) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090f] text-white px-6">
        <div className="max-w-xl rounded-2xl border border-red-700 bg-red-950/80 p-8 text-center">
          <h1 className="text-2xl font-bold mb-3">Missing contract configuration</h1>
          <p className="text-sm leading-6 text-white/80">
            The frontend cannot load <code className="text-amber-200">VITE_CONTRACT_ADDRESS</code>.
            Add it to <code className="text-amber-200">frontend/.env</code> and restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  const { writeContractAsync, data: hash, isPending: isWritePending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const isPublishing = isWritePending || isConfirming;

  const [backendNotices, setBackendNotices] = React.useState(null);

  const fetchNoticesFromBackend = async () => {
    if (!BACKEND_URL) return;
    try {
      const base = BACKEND_URL.replace(/\/$/, '');
      const apiBase = base.endsWith('/api') ? base : `${base}/api`;
      const res = await fetch(`${apiBase}/notices`);
      if (!res.ok) throw new Error('Failed to fetch from backend');
      const json = await res.json();
      setBackendNotices(json.notices || []);
    } catch (err) {
      console.warn('Backend notices fetch failed:', err.message || err);
      setBackendNotices(null);
    }
  };

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

  useEffect(() => {
    if (isConfirmed) fetchNotices();
    // also refresh backend notices if available
    fetchNoticesFromBackend();
  }, [isConfirmed, fetchNotices]);

  const notices = useMemo(() => {
    const source = backendNotices !== null ? backendNotices : noticesData;
    if (!source) return [];
    const dateFormatter = new Intl.DateTimeFormat();
    return (Array.isArray(source) ? source : []).slice().reverse().map((n) => ({
      id: n.id.toString(),
      title: n.title,
      hash: n.content,
      date: dateFormatter.format(Number(n.timestamp) * 1000),
    }));
  }, [noticesData, backendNotices]);

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
      if (!account) throw new Error("Connect Wallet!");
      const isAdmin = ADMIN_ADDRESS && account && account.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
      if (userRole !== "admin" || !isAdmin) {
        throw new Error(ADMIN_ADDRESS ? "Unauthorized: Admins only." : "Unable to verify admin role. Configure VITE_ADMIN_ADDRESS in frontend env.");
      }
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
        if (import.meta.env?.DEV) {
          console.error("Publish error:", err);
          alert("Error publishing notice (Check console for details)");
        } else {
          alert("Error publishing notice. Please try again.");
        }
        console.error("Publish error:", err);
        throw new Error("Error publishing notice (Check console for details)");
      }
    },
    [account, userRole, writeContractAsync, fetchNotices]
  );


  if (!userRole) return <Login onLogin={setUserRole} />;

  if (userRole === "admin") {
    return (
      <AdminDashboard
        notices={filteredNotices}
        onPublish={handlePublish}
        isPublishing={isPublishing}
        onSignOut={() => setUserRole(null)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-primary">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-primary border-theme">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#c9a84c]">
              <Shield size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-primary">BlockNotice</span>
            {userRole === "admin" && (
              <span className="ml-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                Admin
              </span>
            )}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" size={14} />
            <input
              className="w-full border rounded-lg pl-9 pr-4 py-1.5 text-sm outline-none focus:ring-1 transition-all bg-input border-input text-primary"
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

            <ThemeSelector />

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
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                account
                  ? "border-theme text-secondary bg-secondary"
                  : "bg-slate-900 text-white border-slate-900"
              }`}
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
              className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors text-tertiary border-theme"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Sub-header */}
      <div className="border-b bg-primary border-theme">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-bold text-primary">Official Notice Board</h1>
            <p className="text-xs mt-0.5 text-tertiary">
              {notices.length} notice{notices.length !== 1 ? "s" : ""} published on-chain
              {searchQuery && filteredNotices.length !== notices.length && (
                <> · <span className="font-medium text-secondary">{filteredNotices.length} result{filteredNotices.length !== 1 ? "s" : ""}</span></>
              )}
            </p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Connected to blockchain" />
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-12">
            <NoticeFeed filteredNotices={filteredNotices} searchQuery={searchQuery} />
          </div>
        </div>
      </main>
    </div>
  );
}
