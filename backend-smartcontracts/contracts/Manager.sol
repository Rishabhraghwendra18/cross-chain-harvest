// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ICCHHarvestVault} from "./interface/ICCHarvestVault.sol";
import {IRouter} from "./interface/IRouter.sol";
import {IFunctionConsumer} from "./interface/IFunctionConsumer.sol";

contract Manager {
    address public router;
    address public ccHarvestVault;
    address public functionConsumer;
    uint public currentAPR;

    constructor(address _router,address _vault, address _functionConsumer) {
        router=_router;
        ccHarvestVault=_vault;
        functionConsumer=_functionConsumer;
        currentAPR=0;
    }

    function setRouter(address _router) external {
        router=_router;
    }
    function setCCHHarvestVault(address _vault) external {
        ccHarvestVault=_vault;
    }
    function setCurrentAPR(uint _apr)external{
        currentAPR=_apr;
    }

    function performCheck(string[] calldata args)external{
        require(args.length > 0,"Provide Args");
        IFunctionConsumer(functionConsumer).sendRequest(args);
    }
    function performCCIPTransfer() external{
        uint networkAPR=IFunctionConsumer(functionConsumer).getNetworkAPR();
        if(currentAPR<networkAPR){
            (bool success,uint tokensToWithdraw)=ICCHHarvestVault(ccHarvestVault).routerWithdraw();
            require(success,"Not able to transfer tokens to router");
            (,bool ccipTransferSuccess)=IRouter(router).transferTokensPayNative(tokensToWithdraw);
            require(ccipTransferSuccess,"Router not able to transfer tokens");
            currentAPR=networkAPR;
        }
    }
}