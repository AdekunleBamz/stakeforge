import React from 'react';
import './GasEstimate.css';

interface GasEstimateProps {
  gasPrice: bigint;
  gasLimit: bigint;
  ethPrice?: number;
}

export const GasEstimate: React.FC<GasEstimateProps> = ({
  gasPrice,
  gasLimit,
  ethPrice = 3500,
}) => {
  const gasCostWei = gasPrice * gasLimit;
  const gasCostEth = Number(gasCostWei) / 1e18;
  const gasCostUsd = gasCostEth * ethPrice;

  const formatGwei = (wei: bigint) => {
    return (Number(wei) / 1e9).toFixed(4);
  };

  return (
    <div className="gas-estimate">
      <div className="gas-header">
        <span className="gas-icon">⛽</span>
        <span className="gas-label">Estimated Gas</span>
      </div>
      
      <div className="gas-details">
        <div className="gas-row">
          <span>Gas Price</span>
          <span>{formatGwei(gasPrice)} gwei</span>
        </div>
        <div className="gas-row">
          <span>Gas Limit</span>
          <span>{gasLimit.toString()}</span>
        </div>
        <div className="gas-row total">
          <span>Total Cost</span>
          <span>
            {gasCostEth.toFixed(6)} ETH
            <span className="usd-value">(~${gasCostUsd.toFixed(4)})</span>
          </span>
        </div>
      </div>
      
      <div className="gas-note">
        💙 Base L2 = Ultra low fees
      </div>
    </div>
  );
};
