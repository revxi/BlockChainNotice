import React from 'react';
import { Web3Provider, useWeb3 } from "./context/Web3Context.jsx";
import AdminPanel from './components/AdminPanel';
import NoticeFeed from './components/NoticeFeed';
import { Box } from 'lucide-react';

function AppContent() {
  const { account, connectWallet, loading } = useWeb3();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Box size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-gray-800 underline decoration-blue-500 decoration-4 underline-offset-4">
            BLOCKNOTICE
          </h1>
        </div>
        
        <button 
          onClick={connectWallet}
          className={`px-6 py-2 rounded-full font-bold transition-all ${
            account ? "bg-green-100 text-green-700 border border-green-200" : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {loading ? "Connecting..." : account ? `${account.substring(0,6)}...${account.substring(38)}` : "Connect Wallet"}
        </button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <AdminPanel />
        </div>
        <div className="md:col-span-3">
          <NoticeFeed />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  );
}