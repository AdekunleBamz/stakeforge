import React from 'react';
import './NFTCard.css';

interface NFTCardProps {
  tokenId: bigint;
  isStaked?: boolean;
  isSelected?: boolean;
  pendingRewards?: bigint;
  stakedAt?: bigint;
  onClick?: () => void;
}

export const NFTCard: React.FC<NFTCardProps> = ({
  tokenId,
  isStaked = false,
  isSelected = false,
  pendingRewards,
  stakedAt,
  onClick,
}) => {
  const formatRewards = (amount: bigint) => {
    const value = Number(amount) / 1e18;
    return value.toFixed(4);
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  return (
    <div
      className={`nft-card ${isStaked ? 'staked' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="nft-image">
        <div className="nft-placeholder">
          <span className="nft-emoji">{isStaked ? '🔒' : '🎨'}</span>
        </div>
        {isSelected && <div className="selection-badge">✓</div>}
      </div>

      <div className="nft-info">
        <span className="nft-id">ForgeNFT #{tokenId.toString()}</span>
        
        {isStaked && stakedAt && (
          <span className="stake-date">Staked: {formatDate(stakedAt)}</span>
        )}
        
        {isStaked && pendingRewards !== undefined && (
          <span className="rewards">
            +{formatRewards(pendingRewards)} FORGE
          </span>
        )}
      </div>

      <div className="nft-status">
        {isStaked ? (
          <span className="status-badge staked">Staked</span>
        ) : (
          <span className="status-badge available">Available</span>
        )}
      </div>
    </div>
  );
};
