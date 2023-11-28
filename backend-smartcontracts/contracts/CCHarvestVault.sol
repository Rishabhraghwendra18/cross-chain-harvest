// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ICCHBnMToken {
    function mint(address to, uint256 amount) external;

    function burnFrom(address account, uint256 value) external;
}

contract CCHarvestVault {
    mapping(address => uint) public stakedAmounts;
    address public deployerAddress;
    address public routerAddress;
    address public bnMToken;
    address public cchBnMToken;
    uint public routerWithdrawalLimit = 80;

    event Withdrawal(
        address indexed user,
        uint256 withdrawalAmount,
        uint256 remainingAmount
    );
    event Deposit(
        address indexed user,
        uint256 depositAmount,
        uint256 updatedBalance
    );

    constructor(address _bnMToken, address _cchBnMToken,address _router) {
        bnMToken = _bnMToken;
        cchBnMToken = _cchBnMToken;
        deployerAddress = msg.sender;
        routerAddress=_router;
    }

    modifier onlyDeployer() {
        require(
            msg.sender == deployerAddress,
            "Only the Deployer can call this function"
        );
        _;
    }

    function setRouterAddress(address _router) external onlyDeployer {
        routerAddress = _router;
    }

    function setRouterWithdrawalLimit(uint _limit) external {
        routerWithdrawalLimit = _limit;
    }

    // @user users can call this function
    function deposit(uint _amount) external returns (bool) {
        require(_amount > 0, "Amount should be greater than 0");
        IERC20(bnMToken).transferFrom(msg.sender, address(this), _amount);
        stakedAmounts[msg.sender] += _amount;
        ICCHBnMToken(cchBnMToken).mint(msg.sender, _amount);
        emit Deposit(msg.sender, _amount, stakedAmounts[msg.sender]);
        return true;
    }

    // @dev only Router will be able to call this function
    function routerWithdraw() external returns (bool,uint) {
        uint tokenBalance = IERC20(bnMToken).balanceOf(address(this));
        require(tokenBalance>0,"Vault don't have any tokens");
        uint tokensToWithdraw = (routerWithdrawalLimit * tokenBalance) / 100;
        bool success = IERC20(bnMToken).transfer(routerAddress, tokensToWithdraw);
        return (success,tokensToWithdraw);
    }

    receive() external payable {}

    // @user users can call this function
    function withdrawNative(address _beneficiary) external {
        uint256 amount = address(this).balance;

        // Attempt to send the funds, capturing the success status and discarding any return data
        (bool sent, ) = _beneficiary.call{value: amount}("");

        // Revert if the send failed, with information about the attempted transfer
        require(sent,"Not able to withdraw");
    }
    function withdraw(uint _amount) external returns (bool) {
        require(_amount > 0, "Amount should be greater than 0");
        require(stakedAmounts[msg.sender] <= _amount, "Insufficient Balance");
        stakedAmounts[msg.sender] -= _amount;
        ICCHBnMToken(cchBnMToken).burnFrom(msg.sender, _amount);
        IERC20(bnMToken).transfer(msg.sender, _amount);
        emit Withdrawal(msg.sender, _amount, stakedAmounts[msg.sender]);
        return true;
    }
}
