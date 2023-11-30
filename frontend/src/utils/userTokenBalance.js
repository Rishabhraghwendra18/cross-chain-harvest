import { ethers } from "ethers";

export async function userTokenBalance(vaultAddress,ABI,userAddress){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(vaultAddress, ABI, provider);
    return await contract.balanceOf(userAddress);
}