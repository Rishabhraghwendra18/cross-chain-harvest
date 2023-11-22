const hre = require("hardhat");
const { deployERC20 } = require("./deployERC20");
const { verifyContract } = require("./verifyContract");

const BNM_TOKEN = "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40";
async function deployVault() {
  console.log("Deploying MooBnM token...");
  const mooBnMAddress = await deployERC20("MooBnM");
  console.log("Deployging BeefyBnMVault....");
  const BeefyBnMVault = await hre.ethers.getContractFactory("BeefyBnMVault");
  const beefyBnMVault = await BeefyBnMVault.deploy(
    mooBnMAddress,
    hre.ethers.utils.parseEther("10"),
    BNM_TOKEN
  );
  await beefyBnMVault.deployed();

  console.log(`beefyBnMVault is deployed at : ${beefyBnMVault.address}`);
  await beefyBnMVault.deployTransaction.wait(5);
  console.log("Verifying contract....");
  await verifyContract(beefyBnMVault.address, [
    mooBnMAddress,
    hre.ethers.utils.parseEther("10"),
    BNM_TOKEN,
  ]);
  return beefyBnMVault.address;
}
module.exports = {
  deployVault,
};
