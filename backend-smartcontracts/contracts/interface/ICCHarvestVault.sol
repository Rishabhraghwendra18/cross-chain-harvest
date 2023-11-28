// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface ICCHHarvestVault {
    function routerWithdraw() external returns (bool,uint);
}