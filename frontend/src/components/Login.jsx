import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useReadContract } from "wagmi";
import { findInjectedConnector } from "../utils/connectors";
import { User, Lock, ArrowRight, Wallet, AlertCircle, BookOpen } from "lucide-react";
import ABI from "../utils/abi.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afccb333f8a9c6122f65385ba4c8a";

export default function Login({ onLogin }) {
  const { address: account } = useAccount();
  const { connectors, connect, isPending, error: connectError } = useConnect();
  const [activeTab, setActiveTab] = useState("user");
  const [error, setError] = useState("");

  const { data: adminAddress } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "admin",
  });

  useEffect(() => {
    if (connectError) {
      setError(
        connectError.message?.includes("not installed") || connectError.message?.includes("not found")
          ? "Wallet not found. Please install MetaMask."
          : connectError.message?.includes("rejected") || connectError.message?.includes("denied")
          ? "Connection rejected. Please try again."
          : "Failed to connect wallet. Make sure MetaMask is installed."
      );
    }
  }, [connectError]);

  useEffect(() => {
    if (account && activeTab === "admin" && !isPending && adminAddress) {
      if (account.toLowerCase() === adminAddress.toLowerCase()) {
        onLogin("admin");
      } else {
        if (!error) {
          setTimeout(() => setError("Access Denied: Connected wallet is not the authorized admin."), 0);
        }
      }
    }
  }, [account, activeTab, onLogin, isPending, adminAddress, error]);

  const handleAdminLogin = async () => {
    setError("");
    if (account) {
      if (adminAddress && account.toLowerCase() === adminAddress.toLowerCase()) {
        onLogin("admin");
      } else {
        setError("Access Denied: Connected wallet is not the authorized admin.");
      }
      return;
    }
    const injectedConnector = findInjectedConnector(connectors);
    if (!injectedConnector) {
      setError("No wallet extension found. Please install MetaMask from metamask.io.");
      return;
    }
    try {
      connect({ connector: injectedConnector });
    } catch (err) {
      console.error("Connection error:", err);
      setError("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top header bar */}
      <header className="bg-navy-800 text-white py-3 px-6 flex items-center gap-3 shadow-md" style={{ backgroundColor: '#163068' }}>
        <BookOpen size={20} className="text-yellow-300" />
        <span className="text-sm font-medium tracking-wide uppercase text-slate-200">
          Official College Notice Portal
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          {/* Institution branding */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-lg"
              style={{ backgroundColor: '#163068' }}
            >
              <BookOpen size={36} className="text-yellow-300" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1" style={{ fontFamily: 'Merriweather, serif' }}>
              BlockNotice
            </h1>
            <p className="text-slate-500 text-sm font-medium tracking-wide">
              Decentralized Official Notice Board
            </p>
            <div className="mt-3 h-0.5 w-16 mx-auto rounded-full" style={{ backgroundColor: '#163068' }} />
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => { setActiveTab("user"); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-200 ${
                  activeTab === "user"
                    ? "text-white border-b-2"
                    : "text-slate-500 hover:text-slate-700 bg-slate-50"
                }`}
                style={activeTab === "user" ? { backgroundColor: '#163068', borderColor: '#d9970d' } : {}}
              >
                <User size={16} />
                Student / Viewer
              </button>
              <button
                onClick={() => { setActiveTab("admin"); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-200 border-l border-slate-200 ${
                  activeTab === "admin"
                    ? "text-white border-b-2"
                    : "text-slate-500 hover:text-slate-700 bg-slate-50"
                }`}
                style={activeTab === "admin" ? { backgroundColor: '#163068', borderColor: '#d9970d' } : {}}
              >
                <Lock size={16} />
                Administrator
              </button>
            </div>

            <div className="p-8">
              {activeTab === "user" ? (
                <div className="space-y-5 animate-fade-in">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <h3 className="font-semibold text-slate-800 mb-1">Public Access</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Browse all official notices published on the blockchain. No login required for read-only access.
                    </p>
                  </div>
                  <button
                    onClick={() => onLogin("user")}
                    className="w-full text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    style={{ backgroundColor: '#163068' }}
                  >
                    View Notice Board
                    <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <div className="space-y-5 animate-fade-in">
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <h3 className="font-semibold text-slate-800 mb-1">Restricted Access</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Only the authorized administrator can publish notices. Connect your admin wallet to proceed.
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 text-red-700 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    onClick={handleAdminLogin}
                    disabled={isPending}
                    className="w-full text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#163068' }}
                  >
                    <Wallet size={18} />
                    {isPending ? "Connecting..." : account ? "Verify & Enter" : "Connect Admin Wallet"}
                  </button>

                  {account && (
                    <p className="text-center text-xs text-slate-400 font-mono bg-slate-50 py-2 px-3 rounded-lg border border-slate-200">
                      Connected: {account.substring(0, 6)}...{account.substring(38)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-slate-400 text-xs mt-6">
            Secured by Ethereum Blockchain &bull; Tamper-proof &bull; Immutable Records
          </p>
        </div>
      </div>

      <footer className="text-center text-slate-400 text-xs py-4 border-t border-slate-200 bg-white">
        &copy; {new Date().getFullYear()} BlockNotice &mdash; Official Institutional Notice System
      </footer>
    </div>
  );
}
