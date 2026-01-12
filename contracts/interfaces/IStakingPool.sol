// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IStakingPool
 * @dev Interface for StakingPool contract
 */
interface IStakingPool {
    struct StakeInfo {
        address owner;
        uint256 stakedAt;
        uint256 lastClaimTime;
    }
    
    function stake(uint256 tokenId) external;
    function stakeMultiple(uint256[] calldata tokenIds) external;
    function unstake(uint256 tokenId) external;
    function claimRewards(uint256 tokenId) external;
    function claimAllRewards() external;
    function calculateRewards(uint256 tokenId) external view returns (uint256);
    function getPendingRewards(address user) external view returns (uint256);
    function getUserStakedTokens(address user) external view returns (uint256[] memory);
    function getUserStakeCount(address user) external view returns (uint256);
    function stakes(uint256 tokenId) external view returns (address owner, uint256 stakedAt, uint256 lastClaimTime);
    function totalStaked() external view returns (uint256);
    function rewardRate() external view returns (uint256);
    function stakingEnabled() external view returns (bool);
}
