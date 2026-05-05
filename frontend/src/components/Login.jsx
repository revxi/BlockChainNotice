import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useReadContract } from "wagmi";
import { findInjectedConnector, isMetaMaskInstalled } from "../utils/connectors";
import { AlertCircle, Shield, ArrowRight, Wallet } from "lucide-react";
import ABI from "../utils/abi.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afccb333f8a9c6122f65385ba4c8a";

export default function Login({ onLogin }) {
  const { address: account } = useAccount();
  const { connectors, connect, isPending, error: connectError } = useConnect();
  const [view, setView] = useState("home");
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
          : "Failed to connect wallet."
      );
    }
  }, [connectError]);

  useEffect(() => {
    if (account && view === "admin" && !isPending && adminAddress) {
      if (account.toLowerCase() === adminAddress.toLowerCase()) {
        onLogin("admin");
      } else if (!error) {
        setError("Access denied. This wallet is not the authorized administrator.");
      }
    }
  }, [account, view, onLogin, isPending, adminAddress, error]);

  const handleAdminConnect = async () => {
    setError("");
    if (account) {
      if (adminAddress && account.toLowerCase() === adminAddress.toLowerCase()) {
        onLogin("admin");
      } else {
        setError("Access denied. This wallet is not the authorized administrator.");
      }
      return;
    }
    if (!isMetaMaskInstalled()) {
      setError("MetaMask not detected. Please install it from metamask.io.");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    const connector = findInjectedConnector(connectors);
    if (connector) { connect({ connector }); return; }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (err) {
      setError(err.code === 4001 ? "Connection rejected." : "Failed to connect MetaMask.");
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#07090f" }}>

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden"
        style={{ backgroundColor: "#0c1018" }}>

        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />

        {/* Decorative ring */}
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full border border-white/5" />
        <div className="absolute -bottom-20 -left-20 w-[360px] h-[360px] rounded-full border border-white/5" />
        <div className="absolute -bottom-0 -left-0 w-[220px] h-[220px] rounded-full border border-white/5" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#c9a84c" }}>
              <Shield size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">BlockNotice</span>
          </div>
        </div>

        {/* Center quote */}
        <div className="relative z-10 space-y-6">
          <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: "#c9a84c" }} />
          <h2 className="text-4xl font-bold text-white leading-snug"
            style={{ fontFamily: "'Merriweather', serif" }}>
            Every notice,<br />
            <span style={{ color: "#c9a84c" }}>immutable</span> and<br />
            verifiable.
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Official communications secured permanently on the Ethereum blockchain. 
            Tamper-proof by design.
          </p>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex gap-10">
          {[["100%", "On-chain"], ["0", "Downtime"], ["∞", "Immutable"]].map(([val, label]) => (
            <div key={label}>
              <div className="text-2xl font-bold text-white">{val}</div>
              <div className="text-xs text-white/30 mt-0.5 uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — access */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-12 lg:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#c9a84c" }}>
              <Shield size={14} className="text-white" />
            </div>
            <span className="text-white font-bold tracking-tight">BlockNotice</span>
          </div>

          {view === "home" && (
            <div className="animate-fade-in space-y-3">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Access Portal</h1>
                <p className="text-white/40 text-sm">Select how you would like to continue.</p>
              </div>

              {/* Student button */}
              <button
                onClick={() => onLogin("user")}
                className="group w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 hover:border-white/20 hover:bg-white/5"
                style={{ backgroundColor: "#0f131c", borderColor: "#1e2535" }}
              >
                <div className="text-left">
                  <div className="text-white font-semibold text-sm">Student / Public</div>
                  <div className="text-white/35 text-xs mt-0.5">Browse published notices</div>
                </div>
                <ArrowRight size={16} className="text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Admin button */}
              <button
                onClick={() => { setView("admin"); setError(""); }}
                className="group w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200"
                style={{ backgroundColor: "#c9a84c", borderColor: "#c9a84c" }}
              >
                <div className="text-left">
                  <div className="text-black font-semibold text-sm">Administrator</div>
                  <div className="text-black/50 text-xs mt-0.5">Publish & manage notices</div>
                </div>
                <ArrowRight size={16} className="text-black/50 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <p className="text-center text-white/20 text-xs pt-4">
                Secured by Ethereum · Tamper-proof records
              </p>
            </div>
          )}

          {view === "admin" && (
            <div className="animate-fade-in space-y-4">
              <button
                onClick={() => { setView("home"); setError(""); }}
                className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs mb-6 transition-colors"
              >
                ← Back
              </button>

              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
                <p className="text-white/40 text-sm">
                  Connect your authorized wallet to continue.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 text-red-400 text-xs p-4 rounded-xl border border-red-900/50 bg-red-950/30">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleAdminConnect}
                disabled={isPending}
                className="w-full flex items-center justify-between px-5 py-4 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#c9a84c", color: "#000" }}
              >
                <div className="flex items-center gap-2.5">
                  <Wallet size={16} />
                  {isPending ? "Connecting..." : account ? "Verify & Enter" : "Connect MetaMask"}
                </div>
                <ArrowRight size={15} />
              </button>

              {account && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border"
                  style={{ borderColor: "#1e2535", backgroundColor: "#0f131c" }}>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white/50 text-xs font-mono">
                    {account.substring(0, 8)}...{account.substring(36)}
                  </span>
                </div>
              )}

              <p className="text-center text-white/20 text-xs pt-2">
                Only the registered admin wallet can gain access.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
