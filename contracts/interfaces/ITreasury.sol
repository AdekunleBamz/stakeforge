// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ITreasury
 * @dev Interface for Treasury contract
 */
interface ITreasury {
    function authorizePool(address pool, bool authorized) external;
    function distributeRewards(address pool, uint256 amount) external;
    function depositTokens(uint256 amount) external;
    function withdrawTokens(address to, uint256 amount) external;
    function setDailyLimit(uint256 _limit) external;
    function getBalance() external view returns (uint256);
    function getRemainingDailyAllowance() external view returns (uint256);
    function authorizedPools(address pool) external view returns (bool);
    function totalDistributed() external view returns (uint256);
    function dailyLimit() external view returns (uint256);
}
