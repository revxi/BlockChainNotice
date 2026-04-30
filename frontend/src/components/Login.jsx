import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useReadContract } from "wagmi";
import { findInjectedConnector, isMetaMaskInstalled } from "../utils/connectors";
import { AlertCircle } from "lucide-react";
import ABI from "../utils/abi.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afccb333f8a9c6122f65385ba4c8a";

function CrystalBlock({ className, style, pulseClass = "crystal-pulse" }) {
  return (
    <div
      className={`absolute rounded-xl border border-white/30 backdrop-blur-sm ${pulseClass} ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(139,92,246,0.12) 50%, rgba(56,189,248,0.10) 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 32px rgba(139,92,246,0.2)",
        ...style,
      }}
    />
  );
}

function Connector({ className, style }) {
  return (
    <div
      className={`absolute connector-shimmer ${className}`}
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(249,115,22,0.5), transparent)",
        borderRadius: 999,
        ...style,
      }}
    />
  );
}

export default function Login({ onLogin }) {
  const { address: account } = useAccount();
  const { connectors, connect, isPending, error: connectError } = useConnect();
  const [activeTab, setActiveTab] = useState("user");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

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
      } else if (!error) {
        setTimeout(() => setError("Access Denied: Connected wallet is not the authorized admin."), 0);
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
    if (!isMetaMaskInstalled()) {
      setError("MetaMask not found. Please install MetaMask from metamask.io.");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    const connector = findInjectedConnector(connectors);
    if (connector) {
      connect({ connector });
      return;
    }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (err) {
      setError(err.code === 4001 ? "Connection rejected. Please approve the MetaMask request." : "Failed to connect MetaMask. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">

      {/* Background gradient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="orb-drift absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)" }} />
        <div className="orb-drift-2 absolute -bottom-60 -right-40 w-[700px] h-[700px] rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)" }} />
        <div className="orb-drift-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.35) 0%, transparent 70%)" }} />
      </div>

      {/* Header / Nav */}
      <header className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-slate-100/80 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-slate-900">BLOCK</span>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-orange-500 to-sky-500 bg-clip-text text-transparent">
            NOTICE
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {["Create Notice", "Verify Data", "API Access", "Pricing"].map((link) => (
            <a
              key={link}
              href="#"
              className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
            >
              {link}
            </a>
          ))}
        </nav>
        <button
          onClick={() => { setShowModal(true); setActiveTab("admin"); setError(""); }}
          className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-violet-200 hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #7c3aed, #ea580c)" }}
        >
          Admin Login
        </button>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-12">

        {/* Pill badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-200 bg-violet-50 text-violet-700 text-xs font-semibold tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          Powered by Ethereum Blockchain
        </div>

        {/* Headline */}
        <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-black leading-tight text-slate-900 mb-6">
          BLOCKNOTICE:{" "}
          <span className="bg-gradient-to-r from-violet-600 via-orange-500 to-sky-500 bg-clip-text text-transparent">
            IMMUTABLE
          </span>{" "}
          PUBLIC RECORD KEEPING ON THE BLOCKCHAIN.
        </h1>

        <p className="max-w-xl text-slate-500 text-base sm:text-lg leading-relaxed mb-12">
          Publish tamper-proof official notices for your institution. Every record is permanently
          stored on-chain — verifiable by anyone, alterable by no one.
        </p>

        {/* Crystal block visualization */}
        <div className="relative w-full max-w-2xl h-64 sm:h-80 mb-14 flex items-center justify-center float-slow">

          {/* Connector lines */}
          <Connector className="w-36 h-0.5 rotate-[30deg]" style={{ top: "35%", left: "18%" }} />
          <Connector className="w-28 h-0.5 -rotate-[20deg]" style={{ top: "40%", right: "22%" }} />
          <Connector className="w-24 h-0.5 rotate-[50deg]" style={{ top: "55%", left: "35%" }} />
          <Connector className="w-20 h-0.5 -rotate-[40deg]" style={{ top: "30%", right: "30%" }} />
          <Connector className="w-16 h-0.5 rotate-[70deg]" style={{ bottom: "20%", left: "42%" }} />

          {/* Main center block */}
          <CrystalBlock
            pulseClass="crystal-pulse"
            className="w-28 h-28 sm:w-36 sm:h-36 rotate-12 z-10"
            style={{
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%) rotate(12deg)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(139,92,246,0.2) 40%, rgba(249,115,22,0.15) 100%)",
              boxShadow: "inset 0 2px 0 rgba(255,255,255,0.5), 0 16px 48px rgba(139,92,246,0.35)",
            }}
          />

          {/* Top-left block */}
          <CrystalBlock
            pulseClass="crystal-pulse-2"
            className="w-20 h-20 sm:w-24 sm:h-24 -rotate-6"
            style={{
              top: "8%", left: "12%",
              background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(56,189,248,0.18) 50%, rgba(139,92,246,0.12) 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 32px rgba(56,189,248,0.3)",
            }}
          />

          {/* Top-right block */}
          <CrystalBlock
            pulseClass="crystal-pulse-3"
            className="w-16 h-16 sm:w-20 sm:h-20 rotate-[20deg]"
            style={{
              top: "5%", right: "14%",
              background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(249,115,22,0.15) 50%, rgba(56,189,248,0.1) 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 32px rgba(249,115,22,0.3)",
            }}
          />

          {/* Bottom-left block */}
          <CrystalBlock
            pulseClass="crystal-pulse"
            className="w-14 h-14 sm:w-16 sm:h-16 rotate-[35deg]"
            style={{
              bottom: "10%", left: "20%",
              background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(249,115,22,0.18) 60%, rgba(139,92,246,0.1) 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 24px rgba(249,115,22,0.28)",
            }}
          />

          {/* Bottom-right block */}
          <CrystalBlock
            pulseClass="crystal-pulse-2"
            className="w-12 h-12 sm:w-14 sm:h-14 -rotate-12"
            style={{
              bottom: "8%", right: "18%",
              background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(139,92,246,0.14) 50%, rgba(56,189,248,0.12) 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 20px rgba(56,189,248,0.28)",
            }}
          />

          {/* Small accent blocks */}
          <CrystalBlock
            pulseClass="crystal-pulse-3"
            className="w-8 h-8 rotate-[45deg]"
            style={{ top: "22%", left: "38%",
              background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(56,189,248,0.15))" }}
          />
          <CrystalBlock
            pulseClass="crystal-pulse"
            className="w-7 h-7 -rotate-[20deg]"
            style={{ bottom: "28%", right: "32%",
              background: "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(139,92,246,0.15))" }}
          />

          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 rounded-full opacity-25"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.8) 0%, transparent 70%)", filter: "blur(20px)" }} />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => onLogin("user")}
            className="group px-8 py-4 rounded-2xl text-white font-bold text-base transition-all duration-300 hover:shadow-2xl hover:shadow-violet-300 hover:-translate-y-1"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ea580c 60%, #0ea5e9 100%)", minWidth: 200 }}
          >
            Publish Your Notice
            <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
          <button
            onClick={() => onLogin("user")}
            className="group px-8 py-4 rounded-2xl font-bold text-base border-2 border-slate-200 text-slate-700 bg-white hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            style={{ minWidth: 200 }}
          >
            Search the Registry
            <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </div>

        {/* Stats strip */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400">
          {[
            ["Immutable", "Records stored on-chain"],
            ["Zero Downtime", "Decentralized infrastructure"],
            ["Instant Verify", "Public transparency"],
          ].map(([title, sub]) => (
            <div key={title} className="text-center">
              <div className="font-bold text-slate-700 text-base">{title}</div>
              <div className="text-xs mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Admin login modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 animate-fade-in border border-slate-100">

            {/* Modal header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">Admin Portal</h2>
                <p className="text-sm text-slate-400 mt-0.5">Connect your authorized wallet</p>
              </div>
              <button
                onClick={() => { setShowModal(false); setError(""); }}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors text-lg"
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div className="flex rounded-xl overflow-hidden border border-slate-200 mb-6">
              <button
                onClick={() => { setActiveTab("user"); setError(""); }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "user" ? "text-white" : "text-slate-500 hover:text-slate-700 bg-slate-50"
                }`}
                style={activeTab === "user" ? { background: "linear-gradient(135deg, #7c3aed, #ea580c)" } : {}}
              >
                Student
              </button>
              <button
                onClick={() => { setActiveTab("admin"); setError(""); }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all border-l border-slate-200 ${
                  activeTab === "admin" ? "text-white" : "text-slate-500 hover:text-slate-700 bg-slate-50"
                }`}
                style={activeTab === "admin" ? { background: "linear-gradient(135deg, #7c3aed, #ea580c)" } : {}}
              >
                Administrator
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-red-700 text-sm bg-red-50 p-3 rounded-xl border border-red-200 mb-4">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {activeTab === "user" ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-500 leading-relaxed">
                  Browse all published notices without a wallet. No login required.
                </p>
                <button
                  onClick={() => onLogin("user")}
                  className="w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #ea580c)" }}
                >
                  View Notice Board →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-500 leading-relaxed">
                  Only the authorized admin wallet can publish notices.
                </p>
                <button
                  onClick={handleAdminLogin}
                  disabled={isPending}
                  className="w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #ea580c)" }}
                >
                  {isPending ? "Connecting..." : account ? "Verify & Enter →" : "Connect MetaMask →"}
                </button>
                {account && (
                  <p className="text-center text-xs text-slate-400 font-mono bg-slate-50 py-2 px-3 rounded-xl border border-slate-200">
                    {account.substring(0, 6)}...{account.substring(38)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
