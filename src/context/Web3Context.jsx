import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from '../utils/abi.json';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      const noticeContract = new ethers.Contract(contractAddress, abi, signer);

      setAccount(address);
      setContract(noticeContract);
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Web3Context.Provider value={{ account, contract, connectWallet, loading }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);