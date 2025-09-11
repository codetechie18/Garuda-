import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Map from './Map';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    newReports: 500,
    activeCases: 269,
    resolved: 892,
    pending: 98
  });

  const [chartData] = useState([
    { name: 'Resolved', value: 892, color: '#10b981' },
    { name: 'Active', value: 269, color: '#f59e0b' },
    { name: 'New', value: 500, color: '#3b82f6' },
    { name: 'Pending', value: 98, color: '#ef4444' }
  ]);

  
  const [recentCases] = useState([
    {
      id: 'SEC-001',
      title: 'Suspicious Network Activity',
      agent: 'Agent Smith',
      time: '2 hours ago',
      priority: 'High',
      status: 'Active'
    },
    {
      id: 'SEC-002',
      title: 'Malware Detection',
      agent: 'Agent Jones',
      time: '4 hours ago',
      priority: 'Critical',
      status: 'New'
    },
    {
      id: 'SEC-003',
      title: 'Unauthorized Access Attempt',
      agent: 'Agent Brown',
      time: '6 hours ago',
      priority: 'Medium',
      status: 'Investigating'
    },
    {
      id: 'SEC-004',
      title: 'Data Breach Alert',
      agent: 'Agent Davis',
      time: '1 day ago',
      priority: 'Critical',
      status: 'Resolved'
    }
  ]);

  useEffect(() => {
    // Animate counters
    const animateCounters = () => {
      const counters = document.querySelectorAll('.stat-number');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
          if (current < target) {
            current += increment;
            counter.textContent = Math.ceil(current);
            setTimeout(updateCounter, 20);
          } else {
            counter.textContent = target;
          }
        };
        
        updateCounter();
      });
    };
    
    setTimeout(animateCounters, 300);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#d97706';
      case 'Low': return '#0284c7';
      default: return '#6b7280';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header fade-in">
          <div>
            <h1>Security Dashboard</h1>
            <p>Monitor and manage cybersecurity incidents</p>
          </div>
          <div className="dashboard-time">
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid fade-in">
          <div className="stat-card scale-up">
            <div className="stat-icon new">
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <h3>New Reports</h3>
              <div className="stat-number" data-target="500">0</div>
              <span className="stat-change positive">+12% from last month</span>
            </div>
          </div>

          <div className="stat-card scale-up">
            <div className="stat-icon active">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-content">
              <h3>Active Cases</h3>
              <div className="stat-number" data-target="269">0</div>
              <span className="stat-change positive">+5% from last month</span>
            </div>
          </div>

          <div className="stat-card scale-up">
            <div className="stat-icon resolved">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>Resolved</h3>
              <div className="stat-number" data-target="892">0</div>
              <span className="stat-change positive">+23% from last month</span>
            </div>
          </div>

          <div className="stat-card scale-up">
            <div className="stat-icon pending">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>Pending</h3>
              <div className="stat-number" data-target="98">0</div>
              <span className="stat-change negative">-18% from last month</span>
            </div>
          </div>
        </div>

          

        {/* Charts Section */}
        <div className="charts-section fade-in">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Reports Overview</h3>
              <p>Distribution of security reports by status</p>
            </div>
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                {chartData.map((item, index) => (
                  <div key={index} className="legend-item">
                    <div 
                      className="legend-color" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full map card placed after Reports */}
          <div className="chart-card full-map-card">
            <div className="chart-header">
              <h3>Incident Map</h3>
              <p>Geographical distribution of incidents</p>
            </div>
            <div className="map-card-body">
              <Map points={[
                { lat: 28.6139, lng: 77.2090, title: 'New Delhi', count: 12 },
                { lat: 19.0760, lng: 72.8777, title: 'Mumbai', count: 8 },
                { lat: 12.9716, lng: 77.5946, title: 'Bangalore', count: 6 },
              ]} />
            </div>
          </div>

        </div>
         {/* Recent Cases */}
        <div className="recent-cases card fade-in">
          <div className="section-header">
            <h3>Recent Cases</h3>
            <span className="cases-count">{recentCases.length} active cases</span>
          </div>
          <div className="cases-list">
            {recentCases.map((case_, index) => (
              <div key={case_.id} className="case-item slide-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="case-info">
                  <div className="case-header">
                    <span className="case-id">{case_.id}</span>
                    <div className="case-badges">
                      <span 
                        className="badge priority-badge"
                        style={{ 
                          backgroundColor: `${getPriorityColor(case_.priority)}20`,
                          color: getPriorityColor(case_.priority)
                        }}
                      >
                        {case_.priority}
                      </span>
                      <span className={`badge status-${case_.status.toLowerCase()}`}>
                        {case_.status}
                      </span>
                    </div>
                  </div>
                  <h4 className="case-title">{case_.title}</h4>
                  <div className="case-meta">
                    <span className="case-agent">{case_.agent}</span>
                    <span className="case-time">{case_.time}</span>
                  </div>
                </div>
               
              </div>
            ))}
          </div>
        </div>
</div>
      <style >{`
        .dashboard {
          min-height: calc(100vh - 70px);
          background: #f8fafc;
          padding: 24px 0;
        }
        
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        
        .dashboard-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }
        
        .dashboard-header p {
          color: #64748b;
          font-size: 16px;
        }
        
        .dashboard-time {
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }
        
        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .stat-icon.new { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
        .stat-icon.active { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .stat-icon.resolved { background: linear-gradient(135deg, #10b981, #059669); }
        .stat-icon.pending { background: linear-gradient(135deg, #ef4444, #dc2626); }
        
        .stat-content {
          flex: 1;
        }
        
        .stat-content h3 {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 4px;
        }
        
        .stat-number {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }
        
        .stat-change {
          font-size: 12px;
          font-weight: 600;
        }
        
        .stat-change.positive { color: #10b981; }
        .stat-change.negative { color: #ef4444; }
        
        .charts-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        
        .chart-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        /* ensure map card sits below the navbar and doesn't overlap */
        .full-map-card {
          margin-top: 0; /* keep natural flow */
          position: relative;
          z-index: 1; /* lower stacking context than navbar */
        }
        
        .chart-header {
          margin-bottom: 24px;
        }
        
        .chart-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }
        
        .chart-header p {
          color: #64748b;
          font-size: 14px;
        }
        
        .pie-chart-container {
          position: relative;
        }

        /* Leaflet container adjustments to prevent overlap with sticky navbar */
        .map-card-body {
          height: 360px;
          overflow: hidden;
          margin-top: 8px;
        }

        /* Leaflet's own container should be below navbar's z-index */
        .leaflet-container {
          z-index: 0 !important;
          position: relative;
        }
        
        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 16px;
          flex-wrap: wrap;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }
        
        .recent-cases {
          padding: 24px;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .section-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }
        
        .cases-count {
          background: #f1f5f9;
          color: #64748b;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .cases-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .case-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        
        .case-item:hover {
          background: white;
          border-color: #3b82f6;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
        }
        
        .case-info {
          flex: 1;
        }
        
        .case-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .case-id {
          font-size: 12px;
          font-weight: 600;
          color: #1e3a8a;
          background: #dbeafe;
          padding: 2px 8px;
          border-radius: 4px;
        }
        
        .case-badges {
          display: flex;
          gap: 8px;
        }
        
        .priority-badge {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 600;
        }
        
        .status-active { background: #fef3c7; color: #d97706; }
        .status-new { background: #dbeafe; color: #2563eb; }
        .status-investigating { background: #fef3c7; color: #ca8a04; }
        .status-resolved { background: #dcfce7; color: #16a34a; }
        
        .case-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
        }
        
        .case-meta {
          display: flex;
          gap: 16px;
          font-size: 14px;
          color: #64748b;
        }
        
        .case-actions {
          margin-left: 16px;
        }
        
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 0 16px;
          }
          
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .dashboard-header h1 {
            font-size: 24px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .charts-section {
            grid-template-columns: 1fr;
          }
          
          .case-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .case-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;