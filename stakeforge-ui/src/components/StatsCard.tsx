import React from 'react';
import { ethers } from 'ethers';
import './StatsCard.css';

interface StatsCardProps {
  totalStaked: bigint;
  rewardRate: bigint;
  forgeBalance: bigint;
  totalPendingRewards: bigint;
  stakedCount: number;
  ownedCount: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  totalStaked,
  rewardRate,
  forgeBalance,
  totalPendingRewards,
  stakedCount,
  ownedCount,
}) => {
  const formatTokens = (amount: bigint) => {
    return parseFloat(ethers.formatEther(amount)).toFixed(4);
  };

  const formatRewardRate = (rate: bigint) => {
    // Rate per second, convert to per day
    const perDay = rate * 86400n;
    return parseFloat(ethers.formatEther(perDay)).toFixed(2);
  };

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">🖼️</div>
        <div className="stat-content">
          <span className="stat-label">Your NFTs</span>
          <span className="stat-value">{ownedCount}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🔒</div>
        <div className="stat-content">
          <span className="stat-label">Staked</span>
          <span className="stat-value">{stakedCount}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">💰</div>
        <div className="stat-content">
          <span className="stat-label">FORGE Balance</span>
          <span className="stat-value">{formatTokens(forgeBalance)}</span>
        </div>
      </div>

      <div className="stat-card highlight">
        <div className="stat-icon">🎁</div>
        <div className="stat-content">
          <span className="stat-label">Pending Rewards</span>
          <span className="stat-value">{formatTokens(totalPendingRewards)}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <span className="stat-label">Total Staked (All)</span>
          <span className="stat-value">{totalStaked.toString()}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">⚡</div>
        <div className="stat-content">
          <span className="stat-label">Reward/Day/NFT</span>
          <span className="stat-value">{formatRewardRate(rewardRate)} FORGE</span>
        </div>
      </div>
    </div>
  );
};
