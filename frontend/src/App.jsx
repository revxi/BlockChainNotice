import React, { useState, useEffect, useCallback } from "react";
import { useAccount, useConnect } from "wagmi";
import { findInjectedConnector, isMetaMaskInstalled } from "./utils/connectors";
import { fetchNotices, publishNotice } from "./utils/api";
import { Search, Shield, Wallet, User, AlertCircle } from "lucide-react";
import AdminPanel from "./components/AdminPanel";
import NoticeFeed from "./components/NoticeFeed";
import Login from "./components/Login";

export default function App() {
  const { address: account } = useAccount();
  const { connectors, connect, error: connectError } = useConnect();

  const [userRole, setUserRole]       = useState(null);
  const [notices, setNotices]         = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading]         = useState(false);
  const [publishing, setPublishing]   = useState(false);
  const [walletError, setWalletError] = useState("");
  const [fetchError, setFetchError]   = useState("");

  useEffect(() => {
    if (connectError) {
      setWalletError(
        connectError.message?.includes("rejected") || connectError.message?.includes("denied")
          ? "Connection rejected."
          : "Failed to connect wallet."
      );
    }
  }, [connectError]);

  const loadNotices = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const data = await fetchNotices();
      setNotices(data);
    } catch {
      setFetchError("Could not load notices. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userRole) loadNotices();
  }, [userRole, loadNotices]);

  const handlePublish = async (formData) => {
    setPublishing(true);
    try {
      const notice = await publishNotice(formData.title, formData.content, account);
      setNotices((prev) => [notice, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setPublishing(false);
    }
  };

  const handleSignOut = () => {
    setUserRole(null);
    setNotices([]);
  };

  const filteredNotices = notices.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.id.toString().includes(q) ||
      new Date(n.created_at).toLocaleDateString().includes(q)
    );
  });

  if (!userRole) return <Login onLogin={setUserRole} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#c9a84c" }}>
              <Shield size={14} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-sm tracking-tight">NoticeLedger</span>
            {userRole === "faculty" && (
              <span className="ml-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                Faculty
              </span>
            )}
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-slate-400 transition-all bg-slate-50"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {walletError && (
              <div className="flex items-center gap-1.5 text-red-600 text-xs bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                <AlertCircle size={12} className="shrink-0" />
                <span className="hidden sm:inline">{walletError}</span>
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
                window.ethereum?.request({ method: "eth_requestAccounts" });
              }}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
              style={account
                ? { borderColor: "#e2e8f0", color: "#475569", backgroundColor: "#f8fafc" }
                : { backgroundColor: "#0f172a", color: "white", borderColor: "#0f172a" }
              }
            >
              {account ? (
                <><User size={12} /><span className="font-mono">{account.substring(0, 6)}…{account.substring(38)}</span></>
              ) : (
                <><Wallet size={12} />Connect</>
              )}
            </button>

            <button
              onClick={handleSignOut}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Sub-header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-slate-800">Official Notice Board</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {loading ? "Loading…" : `${notices.length} notice${notices.length !== 1 ? "s" : ""} published`}
              {searchQuery && !loading && (
                <> · <span className="text-slate-600 font-medium">{filteredNotices.length} result{filteredNotices.length !== 1 ? "s" : ""}</span></>
              )}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        {fetchError && (
          <div className="mb-6 flex items-center gap-2 text-red-700 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
            <AlertCircle size={15} className="shrink-0" />
            {fetchError}
            <button onClick={loadNotices} className="ml-auto underline text-red-600 hover:text-red-800">Retry</button>
          </div>
        )}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {userRole === "faculty" && (
            <AdminPanel onPublish={handlePublish} loading={publishing} />
          )}
          <div className={userRole === "faculty" ? "lg:col-span-8" : "lg:col-span-12"}>
            <NoticeFeed filteredNotices={filteredNotices} searchQuery={searchQuery} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}
