import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import HealthDashboard from './components/HealthDashboard';
import HealthNotifications from './components/HealthNotifications';
import FileUpload from './components/FileUpload';
import AnalysisResult from './components/AnalysisResult';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setLoading(false);
    setShowDashboard(false);
  };

  const handleAnalysisStart = () => {
    setLoading(true);
    setAnalysisResult(null);
    setShowDashboard(false);
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setLoading(false);
    setShowDashboard(true);
  };

  const handleGetStarted = () => {
    setShowDashboard(false);
  };

  return (
    <div className="App">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8E3C 100%)',
            color: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(255, 107, 53, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
      
      <Header />
      
      <main className="main-content">
        <div className="container">
          {showDashboard && !loading && !analysisResult && (
            <HealthDashboard onGetStarted={handleGetStarted} />
          )}
          
          {!showDashboard && !analysisResult && !loading && (
            <>
             
              <FileUpload 
                onAnalysisStart={handleAnalysisStart}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </>
          )}
          
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <h3>Analyzing your blood report...</h3>
              <p>This may take a few moments while our AI reviews your data.</p>
            </div>
          )}
          
          {analysisResult && (
            <AnalysisResult 
              result={analysisResult}
              onNewAnalysis={handleNewAnalysis}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
