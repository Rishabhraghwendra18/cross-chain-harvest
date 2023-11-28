// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IRouter {
    function transferTokensPayNative(
        uint256 _amount
    )
        external
        returns (bytes32 messageId,bool);
}