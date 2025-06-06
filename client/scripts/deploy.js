const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const Upload = await hre.ethers.getContractFactory("Upload");
  const upload = await Upload.deploy();

  await upload.deployed();

  console.log("Upload contract deployed to:", upload.address);

  // Write the contract address and ABI to frontend config
  const frontendDir = path.join(__dirname, "..", "client", "src", "utils");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(frontendDir, "contractAddress.json"),
    JSON.stringify({ uploadAddress: upload.address }, null, 2)
  );

  const contractArtifact = await hre.artifacts.readArtifact("Upload");
  fs.writeFileSync(
    path.join(frontendDir, "UploadABI.json"),
    JSON.stringify(contractArtifact.abi, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
