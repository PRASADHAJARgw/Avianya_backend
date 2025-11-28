import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Dummy WhatsApp KPI data
  const kpis = [
    { label: 'Total Sent', value: 1200 },
    { label: 'Total Delivered', value: 1100 },
    { label: 'Read', value: 950 },
    { label: 'Failed', value: 50 }
  ];

  // Dummy table data
  const tableData = [
    { customer: 'User 1', sent: 300, delivered: 290, read: 250, failed: 10 },
    { customer: 'User 2', sent: 400, delivered: 390, read: 370, failed: 10 },
    { customer: 'User 3', sent: 500, delivered: 420, read: 400, failed: 80 },
    { customer: 'User 4', sent: 200, delivered: 200, read: 180, failed: 0 }
  ];

  const handleConnectWABA = () => {
    // Check if user is authenticated
    if (!user || !user.id) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to connect your WhatsApp Business Account',
        variant: 'destructive',
      });
      return;
    }

    // Use environment variable or default to localhost
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    
    // Pass the authenticated user's ID to the OAuth flow
    const userId = user.id;
    window.location.href = `${backendUrl}/auth/facebook?user_id=${userId}`;
    
    console.log('Initiating WABA OAuth for user:', userId);
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg-dark-primary)] text-[var(--text-primary)] flex flex-col items-center">
      <div className="w-full flex flex-col items-center">
        <div className="flex items-center justify-between w-full max-w-7xl mt-6 mb-2 px-4">
          <h1 className="font-bold text-2xl">WhatsApp KPI Dashboard</h1>
          <button
            onClick={handleConnectWABA}
            className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Connect WABA
          </button>
        </div>
      </div>
      {/* Skeleton Loader */}
      {showSkeleton && (
        <div id="skeletonLoader" className="w-full max-w-7xl">
          <div className="kpi-cards flex justify-around flex-wrap mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton skeleton-kpi"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="skeleton skeleton-chart"></div>
            ))}
          </div>
        </div>
      )}
      {/* Dashboard Content */}
      {showDashboard && (
        <div id="dashboardContent" className="w-full max-w-7xl">
          {/* KPI Cards */}
          <div className="kpi-cards flex justify-around flex-wrap mb-6" id="kpiPanel">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="kpi">
                <h2>{kpi.value}</h2>
                <p>{kpi.label}</p>
              </div>
            ))}
          </div>
          {/* Filter Controls */}
          <div className="filter-controls flex flex-wrap justify-center items-end gap-4 mb-8 p-4 bg-[var(--bg-dark-secondary)] rounded-xl shadow">
            <div className="filter-group flex flex-col">
              <label className="mb-1">Filter by Customer:</label>
              <select className="bg-[var(--bg-dark-secondary)] text-[var(--text-primary)] border border-[var(--box-border)] rounded px-2 py-1">
                <option>All</option>
              </select>
            </div>
            <button className="bg-[var(--accent-primary)] text-white px-4 py-2 rounded">Apply Filters</button>
          </div>
          {/* Chart Placeholders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="min-h-[350px] bg-[var(--bg-dark-secondary)] rounded-xl shadow mb-4 flex flex-col items-center justify-center">
              <span className="font-semibold mb-2">Donut Chart (Dummy)</span>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="#e5e7eb" />
                <path d="M60 60 L60 10 A50 50 0 1 1 20.6 89.1 Z" fill="#3b82f6" />
                <circle cx="60" cy="60" r="30" fill="#fff" />
              </svg>
            </div>
            <div className="min-h-[350px] bg-[var(--bg-dark-secondary)] rounded-xl shadow mb-4 flex flex-col items-center justify-center">
              <span className="font-semibold mb-2">Line Chart (Dummy)</span>
              <svg width="180" height="100" viewBox="0 0 180 100">
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  points="0,80 30,60 60,70 90,40 120,50 150,30 180,60"
                />
                <line x1="0" y1="80" x2="180" y2="80" stroke="#e5e7eb" strokeWidth="2" />
              </svg>
            </div>
          </div>
          {/* Data Table */}
          <div className="table-header-container flex justify-between items-center mt-10 mb-2 text-[var(--box-border)]">
            <h2 className="text-lg font-semibold">WhatsApp User Message Overview</h2>
            <button className="bg-[var(--accent-primary)] text-white px-4 py-2 rounded">Download Summary</button>
          </div>
          <table className="w-full border-collapse bg-[var(--bg-dark-secondary)] text-[var(--text-primary)] rounded-xl shadow overflow-hidden">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Sent</th>
                <th>Delivered</th>
                <th>Read</th>
                <th>Failed</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={idx}>
                  <td className="text-center">{row.customer}</td>
                  <td className="text-center">{row.sent}</td>
                  <td className="text-center">{row.delivered}</td>
                  <td className="text-center">{row.read}</td>
                  <td className="text-center">{row.failed}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination mt-4 text-center">Page 1 of 1</div>
        </div>
      )}
    </div>
  );
}