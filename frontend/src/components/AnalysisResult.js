import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  FileText,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart,
  Activity,
  TrendingUp,
  Share2,
  Bookmark,
  Bell,
  BarChart3,
  Target,
} from 'lucide-react';
import './AnalysisResult.css';

const AnalysisResult = ({result, onNewAnalysis}) => {
  const [activeTab, setActiveTab] = useState ('analysis');
  const [bookmarked, setBookmarked] = useState (false);
  const [reminderSet, setReminderSet] = useState (false);
  const [analysisProgress, setAnalysisProgress] = useState (0);
  const [isDownloading, setIsDownloading] = useState (false);

  useEffect (() => {
    // Simulate analysis completion animation
    const timer = setTimeout (() => {
      setAnalysisProgress (100);
    }, 500);
    return () => clearTimeout (timer);
  }, []);

  const downloadAnalysis = async () => {
    setIsDownloading (true);

    try {
      // If result.pdfUrl exists (from backend), use it
      if (result.pdfUrl) {
        const link = document.createElement ('a');
        link.href = result.pdfUrl;
        link.download = `health-analysis-${new Date ()
          .toISOString ()
          .split ('T')[0]}.pdf`;
        document.body.appendChild (link);
        link.click ();
        document.body.removeChild (link);
        setIsDownloading (false);
        return;
      }

      // Generate PDF using HTML to Canvas approach
      try {
        // Create a temporary div with the content
        const tempDiv = document.createElement ('div');
        tempDiv.style.cssText = `
          position: absolute;
          top: -9999px;
          left: -9999px;
          width: 800px;
          padding: 40px;
          font-family: Arial, sans-serif;
          background: white;
          color: black;
          line-height: 1.6;
        `;

        // Build the HTML content
        const htmlContent = `
          <div style="margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px; font-size: 28px;">Health Analysis Report</h1>
            <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Generated on: ${new Date ().toLocaleDateString ()}</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-bottom: 15px; color: #1e293b;">File Information</h3>
              <p><strong>File:</strong> ${result.filename || 'N/A'}</p>
              <p><strong>Size:</strong> ${formatFileSize (result.fileSize || 0)} MB</p>
              <p><strong>Analyzed:</strong> ${formatDateTime (result.timestamp || Date.now ())}</p>
            </div>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #dc2626; margin-bottom: 15px; font-size: 22px;">Analysis Results</h2>
            <div style="background: white; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              ${(result.analysis || 'No analysis available')
                .replace (/\n/g, '<br>')
                .replace (/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
            </div>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #059669; margin-bottom: 15px; font-size: 22px;">Recommendations</h2>
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #22c55e;">
              <div style="margin-bottom: 15px;">
                <h3 style="color: #dc2626; margin-bottom: 8px;">🔴 High Priority</h3>
                <p>Consult with your healthcare provider about elevated cholesterol levels and discuss potential treatment options.</p>
              </div>
              <div style="margin-bottom: 15px;">
                <h3 style="color: #d97706; margin-bottom: 8px;">🟡 Lifestyle Changes</h3>
                <p>Increase cardiovascular exercise to 150 minutes per week and reduce sodium intake to improve heart health.</p>
              </div>
              <div style="margin-bottom: 15px;">
                <h3 style="color: #059669; margin-bottom: 8px;">🟢 Dietary Adjustments</h3>
                <p>Consider increasing fiber intake and reducing processed foods to support overall metabolic health.</p>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 40px; padding: 20px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin-bottom: 10px;">⚠️ Medical Disclaimer</h3>
            <p style="font-size: 12px; color: #92400e;">
              This AI analysis is for educational and informational purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals regarding your health concerns.
            </p>
          </div>
        `;

        tempDiv.innerHTML = htmlContent;
        document.body.appendChild (tempDiv);

        // Load html2canvas and jsPDF from CDN
        const html2canvas = await loadScript (
          'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
        );
        const jsPDF = await loadScript (
          'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        );

        if (window.html2canvas && window.jsPDF) {
          // Convert HTML to canvas
          const canvas = await window.html2canvas (tempDiv, {
            width: 800,
            height: tempDiv.scrollHeight,
            useCORS: true,
            scale: 2,
          });

          // Create PDF
          const pdf = new window.jsPDF.jsPDF ({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
          });

          const imgData = canvas.toDataURL ('image/png');
          const imgWidth = 190;
          const imgHeight = canvas.height * imgWidth / canvas.width;

          // Add image to PDF (handle multiple pages if needed)
          let heightLeft = imgHeight;
          let position = 10;

          pdf.addImage (imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= 280;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight + 10;
            pdf.addPage ();
            pdf.addImage (imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= 280;
          }

          // Save PDF
          const fileName = `health-analysis-${new Date ()
            .toISOString ()
            .split ('T')[0]}.pdf`;
          pdf.save (fileName);

          // Clean up
          document.body.removeChild (tempDiv);
        } else {
          throw new Error ('Failed to load PDF libraries');
        }
      } catch (pdfError) {
        console.error ('PDF generation error:', pdfError);
        // Fallback to simpler PDF generation
        await generateSimplePDF ();
      }
    } catch (error) {
      console.error ('Download error:', error);
      // Final fallback to text download
      downloadAsText ();
    } finally {
      setIsDownloading (false);
    }
  };

  const loadScript = src => {
    return new Promise ((resolve, reject) => {
      const script = document.createElement ('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild (script);
    });
  };

  const generateSimplePDF = async () => {
    try {
      // Simple PDF generation using browser's print functionality
      const printWindow = window.open ('', '_blank');
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Health Analysis Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .title { color: #2563eb; font-size: 28px; margin-bottom: 10px; }
            .date { color: #666; font-size: 14px; }
            .section { margin-bottom: 30px; }
            .section-title { color: #1e293b; font-size: 20px; margin-bottom: 15px; }
            .file-info { background: #f8fafc; padding: 15px; border-radius: 5px; }
            .analysis-content { background: white; padding: 20px; border: 1px solid #e2e8f0; }
            .recommendations { background: #f0fdf4; padding: 20px; border-left: 4px solid #22c55e; }
            .disclaimer { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin-top: 30px; }
            .high-priority { color: #dc2626; }
            .medium-priority { color: #d97706; }
            .low-priority { color: #059669; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Health Analysis Report</h1>
            <p class="date">Generated on: ${new Date ().toLocaleDateString ()}</p>
          </div>
          
          <div class="section">
            <div class="file-info">
              <h3>File Information</h3>
              <p><strong>File:</strong> ${result.filename || 'N/A'}</p>
              <p><strong>Size:</strong> ${formatFileSize (result.fileSize || 0)} MB</p>
              <p><strong>Analyzed:</strong> ${formatDateTime (result.timestamp || Date.now ())}</p>
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">Analysis Results</h2>
            <div class="analysis-content">
              ${(result.analysis || 'No analysis available')
                .replace (/\n/g, '<br>')
                .replace (/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">Recommendations</h2>
            <div class="recommendations">
              <div style="margin-bottom: 15px;">
                <h3 class="high-priority">🔴 High Priority</h3>
                <p>Consult with your healthcare provider about elevated cholesterol levels and discuss potential treatment options.</p>
              </div>
              <div style="margin-bottom: 15px;">
                <h3 class="medium-priority">🟡 Lifestyle Changes</h3>
                <p>Increase cardiovascular exercise to 150 minutes per week and reduce sodium intake to improve heart health.</p>
              </div>
              <div>
                <h3 class="low-priority">🟢 Dietary Adjustments</h3>
                <p>Consider increasing fiber intake and reducing processed foods to support overall metabolic health.</p>
              </div>
            </div>
          </div>
          
          <div class="disclaimer">
            <h3>⚠️ Medical Disclaimer</h3>
            <p style="font-size: 12px;">
              This AI analysis is for educational and informational purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals regarding your health concerns.
            </p>
          </div>
          
          <div class="no-print" style="margin-top: 30px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">Print/Save as PDF</button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write (content);
      printWindow.document.close ();

      // Auto-trigger print dialog after a short delay
      setTimeout (() => {
        printWindow.print ();
      }, 500);
    } catch (error) {
      console.error ('Simple PDF generation error:', error);
      throw error;
    }
  };

  const downloadAsText = () => {
    const content = `
HEALTH ANALYSIS REPORT
Generated on: ${new Date ().toLocaleDateString ()}

File: ${result.filename || 'N/A'}
Size: ${formatFileSize (result.fileSize || 0)} MB
Analyzed: ${formatDateTime (result.timestamp || Date.now ())}

ANALYSIS RESULTS:
${result.analysis || 'No analysis available'}

RECOMMENDATIONS:
• High Priority: Consult with your healthcare provider about elevated cholesterol levels and discuss potential treatment options.
• Lifestyle Changes: Increase cardiovascular exercise to 150 minutes per week and reduce sodium intake to improve heart health.
• Dietary Adjustments: Consider increasing fiber intake and reducing processed foods to support overall metabolic health.

MEDICAL DISCLAIMER:
This AI analysis is for educational and informational purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals regarding your health concerns.
    `;

    const blob = new Blob ([content], {type: 'text/plain'});
    const url = URL.createObjectURL (blob);
    const link = document.createElement ('a');
    link.href = url;
    link.download = `health-analysis-${new Date ()
      .toISOString ()
      .split ('T')[0]}.txt`;
    document.body.appendChild (link);
    link.click ();
    document.body.removeChild (link);
    URL.revokeObjectURL (url);
  };

  const shareAnalysis = () => {
    if (navigator.share) {
      navigator.share ({
        title: 'My Health Analysis',
        text: 'Check out my health analysis results',
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText (window.location.href);
      alert ('Link copied to clipboard!');
    }
  };

  const toggleBookmark = () => {
    setBookmarked (!bookmarked);
  };

  const toggleReminder = () => {
    setReminderSet (!reminderSet);
  };

  const formatFileSize = bytes => {
    return (bytes / 1024 / 1024).toFixed (2);
  };

  const formatDateTime = timestamp => {
    return new Date (timestamp).toLocaleString ();
  };

  return (
    <motion.div
      className="analysis-result-container"
      initial={{opacity: 0, y: 50}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.8}}
    >
      <div className="result-card">
        {/* Header */}
        <motion.div
          className="result-header"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 0.2, duration: 0.8}}
        >
          {/* Progress Bar */}
          <div className="analysis-progress-bar">
            <motion.div
              className="progress-fill"
              initial={{width: 0}}
              animate={{width: `${analysisProgress}%`}}
              transition={{duration: 1.5, ease: 'easeOut'}}
            />
          </div>

          <div className="success-indicator">
            <CheckCircle className="success-icon" />
            <div className="success-text">
              <h2>Analysis Complete!</h2>
              <p>Your blood report has been analyzed successfully</p>
            </div>
          </div>

          <div className="action-buttons">
            <motion.button
              className={`action-btn ${bookmarked ? 'active' : ''}`}
              onClick={toggleBookmark}
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
            >
              <Bookmark className="btn-icon" />
              {bookmarked ? 'Saved' : 'Save'}
            </motion.button>

            <motion.button
              className="action-btn"
              onClick={shareAnalysis}
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
            >
              <Share2 className="btn-icon" />
              Share
            </motion.button>

            <motion.button
              className={`action-btn ${reminderSet ? 'active' : ''}`}
              onClick={toggleReminder}
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
            >
              <Bell className="btn-icon" />
              {reminderSet ? 'Reminder Set' : 'Set Reminder'}
            </motion.button>
          </div>

          <div className="file-summary">
            <div className="summary-item">
              <FileText className="summary-icon" />
              <div>
                <span className="label">File:</span>
                <span className="value">{result.filename}</span>
              </div>
            </div>
            <div className="summary-item">
              <Activity className="summary-icon" />
              <div>
                <span className="label">Size:</span>
                <span className="value">
                  {formatFileSize (result.fileSize)} MB
                </span>
              </div>
            </div>
            <div className="summary-item">
              <Clock className="summary-icon" />
              <div>
                <span className="label">Analyzed:</span>
                <span className="value">
                  {formatDateTime (result.timestamp)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="tab-navigation"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 0.4, duration: 0.8}}
        >
          <button
            className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab ('analysis')}
          >
            <Heart className="tab-icon" />
            Analysis Results
          </button>
          <button
            className={`tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab ('recommendations')}
          >
            <Target className="tab-icon" />
            Recommendations
          </button>
          <button
            className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab ('trends')}
          >
            <TrendingUp className="tab-icon" />
            Health Trends
          </button>
          <button
            className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab ('insights')}
          >
            <BarChart3 className="tab-icon" />
            AI Insights
          </button>
        </motion.div>

        {/* Content */}
        <motion.div
          className="tab-content"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 0.6, duration: 0.8}}
        >
          {activeTab === 'analysis' &&
            <div className="analysis-content">
              <div className="markdown-content">
                <ReactMarkdown>{result.analysis}</ReactMarkdown>
              </div>
            </div>}

          {activeTab === 'recommendations' &&
            <div className="recommendations-content">
              <div className="recommendation-card">
                <div className="recommendation-header">
                  <AlertTriangle className="recommendation-icon" />
                  <h3 className="recommendation-title">High Priority</h3>
                </div>
                <p className="recommendation-description">
                  Consult with your healthcare provider about elevated cholesterol levels and discuss potential treatment options.
                </p>
                <span className="recommendation-priority high">
                  High Priority
                </span>
              </div>

              <div className="recommendation-card">
                <div className="recommendation-header">
                  <Heart className="recommendation-icon" />
                  <h3 className="recommendation-title">Lifestyle Changes</h3>
                </div>
                <p className="recommendation-description">
                  Increase cardiovascular exercise to 150 minutes per week and reduce sodium intake to improve heart health.
                </p>
                <span className="recommendation-priority medium">
                  Medium Priority
                </span>
              </div>

              <div className="recommendation-card">
                <div className="recommendation-header">
                  <Activity className="recommendation-icon" />
                  <h3 className="recommendation-title">Dietary Adjustments</h3>
                </div>
                <p className="recommendation-description">
                  Consider increasing fiber intake and reducing processed foods to support overall metabolic health.
                </p>
                <span className="recommendation-priority low">
                  Low Priority
                </span>
              </div>
            </div>}

          {activeTab === 'trends' &&
            <div className="trends-content">
              <div className="trend-chart">
                <h3>Health Trend Analysis</h3>
                <p className="trend-placeholder">
                  📊 Detailed trend analysis will be available after multiple reports are uploaded
                </p>
              </div>

              <div className="trend-indicators">
                <div className="trend-indicator">
                  <div className="trend-value">95%</div>
                  <div className="trend-label">Overall Health Score</div>
                  <div className="trend-change positive">
                    ↑ 5% from last month
                  </div>
                </div>

                <div className="trend-indicator">
                  <div className="trend-value">12</div>
                  <div className="trend-label">Biomarkers in Range</div>
                  <div className="trend-change neutral">→ No change</div>
                </div>

                <div className="trend-indicator">
                  <div className="trend-value">3</div>
                  <div className="trend-label">Areas of Concern</div>
                  <div className="trend-change negative">
                    ↓ 1 from last month
                  </div>
                </div>
              </div>
            </div>}

          {activeTab === 'insights' &&
            <div className="insights-content">
              <div className="insight-cards">
                <div className="insight-card">
                  <div className="insight-header">
                    <TrendingUp className="insight-icon" />
                    <h3 className="insight-title">Pattern Recognition</h3>
                  </div>
                  <p className="insight-content">
                    AI has identified patterns in your biomarkers that suggest excellent cardiovascular health maintenance.
                  </p>
                  <div className="insight-confidence">
                    <span>Confidence: 92%</span>
                    <div className="confidence-bar">
                      <div className="confidence-fill" style={{width: '92%'}} />
                    </div>
                  </div>
                </div>

                <div className="insight-card">
                  <div className="insight-header">
                    <BarChart3 className="insight-icon" />
                    <h3 className="insight-title">Risk Assessment</h3>
                  </div>
                  <p className="insight-content">
                    Based on current biomarkers, your risk for metabolic syndrome is low with continued healthy lifestyle.
                  </p>
                  <div className="insight-confidence">
                    <span>Confidence: 88%</span>
                    <div className="confidence-bar">
                      <div className="confidence-fill" style={{width: '88%'}} />
                    </div>
                  </div>
                </div>

                <div className="insight-card">
                  <div className="insight-header">
                    <Target className="insight-icon" />
                    <h3 className="insight-title">Personalized Goals</h3>
                  </div>
                  <p className="insight-content">
                    AI recommends focusing on maintaining current iron levels and monitoring B12 for optimal energy levels.
                  </p>
                  <div className="insight-confidence">
                    <span>Confidence: 85%</span>
                    <div className="confidence-bar">
                      <div className="confidence-fill" style={{width: '85%'}} />
                    </div>
                  </div>
                </div>
              </div>
            </div>}
        </motion.div>

        {/* Actions */}
        <motion.div
          className="result-actions"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 0.8, duration: 0.8}}
        >
          <motion.button
            className="action-btn download-btn"
            onClick={downloadAnalysis}
            disabled={isDownloading}
            whileHover={{scale: isDownloading ? 1 : 1.05}}
            whileTap={{scale: isDownloading ? 1 : 0.95}}
          >
            <Download className="btn-icon" />
            {isDownloading ? 'Generating PDF...' : 'Download Analysis'}
          </motion.button>

          <motion.button
            className="action-btn new-analysis-btn"
            onClick={onNewAnalysis}
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
          >
            <RefreshCw className="btn-icon" />
            New Analysis
          </motion.button>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          className="result-disclaimer"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 1, duration: 0.8}}
        >
          <AlertTriangle className="disclaimer-icon" />
          <p>
            <strong>Medical Disclaimer:</strong>
            {' '}
            This AI analysis is for educational and informational
            {' '}
            purposes only. It should not be used as a substitute for professional medical advice,
            {' '}
            diagnosis, or treatment. Always consult with qualified healthcare professionals regarding
            {' '}
            your health concerns.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalysisResult;
