// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const {deployVault} = require("../utils/deployVault");
const {verifyContract} = require("../utils/verifyContract");

const ROUTER='0x70499c328e1e2a3c41108bd3730f6670a44595d1';
const LINK='0x326C977E6efc84E512bB9C30f76E30c160eD06FB';
const DESTINATION_CHAIN='14767482510784806043';
const CCIP_BNM_TOKEN='0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40';
const FUNCTIONS_ROUTER='0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C';
const DON_ID='0x66756e2d706f6c79676f6e2d6d756d6261692d31000000000000000000000000';
const FUNCTIONS_CONSUMER_ID=922;

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
  await tokenTransferor.deployTransaction.wait(5);
  await verifyContract(tokenTransferor.address,[ROUTER,
    LINK,
    DESTINATION_CHAIN,
    CCIP_BNM_TOKEN]);

  console.log("Deploying CCHBnMToken...\n");
  const CCHBnMToken = await hre.ethers.getContractFactory("CCHBnM");
  const cchBnMToken = await CCHBnMToken.deploy();
  await cchBnMToken.deployed();
  console.log("Deployed at: ",cchBnMToken.address);
  await cchBnMToken.deployTransaction.wait(5);
  await verifyContract(cchBnMToken.address,[],'contracts/CCHBnMToken.sol:CCHBnM');

  console.log("Deploying Harvest Vault...\n");
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

  console.log("Deploying Function Consumer...\n");
  const FunctionConsumer = await hre.ethers.getContractFactory("FunctionConsumer");
  const functionConsumer = await FunctionConsumer.deploy(
    FUNCTIONS_ROUTER,
    DON_ID,
    ccharvestVault.address,
    FUNCTIONS_CONSUMER_ID
  );
  await functionConsumer.deployed();
  console.log("Deployed at: ",functionConsumer.address);
  await functionConsumer.deployTransaction.wait(5);
  await  verifyContract(functionConsumer.address,[FUNCTIONS_ROUTER,
    DON_ID,
    ccharvestVault.address,
    FUNCTIONS_CONSUMER_ID]);
  
  console.log("DEPLOYED AND VERIFIED ALL CONTRACTS...");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
