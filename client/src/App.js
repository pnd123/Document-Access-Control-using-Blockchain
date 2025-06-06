import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ethers } from "ethers";
import Firstpage from "./components/Firstpage";
import Secondpage from "./components/Secondpage";
import AccessList from "./components/AccessList";
import Working from "./components/Working";
import ActivityLog from './components/ActivityLog';


const App = () => {
  const [contract, setContract] = useState(null);
  const [loadingContract, setLoadingContract] = useState(true); // Add a loading state

  useEffect(() => {
    const connectToContract = async () => {
      setLoadingContract(true); // Set loading to true when connection starts
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // Request account access
        const signer = provider.getSigner();
        const contractAddress = "youraddres"; // No leading/trailing spaces
        const abi = [
          // Your ABI here
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_user",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "url",
                "type": "string"
              }
            ],
            "name": "add",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "user",
                "type": "address"
              }
            ],
            "name": "allow",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
              }
            ],
            "name": "deleteUrl",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "user",
                "type": "address"
              }
            ],
            "name": "disallow",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_user",
                "type": "address"
              }
            ],
            "name": "display",
            "outputs": [
              {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "shareAccess",
            "outputs": [
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                  },
                  {
                    "internalType": "bool",
                    "name": "access",
                    "type": "bool"
                  }
                ],
                "internalType": "struct Upload.Access[]",
                "name": "",
                "type": "tuple[]"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ];
        const contractInstance = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );
        setContract(contractInstance);
      } catch (error) {
        console.error("Error connecting to contract:", error);
        // Optionally set an error state here
      } finally {
        setLoadingContract(false); // Set loading to false when connection finishes (success or error)
      }
    };

    connectToContract();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Firstpage />} />
        <Route path="/Secondpage" element={<Secondpage />} />
        <Route
          path="/accesslist"
          element={
            loadingContract ? (
              <div>Connecting to contract...</div> // Or a more informative loading indicator
            ) : (
              <AccessList contract={contract} />
            )
          }
        />
        <Route path="/Working" element={<Working />} />
        <Route path="/ActivityLog" element={<ActivityLog />} />

      </Routes>
    </>
  );
};

export default App;