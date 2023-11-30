import { ethers } from "ethers";

export async function depositTokens(vaultAddress,ABI,amount) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const contract = new ethers.Contract(vaultAddress, ABI, signer);
   const tx= await contract.deposit(ethers.utils.parseUnits(amount,"ether"));
    return {contract,tx};
}