import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { FileText, CheckCircle, ExternalLink } from 'lucide-react';

const NoticeFeed = () => {
  const { contract } = useWeb3();
  const [notices, setNotices] = useState([]);

  const fetchNotices = async () => {
    if (!contract) return;
    const count = await contract.getNoticeCount();
    const items = [];
    for (let i = 0; i < count; i++) {
      const n = await contract.allNotices(i);
      items.push(n);
    }
    setNotices(items.reverse()); // Newest first
  };

  useEffect(() => { fetchNotices(); }, [contract]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <FileText className="text-gray-400" /> Recent Notices
      </h3>
      {notices.length === 0 ? (
        <p className="text-gray-500 italic">No notices found on-chain.</p>
      ) : (
        notices.map((notice, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center group hover:border-blue-300 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-lg">{notice.title}</h4>
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-black">
                  <CheckCircle size={10} /> VERIFIED
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">Issued by: {notice.issuedBy.substring(0,10)}...</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(Number(notice.timestamp) * 1000).toLocaleString()}
              </p>
            </div>
            <a 
              href={`https://ipfs.io/ipfs/${notice.ipfsHash}`} 
              target="_blank" 
              className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-600 hover:text-white transition-all"
            >
              <ExternalLink size={20} />
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default NoticeFeed;