# CrossChain Harvest Chainlink Products Usage
CorssChain Harvest protocols uses Chainlink Automation, Functions, and CCIP. It uses these chainlink products to automate 
and provide best yields to users by moivng their staked tokens accross different money markets acorss different chains.

### CrossChain Harvest includes 5 contracts
- Router Contract: To facilate token transfer accross chains using CCIP. Checkout Router Contract [here](https://github.com/Rishabhraghwendra18/cross-chain-harvest/blob/main/backend-smartcontracts/contracts/Router.sol#L101).
- Function Consumer Contract: This is a Function Consumer contract to call off-chain APIs and for Yield calculations off-chain using Chainlink Functions. Checkout Function Consumer [here](https://github.com/Rishabhraghwendra18/cross-chain-harvest/blob/main/backend-smartcontracts/contracts/FunctionConsumer.sol#L84).
- Manager Contract: This contract governs the money market on CrossChain Harvest. This contract has two functions`performCheck(string memory args[])`, and `performCCIPTransfer()`

    -  `performCheck(string memory args[])`: It's used to call Function consumer contract. This function is been called on each sunday by Chainlink Automation upkeep to check for better yield opprotunities across chains. It accepts an argument `args[]` to provide query parameters to API calls in function consumer contract. Checkout logic [here](https://github.com/Rishabhraghwendra18/cross-chain-harvest/blob/main/backend-smartcontracts/contracts/Manager.sol#L31).
    
    - `performCCIPTransfer()`: This function is also been called by Chainlink Automation upkeep on every sunday 5 minutes after `performCheck()` is being called. It facilates the token transfer operations on Router contract depending upon the better yields if found. Checkout logic [here](https://github.com/Rishabhraghwendra18/cross-chain-harvest/blob/main/backend-smartcontracts/contracts/Manager.sol#L35).
    
    _Note: For testing and demo purposes we have set the time based automation to after every 3 minutes for `performCheck()` and after every 5 minutes for `performCCIPTransfer()`._

- CrossChain Harvest Vault: This vaults has `deposit()` and `withdraw()` for users to deposit and withdraw their funds. Checkout deposit function [here](https://github.com/Rishabhraghwendra18/cross-chain-harvest/blob/main/backend-smartcontracts/contracts/CCHarvestVault.sol#L55) and withdraw function [here](https://github.com/Rishabhraghwendra18/cross-chain-harvest/blob/main/backend-smartcontracts/contracts/CCHarvestVault.sol#L86)
- CCHBnMToken: This is an LP token which is minted to user for depositing their tokens. Checkout contract [here](https://github.com/Rishabhraghwendra18/cross-chain-harvest/blob/main/backend-smartcontracts/contracts/CCHBnMToken.sol)

    _Note: It's a BnM LP token due to limitations of CCIP on testnet to only facilate CCIP-BnM and cCCIP-LnM tokens._