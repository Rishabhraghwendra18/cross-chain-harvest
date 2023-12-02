// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const {deployVault} = require("../utils/deployVault");
const {verifyContract} = require("../utils/verifyContract");

const ROUTER='0x554472a2720e5e7d5d3c817529aba05eed5f82d8';
const LINK='0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846';
const DESTINATION_CHAIN='12532609583862916517';
const CCIP_BNM_TOKEN='0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4';
const FUNCTIONS_ROUTER='0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0';
const DON_ID='0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000';
const FUNCTIONS_CONSUMER_ID=1338;

async function main() {
  // const beefyBnMVaultAddress = await deployVault();

  console.log("Deploying Router (TokenTransferor)...");
  const TokenTransferor = await hre.ethers.getContractFactory("TokenTransferor");
  const tokenTransferor = await TokenTransferor.deploy(
    ROUTER,
    LINK,
    DESTINATION_CHAIN,
    CCIP_BNM_TOKEN
  );
  await tokenTransferor.deployed();
  console.log("Deployed at: ",tokenTransferor.address);
  // =================For Testing Only==================
    const [owner] = await hre.ethers.getSigners();
    await tokenTransferor.setReceiverContract(owner.address)
    await owner.sendTransaction({
      to:tokenTransferor.address,
      value: hre.ethers.utils.parseEther("2.0"),
    })
    console.log("Matic and receiver address set!");
  // ===================================================
  await tokenTransferor.deployTransaction.wait(5);
  await verifyContract(tokenTransferor.address,[ROUTER,
    LINK,
    DESTINATION_CHAIN,
    CCIP_BNM_TOKEN]);

  console.log("\nDeploying CCHBnMToken...");
  const CCHBnMToken = await hre.ethers.getContractFactory("CCHBnM");
  const cchBnMToken = await CCHBnMToken.deploy();
  await cchBnMToken.deployed();
  console.log("Deployed at: ",cchBnMToken.address);
  await cchBnMToken.deployTransaction.wait(5);
  await verifyContract(cchBnMToken.address,[],'contracts/CCHBnMToken.sol:CCHBnM');

  console.log("\nDeploying Harvest Vault...");
  const CCHarvestVault = await hre.ethers.getContractFactory("CCHarvestVault");
  const ccharvestVault = await CCHarvestVault.deploy(
    CCIP_BNM_TOKEN,
    cchBnMToken.address,
    tokenTransferor.address
  );
  await ccharvestVault.deployed();
  console.log("Deployed at: ",ccharvestVault.address);
  await ccharvestVault.deployTransaction.wait(5);
  await verifyContract(ccharvestVault.address,[CCIP_BNM_TOKEN,
    cchBnMToken.address,
    tokenTransferor.address]);

  console.log("\nDeploying Function Consumer...");
  const FunctionConsumer = await hre.ethers.getContractFactory("FunctionConsumer");
  const functionConsumer = await FunctionConsumer.deploy(
    FUNCTIONS_ROUTER,
    DON_ID,
    ccharvestVault.address,
    FUNCTIONS_CONSUMER_ID,
    tokenTransferor.address
  );
  await functionConsumer.deployed();
  console.log("Deployed at: ",functionConsumer.address);
  await functionConsumer.deployTransaction.wait(5);
  await  verifyContract(functionConsumer.address,[FUNCTIONS_ROUTER,
    DON_ID,
    ccharvestVault.address,
    FUNCTIONS_CONSUMER_ID,tokenTransferor.address]);
  
    console.log("\nDeploying Manager Contract...");
    const Manager = await hre.ethers.getContractFactory("Manager");
    const manager = await Manager.deploy(
      tokenTransferor.address,
      ccharvestVault.address,
      functionConsumer.address
    )
    await manager.deployed();
    console.log("Deployed at: ",manager.address);
    await manager.deployTransaction.wait(5);
    await verifyContract(manager.address,[
      tokenTransferor.address,
      ccharvestVault.address,
      functionConsumer.address
    ]);

  console.log("DEPLOYED AND VERIFIED ALL CONTRACTS...");

}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
