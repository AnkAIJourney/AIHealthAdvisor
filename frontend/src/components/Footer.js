import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <div className="feature-item">
            <span className="feature-icon" role="img" aria-label="shield">
              🛡️
            </span>
            <div className="feature-text">
              <h4>Secure &amp; Private</h4>
              <p>Your health data is processed securely and never stored</p>
            </div>
          </div>
        </div>
        <div className="footer-section">
          <div className="feature-item">
            <span className="feature-icon" role="img" aria-label="zap">⚡</span>
            <div className="feature-text">
              <h4>AI-Powered</h4>
              <p>Advanced AI technology for accurate health insights</p>
            </div>
          </div>
        </div>
        <div className="footer-section">
          <div className="feature-item">
            <span className="feature-icon" role="img" aria-label="users">
              👨‍⚕️
            </span>
            <div className="feature-text">
              <h4>Expert-Reviewed</h4>
              <p>Analysis methods reviewed by healthcare professionals</p>
            </div>
          </div>
        </div>
        <div className="footer-section">
          <div className="feature-item">
            <span className="feature-icon" role="img" aria-label="award">
              🏆
            </span>
            <div className="feature-text">
              <h4>Trusted Platform</h4>
              <p>Reliable health analysis trusted by thousands</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copyright">
          <span className="heart-icon" role="img" aria-label="heart">❤️</span>
          <p>© 2025 AI Health Advisor. Made with care for your health.</p>
        </div>
        <div className="disclaimer">
          <p>
            This tool is for informational purposes only and should not replace professional medical advice.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
