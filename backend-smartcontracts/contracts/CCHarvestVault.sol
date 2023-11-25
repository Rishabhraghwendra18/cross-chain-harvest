// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ICCHBnMToken {
    function mint(address to, uint256 amount) external;

    function burnFrom(address account, uint256 value) external;
}

interface IRouter {
    function transferTokensPayNative(
        uint256 _amount
    ) external returns (bytes32 messageId);
}

contract CCHarvestVault {
    mapping(address => uint) public stakedAmounts;
    address public deployerAddress;
    address public routerAddress;
    address bnMToken;
    address cchBnMToken;
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
    function routerWithdraw() external returns (uint) {
        uint tokenBalance = IERC20(bnMToken).balanceOf(address(this));
        uint tokensToWithdraw = (routerWithdrawalLimit * tokenBalance) / 100;
        IERC20(bnMToken).approve(routerAddress, tokensToWithdraw);
        IRouter(routerAddress).transferTokensPayNative(tokensToWithdraw);
        return tokensToWithdraw;
    }

    // @user users can call this function
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
