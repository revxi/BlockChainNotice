import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import ABI from "../utils/abi.json";

const Web3Context = createContext();

// Contract address - update this after deployment
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x5FbDB2315678afccb333f8a9c6122f65385ba4c8a";

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          // Verify network before connecting
          const chainId = await window.ethereum.request({ method: "eth_chainId" });
          const targetChainId = import.meta.env.VITE_CHAIN_ID || "0x89";

          if (chainId !== targetChainId) {
            // Optionally prompt switch here, or just let connectWallet handle it when called explicitly
            // For now, we'll just connect and let the user switch if they try to interact,
            // OR we can force switch. Let's force switch in connectWallet.
          }
          connectWallet();
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  };

  const switchNetwork = async () => {
    const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || "0x89"; // Default to Polygon
    const RPC_URL = import.meta.env.VITE_RPC_URL || "https://polygon-rpc.com";
    const CHAIN_NAME = import.meta.env.VITE_CHAIN_NAME || "Polygon Mainnet";
    const NATIVE_CURRENCY_SYMBOL = import.meta.env.VITE_NATIVE_CURRENCY_SYMBOL || "MATIC";
    const BLOCK_EXPLORER_URL = import.meta.env.VITE_BLOCK_EXPLORER_URL || "https://polygonscan.com/";

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN_ID }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: CHAIN_ID,
                chainName: CHAIN_NAME,
                rpcUrls: [RPC_URL],
                nativeCurrency: {
                  name: NATIVE_CURRENCY_SYMBOL,
                  symbol: NATIVE_CURRENCY_SYMBOL,
                  decimals: 18,
                },
                blockExplorerUrls: [BLOCK_EXPLORER_URL],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
        }
      } else {
        console.error("Error switching network:", switchError);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      await switchNetwork();

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const newSigner = await newProvider.getSigner();

      // Initialize contract
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        newSigner
      );

      setAccount(accounts[0]);
      setProvider(newProvider);
      setSigner(newSigner);
      setContract(contractInstance);
      setConnected(true);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setConnected(false);
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        contract,
        connected,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};