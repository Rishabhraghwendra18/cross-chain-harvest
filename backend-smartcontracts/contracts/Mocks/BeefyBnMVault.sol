// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../interface/IMooBnM.sol";
// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BeefyBnMVault {
    IMooBnM mooBnMToken;
    uint public currentAPR;
    IBnM bnMToken;
    mapping (address => uint) stakedAmounts;

    constructor(address _mooBnMToken,uint _apr,address _bnMToken) {
        mooBnMToken = IMooBnM(_mooBnMToken);
        currentAPR=_apr;
        bnMToken = IBnM(_bnMToken);
    }
    function setAPR(uint _newAPR) external {
        currentAPR=_newAPR;
    }
    function deposit(uint _amount) external returns (bool) {
        require(_amount > 0,"Amount should be greater than 0");
        bnMToken.transferFrom(msg.sender,address(this),_amount);
        stakedAmounts[msg.sender]+=_amount;
        mooBnMToken.mint(msg.sender,_amount);
        return true;
    }
    function withdraw(uint _amount) external returns (bool) {
        require(_amount > 0,"Amount should be greater than 0");
        require(stakedAmounts[msg.sender]>0,"Msg.sender don't have enough staked tokens");
        mooBnMToken.burnFrom(msg.sender,_amount);
        stakedAmounts[msg.sender]-=_amount;
        bnMToken.transfer(msg.sender,_amount);
        return true;
    }
}
