const hre = require("hardhat");

async function main() {
  // Get the deployer's address
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the ContractFactory for Credential
  const Credential = await hre.ethers.getContractFactory("Credential");
  
  // Deploy the contract and pass the deployer's address as the initialOwner
  const credential = await Credential.deploy(deployer.address);

  await credential.waitForDeployment();

  console.log("Credential contract deployed to:", await credential.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});