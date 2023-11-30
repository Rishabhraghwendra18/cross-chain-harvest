import { ethers } from "ethers";

export async function approveTokens(tokenAddress,vaultAddress,ABI,amount) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, ABI, signer);
    const tx=await contract.approve(vaultAddress,ethers.utils.parseUnits(amount,"ether"));
    return await tx.wait();
}