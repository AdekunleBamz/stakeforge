import React, { useState } from 'react';
import { APP_CONFIG } from '../config/contracts';
import './MintSection.css';

interface MintSectionProps {
  onMint: (quantity: number) => Promise<string | null>;
  isMinting: boolean;
  isConnected: boolean;
}

export const MintSection: React.FC<MintSectionProps> = ({
  onMint,
  isMinting,
  isConnected,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleMint = async () => {
    const hash = await onMint(quantity);
    if (hash) {
      setTxHash(hash);
      setTimeout(() => setTxHash(null), 10000);
    }
  };

  const totalPrice = (parseFloat(APP_CONFIG.mintPrice) * quantity).toFixed(4);

  return (
    <section id="mint" className="mint-section">
      <div className="section-header">
        <h2>⚒️ Mint ForgeNFT</h2>
        <p>Mint NFTs to stake and earn FORGE rewards</p>
      </div>

      <div className="mint-card">
        <div className="mint-preview">
          <div className="nft-preview">
            <span className="preview-icon">🎨</span>
            <span className="preview-text">ForgeNFT</span>
          </div>
        </div>

        <div className="mint-controls">
          <div className="quantity-selector">
            <button
              className="qty-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isMinting}
            >
              -
            </button>
            <span className="quantity">{quantity}</span>
            <button
              className="qty-btn"
              onClick={() => setQuantity(Math.min(APP_CONFIG.maxMintPerTx, quantity + 1))}
              disabled={quantity >= APP_CONFIG.maxMintPerTx || isMinting}
            >
              +
            </button>
          </div>

          <div className="price-info">
            <span className="price-label">Total Price</span>
            <span className="price-value">{totalPrice} ETH</span>
          </div>

          <button
            className="mint-btn"
            onClick={handleMint}
            disabled={!isConnected || isMinting}
          >
            {isMinting ? 'Minting...' : `Mint ${quantity} NFT${quantity > 1 ? 's' : ''}`}
          </button>

          <p className="gas-notice">
            ⚡ Ultra-low gas on Base: ~0.000005 ETH per tx
          </p>
        </div>

        {txHash && (
          <div className="tx-success">
            ✅ Minted successfully!{' '}
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on BaseScan
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
