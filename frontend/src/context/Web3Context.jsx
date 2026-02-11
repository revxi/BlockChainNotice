import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import ABI from "../utils/abi.json";

const Web3Context = createContext();

// Contract address - update this after deployment
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [connected, setConnected] = useState(false);

  const handleAccountsChanged = useCallback(async (accounts) => {
    if (accounts.length > 0) {
      const account = accounts[0];
      setAccount(account);
      setConnected(true);

      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        try {
          const signer = await provider.getSigner();
          setSigner(signer);

          const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
          setContract(contract);
        } catch (error) {
          console.error("Error getting signer:", error);
        }
      }
    } else {
      setAccount(null);
      setConnected(false);
      setProvider(null);
      setSigner(null);
      setContract(null);
    }
  }, []);

  const checkConnection = useCallback(async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          handleAccountsChanged(accounts);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  }, [handleAccountsChanged]);

  useEffect(() => {
    checkConnection();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [checkConnection, handleAccountsChanged]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // The accountsChanged event will handle the rest
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <Web3Context.Provider value={{ account, provider, signer, contract, connected, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
