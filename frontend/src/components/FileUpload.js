import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, UploadCloud, X, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './FileUpload.css';

const MAX_SIZE_MB = 10;

const FileUpload = ({ onAnalysisStart, onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError('');
    if (fileRejections.length > 0) {
      setError('Only PDF files under 10MB are allowed.');
      return;
    }
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: MAX_SIZE_MB * 1024 * 1024,
    multiple: false,
    onDrop,
  });

  const handleRemove = () => {
    setFile(null);
    setError('');
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setProgress(0);
    if (onAnalysisStart) onAnalysisStart();
    const formData = new FormData();
    formData.append('bloodReport', file);
    try {
      const response = await axios.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
      if (onAnalysisComplete) onAnalysisComplete(response.data);
      toast.success('Analysis complete!');
      setFile(null);
      setProgress(0);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Upload failed. Please try again.'
      );
      toast.error('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <div className="medical-upload-card">
        <div className="upload-header">
          <div className="medical-icon-wrapper">
            <UploadCloud className="upload-icon" />
            <span className="pulse-ring" />
          </div>
          <h2>Upload Your Medical Report</h2>
          <p>Drag & drop your PDF file here, or click to select a file (max 10MB).</p>
        </div>
        <div {...getRootProps({ className: `dropzone${isDragActive ? ' drag-active' : ''}` })}>
          <input {...getInputProps()} />
          <div className="dropzone-icon">
            <FileText size={48} />
          </div>
          <div className="dropzone-text">
            <h3>{isDragActive ? 'Drop the file here...' : 'Drag & drop or click to select'}</h3>
            <p>PDF only. Your data is never stored.</p>
          </div>
        </div>
        {file && (
          <div className="file-preview">
            <div className="file-info-card">
              <div className="file-icon-container">
                <FileText className="file-icon" />
                {progress === 100 && <CheckCircle className="success-icon" />}
              </div>
              <div className="file-details">
                <h4>{file.name}</h4>
                <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <span className="file-type">PDF</span>
              </div>
              <button className="remove-file-btn" onClick={handleRemove} title="Remove file">
                <X />
              </button>
            </div>
            {uploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <span>{progress}%</span>
              </div>
            )}
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
        <div className="action-section">
          <button
            className={`analyze-btn${uploading || !file ? ' disabled' : ''}`}
            onClick={handleUpload}
            disabled={uploading || !file}
          >
            {uploading ? 'Analyzing...' : 'Analyze My Blood Report'}
          </button>
        </div>
        <div className="disclaimer">
          <span className="disclaimer-icon">⚠️</span>
          <p>
            <strong>Privacy:</strong> Your file is processed securely and never stored. Only PDF files under 10MB are accepted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
