// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IMooBnM {
    function mint(address to, uint256 amount) external;
    function burnFrom(address account, uint256 value) external;
}