// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IFunctionConsumer{
    function getNetworkAPR() external view returns (uint);
    function sendRequest(
        // string memory source,
        string[] calldata args
    ) external returns (bytes32 requestId);
}