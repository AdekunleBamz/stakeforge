// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StakingConfig
 * @dev Configuration contract for StakingPool parameters
 */
contract StakingConfig is Ownable {
    
    // Staking tiers with different reward multipliers
    struct StakingTier {
        uint256 minDuration;      // Minimum stake duration
        uint256 rewardMultiplier; // Multiplier in basis points (10000 = 1x)
        string name;
    }
    
    // Tier levels
    StakingTier[] public tiers;
    
    // Events
    event TierAdded(uint256 indexed tierId, string name, uint256 minDuration, uint256 multiplier);
    event TierUpdated(uint256 indexed tierId, uint256 minDuration, uint256 multiplier);
    event TierRemoved(uint256 indexed tierId);
    
    constructor() Ownable(msg.sender) {
        // Default tiers
        _addTier(0, 10000, "Bronze");           // 0 days, 1x
        _addTier(7 days, 12500, "Silver");      // 7 days, 1.25x
        _addTier(30 days, 15000, "Gold");       // 30 days, 1.5x
        _addTier(90 days, 20000, "Diamond");    // 90 days, 2x
    }
    
    /**
     * @dev Add a new staking tier
     */
    function addTier(
        uint256 minDuration,
        uint256 rewardMultiplier,
        string calldata name
    ) external onlyOwner {
        _addTier(minDuration, rewardMultiplier, name);
    }
    
    /**
     * @dev Internal add tier function
     */
    function _addTier(
        uint256 minDuration,
        uint256 rewardMultiplier,
        string memory name
    ) internal {
        tiers.push(StakingTier({
            minDuration: minDuration,
            rewardMultiplier: rewardMultiplier,
            name: name
        }));
        
        emit TierAdded(tiers.length - 1, name, minDuration, rewardMultiplier);
    }
    
    /**
     * @dev Update an existing tier
     */
    function updateTier(
        uint256 tierId,
        uint256 minDuration,
        uint256 rewardMultiplier
    ) external onlyOwner {
        require(tierId < tiers.length, "Invalid tier ID");
        
        tiers[tierId].minDuration = minDuration;
        tiers[tierId].rewardMultiplier = rewardMultiplier;
        
        emit TierUpdated(tierId, minDuration, rewardMultiplier);
    }
    
    /**
     * @dev Get tier count
     */
    function getTierCount() external view returns (uint256) {
        return tiers.length;
    }
    
    /**
     * @dev Get tier by staking duration
     */
    function getTierForDuration(uint256 duration) external view returns (uint256 tierId, uint256 multiplier) {
        for (uint256 i = tiers.length; i > 0; i--) {
            if (duration >= tiers[i - 1].minDuration) {
                return (i - 1, tiers[i - 1].rewardMultiplier);
            }
        }
        return (0, tiers[0].rewardMultiplier);
    }
    
    /**
     * @dev Get all tiers
     */
    function getAllTiers() external view returns (StakingTier[] memory) {
        return tiers;
    }
}
