import { ethers } from "ethers"; 
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Navbar from "./Navbar";
import "./AccessList.css";
import Discordsvg from "./Discordsvg";
import Twittersvg from "./Twittersvg";
import Instagramsvg from "./Instagramsvg";
import { utils } from "ethers";

const AccessListPage = ({ contract }) => {
  const [accessList, setAccessList] = useState([]);
  const [metaMaskAddress, setMetaMaskAddress] = useState("");

useEffect(() => {
  const fetchAccessList = async () => {
    try {
      console.log("Fetching access list...");
      const list = await contract.shareAccess();

      // Filter valid addresses only
      const filteredList = list.filter(item =>
        item?.user && utils.isAddress(item.user)
      );

      setAccessList(filteredList);
    } catch (err) {
      console.error("Failed to fetch access list:", err);
      console.trace(); // helps you debug
    }
  };

  if (contract) {
    fetchAccessList();
  }
}, [contract]);

  const handleAllow = async (address) => {
    await contract.allow(address);
    const addressObj = { user: address, access: true };
    if (accessList.some((item) => item.user === address)) {
      setAccessList(
        accessList.map((item) => {
          if (item.user === address) {
            return { ...item, access: true };
          }
          return item;
        })
      );
    } else {
      setAccessList([...accessList, addressObj]);
    }
  };

  const handleDisallow = async (address) => {
    await contract.disallow(address);
    setAccessList(
      accessList.map((item) => {
        if (item.user === address) {
          return { ...item, access: false };
        }
        return item;
      })
    );
  };

  const onSubmit = (event) => {
    event.preventDefault();
  
    const addressInput = event.target.elements.address;
  
    if (!addressInput) {
      console.error("Address input field is missing!");
      return;
    }
  
    const address = addressInput.value.trim();
  
    if (!ethers.utils.isAddress(address)) {
      alert("Please enter a valid Ethereum address (starting with 0x...)");
      return;
    }
  
    handleAllow(address);
    setMetaMaskAddress("");
  };

  return (
    <div>
      {/* Navbar section */}
      <div className="navbar-section">
        <Navbar />
      </div>
      <div className="accesslist-section">
        <h1 className="accesslist-h1">Access List</h1>
        <form onSubmit={onSubmit} className="accesslist-form">
          <input
            className="accesslist-input"
            type="text"
            name="address"
            value={metaMaskAddress}
            onChange={(e) => setMetaMaskAddress(e.target.value)}
            placeholder="Enter Address"
          />
          <button type="submit" className="accesslist-button">
            Allow
          </button>
        </form>

        {accessList.length > 0 ? (
          <ul>
            {accessList.map((item) => (
              <li key={item.user} className="accesslist-container">
                <div className="address">{item.user}</div>
                <div className="status">
                  {item.access ? "Allowed" : "Disallowed"}
                </div>
                {item.access ? (
                  <button
                    className="accesslist-button"
                    onClick={() => handleDisallow(item.user)}
                  >
                    Disallow
                  </button>
                ) : (
                  <button
                    className="accesslist-button"
                    onClick={() => handleAllow(item.user)}
                  >
                    Allow
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="error-text">No addresses with access.</p>
        )}
      </div>
    </div>
  );
};

AccessListPage.propTypes = {
  contract: PropTypes.shape({
    shareAccess: PropTypes.func.isRequired,
    allow: PropTypes.func.isRequired,
    disallow: PropTypes.func.isRequired,
  }).isRequired,
};

export default AccessListPage;
