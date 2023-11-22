
const hre = require("hardhat");
const {verifyContract} = require("./verifyContract");

async function deployERC20(tokenName) {
  const MooBnM = await hre.ethers.getContractFactory(tokenName);
  const mooBnM = await MooBnM.deploy();

  await mooBnM.deployed();
  console.log(
    `${tokenName} is deployed at : ${mooBnM.address}`
  );
  await mooBnM.deployTransaction.wait(5);
  console.log("Verifying contract....");
await verifyContract(mooBnM.address);
  return mooBnM.address;
}
module.exports={
    deployERC20
}