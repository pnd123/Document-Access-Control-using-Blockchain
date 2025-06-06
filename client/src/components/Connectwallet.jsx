import React from "react";
import { useEffect, useState } from "react";

function App() {
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, []);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          const address = accounts[0];
          if (address.startsWith("0x") && address.length === 42) {
            setWalletAddress(address);
            console.log("Connected wallet:", address);
          }
        }
      } catch (err) {
        console.error("Wallet connection error:", err.message);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          const address = accounts[0];
          if (address.startsWith("0x") && address.length === 42) {
            setWalletAddress(address);
            console.log("Already connected:", address);
          }
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error("Wallet fetch error:", err.message);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          const address = accounts[0];
          if (address.startsWith("0x") && address.length === 42) {
            setWalletAddress(address);
            console.log("Wallet changed:", address);
          }
        } else {
          setWalletAddress("");
          console.log("Wallet disconnected");
        }
      });
    } else {
      console.log("Please install MetaMask");
    }
  };

  return (
    <div>
      <button className="connect-btn" onClick={connectWallet}>
        <span className="btn-txt">
          {walletAddress && walletAddress.length > 0
            ? `Connected: ${walletAddress.substring(0, 4)}...${walletAddress.substring(38)}`
            : "Connect Wallet"}
        </span>
      </button>
    </div>
  );
}

export default App;
