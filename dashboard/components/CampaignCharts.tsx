import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { Campaign } from '../types';

interface CampaignChartsProps {
  campaigns: Campaign[];
}

export const CampaignCharts: React.FC<CampaignChartsProps> = ({ campaigns }) => {
  
  // Aggregate data for Pie Chart
  const totalStats = campaigns.reduce((acc, curr) => ({
    sent: acc.sent + curr.stats.sent,
    delivered: acc.delivered + curr.stats.delivered,
    read: acc.read + curr.stats.read,
    failed: acc.failed + curr.stats.failed
  }), { sent: 0, delivered: 0, read: 0, failed: 0 });

  // Modern Corporate Green Palette
  const pieData = [
    { name: 'Read', value: totalStats.read, color: '#10b981' }, // Emerald-500
    { name: 'Delivered', value: totalStats.delivered - totalStats.read, color: '#059669' }, // Emerald-600
    { name: 'Failed', value: totalStats.failed, color: '#ef4444' }, // Red-500
  ];

  const barData = campaigns.map(c => ({
    name: c.name,
    Read: c.stats.read,
    Delivered: c.stats.delivered,
    Failed: c.stats.failed,
    ResponseRate: c.stats.responseRate
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100">
          <p className="text-slate-900 font-bold mb-2 text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.fill || entry.color }} className="text-xs font-semibold flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ background: entry.fill || entry.color }}></span>
              {entry.name}: {entry.value}{entry.name === 'ResponseRate' ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 mt-6">
      
      {/* Bar Chart */}
      <div className="xl:col-span-2 glass-panel rounded-2xl p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-base font-bold text-slate-800">Campaign Performance</h3>
                <p className="text-slate-500 text-xs mt-1">Delivery breakdown per campaign</p>
            </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#f1f5f9'}} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
              <Bar dataKey="Delivered" fill="#34d399" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="Read" fill="#059669" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="Failed" fill="#f87171" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="glass-panel rounded-2xl p-6 bg-white flex flex-col relative overflow-hidden">
        
        <h3 className="text-base font-bold text-slate-800 mb-1 relative z-10">Total Volume</h3>
        <p className="text-slate-500 text-xs mb-4 relative z-10">Delivery status distribution</p>
        
        <div className="flex-1 min-h-[250px] relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
             <div className="text-3xl font-bold text-slate-800">{totalStats.sent > 1000 ? (totalStats.sent/1000).toFixed(1) + 'k' : totalStats.sent}</div>
             <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Sent</div>
          </div>
        </div>
      </div>

       {/* Area Chart - Response Rates */}
       <div className="xl:col-span-3 glass-panel rounded-2xl p-6 bg-white">
        <div className="flex justify-between items-end mb-6">
            <div>
                <h3 className="text-base font-bold text-slate-800">Engagement Trends</h3>
                <p className="text-slate-500 text-xs mt-1">Response rate velocity</p>
            </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis unit="%" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="ResponseRate" 
                stroke="#059669" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorResponse)" 
                name="Response Rate"
                dot={{ fill: '#059669', stroke: '#fff', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};