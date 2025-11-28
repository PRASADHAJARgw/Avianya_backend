import React from 'react';

// Dummy KPI data
const kpis = [
  { label: 'Messages Sent', value: 1200 },
  { label: 'Active Users', value: 350 },
  { label: 'Conversion Rate', value: '8.2%' },
];

const DemoDashboard: React.FC = () => (
  <div className="p-8 space-y-8">
    {/* KPI Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-700">{kpi.label}</span>
          <span className="text-3xl font-bold text-primary mt-2">{kpi.value}</span>
        </div>
      ))}
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Donut Chart */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
        <span className="font-semibold mb-4">Donut Chart</span>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="#e5e7eb" />
          <path d="M60 60 L60 10 A50 50 0 1 1 20.6 89.1 Z" fill="#3b82f6" />
          <circle cx="60" cy="60" r="30" fill="#fff" />
        </svg>
      </div>
      {/* Line Chart */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
        <span className="font-semibold mb-4">Line Chart</span>
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
  </div>
);

export default DemoDashboard;
