import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  TrendingUp,
  Shield,
  Users,
  Activity
} from 'lucide-react';
import Navbar from './Navbar';
import ReportsChart from './ReportsChart';

const Dashboard = () => {
  const stats = [
    {
      title: 'New Reports',
      value: '500',
      change: '+12%',
      icon: FileText,
      color: 'text-info',
      bgColor: 'bg-info/10'
    },
    {
      title: 'Active Cases',
      value: '269',
      change: '+5%',
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Resolved',
      value: '892',
      change: '+23%',
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Pending',
      value: '98',
      change: '-18%',
      icon: Clock,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    }
  ];

  const recentCases = [
    {
      id: 'SEC-001',
      title: 'Suspicious Network Activity',
      severity: 'High',
      status: 'Active',
      time: '2 hours ago',
      agent: 'Agent Smith'
    },
    {
      id: 'SEC-002',
      title: 'Malware Detection',
      severity: 'Critical',
      status: 'New',
      time: '4 hours ago',
      agent: 'Agent Jones'
    },
    {
      id: 'SEC-003',
      title: 'Unauthorized Access Attempt',
      severity: 'Medium',
      status: 'Investigating',
      time: '6 hours ago',
      agent: 'Agent Brown'
    },
    {
      id: 'SEC-004',
      title: 'Data Breach Alert',
      severity: 'Critical',
      status: 'Resolved',
      time: '1 day ago',
      agent: 'Agent Davis'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'status-critical';
      case 'High': return 'text-destructive';
      case 'Medium': return 'text-warning';
      case 'Low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'status-new';
      case 'Active': return 'status-active';
      case 'Investigating': return 'status-active';
      case 'Resolved': return 'status-resolved';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Security Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage cybersecurity incidents</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover-lift card-hover" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className={`text-xs ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reports Chart */}
          <Card className="animate-scale-in card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Reports Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReportsChart />
            </CardContent>
          </Card>

          {/* Recent Cases */}
          <Card className="animate-scale-in card-hover" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCases.map((case_, index) => (
                  <div key={case_.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{case_.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(case_.severity)}`}>
                          {case_.severity}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{case_.title}</p>
                      <p className="text-xs text-muted-foreground">{case_.agent} • {case_.time}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                      {case_.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10">
                <div className="w-3 h-3 rounded-full bg-success animate-pulse"></div>
                <div>
                  <p className="font-medium text-success">Firewall Status</p>
                  <p className="text-sm text-success/80">Active & Protected</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10">
                <div className="w-3 h-3 rounded-full bg-success animate-pulse"></div>
                <div>
                  <p className="font-medium text-success">Threat Detection</p>
                  <p className="text-sm text-success/80">Monitoring</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10">
                <div className="w-3 h-3 rounded-full bg-warning animate-pulse"></div>
                <div>
                  <p className="font-medium text-warning">System Updates</p>
                  <p className="text-sm text-warning/80">2 Pending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;