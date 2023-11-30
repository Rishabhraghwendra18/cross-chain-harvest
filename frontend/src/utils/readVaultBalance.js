import { ethers } from "ethers";

export async function totalValueLocked(vaultAddress,ABI){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(vaultAddress, ABI, provider);
    return await contract.totalValueLocked();
}