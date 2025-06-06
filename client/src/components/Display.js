import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Secondfile.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState(false);

  // Generate valid IPFS URL
  const getValidIPFSUrl = (url) => {
    if (url.startsWith("ipfs://")) {
      return `https://ipfs.io/ipfs/${url.split("ipfs://")[1]}`;
    }
    return url;
  };
  

  // Detect file type based on extension
  const getFileType = (url) => {
    try {
      const parsedUrl = new URL(getValidIPFSUrl(url));
      const pathname = parsedUrl.pathname;
      const ext = pathname.split(".").pop().toLowerCase();
  
      if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
      if (["mp4", "webm", "ogg"].includes(ext)) return "video";
      if (["pdf"].includes(ext)) return "pdf";
      if (["txt", "md"].includes(ext)) return "text";
      if (["doc", "docx"].includes(ext)) return "doc";
      return "FILES";
    } catch {
      return "unknown";
    }
  };
  

  // Fetch data from the contract
  const getdata = async () => {
    let dataArray;
    const addressInput = document.querySelector(".address");
    const Otheraddress = addressInput ? addressInput.value : "";
  
    try {
      dataArray = Otheraddress
        ? await contract.display(Otheraddress)
        : await contract.display(account);
    } catch (e) {
      alert("You don't have access or no files found.");
      return;
    }
  
    if (dataArray.length === 0) {
      alert("No files to display.");
      return;
    }
  
    const grouped = {
      image: [],
      video: [],
      pdf: [],
      text: [],
      doc: [],
      FILES: [],
    };
  
    dataArray.forEach((url, index) => {
      const type = getFileType(url);
      const formattedUrl = getValidIPFSUrl(url);
      grouped[type].push({
        id: index,
        url: formattedUrl,
        type,
        name: `File-${index + 1}`,
      });
    });
  
    setData(grouped);
    setShowData(true);
  };
  

  // Delete file
  const deleteFile = async (index) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await contract.deleteUrl(index);
        alert("File deleted successfully");
        getdata();
      } catch (e) {
        alert("Error deleting file");
      }
    }
  };

  const toggleData = () => {
    setShowData(!showData);
  };

  const closeContainer = () => {
    setShowData(false);
  };

  // Render file based on type
  const renderFile = (file) => {
    switch (file.type) {
      case "image":
        return <img src={file.url} alt={file.name} className="file-preview" />;
      case "video":
        return <video src={file.url} controls className="file-preview" />;
      case "pdf":
        return (
          <iframe
            src={file.url}
            title={file.name}
            className="file-preview"
          />
        );
      case "text":
        return (
          <iframe
            src={file.url}
            title={file.name}
            className="file-preview"
          />
        );
      case "doc":
        return (
          <a href={file.url} target="_blank" rel="noopener noreferrer" className="file-link">
            View DOC
          </a>
        );
     /* default:
        return (
          //<a href={file.url} target="_blank" rel="noopener noreferrer" className="file-link">
             //Download File
          //</a>
        );*/
    }
  };

  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          className="address"
          placeholder="Enter Account Address"
        />
        <button className="search-button" onClick={getdata}>
          <i className="fa-solid fa-magnifying-glass"></i> Search
        </button>
      </div>

      {showData && (
  <div className="popup-overlay">
    <div className="popup-content">
      <button className="popup-close" onClick={closeContainer}>✖</button>
      <h2 className="popup-title">📂 Your Uploaded Files</h2>

      {Object.entries(data).map(([category, files]) => (
        files.length > 0 && (
          <div key={category} className="popup-category">
            <h3 className="category-title">{category.toUpperCase()}</h3>
            <div className="popup-grid">
              {files.map((file) => (
                <div key={file.id} className="popup-card">
                  {renderFile(file)}
                  <div className="popup-actions">
                    <h4>{file.name}</h4>
                    <a href={file.url} download className="popup-download">⬇ Download</a>
                    <button onClick={() => deleteFile(file.id)} className="popup-delete">🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  </div>
)}


    </>
  );
};

Display.propTypes = {
  contract: PropTypes.shape({
    display: PropTypes.func.isRequired,
    deleteUrl: PropTypes.func.isRequired,
  }).isRequired,
  account: PropTypes.string.isRequired,
};

export default Display;
