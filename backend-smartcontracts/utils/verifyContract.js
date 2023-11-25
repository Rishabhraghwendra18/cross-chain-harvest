const hre = require("hardhat");

const verifyContract = async (address,constructorArguments=[],contract)=>{
    await hre.run("verify:verify",{
        address,
        constructorArguments,
        contract
    })
}
module.exports ={
    verifyContract
}