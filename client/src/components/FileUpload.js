import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Modal from "./Modal";
import FormData from "form-data";


const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [imageUrl, setImageUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("No file selected!");
      return;
    }

    if (!provider || !contract) {
      console.error("Provider or contract is missing!");
      alert("Blockchain connection error. Please reconnect.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `yourpinat-api-key`,
          pinata_secret_api_key: `your-screte-key`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progressPercentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progressPercentage);
        },
      });

      const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
      
      console.log("Connecting contract...");
      console.log("Contract:", contract);
      console.log("Provider:", provider);
      console.log("Account:", account);

      const signer = contract.connect(provider.getSigner());
      await signer.add(account, ImgHash);
      console.log("Generated file hash:", ImgHash);


// 🔗 Send data to Python logger server
try {
  await fetch("http://localhost:5001/log", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: file.name,
      cid: resFile.data.IpfsHash,
      uploader: account,
    }),
  });
  console.log("✅ Logged file info to blockchain_logger");
} catch (logError) {
  console.error("⚠️ Logging to Python logger failed:", logError);
}

setFileName("No image selected");
setImageUrl(null);

alert("Successfully uploaded file!");
setFile(null);
setUploadProgress(0);


      setFileName("No image selected");
      setImageUrl(null);
      
      alert("Successfully uploaded file!");
      setFile(null);
      setUploadProgress(0);
    } catch (error) {
       console.error("❌ Upload rejected:");
  if (error.message.includes("You have already uploaded this file")) {
    alert("You have already uploaded this file!");
  } else {
    alert("Failed to upload file. Check console for details.");
  }
}
  };

  const retrieveFile = (e) => {
    const input = e.target;
    const label = document.getElementById("fileLabel");
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      setFile(file);
      setFileName(file.name);
      label.textContent = "";
    } else if (!file) {
      label.innerHTML = '<i className="fa-solid fa-cloud-arrow-up fa-bounce"></i>';
      document.getElementById("upload-para").style.display = "block";
    }
  };

  const renderPreview = () => {
    if (file) {
      const fileType = file.type.split("/")[0];

      switch (fileType) {
        case "image":
          return (
            <img
              src={URL.createObjectURL(file)}
              alt="Uploaded file"
              className="preview-image"
            />
          );
        case "video":
          return (
            <video
              src={URL.createObjectURL(file)}
              className="preview-video"
              controls
              height={150}
              width={320}
            />
          );
        case "audio":
          return (
            <audio
              src={URL.createObjectURL(file)}
              className="preview-audio"
              controls
            />
          );
        case "application":
          if (file.type === "application/pdf") {
            return (
              <div className="preview-file">
                <i className="fa-solid fa-file-pdf"></i>
                <p>PDF FILE</p>
              </div>
            );
          } else {
            return (
              <div className="preview-file">
                <i className="fa-solid fa-file"></i>
                <p>{fileType.toUpperCase()} FILE</p>
              </div>
            );
          }
        default:
          return (
            <div className="preview-file">
              <i className="fa-solid fa-file"></i>
              <p>{fileType.toUpperCase()} FILE</p>
            </div>
          );
      }
    }

    return null;
  };

  const [currentButton, setCurrentButton] = useState("upload");

  return (
    <>
      <div className="upload-share-container">
        <div className="toggleWrapper">
          <input type="checkbox" className="dn" id="dn" />
          <label
            htmlFor="dn"
            className="toggle"
            onClick={() =>
              setCurrentButton(currentButton === "share" ? "upload" : "share")
            }
          >
            <span className="toggle__handler"></span>
          </label>
        </div>
        {currentButton === "upload" && (
          <div className="wrapper">
            <h3>Upload Your Files</h3>
            <p className="first-desc">
              File supported type : PNG , MP3 ,MP4, PDF, DOC {" "}
            </p>
            <div
              className="form"
              onClick={() => document.getElementById("my-file").click()}
              onSubmit={handleSubmit}
            >
              <label
                htmlFor="my-file"
                id="fileLabel"
                className="custom-file-upload"
              >
                <i className="fa-solid fa-cloud-arrow-up fa-bounce"></i>
              </label>
              <input
                type="file"
                id="my-file"
                name="myfile"
                disabled={!account}
                onChange={(e) => {
                  retrieveFile(e);
                  document.getElementById("upload-para").style.display = "none";
                }}
              />
              {file && renderPreview()}

              <p id="upload-para" className="upload-para">
                Browse or Drag here to upload
              </p>
              {uploadProgress > 0 && (
                <progress value={uploadProgress} max={100} />
              )}
            </div>
            <button
              type="submit"
              className="upload"
              disabled={!file}
              onClick={handleSubmit}
            >
              Upload
            </button>
          </div>
        )}
        {currentButton === "share" && (
          <div className="share-wrapper">
            <h3>Share Your Files</h3>
            <Modal contract={contract} />
          </div>
        )}
      </div>
    </>
  );
};

FileUpload.propTypes = {
  contract: PropTypes.shape({
    connect: PropTypes.func,
    add: PropTypes.func.isRequired, // Ensure `add` function exists
  }).isRequired,
  account: PropTypes.string.isRequired,
  provider: PropTypes.shape({
    getSigner: PropTypes.func.isRequired,
  }).isRequired,
};

export default FileUpload;
