import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Upload, ShieldCheck, Loader2 } from 'lucide-react';

const AdminPanel = () => {
  const { contract, account } = useWeb3();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleIssueNotice = async (e) => {
    e.preventDefault();
    if (!contract) return alert("Connect wallet first!");

    setIsProcessing(true);
    try {
      setStatus('Uploading to IPFS (Simulated)...');
      // In a real app, you'd call Pinata/Infura here
      const mockIpfsHash = "Qm" + Math.random().toString(36).substring(2, 15); 

      setStatus('Signing Transaction in MetaMask...');
      const tx = await contract.issueNotice(mockIpfsHash, title);
      
      setStatus('Waiting for Block Confirmation...');
      await tx.wait();

      setStatus('Success! Notice anchored to Blockchain.');
      setTitle('');
    } catch (err) {
      console.error(err);
      setStatus('Transaction Failed or Cancelled.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          <ShieldCheck size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Issue New Notice</h2>
          <p className="text-sm text-gray-500">Only authorized admin wallets can perform this action.</p>
        </div>
      </div>
      
      <form onSubmit={handleIssueNotice} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Notice Title</label>
          <input 
            type="text" 
            placeholder="e.g. Final Semester Exam Schedule" 
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <button 
          disabled={isProcessing}
          type="submit" 
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
          {isProcessing ? "Processing..." : "Securely Publish Notice"}
        </button>
      </form>
      {status && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center text-sm font-medium text-blue-700 animate-pulse">
          {status}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;