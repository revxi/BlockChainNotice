import React from "react";
import { X, BookOpen, Shield, Zap, Users, Github, ExternalLink } from "lucide-react";

export default function AboutModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200" style={{ backgroundColor: '#163068' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/10">
              <BookOpen size={18} className="text-yellow-300" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">BlockNotice</h2>
              <p className="text-blue-200 text-xs tracking-widest uppercase">Project README</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-8 py-7 space-y-8 text-slate-700">

          {/* Overview */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Overview</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              BlockNotice is a decentralized application (dApp) that enables colleges and institutions
              to publish tamper-proof official notices on the Ethereum blockchain. Notices are immutable,
              verifiable, and always available — no central server required.
            </p>
            <p className="text-sm leading-relaxed text-slate-600 mt-2">
              Traditional notice boards rely on centralized servers vulnerable to data tampering,
              unauthorized modifications, and downtime. BlockNotice replaces this with a blockchain-backed
              system where every notice is permanently recorded on-chain and only authorized administrators
              can publish.
            </p>
          </section>

          {/* Features */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Key Features</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: Shield, label: "Immutable Records", desc: "Notices stored on-chain cannot be edited or deleted after publishing" },
                { icon: Zap, label: "Admin-Only Publishing", desc: "Smart contract enforces only the authorized admin wallet can post" },
                { icon: BookOpen, label: "IPFS Content Hashing", desc: "Notice content is hashed before submission, enabling integrity verification" },
                { icon: Users, label: "Wallet Authentication", desc: "MetaMask and any EIP-1193 wallet are supported for admin login" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#163068' }}>
                    <Icon size={15} className="text-yellow-300" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{label}</div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Tech Stack</h3>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-white uppercase tracking-wider" style={{ backgroundColor: '#163068' }}>
                    <th className="px-4 py-3">Layer</th>
                    <th className="px-4 py-3">Technology</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Smart Contracts", "Solidity, Hardhat"],
                    ["Frontend Framework", "React 18, Vite, Tailwind CSS"],
                    ["Blockchain Interaction", "Wagmi v3, Viem v2"],
                    ["Wallet Support", "MetaMask, any injected EIP-1193 wallet"],
                    ["Storage (Simulated)", "IPFS content addressing (SHA-256)"],
                    ["Networks Supported", "Ethereum Mainnet, Sepolia Testnet, Polygon"],
                  ].map(([layer, tech], i) => (
                    <tr key={layer} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="px-4 py-3 font-medium text-slate-700">{layer}</td>
                      <td className="px-4 py-3 text-slate-500">{tech}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Smart Contract */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Smart Contract Interface</h3>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-white uppercase tracking-wider" style={{ backgroundColor: '#163068' }}>
                    <th className="px-4 py-3">Function</th>
                    <th className="px-4 py-3">Access</th>
                    <th className="px-4 py-3">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["postNotice(title, content)", "Admin only", "Publishes a new notice to the chain"],
                    ["getAllNotices()", "Public", "Returns all published notices"],
                    ["admin()", "Public", "Returns the admin wallet address"],
                  ].map(([fn, access, desc], i) => (
                    <tr key={fn} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="px-4 py-3 font-mono text-xs text-blue-700">{fn}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${access === "Admin only" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
                          {access}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Security */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Security</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {[
                "On-chain admin verification — the frontend verifies the connected wallet against the contract's admin() state before allowing any publish action",
                "Immutable records — published notices cannot be modified or deleted by anyone, including the admin",
                "Content hashing — notice content is hashed using SHA-256 (IPFS simulation) before being stored, enabling integrity verification",
                "No private keys stored — all signing happens in the user's wallet; the app never handles private keys",
              ].map((item, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#163068' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Contributors */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Contributors</h3>
            <div className="flex flex-wrap gap-2">
              {["Diksha Singh", "Nandani Rana", "Mehak Sharma", "Yukta Lohani"].map((name) => (
                <div key={name} className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: '#163068' }}>
                    {name[0]}
                  </div>
                  {name}
                </div>
              ))}
            </div>
          </section>

          {/* GitHub link */}
          <section>
            <a
              href="https://github.com/revxi/BlockChainNotice"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#163068' }}
            >
              <Github size={16} />
              View on GitHub
              <ExternalLink size={13} />
            </a>
          </section>

        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400">MIT License &bull; Secured by Ethereum Blockchain</span>
          <button
            onClick={onClose}
            className="text-sm font-medium px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
