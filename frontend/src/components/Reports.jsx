import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search, Plus, Eye, Edit2, Calendar, User, Tag } from 'lucide-react';
import './Reports.css';

const INITIAL_REPORTS = [
  { id: 'SEC-001', title: 'Suspicious Network Activity Detected', description: 'Unusual traffic patterns detected from external IP addresses attempting to access restricted network segments.', agent: 'Agent Smith', date: '1/15/2024', time: '2 hours ago', priority: 'High', status: 'Active', category: 'Network Security', details: 'Multiple failed authentication attempts detected from IP range 192.168.1.0/24. Potential brute force attack in progress. Immediate investigation required.', fullDetails: 'A comprehensive security analysis revealed multiple failed authentication attempts originating from the IP range 192.168.1.0/24. The attack pattern suggests a coordinated brute force attempt targeting administrative accounts.' },
  { id: 'SEC-002', title: 'Malware Detection Alert', description: 'Malicious software detected on workstation WS-2024-45. Immediate quarantine initiated.', agent: 'Agent Jones', date: '1/15/2024', time: '4 hours ago', priority: 'Critical', status: 'New', category: 'Endpoint Security', details: 'Trojan.Win32.Generic variant detected. File quarantined. System scan in progress.', fullDetails: 'Advanced malware analysis identified a sophisticated Trojan.Win32.Generic variant with rootkit capabilities.' },
  { id: 'SEC-003', title: 'Unauthorized Access Attempt', description: 'Failed login attempts detected on privileged accounts from unknown location.', agent: 'Agent Brown', date: '1/14/2024', time: '6 hours ago', priority: 'Medium', status: 'Investigating', category: 'Access Control', details: 'Geographic anomaly detected. Login attempts from Eastern Europe region.', fullDetails: 'Security monitoring systems detected 127 failed login attempts on administrative accounts.' },
  { id: 'SEC-004', title: 'Data Breach Investigation Complete', description: 'Investigation concluded for reported data breach incident. No sensitive data compromised.', agent: 'Agent Davis', date: '1/13/2024', time: '1 day ago', priority: 'Critical', status: 'Resolved', category: 'Data Protection', details: 'Forensic analysis confirmed no data exfiltration occurred. Security measures enhanced.', fullDetails: 'Comprehensive forensic investigation has been completed regarding the reported data breach incident.' },
  { id: 'SEC-005', title: 'Phishing Campaign Detected', description: 'Large-scale phishing email campaign targeting employee credentials identified and blocked.', agent: 'Agent Wilson', date: '1/13/2024', time: '1 day ago', priority: 'High', status: 'Active', category: 'Email Security', details: 'Over 500 malicious emails blocked. User awareness training initiated.', fullDetails: 'Our email security systems detected and blocked a sophisticated phishing campaign consisting of over 500 malicious emails.' },
  { id: 'SEC-001', title: 'Suspicious Network Activity Detected', description: 'Unusual traffic patterns detected from external IP addresses attempting to access restricted network segments.', agent: 'Agent Smith', date: '1/15/2024', time: '2 hours ago', priority: 'High', status: 'Active', category: 'Network Security', details: 'Multiple failed authentication attempts detected from IP range 192.168.1.0/24. Potential brute force attack in progress. Immediate investigation required.', fullDetails: 'A comprehensive security analysis revealed multiple failed authentication attempts originating from the IP range 192.168.1.0/24. The attack pattern suggests a coordinated brute force attempt targeting administrative accounts.' },
  { id: 'SEC-002', title: 'Malware Detection Alert', description: 'Malicious software detected on workstation WS-2024-45. Immediate quarantine initiated.', agent: 'Agent Jones', date: '1/15/2024', time: '4 hours ago', priority: 'Critical', status: 'New', category: 'Endpoint Security', details: 'Trojan.Win32.Generic variant detected. File quarantined. System scan in progress.', fullDetails: 'Advanced malware analysis identified a sophisticated Trojan.Win32.Generic variant with rootkit capabilities.' },
  { id: 'SEC-003', title: 'Unauthorized Access Attempt', description: 'Failed login attempts detected on privileged accounts from unknown location.', agent: 'Agent Brown', date: '1/14/2024', time: '6 hours ago', priority: 'Medium', status: 'Investigating', category: 'Access Control', details: 'Geographic anomaly detected. Login attempts from Eastern Europe region.', fullDetails: 'Security monitoring systems detected 127 failed login attempts on administrative accounts.' },
  { id: 'SEC-004', title: 'Data Breach Investigation Complete', description: 'Investigation concluded for reported data breach incident. No sensitive data compromised.', agent: 'Agent Davis', date: '1/13/2024', time: '1 day ago', priority: 'Critical', status: 'Resolved', category: 'Data Protection', details: 'Forensic analysis confirmed no data exfiltration occurred. Security measures enhanced.', fullDetails: 'Comprehensive forensic investigation has been completed regarding the reported data breach incident.' },
  { id: 'SEC-005', title: 'Phishing Campaign Detected', description: 'Large-scale phishing email campaign targeting employee credentials identified and blocked.', agent: 'Agent Wilson', date: '1/13/2024', time: '1 day ago', priority: 'High', status: 'Active', category: 'Email Security', details: 'Over 500 malicious emails blocked. User awareness training initiated.', fullDetails: 'Our email security systems detected and blocked a sophisticated phishing campaign consisting of over 500 malicious emails.' },
  
  { id: 'SEC-006', title: 'SQL Injection Attempt Blocked', description: 'Automated SQL injection attacks detected and successfully mitigated.', agent: 'Agent Taylor', date: '1/12/2024', time: '2 days ago', priority: 'Medium', status: 'Resolved', category: 'Web Application', details: 'Web application firewall blocked multiple injection attempts. Application patched.', fullDetails: 'Web application security monitoring detected multiple SQL injection attempts targeting our customer portal database.' }
];

const Reports = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [filteredAll, setFilteredAll] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [severityFilter, setSeverityFilter] = useState('All Severity');
  const [expandedReport, setExpandedReport] = useState(null);
  const [showAddReport, setShowAddReport] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Network Security',
    details: ''
  });

  useEffect(() => { setReports(INITIAL_REPORTS); }, []);

  useEffect(() => {
    let filtered = reports;
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      filtered = filtered.filter(r => (r.title + r.description + r.agent + r.id).toLowerCase().includes(t));
    }
    if (statusFilter !== 'All Status') filtered = filtered.filter(r => r.status === statusFilter);
    if (severityFilter !== 'All Severity') filtered = filtered.filter(r => r.priority === severityFilter);

    setFilteredAll(filtered);
    const total = Math.max(1, Math.ceil(filtered.length / pageSize));
    const p = Math.min(Math.max(1, currentPage), total);
    setCurrentPage(p);
    const start = (p - 1) * pageSize;
    setFilteredReports(filtered.slice(start, start + pageSize));
  }, [reports, searchTerm, statusFilter, severityFilter, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredAll.length / pageSize));

  const goToPage = (page) => { const p = Math.max(1, Math.min(totalPages, page)); setCurrentPage(p); };
  const handlePageSizeChange = (e) => { const size = parseInt(e.target.value, 10) || 10; setPageSize(size); setCurrentPage(1); };

  const handleAddReport = (e) => {
    e.preventDefault();
    const agentName = user && (user.firstName || user.lastName) ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Unknown';
    const report = { id: `SEC-${String(reports.length + 1).padStart(3, '0')}`, ...newReport, agent: agentName, date: new Date().toLocaleDateString(), time: 'Just now', status: 'New', details: newReport.details || newReport.description, fullDetails: newReport.details || newReport.description };
    setReports(prev => [report, ...prev]);
    setNewReport({ title: '', description: '', priority: 'Medium', category: 'Network Security', details: '' });
    setShowAddReport(false);
    setCurrentPage(1);
  };

  const stats = {
    new: reports.filter(r => r.status === 'New').length,
    active: reports.filter(r => r.status === 'Active' || r.status === 'Investigating').length,
    resolved: reports.filter(r => r.status === 'Resolved').length,
    highPriority: reports.filter(r => r.priority === 'High' || r.priority === 'Critical').length
  };

  return (
    <div className="reports">
      <div className="reports-container">
        <div className="reports-header fade-in"><div><h1>Security Reports</h1><p>Monitor and manage security incidents and reports</p></div></div>

        <div className="stats-grid fade-in">
          <div className="stat-card"><div className="stat-content"><span className="stat-number">{stats.new}</span><span className="stat-label">New Reports</span></div><div className="stat-icon new">📋</div></div>
          <div className="stat-card"><div className="stat-content"><span className="stat-number">{stats.active}</span><span className="stat-label">Active Cases</span></div><div className="stat-icon active">⚠️</div></div>
          <div className="stat-card"><div className="stat-content"><span className="stat-number">{stats.resolved}</span><span className="stat-label">Resolved</span></div><div className="stat-icon resolved">✅</div></div>
          <div className="stat-card"><div className="stat-content"><span className="stat-number">{stats.highPriority}</span><span className="stat-label">High Priority</span></div><div className="stat-icon high">🔺</div></div>
        </div>

        <div className="controls-section fade-in">
          <div className="search-bar"><Search size={20} className="search-icon" /><input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search reports, agents, or descriptions..." className="search-input" /></div>
          <div className="filters">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="filter-select"><option>All Status</option><option>New</option><option>Active</option><option>Investigating</option><option>Resolved</option></select>
            <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="filter-select"><option>All Severity</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select>
            <button className="btn btn-primary" onClick={() => setShowAddReport(true)}><Plus size={20} /> Add Report</button>
          </div>
        </div>

        {showAddReport && (
          <div className="add-report-overlay" onClick={e => { if (e.target === e.currentTarget) setShowAddReport(false); }}>
            <div className="add-report-form fade-in">
              <h3>Add New Security Report</h3>
              <form onSubmit={handleAddReport}>
                <div className="form-group"><label className="form-label">Title</label><input required value={newReport.title} onChange={e => setNewReport({...newReport, title: e.target.value})} className="form-input" /></div>
                <div className="form-group"><label className="form-label">Description</label><textarea required value={newReport.description} onChange={e => setNewReport({...newReport, description: e.target.value})} className="form-input" rows={3} /></div>
                <div className="form-row"><div className="form-group"><label className="form-label">Priority</label><select value={newReport.priority} onChange={e => setNewReport({...newReport, priority: e.target.value})} className="form-input"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div>
                <div className="form-group"><label className="form-label">Category</label><select value={newReport.category} onChange={e => setNewReport({...newReport, category: e.target.value})} className="form-input"><option>Network Security</option><option>Endpoint Security</option><option>Email Security</option><option>Web Application</option><option>Data Protection</option><option>Access Control</option></select></div></div>
                <div className="form-group"><label className="form-label">Detailed Information</label><textarea value={newReport.details} onChange={e => setNewReport({...newReport, details: e.target.value})} className="form-input" rows={4} /></div>
                <div className="form-actions"><button className="btn btn-primary" type="submit">Create Report</button><button type="button" className="btn btn-secondary" onClick={() => setShowAddReport(false)}>Cancel</button></div>
              </form>
            </div>
          </div>
        )}

        <div className="reports-list fade-in">
          {filteredReports.map((report, index) => (
            <div key={report.id} className="report-card scale-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="report-header"><div className="report-badges"><span className="report-id">{report.id}</span><span className="badge priority-badge" style={{ background: '#fffbeb', color: '#d97706' }}>{report.priority}</span><span className="badge status-badge" style={{ background: '#fef3c7', color: '#d97706' }}>{report.status}</span></div><div className="report-actions"><button className="action-btn" onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}><Eye size={16} /> View</button><button className="action-btn"><Edit2 size={16} /> Edit</button></div></div>
              <h3 className="report-title">{report.title}</h3>
              <p className="report-description">{report.description}</p>
              <div className="report-meta"><div className="meta-item"><Calendar size={16} /><span>{report.date}</span></div><div className="meta-item"><User size={16} /><span>{report.agent}</span></div><div className="meta-item"><Tag size={16} /><span>{report.category}</span></div></div>
              <div className="report-details">
                <p className="details-preview">{report.details}</p>
                {expandedReport === report.id && (
                  <div className="expanded-details slide-in">
                    <div className="details-section"><h4>Full Investigation Details</h4><p>{report.fullDetails}</p></div>
                    <div className="details-section"><h4>Timeline</h4><div className="timeline-item"><span className="timeline-time">{report.time}</span><span>Report created by {report.agent}</span></div></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pagination-section">
          <div className="pagination-controls" role="navigation" aria-label="Pagination">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className={`inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:shadow-md ${currentPage === 1 ? 'opacity-50' : ''}`} aria-label="Previous page">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => goToPage(p)} aria-current={p === currentPage ? 'page' : undefined} className={`inline-flex items-center justify-center w-10 h-10 rounded-md border text-sm font-semibold mx-0.5 ${p === currentPage ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>{p}</button>
            ))}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className={`inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:shadow-md ${currentPage === totalPages ? 'opacity-50' : ''}`} aria-label="Next page">›</button>
          </div>
          <div className="page-size-select"><label className="mr-2 text-sm text-gray-600">Show</label><select value={pageSize} onChange={handlePageSizeChange} className="px-2 py-1 border rounded-md text-sm font-semibold border-gray-200 bg-white"><option value={5}>5</option><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option></select><span className="ml-2 text-sm text-gray-600">per page</span></div>
        </div>
      </div>

  {/* styles moved to Reports.css */}
    </div>
  );
};

Reports.propTypes = { user: PropTypes.shape({ firstName: PropTypes.string, lastName: PropTypes.string }) };

export default Reports;