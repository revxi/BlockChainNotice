import { ethers } from "ethers";

const contractAddress = "0x5FbDB2315678afccb333f8a9c6122f65385ba4c8a";

const abi = [
  "function getAllNotices() view returns (tuple(uint id,string title,string content,uint timestamp)[])",
  "function admin() view returns (address)"
];

export const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not found");

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(contractAddress, abi, signer);
};
