import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">⚒️</span>
          <span className="footer-name">StakeForge</span>
        </div>

        <div className="footer-links">
          <a
            href="https://basescan.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            BaseScan
          </a>
          <a
            href="https://github.com/AdekunleBamz/stakeforge"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://base.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Base
          </a>
        </div>

        <div className="footer-info">
          <p>Built on Base • Ultra-low gas fees</p>
          <p>© {currentYear} StakeForge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
