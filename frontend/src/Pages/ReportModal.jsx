import React, { useState, useEffect } from 'react';

const ReportModal = ({ report, onClose }) => {
  const [formData, setFormData] = useState({
    reportType: 'platform_violation',
    description: '',
    urgency: 'medium',
    additionalEvidence: '',
    reporterName: '',
    reporterContact: ''
  });

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Mock submission - Replace with actual API call
    const reportData = {
      originalReport: report,
      reportDetails: formData,
      submittedAt: new Date().toISOString()
    };
    
    console.log('Report submitted:', reportData);
    
    // TODO: Replace this with actual API call
    // Example: 
    // try {
    //   const response = await fetch('/api/reports', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(reportData)
    //   });
    //   if (response.ok) {
    //     alert('Report submitted successfully');
    //     onClose();
    //   }
    // } catch (error) {
    //   console.error('Report submission failed:', error);
    // }
    
    alert('Report submitted successfully! (Check console for details)');
    onClose();
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="modal-content report-modal">
        <div className="modal-header">
          <h2 id="report-modal-title">Submit Report</h2>
          <button 
            className="modal-close"
            onClick={onClose}
            aria-label="Close report modal"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="report-modal__summary">
            <h3>Reporting Post</h3>
            <div className="report-summary">
              <div><strong>Platform:</strong> {report.platform}</div>
              <div><strong>User:</strong> {report.user.name} ({report.user.username})</div>
              <div><strong>Location:</strong> {report.location.lat}, {report.location.lng}</div>
              <div><strong>Severity:</strong> {report.toxicitySeverity}</div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reportType">Report Type</label>
            <select 
              id="reportType"
              name="reportType" 
              value={formData.reportType}
              onChange={handleInputChange}
              required
            >
              <option value="platform_violation">Platform Policy Violation</option>
              <option value="legal_concern">Legal Concern</option>
              <option value="safety_threat">Safety Threat</option>
              <option value="harassment">Harassment</option>
              <option value="hate_speech">Hate Speech</option>
              <option value="spam">Spam/Scam</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="urgency">Urgency Level</label>
            <select 
              id="urgency"
              name="urgency" 
              value={formData.urgency}
              onChange={handleInputChange}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide additional details about why this post should be reported..."
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="additionalEvidence">Additional Evidence</label>
            <textarea 
              id="additionalEvidence"
              name="additionalEvidence"
              value={formData.additionalEvidence}
              onChange={handleInputChange}
              placeholder="Links to related posts, screenshots, or other supporting information..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reporterName">Your Name</label>
            <input 
              type="text"
              id="reporterName"
              name="reporterName"
              value={formData.reporterName}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reporterContact">Contact Information</label>
            <input 
              type="email"
              id="reporterContact"
              name="reporterContact"
              value={formData.reporterContact}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="modal-footer">
            <button type="submit" className="modal-button modal-button--primary">
              Submit Report
            </button>
            <button 
              type="button" 
              className="modal-button modal-button--secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;