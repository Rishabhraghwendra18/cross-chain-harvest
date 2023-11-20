const hre = require("hardhat");

const verifyContract = async (address,constructorArguments=[])=>{
    await hre.run("verify:verify",{
        address,
        constructorArguments
    })
}
module.exports ={
    verifyContract
}