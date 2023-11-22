// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

interface IBeefyVault {
    function deposit(uint _amount) external returns (bool);
    function withdraw(uint _amount) external returns (bool);
}
contract Router is AutomationCompatibleInterface{
    address public beefyVault;
    address public owner;
    constructor(address _beefyVault){
        beefyVault=_beefyVault;
        owner=msg.sender;
    }
    modifier onlyOnwer() {
        require(msg.sender == owner, "Only the Onwer can call this function");
        _;
    }
    function setbeefyVault(address _vault) external onlyOnwer {
        beefyVault=_vault;
    }
    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        // upkeepNeeded=IBeefyVault(beefyVault).currentAPR;
        upkeepNeeded=true;
    }
    function performUpkeep(bytes calldata /* performData */) external override {
        
    }
}