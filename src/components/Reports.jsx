import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Eye, Edit2, ChevronDown, Calendar, User, Tag } from 'lucide-react';

const Reports = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [severityFilter, setSeverityFilter] = useState('All Severity');
  const [expandedReport, setExpandedReport] = useState(null);
  const [showAddReport, setShowAddReport] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);

  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Network Security',
    details: ''
  });

  const [allReports] = useState([
    {
      id: 'SEC-001',
      title: 'Suspicious Network Activity Detected',
      description: 'Unusual traffic patterns detected from external IP addresses attempting to access restricted network segments.',
      agent: 'Agent Smith',
      date: '1/15/2024',
      time: '2 hours ago',
      priority: 'High',
      status: 'Active',
      category: 'Network Security',
      details: 'Multiple failed authentication attempts detected from IP range 192.168.1.0/24. Potential brute force attack in progress. Immediate investigation required.',
      fullDetails: 'A comprehensive security analysis revealed multiple failed authentication attempts originating from the IP range 192.168.1.0/24. The attack pattern suggests a coordinated brute force attempt targeting administrative accounts. Network logs indicate sustained activity over a 6-hour period with escalating frequency. Security protocols have been automatically triggered, and the affected IP range has been temporarily blacklisted. Immediate investigation is recommended to assess potential system compromises and implement additional protective measures.'
    },
    {
      id: 'SEC-002',
      title: 'Malware Detection Alert',
      description: 'Malicious software detected on workstation WS-2024-45. Immediate quarantine initiated.',
      agent: 'Agent Jones',
      date: '1/15/2024',
      time: '4 hours ago',
      priority: 'Critical',
      status: 'New',
      category: 'Endpoint Security',
      details: 'Trojan.Win32.Generic variant detected. File quarantined. System scan in progress.',
      fullDetails: 'Advanced malware analysis identified a sophisticated Trojan.Win32.Generic variant with rootkit capabilities. The malware was attempting to establish persistent backdoor access and exfiltrate sensitive data. Our endpoint protection successfully quarantined the threat before it could execute its payload. Full system forensics are underway to determine the attack vector and assess any potential data exposure. The affected workstation has been isolated from the network pending complete remediation.'
    },
    {
      id: 'SEC-003',
      title: 'Unauthorized Access Attempt',
      description: 'Failed login attempts detected on privileged accounts from unknown location.',
      agent: 'Agent Brown',
      date: '1/14/2024',
      time: '6 hours ago',
      priority: 'Medium',
      status: 'Investigating',
      category: 'Access Control',
      details: 'Geographic anomaly detected. Login attempts from Eastern Europe region.',
      fullDetails: 'Security monitoring systems detected 127 failed login attempts on administrative accounts originating from IP addresses geolocated to Eastern Europe. The attack pattern indicates use of credential stuffing techniques with a dictionary of commonly used passwords. Multi-factor authentication successfully prevented unauthorized access. Investigation is ongoing to determine if these attempts are part of a larger coordinated attack campaign. Additional monitoring has been implemented for all privileged accounts.'
    },
    {
      id: 'SEC-004',
      title: 'Data Breach Investigation Complete',
      description: 'Investigation concluded for reported data breach incident. No sensitive data compromised.',
      agent: 'Agent Davis',
      date: '1/13/2024',
      time: '1 day ago',
      priority: 'Critical',
      status: 'Resolved',
      category: 'Data Protection',
      details: 'Forensic analysis confirmed no data exfiltration occurred. Security measures enhanced.',
      fullDetails: 'Comprehensive forensic investigation has been completed regarding the reported data breach incident. Digital forensics analysis, network traffic examination, and database audit logs confirm that no sensitive data was successfully extracted from our systems. The initial security alert was triggered by unusual database query patterns, which were determined to be legitimate automated backup operations. However, this incident has led to implementation of enhanced monitoring protocols and updated data access controls to prevent future false positives and strengthen our overall security posture.'
    },
    {
      id: 'SEC-005',
      title: 'Phishing Campaign Detected',
      description: 'Large-scale phishing email campaign targeting employee credentials identified and blocked.',
      agent: 'Agent Wilson',
      date: '1/13/2024',
      time: '1 day ago',
      priority: 'High',
      status: 'Active',
      category: 'Email Security',
      details: 'Over 500 malicious emails blocked. User awareness training initiated.',
      fullDetails: 'Our email security systems detected and blocked a sophisticated phishing campaign consisting of over 500 malicious emails designed to harvest employee credentials. The emails impersonated trusted business partners and contained convincing replicas of legitimate login pages. Advanced threat protection successfully identified and quarantined all malicious messages before delivery. Employee awareness training has been immediately deployed to all staff members, and additional email security measures have been implemented to prevent similar attacks.'
    },
    {
      id: 'SEC-006',
      title: 'SQL Injection Attempt Blocked',
      description: 'Automated SQL injection attacks detected and successfully mitigated.',
      agent: 'Agent Taylor',
      date: '1/12/2024',
      time: '2 days ago',
      priority: 'Medium',
      status: 'Resolved',
      category: 'Web Application',
      details: 'Web application firewall blocked multiple injection attempts. Application patched.',
      fullDetails: 'Web application security monitoring detected multiple SQL injection attempts targeting our customer portal database. The attacks used automated tools to probe for vulnerabilities in user input fields. Our web application firewall successfully blocked all injection attempts, preventing any unauthorized database access. Application development team has implemented additional input validation and parameterized queries. A comprehensive security audit of all web applications is scheduled to ensure similar vulnerabilities do not exist elsewhere.'
    }
  ]);

  useEffect(() => {
    setReports(allReports);
    setFilteredReports(allReports.slice(0, visibleCount));
  }, []);

  useEffect(() => {
    filterReports();
  }, [searchTerm, statusFilter, severityFilter, visibleCount]);

  const filterReports = () => {
    let filtered = allReports;

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.agent.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All Status') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    if (severityFilter !== 'All Severity') {
      filtered = filtered.filter(report => report.priority === severityFilter);
    }

    setFilteredReports(filtered.slice(0, visibleCount));
    setShowLoadMore(filtered.length > visibleCount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return { bg: '#fef3c7', color: '#d97706' };
      case 'New': return { bg: '#dbeafe', color: '#2563eb' };
      case 'Resolved': return { bg: '#dcfce7', color: '#16a34a' };
      case 'Investigating': return { bg: '#fef3c7', color: '#ca8a04' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return { bg: '#fef2f2', color: '#dc2626' };
      case 'High': return { bg: '#fef2f2', color: '#ea580c' };
      case 'Medium': return { bg: '#fffbeb', color: '#d97706' };
      case 'Low': return { bg: '#f0f9ff', color: '#0284c7' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const handleAddReport = (e) => {
    e.preventDefault();
    const report = {
      id: `SEC-${String(reports.length + 1).padStart(3, '0')}`,
      ...newReport,
      agent: `${user.firstName} ${user.lastName}`,
      date: new Date().toLocaleDateString(),
      time: 'Just now',
      status: 'New',
      details: newReport.details || newReport.description,
      fullDetails: newReport.details || newReport.description
    };

    const updatedReports = [report, ...allReports];
    setReports(updatedReports);
    setFilteredReports([report, ...filteredReports].slice(0, visibleCount));
    
    setNewReport({
      title: '',
      description: '',
      priority: 'Medium',
      category: 'Network Security',
      details: ''
    });
    setShowAddReport(false);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  const stats = {
    new: allReports.filter(r => r.status === 'New').length,
    active: allReports.filter(r => r.status === 'Active' || r.status === 'Investigating').length,
    resolved: allReports.filter(r => r.status === 'Resolved').length,
    highPriority: allReports.filter(r => r.priority === 'High' || r.priority === 'Critical').length
  };

  return (
    <div className="reports">
      <div className="reports-container">
        <div className="reports-header fade-in">
          <div>
            <h1>Security Reports</h1>
            <p>Monitor and manage security incidents and reports</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid fade-in">
          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-number">{stats.new}</span>
              <span className="stat-label">New Reports</span>
            </div>
            <div className="stat-icon new">📋</div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-number">{stats.active}</span>
              <span className="stat-label">Active Cases</span>
            </div>
            <div className="stat-icon active">⚠️</div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-number">{stats.resolved}</span>
              <span className="stat-label">Resolved</span>
            </div>
            <div className="stat-icon resolved">✅</div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-number">{stats.highPriority}</span>
              <span className="stat-label">High Priority</span>
            </div>
            <div className="stat-icon high">🔺</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="controls-section fade-in">
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search reports, agents, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filters">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option>All Status</option>
              <option>New</option>
              <option>Active</option>
              <option>Investigating</option>
              <option>Resolved</option>
            </select>
            
            <select 
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="filter-select"
            >
              <option>All Severity</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddReport(true)}
            >
              <Plus size={20} />
              Add Report
            </button>
          </div>
        </div>

        {/* Add Report Form */}
        {showAddReport && (
          <div className="add-report-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddReport(false);
          }}>
            <div className="add-report-form fade-in">
              <h3>Add New Security Report</h3>
              <form onSubmit={handleAddReport}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    value={newReport.title}
                    onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                    className="form-input"
                    placeholder="Brief title of the security incident"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={newReport.description}
                    onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                    className="form-input"
                    rows={3}
                    placeholder="Brief description of the incident"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select
                      value={newReport.priority}
                      onChange={(e) => setNewReport({...newReport, priority: e.target.value})}
                      className="form-input"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      value={newReport.category}
                      onChange={(e) => setNewReport({...newReport, category: e.target.value})}
                      className="form-input"
                    >
                      <option>Network Security</option>
                      <option>Endpoint Security</option>
                      <option>Email Security</option>
                      <option>Web Application</option>
                      <option>Data Protection</option>
                      <option>Access Control</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Detailed Information</label>
                  <textarea
                    value={newReport.details}
                    onChange={(e) => setNewReport({...newReport, details: e.target.value})}
                    className="form-input"
                    rows={4}
                    placeholder="Detailed information about the incident, investigation steps, and findings..."
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Create Report</button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowAddReport(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reports List */}
        <div className="reports-list fade-in">
          {filteredReports.map((report, index) => (
            <div key={report.id} className="report-card scale-up" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="report-header">
                <div className="report-badges">
                  <span className="report-id">{report.id}</span>
                  <span 
                    className="badge priority-badge"
                    style={getPriorityColor(report.priority)}
                  >
                    {report.priority}
                  </span>
                  <span 
                    className="badge status-badge"
                    style={getStatusColor(report.status)}
                  >
                    {report.status}
                  </span>
                </div>
                <div className="report-actions">
                  <button className="action-btn">
                    <Eye size={16} />
                    View
                  </button>
                  <button className="action-btn">
                    <Edit2 size={16} />
                    Edit
                  </button>
                </div>
              </div>
              
              <h3 className="report-title">{report.title}</h3>
              <p className="report-description">{report.description}</p>
              
              <div className="report-meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{report.date}</span>
                </div>
                <div className="meta-item">
                  <User size={16} />
                  <span>{report.agent}</span>
                </div>
                <div className="meta-item">
                  <Tag size={16} />
                  <span>{report.category}</span>
                </div>
              </div>
              
              <div className="report-details">
                <p className="details-preview">{report.details}</p>
                <button 
                  className="expand-btn"
                  onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                >
                  <ChevronDown 
                    size={16} 
                    className={`chevron ${expandedReport === report.id ? 'rotated' : ''}`}
                  />
                  {expandedReport === report.id ? 'Show Less' : 'Show More'}
                </button>
                
                {expandedReport === report.id && (
                  <div className="expanded-details slide-in">
                    <div className="details-section">
                      <h4>Full Investigation Details</h4>
                      <p>{report.fullDetails}</p>
                    </div>
                    <div className="details-section">
                      <h4>Timeline</h4>
                      <div className="timeline-item">
                        <span className="timeline-time">{report.time}</span>
                        <span>Report created by {report.agent}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {showLoadMore && (
          <div className="load-more-section">
            <button className="btn btn-outline" onClick={handleLoadMore}>
              Load More Reports
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .reports {
          min-height: calc(100vh - 70px);
          background: #f8fafc;
          padding: 24px 0;
        }
        
        .reports-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        .reports-header {
          margin-bottom: 32px;
        }
        
        .reports-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }
        
        .reports-header p {
          color: #64748b;
          font-size: 16px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .stat-content {
          display: flex;
          flex-direction: column;
        }
        
        .stat-number {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }
        
        .stat-label {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }
        
        .stat-icon {
          font-size: 24px;
          opacity: 0.7;
        }
        
        .controls-section {
          display: flex;
          gap: 20px;
          margin-bottom: 32px;
          align-items: center;
        }
        
        .search-bar {
          position: relative;
          flex: 1;
          max-width: 400px;
        }
        
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
        }
        
        .search-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .filters {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        
        .filter-select {
          padding: 10px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          font-size: 14px;
          min-width: 120px;
          cursor: pointer;
        }
        
        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
        }
        
        .add-report-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .add-report-form {
          background: white;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
        }
        
        .add-report-form h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 24px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }
        
        .reports-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .report-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .report-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .report-badges {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .report-id {
          font-size: 12px;
          font-weight: 700;
          color: #1e3a8a;
          background: #dbeafe;
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        
        .report-actions {
          display: flex;
          gap: 8px;
        }
        
        .action-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .action-btn:hover {
          background: #e2e8f0;
          color: #1e293b;
        }
        
        .report-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
        }
        
        .report-description {
          color: #64748b;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 16px;
        }
        
        .report-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #64748b;
        }
        
        .report-details {
          border-top: 1px solid #e5e7eb;
          padding-top: 16px;
        }
        
        .details-preview {
          font-size: 14px;
          color: #374151;
          margin-bottom: 12px;
        }
        
        .expand-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: #3b82f6;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .expand-btn:hover {
          color: #1d4ed8;
        }
        
        .chevron {
          transition: transform 0.3s ease;
        }
        
        .chevron.rotated {
          transform: rotate(180deg);
        }
        
        .expanded-details {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }
        
        .details-section {
          margin-bottom: 20px;
        }
        
        .details-section h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
        }
        
        .details-section p {
          font-size: 14px;
          color: #374151;
          line-height: 1.6;
        }
        
        .timeline-item {
          display: flex;
          gap: 12px;
          font-size: 13px;
          color: #64748b;
        }
        
        .timeline-time {
          font-weight: 500;
          color: #3b82f6;
        }
        
        .load-more-section {
          text-align: center;
          margin-top: 32px;
        }
        
        @media (max-width: 768px) {
          .reports-container {
            padding: 0 16px;
          }
          
          .reports-header h1 {
            font-size: 24px;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .controls-section {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-bar {
            max-width: none;
          }
          
          .filters {
            justify-content: space-between;
          }
          
          .report-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .report-meta {
            gap: 12px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .filters {
            flex-direction: column;
            gap: 8px;
          }
          
          .filter-select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Reports;