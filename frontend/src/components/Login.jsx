import React, { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { findInjectedConnector, isMetaMaskInstalled } from "../utils/connectors";
import { AlertCircle, ArrowRight, Wallet, Shield } from "lucide-react";
import { getNonce, verifySignature, setToken } from "../utils/api";

export default function Login({ onLogin }) {
  const { address: account } = useAccount();
  const { connectors, connect, isPending, error: connectError } = useConnect();

  const [view, setView]       = useState("home");
  const [error, setError]     = useState("");
  const [signing, setSigning] = useState(false);

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

  // Once wallet is connected while on admin view, auto-trigger signing
  useEffect(() => {
    if (account && view === "admin" && !signing && !error) {
      handleSign();
    }
  }, [account, view]);

  const handleConnectAndSign = async () => {
    setError("");
    if (account) {
      await handleSign();
      return;
    }
    if (!isMetaMaskInstalled()) {
      setError("MetaMask not detected. Install it from metamask.io.");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    const connector = findInjectedConnector(connectors);
    if (connector) {
      connect({ connector });
    } else {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (err) {
        setError(err.code === 4001 ? "Connection rejected." : "Failed to connect MetaMask.");
      }
    }
  };

  const handleSign = async () => {
    if (!account || signing) return;
    setSigning(true);
    setError("");
    try {
      const { nonce } = await getNonce(account);
      const message = `Welcome to BlockNotice\n\nSign this message to verify your wallet.\n\nNonce: ${nonce}`;
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, account],
      });
      const { token, role } = await verifySignature(account, signature);
      setToken(token);
      onLogin(role);
    } catch (err) {
      if (err.code === 4001) {
        setError("Signature rejected. Please approve the signing request.");
      } else {
        setError(err.message || "Verification failed. Please try again.");
      }
    } finally {
      setSigning(false);
    }
  };

  const isLoading = isPending || signing;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#07090f" }}>

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden"
        style={{ backgroundColor: "#0c1018" }}>

        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full border border-white/5" />
        <div className="absolute -bottom-20 -left-20 w-[360px] h-[360px] rounded-full border border-white/5" />
        <div className="absolute -bottom-0 -left-0 w-[220px] h-[220px] rounded-full border border-white/5" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#c9a84c" }}>
            <Shield size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">BlockNotice</span>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: "#c9a84c" }} />
          <h2 className="text-4xl font-bold text-white leading-snug" style={{ fontFamily: "'Merriweather', serif" }}>
            Every notice,<br />
            <span style={{ color: "#c9a84c" }}>permanent</span> and<br />
            verifiable.
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Official communications published to a secure database.
            Managed by authorized administrators, readable by everyone.
          </p>
        </div>

        <div className="relative z-10 flex gap-10">
          {[["DB", "Powered"], ["100%", "Uptime"], ["Public", "Readable"]].map(([val, label]) => (
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

          <div className="flex items-center gap-2 mb-12 lg:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#c9a84c" }}>
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

              <button
                onClick={() => { setView("admin"); setError(""); }}
                className="group w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200"
                style={{ backgroundColor: "#c9a84c", borderColor: "#c9a84c" }}
              >
                <div className="text-left">
                  <div className="text-black font-semibold text-sm">Administrator</div>
                  <div className="text-black/50 text-xs mt-0.5">Publish &amp; manage notices</div>
                </div>
                <ArrowRight size={16} className="text-black/50 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <p className="text-center text-white/20 text-xs pt-4">
                Secure access · Wallet-verified identity
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
                <p className="text-white/40 text-sm leading-relaxed">
                  Connect your MetaMask wallet and sign a message to verify your identity.
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-2 mb-6">
                {[
                  { n: 1, label: "Connect MetaMask wallet", done: !!account },
                  { n: 2, label: "Sign verification message", done: false },
                ].map(({ n, label, done }) => (
                  <div key={n} className="flex items-center gap-3 text-sm">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${done ? "bg-emerald-500 text-white" : "border border-white/20 text-white/40"}`}>
                      {done ? "✓" : n}
                    </div>
                    <span className={done ? "text-white/60 line-through" : "text-white/50"}>{label}</span>
                  </div>
                ))}
              </div>

              {error && (
                <div className="flex items-start gap-2.5 text-red-400 text-xs p-4 rounded-xl border border-red-900/50 bg-red-950/30">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {account && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border mb-2"
                  style={{ borderColor: "#1e2535", backgroundColor: "#0f131c" }}>
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-white/50 text-xs font-mono">
                    {account.substring(0, 8)}…{account.substring(36)}
                  </span>
                </div>
              )}

              <button
                onClick={handleConnectAndSign}
                disabled={isLoading}
                className="w-full flex items-center justify-between px-5 py-4 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#c9a84c", color: "#000" }}
              >
                <div className="flex items-center gap-2.5">
                  <Wallet size={16} />
                  {isLoading
                    ? (signing ? "Waiting for signature…" : "Connecting…")
                    : account
                    ? "Sign to Verify Identity"
                    : "Connect MetaMask"}
                </div>
                <ArrowRight size={15} />
              </button>

              <p className="text-center text-white/20 text-xs pt-2">
                No transaction is sent. Signing is free and instant.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
