import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Calendar,
  User
} from 'lucide-react';
import Navbar from './Navbar';
import AddReportForm from './AddReportForm';
import EditReportForm from './EditReportForm';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [expandedReport, setExpandedReport] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  const initialReports = [
    {
      id: 'SEC-001',
      title: 'Suspicious Network Activity Detected',
      description: 'Unusual traffic patterns detected from external IP addresses attempting to access restricted network segments.',
      fullDescription: 'Our network monitoring systems have identified abnormal traffic patterns originating from multiple external IP addresses. The activity shows characteristics of reconnaissance behavior, with attempted connections to restricted network segments containing sensitive government data. The attack vectors include port scanning, vulnerability probing, and attempted SQL injection attacks. Immediate containment measures have been implemented.',
      severity: 'High',
      status: 'Active',
      date: '2024-01-15',
      agent: 'Agent Smith',
      category: 'Network Security',
      affectedSystems: ['Web Server', 'Database Server', 'Firewall'],
      recommendations: ['Implement additional firewall rules', 'Increase monitoring frequency', 'Update security patches']
    },
    {
      id: 'SEC-002',
      title: 'Malware Detection on Executive Workstation',
      description: 'Advanced persistent threat detected on high-privilege user workstation in executive division.',
      fullDescription: 'A sophisticated malware sample has been identified on a workstation belonging to a high-level executive. The malware exhibits characteristics of advanced persistent threats (APT) with capabilities for data exfiltration, keylogging, and lateral movement. The infection vector appears to be a spear-phishing email with a malicious attachment. The workstation has been isolated and is undergoing forensic analysis.',
      severity: 'Critical',
      status: 'New',
      date: '2024-01-15',
      agent: 'Agent Jones',
      category: 'Malware',
      affectedSystems: ['Executive Workstation', 'Email Server'],
      recommendations: ['Complete system rebuild', 'Password reset for affected user', 'Enhanced email filtering']
    },
    {
      id: 'SEC-003',
      title: 'Unauthorized Access Attempt',
      description: 'Multiple failed login attempts detected on critical infrastructure systems.',
      fullDescription: 'Security monitoring has detected a series of failed authentication attempts targeting critical infrastructure control systems. The attempts show patterns consistent with credential stuffing attacks using previously compromised credentials. The source IPs have been traced to multiple geographic locations, suggesting a coordinated attack. Multi-factor authentication successfully prevented unauthorized access.',
      severity: 'Medium',
      status: 'Investigating',
      date: '2024-01-14',
      agent: 'Agent Brown',
      category: 'Access Control',
      affectedSystems: ['SCADA Systems', 'Authentication Server'],
      recommendations: ['Review access logs', 'Strengthen password policies', 'Implement geofencing']
    },
    {
      id: 'SEC-004',
      title: 'Data Breach Alert - Classified Information',
      description: 'Potential unauthorized access to classified document repository detected.',
      fullDescription: 'An investigation has been initiated following alerts from our data loss prevention system indicating potential unauthorized access to classified documents. The breach appears to involve insider threat activity with legitimate credentials being used outside normal operating hours. Document access patterns and file transfer logs are being analyzed to determine the scope of the potential breach.',
      severity: 'Critical',
      status: 'Resolved',
      date: '2024-01-13',
      agent: 'Agent Davis',
      category: 'Data Protection',
      affectedSystems: ['Document Management System', 'File Server'],
      recommendations: ['Implement additional access controls', 'Enhanced user behavior analytics', 'Regular security awareness training']
    },
    {
      id: 'SEC-005',
      title: 'DDoS Attack on Public Portal',
      description: 'Distributed denial of service attack targeting citizen services portal.',
      fullDescription: 'A large-scale distributed denial of service attack has been launched against our public citizen services portal. The attack utilizes a botnet of compromised IoT devices generating over 100 Gbps of malicious traffic. Traffic analysis shows the attack is targeting specific application endpoints. DDoS mitigation services have been activated and are successfully filtering malicious traffic.',
      severity: 'High',
      status: 'Active',
      date: '2024-01-12',
      agent: 'Agent Wilson',
      category: 'Network Security',
      affectedSystems: ['Public Portal', 'Load Balancers', 'CDN'],
      recommendations: ['Scale DDoS protection', 'Implement rate limiting', 'Monitor for follow-up attacks']
    },
    {
      id: 'SEC-006',
      title: 'Phishing Campaign Targeting Staff',
      description: 'Coordinated phishing campaign detected targeting government employees.',
      fullDescription: 'Intelligence sources have identified a sophisticated phishing campaign specifically targeting government employees. The emails appear to originate from trusted government partners and contain malicious links designed to harvest credentials. The campaign shows high levels of social engineering with personalized content suggesting prior reconnaissance. Email security filters have been updated to block known indicators.',
      severity: 'Medium',
      status: 'Resolved',
      date: '2024-01-11',
      agent: 'Agent Miller',
      category: 'Social Engineering',
      affectedSystems: ['Email System', 'User Workstations'],
      recommendations: ['Conduct phishing awareness training', 'Implement additional email security', 'Regular security briefings']
    }
  ];

  const [reports, setReports] = useState(initialReports);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Critical': return <AlertTriangle className="w-4 h-4" />;
      case 'High': return <AlertTriangle className="w-4 h-4" />;
      case 'Medium': return <Clock className="w-4 h-4" />;
      case 'Low': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-destructive text-destructive-foreground';
      case 'High': return 'bg-destructive/80 text-destructive-foreground';
      case 'Medium': return 'bg-warning text-warning-foreground';
      case 'Low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-info text-info-foreground';
      case 'Active': return 'bg-warning text-warning-foreground';
      case 'Investigating': return 'bg-warning text-warning-foreground';
      case 'Resolved': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.agent.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || report.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSeverity = filterSeverity === 'all' || report.severity.toLowerCase() === filterSeverity.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const displayedReports = showMore ? filteredReports : filteredReports.slice(0, 4);

  const handleAddReport = (newReport) => {
    const report = {
      ...newReport,
      id: `SEC-${String(reports.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      agent: 'Current User'
    };
    setReports([report, ...reports]);
    setIsAddDialogOpen(false);
  };

  const handleEditReport = (updatedReport) => {
    setReports(reports.map(report => 
      report.id === updatedReport.id ? updatedReport : report
    ));
    setIsEditDialogOpen(false);
    setEditingReport(null);
  };

  const openEditDialog = (report) => {
    setEditingReport(report);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Security Reports</h1>
          <p className="text-muted-foreground">Monitor and manage security incidents and reports</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up">
          <Card className="hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-info/10 rounded-lg">
                  <FileText className="w-5 h-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {reports.filter(r => r.status === 'New').length}
                  </p>
                  <p className="text-sm text-muted-foreground">New Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {reports.filter(r => r.status === 'Active' || r.status === 'Investigating').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {reports.filter(r => r.status === 'Resolved').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {reports.filter(r => r.severity === 'Critical' || r.severity === 'High').length}
                  </p>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="animate-scale-in">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search reports, agents, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary-hover">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Security Report</DialogTitle>
                    </DialogHeader>
                    <AddReportForm onSubmit={handleAddReport} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          {displayedReports.map((report, index) => (
            <Card key={report.id} className="animate-fade-in hover-lift card-hover" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        {report.id}
                      </Badge>
                      <Badge className={getSeverityColor(report.severity)}>
                        {getSeverityIcon(report.severity)}
                        {report.severity}
                      </Badge>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {expandedReport === report.id ? 'Hide' : 'View'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(report)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {report.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {report.description}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(report.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {report.agent}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {report.category}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedReport === report.id && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-4 animate-fade-in">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Full Description</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {report.fullDescription}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Affected Systems</h4>
                        <div className="flex flex-wrap gap-2">
                          {report.affectedSystems?.map((system, idx) => (
                            <Badge key={idx} variant="secondary">
                              {system}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Recommendations</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {report.recommendations?.map((rec, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground">
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show More Button */}
        {filteredReports.length > 4 && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setShowMore(!showMore)}
              className="hover-lift"
            >
              {showMore ? 'Show Less' : `Show More Reports (${filteredReports.length - 4} remaining)`}
            </Button>
          </div>
        )}

        {/* Edit Report Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Security Report</DialogTitle>
            </DialogHeader>
            {editingReport && (
              <EditReportForm 
                report={editingReport} 
                onSubmit={handleEditReport}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Reports;