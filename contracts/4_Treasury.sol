// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Treasury
 * @dev Holds and distributes ForgeToken rewards to StakingPool
 */
contract Treasury is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    // Reward token
    IERC20 public rewardToken;
    
    // Authorized staking pools
    mapping(address => bool) public authorizedPools;
    
    // Total rewards distributed
    uint256 public totalDistributed;
    
    // Distribution limits
    uint256 public dailyLimit;
    uint256 public lastDistributionDay;
    uint256 public distributedToday;
    
    // Events
    event PoolAuthorized(address indexed pool, bool authorized);
    event RewardsDistributed(address indexed pool, uint256 amount);
    event TokensDeposited(address indexed from, uint256 amount);
    event TokensWithdrawn(address indexed to, uint256 amount);
    event DailyLimitUpdated(uint256 oldLimit, uint256 newLimit);
    
    constructor(address _rewardToken) Ownable(msg.sender) {
        rewardToken = IERC20(_rewardToken);
        dailyLimit = 100000 * 10**18; // 100k tokens per day
    }
    
    /**
     * @dev Authorize a staking pool to receive rewards
     */
    function authorizePool(address pool, bool authorized) external onlyOwner {
        authorizedPools[pool] = authorized;
        emit PoolAuthorized(pool, authorized);
    }
    
    /**
     * @dev Distribute rewards to a staking pool
     */
    function distributeRewards(address pool, uint256 amount) external onlyOwner nonReentrant {
        require(authorizedPools[pool], "Pool not authorized");
        require(amount > 0, "Amount must be greater than 0");
        
        // Check daily limit
        _updateDailyDistribution();
        require(distributedToday + amount <= dailyLimit, "Daily limit exceeded");
        
        uint256 balance = rewardToken.balanceOf(address(this));
        require(balance >= amount, "Insufficient treasury balance");
        
        distributedToday += amount;
        totalDistributed += amount;
        
        rewardToken.safeTransfer(pool, amount);
        
        emit RewardsDistributed(pool, amount);
    }
    
    /**
     * @dev Deposit tokens into treasury
     */
    function depositTokens(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        rewardToken.safeTransferFrom(msg.sender, address(this), amount);
        
        emit TokensDeposited(msg.sender, amount);
    }
    
    /**
     * @dev Withdraw tokens from treasury (emergency)
     */
    function withdrawTokens(address to, uint256 amount) external onlyOwner nonReentrant {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than 0");
        
        uint256 balance = rewardToken.balanceOf(address(this));
        require(balance >= amount, "Insufficient balance");
        
        rewardToken.safeTransfer(to, amount);
        
        emit TokensWithdrawn(to, amount);
    }
    
    /**
     * @dev Set daily distribution limit
     */
    function setDailyLimit(uint256 _limit) external onlyOwner {
        emit DailyLimitUpdated(dailyLimit, _limit);
        dailyLimit = _limit;
    }
    
    /**
     * @dev Get treasury balance
     */
    function getBalance() external view returns (uint256) {
        return rewardToken.balanceOf(address(this));
    }
    
    /**
     * @dev Get remaining daily distribution allowance
     */
    function getRemainingDailyAllowance() external view returns (uint256) {
        uint256 currentDay = block.timestamp / 1 days;
        if (currentDay > lastDistributionDay) {
            return dailyLimit;
        }
        return dailyLimit - distributedToday;
    }
    
    /**
     * @dev Update daily distribution tracking
     */
    function _updateDailyDistribution() internal {
        uint256 currentDay = block.timestamp / 1 days;
        if (currentDay > lastDistributionDay) {
            lastDistributionDay = currentDay;
            distributedToday = 0;
        }
    }
    
    /**
     * @dev Emergency withdraw any ERC20 token
     */
    function emergencyWithdraw(address token, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid address");
        IERC20(token).safeTransfer(to, amount);
    }
}
