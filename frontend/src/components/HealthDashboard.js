import React from 'react';
import {
  FaHeartbeat,
  FaStethoscope,
  FaUserMd,
  FaShieldAlt,
  FaLightbulb,
  FaChartLine,
  FaClipboardCheck,
  FaPlay,
} from 'react-icons/fa';
import './HealthDashboard.css';

const HealthDashboard = ({onGetStarted}) => {
  return (
    <div className="health-dashboard">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          Your Personal <span className="gradient-text">Health Advisor</span>
        </h1>
        <p className="hero-subtitle">
          Transform your blood reports into actionable health insights using advanced AI technology.
          {' '}
          Get personalized recommendations, track your progress, and take control of your wellness journey.
        </p>
        <button className="cta-button" onClick={onGetStarted}>
          <FaPlay className="cta-icon" />
          Get Started
        </button>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">
              <FaUserMd />
            </div>
            <div className="stat-value">95%</div>
            <div className="stat-label">Accuracy Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FaStethoscope />
            </div>
            <div className="stat-value">24/7</div>
            <div className="stat-label">AI Support</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FaShieldAlt />
            </div>
            <div className="stat-value">100%</div>
            <div className="stat-label">Secure & Private</div>
          </div>
        </div>
      </section>

      {/* Health Tip Section */}
      <section className="health-tip-section">
        <div className="health-tip-banner">
          <FaLightbulb className="tip-icon" />
          <div className="tip-content">
            <h4>Daily Health Tip</h4>
            <p>
              Regular blood tests can help detect health issues early. Ideally, adults should get
              {' '}
              comprehensive blood work done annually or as recommended by their healthcare provider.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Our AI Health Advisor?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaStethoscope className="feature-icon" />
            <h3 className="feature-title">AI-Powered Analysis</h3>
            <p className="feature-description">
              Our advanced AI algorithms analyze your blood reports with medical-grade precision,
              {' '}
              providing insights that help you understand your health better.
            </p>
          </div>
          <div className="feature-card">
            <FaChartLine className="feature-icon" />
            <h3 className="feature-title">Personalized Insights</h3>
            <p className="feature-description">
              Get tailored health recommendations based on your unique blood profile, medical history,
              {' '}
              and lifestyle factors for optimal wellness.
            </p>
          </div>
          <div className="feature-card">
            <FaClipboardCheck className="feature-icon" />
            <h3 className="feature-title">Comprehensive Reports</h3>
            <p className="feature-description">
              Receive detailed explanations of your blood test results in easy-to-understand language,
              {' '}
              along with actionable steps to improve your health.
            </p>
          </div>

        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <h2 className="section-title">How It Works</h2>
        <div className="process-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Upload Your Report</h3>
              <p>
                Simply upload your blood test report in PDF or image format. Our system supports all major lab formats.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>AI Analysis</h3>
              <p>
                Our advanced AI processes your data, comparing it against medical databases and guidelines.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Get Insights</h3>
              <p>
                Receive personalized health insights, recommendations, and track your progress over time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HealthDashboard;
