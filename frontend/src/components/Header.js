import React from 'react';
import {motion} from 'framer-motion';
import {
  Heart,
  Brain,
  Activity,
  Stethoscope,
  Shield,
  Award,
  Users,
} from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <motion.header
      className="header"
      initial={{opacity: 0, y: -50}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.8}}
    >
      <div className="header-container">
        <motion.div
          className="logo-section"
          whileHover={{scale: 1.02}}
          transition={{type: 'spring', stiffness: 300}}
        >
          <div className="logo-icon">
            <motion.div
              animate={{rotate: 360}}
              transition={{duration: 30, repeat: Infinity, ease: 'linear'}}
              className="rotating-background"
            >
              <Stethoscope className="stethoscope-icon" />
            </motion.div>
            <Heart className="heart-icon" />
            <Brain className="brain-icon" />
            <Activity className="activity-icon" />
          </div>
          <div className="logo-text">
            <h1>AI Health Advisor</h1>
            <p>Professional Blood Report Analysis</p>
            <div className="medical-credentials">
              <span>🏥 Medical AI</span>
              <span>🔬 Lab Analysis</span>
              <span>📊 Health Insights</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="header-description"
          initial={{opacity: 0, scale: 0.9}}
          animate={{opacity: 1, scale: 1}}
          transition={{delay: 0.5, duration: 0.8}}
        >
          <p>
            Advanced AI-powered analysis for comprehensive health insights from your blood test results
          </p>
          <motion.div
            className="trust-indicators"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.8, duration: 0.6}}
          >

            <div className="trust-item">
              <Award className="trust-icon" />
              <span>Medical Grade AI</span>
            </div>
            <div className="trust-item">
              <Users className="trust-icon" />
              <span>AI Powered</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
