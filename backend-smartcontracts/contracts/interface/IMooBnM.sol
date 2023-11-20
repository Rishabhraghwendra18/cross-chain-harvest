// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IMooBnM {
    function mint(address to, uint256 amount) public;
    function burnFrom(address account, uint256 value) public virtual;
}