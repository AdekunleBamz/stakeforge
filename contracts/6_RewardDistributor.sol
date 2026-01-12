// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RewardDistributor
 * @dev Automated reward distribution for staking pools
 */
contract RewardDistributor is Ownable, ReentrancyGuard {
    
    // Distribution info
    struct Distribution {
        address pool;
        uint256 amount;
        uint256 timestamp;
        bool executed;
    }
    
    // Pool reward allocation
    mapping(address => uint256) public poolAllocation; // basis points (10000 = 100%)
    
    // Distribution history
    Distribution[] public distributions;
    
    // Total allocation (should equal 10000)
    uint256 public totalAllocation;
    
    // Events
    event AllocationUpdated(address indexed pool, uint256 allocation);
    event DistributionScheduled(uint256 indexed distributionId, address pool, uint256 amount);
    event DistributionExecuted(uint256 indexed distributionId);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Set allocation for a pool
     */
    function setAllocation(address pool, uint256 allocation) external onlyOwner {
        require(pool != address(0), "Invalid pool");
        
        uint256 oldAllocation = poolAllocation[pool];
        totalAllocation = totalAllocation - oldAllocation + allocation;
        
        require(totalAllocation <= 10000, "Total exceeds 100%");
        
        poolAllocation[pool] = allocation;
        
        emit AllocationUpdated(pool, allocation);
    }
    
    /**
     * @dev Schedule a distribution
     */
    function scheduleDistribution(
        address pool,
        uint256 amount
    ) external onlyOwner {
        require(poolAllocation[pool] > 0, "Pool not allocated");
        require(amount > 0, "Amount must be > 0");
        
        distributions.push(Distribution({
            pool: pool,
            amount: amount,
            timestamp: block.timestamp,
            executed: false
        }));
        
        emit DistributionScheduled(distributions.length - 1, pool, amount);
    }
    
    /**
     * @dev Get distribution count
     */
    function getDistributionCount() external view returns (uint256) {
        return distributions.length;
    }
    
    /**
     * @dev Get pending distributions count
     */
    function getPendingCount() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < distributions.length; i++) {
            if (!distributions[i].executed) {
                count++;
            }
        }
        return count;
    }
}
