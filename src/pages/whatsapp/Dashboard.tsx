import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Send, 
  CheckCheck, 
  Eye, 
  XCircle,
  TrendingUp,
  Users,
  MessageCircle,
  Star,
  Download,
  Filter,
  X,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';

// Types
interface Campaign {
  id: string;
  phoneNumberId?: string;
  name: string;
  date: string;
  stats: {
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    responseRate: number;
  };
  status: 'Active' | 'Completed' | 'Draft';
}

interface PhoneNumber {
  id: string;
  display_name: string;
  phone_number: string;
  quality_rating: 'High' | 'Medium' | 'Low';
  status: 'Connected' | 'Pending' | 'Offline';
}

// StatCard Component
const StatCard: React.FC<{
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  subtext?: string;
}> = ({ title, value, trend, icon, subtext }) => {
  return (
    <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h3>
        </div>
        <div className="p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm text-emerald-600">
          {icon}
        </div>
      </div>
      {(trend !== undefined || subtext) && (
        <div className="mt-4 flex items-center text-xs relative z-10">
          {trend !== undefined && (
            <div className="flex items-center font-bold mr-3">
              {trend > 0 ? (
                <>
                  <TrendingUp className="w-3 h-3 text-emerald-600 mr-1" />
                  <span className="text-emerald-700">{Math.abs(trend)}%</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 text-slate-400 mr-1" />
                  <span className="text-slate-500">0%</span>
                </>
              )}
            </div>
          )}
          {subtext && (
            <span className="text-slate-400 font-medium ml-auto truncate max-w-[120px]">{subtext}</span>
          )}
        </div>
      )}
    </div>
  );
};

// Mock Data
const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: '1', phoneNumberId: '1', name: 'Summer Sale Blast', date: '2023-10-15', status: 'Completed', stats: { sent: 12500, delivered: 12100, read: 9800, failed: 400, responseRate: 15 } },
  { id: '2', phoneNumberId: '2', name: 'Abandoned Cart Recovery', date: '2023-10-18', status: 'Active', stats: { sent: 450, delivered: 445, read: 320, failed: 5, responseRate: 42 } },
  { id: '3', phoneNumberId: '1', name: 'Black Friday Teaser', date: '2023-10-20', status: 'Active', stats: { sent: 5000, delivered: 4800, read: 1200, failed: 200, responseRate: 8 } },
  { id: '4', phoneNumberId: '2', name: 'Loyalty Rewards', date: '2023-10-22', status: 'Draft', stats: { sent: 0, delivered: 0, read: 0, failed: 0, responseRate: 0 } },
  { id: '5', phoneNumberId: '1', name: 'Holiday Greetings', date: '2023-10-25', status: 'Active', stats: { sent: 8500, delivered: 8400, read: 7200, failed: 100, responseRate: 25 } },
];

const INITIAL_NUMBERS: PhoneNumber[] = [
  { id: '1', display_name: 'Main Support', phone_number: '+1 (555) 010-9999', quality_rating: 'High', status: 'Connected' },
  { id: '2', display_name: 'Marketing Line', phone_number: '+44 20 7123 4567', quality_rating: 'Medium', status: 'Connected' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [campaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [numbers] = useState<PhoneNumber[]>(INITIAL_NUMBERS);
  const [filterPhone, setFilterPhone] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterCampaignId, setFilterCampaignId] = useState<string>('all');

  const handleConnectWABA = () => {
    if (!user || !user.id) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to connect your WhatsApp Business Account',
        variant: 'destructive',
      });
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    const userId = user.id;
    window.location.href = `${backendUrl}/auth/facebook?user_id=${userId}`;
  };

  // Filter Logic
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      const matchesPhone = filterPhone === 'all' || c.phoneNumberId === filterPhone;
      const matchesDate = !filterDate || c.date === filterDate;
      const matchesCampaign = filterCampaignId === 'all' || c.id === filterCampaignId;
      return matchesPhone && matchesDate && matchesCampaign;
    });
  }, [campaigns, filterPhone, filterDate, filterCampaignId]);

  // Computed Stats
  const totalSent = filteredCampaigns.reduce((acc, c) => acc + c.stats.sent, 0);
  const totalDelivered = filteredCampaigns.reduce((acc, c) => acc + c.stats.delivered, 0);
  const totalRead = filteredCampaigns.reduce((acc, c) => acc + c.stats.read, 0);
  const totalFailed = filteredCampaigns.reduce((acc, c) => acc + c.stats.failed, 0);
  const readRate = totalSent ? Math.round((totalRead / totalSent) * 100) : 0;

  // Chart Data
  const pieData = [
    { name: 'Read', value: totalRead, color: '#10b981' },
    { name: 'Delivered', value: totalDelivered - totalRead, color: '#059669' },
    { name: 'Failed', value: totalFailed, color: '#ef4444' },
  ];

  const barData = filteredCampaigns.map(c => ({
    name: c.name,
    Read: c.stats.read,
    Delivered: c.stats.delivered,
    Failed: c.stats.failed,
    ResponseRate: c.stats.responseRate
  }));

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ fill?: string; color?: string; name: string; value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100">
          <p className="text-slate-900 font-bold mb-2 text-sm">{label}</p>
          {payload.map((entry, index: number) => (
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

  const clearFilters = () => {
    setFilterPhone('all');
    setFilterDate('');
    setFilterCampaignId('all');
  };

  const hasFilters = filterPhone !== 'all' || filterDate !== '' || filterCampaignId !== 'all';

  const handleDownloadReport = () => {
    const headers = ['Campaign Name', 'Date', 'Status', 'Sent', 'Delivered', 'Read', 'Failed', 'Response Rate'];
    const rows = filteredCampaigns.map(c => [
      c.name, c.date, c.status, c.stats.sent, c.stats.delivered, c.stats.read, c.stats.failed, `${c.stats.responseRate}%`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `waba_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans">
      {/* Sticky Combined Header & Filters */}
      {/* <header className="px-4 md:px-8 pt-4 md:pt-6 pb-4 bg-slate-50 sticky top-0 z-50 shadow-sm"> */}
      <header
  className="
    px-4 md:px-8 pt-4 md:pt-6 pb-4
    sticky top-0 z-50
    shadow-sm
    bg-white/40
    backdrop-blur-md
    border-b border-slate-200/60
    transition-all mb-3
  "
  style={{
    // Optional: fallback for browsers that don't support backdrop-filter
    background: 'rgba(255,255,255,0.40)',
    WebkitBackdropFilter: 'blur(20px)',
    backdropFilter: 'blur(12px)',
  }}
>
        {/* Combined Title & Filters Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-md">
          {/* Title on Left, Filters on Right */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left Side: Title */}
            <div className="flex items-center gap-3">
              <MessageSquare className="text-green-500 w-7 h-7" />
              <div>
                <h1 className="text-xl font-bold text-slate-800">WABA Analytics</h1>
                <p className="text-slate-500 text-xs mt-0.5">Real-time WhatsApp Business performance insights</p>
              </div>
            </div>

            {/* Right Side: Filters */}
            <div className="flex flex-col gap-2">
              {/* Clear Filters Button */}
              {hasFilters && (
                <div className="flex justify-end">
                  <button 
                    onClick={clearFilters}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Filters Row */}
              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-700">Filters:</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Phone Number</label>
                  <select
                    value={filterPhone}
                    onChange={(e) => setFilterPhone(e.target.value)}
                    title="All Numbers"
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all min-w-[120px]"
                  >
                    <option value="all">All Numbers</option>
                    {numbers.map(num => (
                      <option key={num.id} value={num.id}>{num.display_name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Campaign</label>
                  <select
                    value={filterCampaignId}
                    onChange={(e) => setFilterCampaignId(e.target.value)}
                    title="All Campaigns"
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all min-w-[120px]"
                  >
                    <option value="all">All Campaigns</option>
                    {campaigns.map(camp => (
                      <option key={camp.id} value={camp.id}>{camp.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Date</label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    title="dd/mm/yyyy"
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all min-w-[120px]"
                  />
                </div>

                <button
                  onClick={handleDownloadReport}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-8 pb-8 w-full">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard
            title="Total Sent"
            value={totalSent.toLocaleString()}
            trend={12}
            icon={<Send className="w-5 h-5" />}
            subtext="This month"
          />
          <StatCard
            title="Delivered"
            value={totalDelivered.toLocaleString()}
            trend={8}
            icon={<CheckCheck className="w-5 h-5" />}
            subtext="Success rate"
          />
          <StatCard
            title="Read Rate"
            value={`${readRate}%`}
            trend={15}
            icon={<Eye className="w-5 h-5" />}
            subtext="Engagement"
          />
          <StatCard
            title="Failed"
            value={totalFailed.toLocaleString()}
            icon={<XCircle className="w-5 h-5" />}
            subtext="Error tracking"
          />
        </div>

        

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
          
          {/* Bar Chart */}
          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  Campaign Performance
                </h3>
                <p className="text-slate-500 text-xs mt-1">Delivery breakdown per campaign</p>
              </div>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 30, left: 0, bottom: 0 }} barCategoryGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#f1f5f9'}} />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                  <Bar dataKey="Delivered" fill="#34d399" radius={[4, 4, 0, 0]} barSize={28} />
                  <Bar dataKey="Read" fill="#059669" radius={[4, 4, 0, 0]} barSize={28} />
                  <Bar dataKey="Failed" fill="#f87171" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
            <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-emerald-600" />
              Total Volume
            </h3>
            <p className="text-slate-500 text-xs mb-2">Delivery status distribution</p>
            <div className="flex-1 min-h-[100px] relative">
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
                <div className="text-3xl font-bold text-slate-800">{totalSent > 1000 ? (totalSent/1000).toFixed(1) + 'k' : totalSent}</div>
                <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Sent</div>
              </div>
            </div>
          </div>

          {/* Area Chart */}
          <div className="xl:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  Engagement Trends
                </h3>
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

        {/* Campaign Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Campaign Details</h3>
              <p className="text-slate-500 text-xs mt-1">Complete message tracking overview</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Sent</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Delivered</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Read</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Failed</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-800">{campaign.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{campaign.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${
                        campaign.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                        campaign.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-800">{campaign.stats.sent.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-emerald-600">{campaign.stats.delivered.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-blue-600">{campaign.stats.read.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-rose-600">{campaign.stats.failed.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-slate-800">{campaign.stats.responseRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCampaigns.length === 0 && (
            <div className="p-12 text-center">
              <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-slate-900 font-bold text-sm mb-1">No campaigns found</h3>
              <p className="text-slate-400 text-xs">Try adjusting your filters</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}