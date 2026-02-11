import React, { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { User, Lock, ShieldCheck, ArrowRight, Wallet, AlertCircle } from "lucide-react";

export default function Login({ onLogin }) {
  const { connectWallet, account, contract } = useWeb3();
  const { connect } = useConnect();
  const { address: account } = useAccount();
  const [activeTab, setActiveTab] = useState("user"); // 'user' or 'admin'
  const [error, setError] = useState("");

  const handleAdminLogin = async () => {
    setError("");

    // Ensure wallet is connected
    if (!account || !contract) {
      await connectWallet();
    if (!account) {
      connect({ connector: injected() });
      return;
    }

    try {
      // Fetch the admin address directly from the smart contract
      const adminAddress = await contract.admin();

      if (account.toLowerCase() === adminAddress.toLowerCase()) {
        onLogin("admin");
      } else {
        setError("Unauthorized: Connected wallet is not the admin.");
      }
    } catch (err) {
      console.error("Error verifying admin status:", err);
      setError("Error verifying admin status. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300 font-sans flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-purple-500/20 mb-4 border border-white/10 shadow-xl shadow-blue-500/10">
            <ShieldCheck size={32} className="text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">BlockNotice</h1>
          <p className="text-slate-400">Secure Decentralized Notice Board</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-slate-950/50 rounded-2xl">
            <button
              onClick={() => { setActiveTab("user"); setError(""); }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "user"
                  ? "bg-slate-800 text-white shadow-lg shadow-black/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <User size={18} />
              User Access
            </button>
            <button
              onClick={() => { setActiveTab("admin"); setError(""); }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "admin"
                  ? "bg-blue-600/20 text-blue-300 border border-blue-500/20 shadow-lg shadow-blue-500/10"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Lock size={18} />
              Admin Portal
            </button>
          </div>

          <div className="px-6 pb-6 pt-2">
            {activeTab === "user" ? (
              <div className="space-y-6 text-center animate-fadeIn">
                <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                  <h3 className="text-white font-bold text-lg mb-2">Welcome Guest</h3>
                  <p className="text-slate-400 text-sm">
                    Access public notices securely on the blockchain. Read-only access granted.
                  </p>
                </div>
                <button
                  onClick={() => onLogin("user")}
                  className="w-full bg-slate-100 hover:bg-white text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Enter Dashboard
                  <ArrowRight size={20} />
                </button>
              </div>
            ) : (
              <div className="space-y-6 text-center animate-fadeIn">
                <div className="p-6 bg-blue-900/10 rounded-2xl border border-blue-500/10">
                  <h3 className="text-white font-bold text-lg mb-2">Administrator</h3>
                  <p className="text-slate-400 text-sm">
                    Restricted access. Connect the official admin wallet to proceed.
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-left">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleAdminLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                >
                  {account ? (
                    <>
                      <Lock size={20} />
                      Verify & Enter
                    </>
                  ) : (
                    <>
                      <Wallet size={20} />
                      Connect Admin Wallet
                    </>
                  )}
                </button>
                {account && (
                  <p className="text-xs text-slate-500 font-mono">
                    Connected: {account.substring(0, 6)}...{account.substring(38)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-8">
          &copy; {new Date().getFullYear()} BlockNotice Decentralized System
        </p>
      </div>
    </div>
  );
}
