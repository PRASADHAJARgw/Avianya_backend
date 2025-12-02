import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  MessageSquare, 
  Users, 
  Zap, 
  AlertTriangle,
  Send,
  Eye,
  Smile,
  MessageCircle,
  BarChart3,
  Globe,
  Bell,
  Filter,
  Calendar,
  Download,
  Search,
  X,
  ArrowLeft,
  Smartphone,
  Link2,
  CheckCircle2,
  Loader2,
  Building2,
  CreditCard,
  Wallet,
  Receipt,
  ChevronRight
} from 'lucide-react';
import { Campaign, PhoneNumber, WABAStatus } from './types';
import { StatCard } from './components/StatCard';
import { CampaignCharts } from './components/CampaignCharts';
import { NumberManager } from './components/NumberManager';

// Mock Data
const INITIAL_NUMBERS: PhoneNumber[] = [
  { id: '1', display_name: 'Main Support', phone_number: '+1 (555) 010-9999', quality_rating: 'High', status: 'Connected' },
  { id: '2', display_name: 'Marketing Line', phone_number: '+44 20 7123 4567', quality_rating: 'Medium', status: 'Connected' },
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: '1', phoneNumberId: '1', name: 'Summer Sale Blast', date: '2023-10-15', status: 'Completed', stats: { sent: 12500, delivered: 12100, read: 9800, failed: 400, responseRate: 15 } },
  { id: '2', phoneNumberId: '2', name: 'Abandoned Cart Recovery', date: '2023-10-18', status: 'Active', stats: { sent: 450, delivered: 445, read: 320, failed: 5, responseRate: 42 } },
  { id: '3', phoneNumberId: '1', name: 'Black Friday Teaser', date: '2023-10-20', status: 'Active', stats: { sent: 5000, delivered: 4800, read: 1200, failed: 200, responseRate: 8 } },
  { id: '4', phoneNumberId: '2', name: 'Loyalty Rewards', date: '2023-10-22', status: 'Draft', stats: { sent: 0, delivered: 0, read: 0, failed: 0, responseRate: 0 } },
  { id: '5', phoneNumberId: '1', name: 'Holiday Greetings', date: '2023-10-25', status: 'Active', stats: { sent: 8500, delivered: 8400, read: 7200, failed: 100, responseRate: 25 } },
];

const WABA_STATUS_DATA: WABAStatus = {
  healthStatus: 'Healthy',
  quotaLimit: '100K Conversations',
  currency: 'USD',
  balance: 1450.00,
  qualityScore: 98,
  messagingLimitTier: 'Tier 3'
};

// --- Setup Component ---
const SetupWizard = ({ onComplete }: { onComplete: () => void }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [wabaId, setWabaId] = useState('');
    const [businessName, setBusinessName] = useState('');
  
    const handleConnect = (e: React.FormEvent) => {
      e.preventDefault();
      if(!wabaId || !businessName) return;
      
      setIsLoading(true);
      // Simulate API connection delay
      setTimeout(() => {
          setIsLoading(false);
          onComplete();
      }, 1500);
    };
  
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-50">
         
         <div className="glass-panel w-full max-w-md p-8 rounded-3xl shadow-lg relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white">
             
             <div className="text-center mb-8">
                 <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 mx-auto mb-6 transform rotate-3">
                    <MessageSquare className="text-white w-8 h-8" />
                 </div>
                 <h1 className="text-2xl font-bold text-slate-800 mb-2">Connect WABA</h1>
                 <p className="text-slate-500 text-sm">Link your WhatsApp Business Account to access real-time analytics and campaign tools.</p>
             </div>
  
             <form onSubmit={handleConnect} className="space-y-5">
                 <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Business Name</label>
                     <div className="relative group">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                             <Building2 className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                         </div>
                         <input 
                             type="text" 
                             required
                             placeholder="e.g. Acme Corp" 
                             value={businessName}
                             onChange={(e) => setBusinessName(e.target.value)}
                             className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                         />
                     </div>
                 </div>
  
                 <div className="space-y-1.5">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">WABA ID</label>
                     <div className="relative group">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                             <CheckCircle2 className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                         </div>
                         <input 
                             type="text" 
                             required
                             placeholder="e.g. 1038472938472" 
                             value={wabaId}
                             onChange={(e) => setWabaId(e.target.value)}
                             className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm font-mono text-sm"
                         />
                     </div>
                 </div>
  
                 <button 
                     type="submit" 
                     disabled={isLoading}
                     className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                 >
                     {isLoading ? (
                         <>
                             <Loader2 className="w-5 h-5 animate-spin" />
                             Connecting...
                         </>
                     ) : (
                         <>
                             <Link2 className="w-5 h-5" />
                             Connect Account
                         </>
                     )}
                 </button>
             </form>
             
             <div className="mt-8 text-center">
                 <p className="text-xs text-slate-400">
                     By connecting, you agree to our <a href="#" className="underline hover:text-emerald-600">Terms of Service</a>.
                 </p>
             </div>
         </div>
      </div>
    )
  }

export default function App() {
  const [isSetup, setIsSetup] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings'>('dashboard');
  const [campaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [numbers, setNumbers] = useState<PhoneNumber[]>(INITIAL_NUMBERS);
  
  // Settings State
  const [currency, setCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Filter States
  const [filterPhone, setFilterPhone] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterCampaignId, setFilterCampaignId] = useState<string>('all');

  const handleAddNumber = (num: PhoneNumber) => {
    setNumbers([...numbers, num]);
  };

  const handleDeleteNumber = (id: string) => {
    setNumbers(numbers.filter(n => n.id !== id));
  };

  const handleDisconnect = () => {
      // Reset app state
      setIsSetup(false);
      setCurrentView('dashboard');
      // In a real app, you would clear data here
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

  // Computed Totals based on Filtered Data
  const totalSent = filteredCampaigns.reduce((acc, c) => acc + c.stats.sent, 0);
  const totalRead = filteredCampaigns.reduce((acc, c) => acc + c.stats.read, 0);
  const readRate = totalSent ? Math.round((totalRead / totalSent) * 100) : 0;
  
  // Dynamic stats simulation based on filtered count
  const dailyActiveUsers = Math.floor(2340 * (filteredCampaigns.length / campaigns.length) || 0); 
  const totalMessagesExchanged = Math.floor(45200 * (filteredCampaigns.length / campaigns.length) || 0);
  const csatScore = 4.8;

  // Currency Symbol Helper
  const getCurrencySymbol = (curr: string) => {
    switch(curr) {
        case 'EUR': return '€';
        case 'GBP': return '£';
        case 'INR': return '₹';
        default: return '$';
    }
  };

  const currentCurrencySymbol = getCurrencySymbol(currency);

  // Download Report Function
  const handleDownloadReport = () => {
    const headers = ['Campaign Name', 'Date', 'Status', 'Sent', 'Delivered', 'Read', 'Failed', 'Response Rate'];
    const rows = filteredCampaigns.map(c => [
      c.name,
      c.date,
      c.status,
      c.stats.sent,
      c.stats.delivered,
      c.stats.read,
      c.stats.failed,
      `${c.stats.responseRate}%`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `waba_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setFilterPhone('all');
    setFilterDate('');
    setFilterCampaignId('all');
  };

  const hasFilters = filterPhone !== 'all' || filterDate !== '' || filterCampaignId !== 'all';

  if (!isSetup) {
      return <SetupWizard onComplete={() => setIsSetup(true)} />;
  }

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900 bg-slate-50">
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative max-w-7xl mx-auto w-full">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
                <MessageSquare className="text-white w-6 h-6" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                {currentView === 'dashboard' ? 'Business Overview' : 'WABA Settings'}
                </h2>
                <p className="text-slate-500 text-sm mt-0.5 font-medium">
                {currentView === 'dashboard' ? 'Real-time analytics & reporting' : 'Manage your WhatsApp Business Account'}
                </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
             <div className="hidden md:block text-right">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Balance</div>
                <div className="text-lg font-bold text-emerald-700 font-mono tracking-tight">{currentCurrencySymbol}{WABA_STATUS_DATA.balance.toFixed(2)}</div>
             </div>
             
             <div className="flex items-center gap-3">
                 {/* Settings Toggle Button */}
                 <button 
                    onClick={() => setCurrentView(currentView === 'dashboard' ? 'settings' : 'dashboard')}
                    className={`w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center transition-all ${
                        currentView === 'settings' 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                        : 'bg-white text-emerald-600 hover:bg-slate-50 hover:shadow-md'
                    }`}
                    title={currentView === 'dashboard' ? "Settings" : "Back to Dashboard"}
                 >
                    {currentView === 'dashboard' ? <Settings className="w-5 h-5" /> : <LayoutDashboard className="w-5 h-5" />}
                 </button>

                 <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-emerald-600 hover:bg-slate-50 hover:shadow-md transition-all">
                    <Bell className="w-4 h-4" />
                 </button>
                 <div className="w-10 h-10 rounded-full bg-emerald-600 shadow-md flex items-center justify-center text-white font-bold text-xs cursor-pointer border-2 border-white">
                     JD
                 </div>
             </div>
          </div>
        </header>

        {currentView === 'dashboard' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Filter Bar */}
            <div className="glass-panel rounded-2xl p-3 flex flex-col lg:flex-row gap-3 justify-between items-center shadow-sm z-20 relative bg-white">
                <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
                    
                    {/* Phone Filter */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Users className="h-4 w-4 text-emerald-500" />
                        </div>
                        <select 
                            value={filterPhone}
                            onChange={(e) => setFilterPhone(e.target.value)}
                            className="w-full md:w-48 pl-9 pr-8 py-2 bg-slate-50 border-transparent hover:bg-white hover:border-emerald-200 border rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-200 focus:outline-none appearance-none transition-all cursor-pointer"
                        >
                            <option value="all">All Numbers</option>
                            {numbers.map(n => (
                                <option key={n.id} value={n.id}>{n.display_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Campaign Filter */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-emerald-500" />
                        </div>
                        <select 
                             value={filterCampaignId}
                             onChange={(e) => setFilterCampaignId(e.target.value)}
                             className="w-full md:w-48 pl-9 pr-8 py-2 bg-slate-50 border-transparent hover:bg-white hover:border-emerald-200 border rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-200 focus:outline-none appearance-none transition-all cursor-pointer"
                        >
                            <option value="all">All Campaigns</option>
                            {campaigns.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date Filter */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-emerald-500" />
                        </div>
                        <input 
                            type="date" 
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="w-full md:w-auto pl-9 pr-4 py-2 bg-slate-50 border-transparent hover:bg-white hover:border-emerald-200 border rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all cursor-pointer"
                        />
                    </div>

                    {hasFilters && (
                        <button 
                            onClick={clearFilters}
                            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-500 rounded-lg text-sm font-medium transition-all"
                        >
                            <X className="w-3.5 h-3.5" />
                            Clear
                        </button>
                    )}
                </div>

                <div className="w-full lg:w-auto flex justify-end">
                    <button 
                        onClick={handleDownloadReport}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-md shadow-emerald-200 transition-all hover:-translate-y-0.5"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Export Data
                    </button>
                </div>
            </div>

            {/* WABA Status Summary */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row shadow-sm gap-8 items-center bg-white">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-600">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-800">Account Status</h3>
                        <p className="text-slate-500 text-xs font-medium">Meta Business ID: 89342738</p>
                    </div>
                </div>
                <div className="h-10 w-px bg-slate-200 hidden md:block"></div>
                <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Platform</div>
                        <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Operational
                        </div>
                    </div>
                    <div>
                         <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Msg Quota</div>
                         <div className="text-sm font-bold text-slate-700">{WABA_STATUS_DATA.quotaLimit}</div>
                    </div>
                    <div>
                         <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Quality</div>
                         <div className="text-sm font-bold text-emerald-700">{WABA_STATUS_DATA.qualityScore}/100</div>
                    </div>
                    <div>
                         <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tier</div>
                         <div className="text-sm font-bold text-slate-700">{WABA_STATUS_DATA.messagingLimitTier}</div>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                        title="Messages Sent" 
                        value={totalSent.toLocaleString()} 
                        trend={12.5} 
                        icon={<Send />} 
                        colorClass="bg-emerald-500" 
                        subtext="Outbound volume"
                    />
                    <StatCard 
                        title="Read Rate" 
                        value={`${readRate}%`} 
                        trend={2.1} 
                        icon={<Eye />} 
                        colorClass="bg-teal-500"
                        subtext="Target: 85%" 
                    />
                     <StatCard 
                        title="CSAT Score" 
                        value={csatScore} 
                        trend={5.4} 
                        icon={<Smile />} 
                        colorClass="bg-emerald-600"
                        subtext="Based on feedback" 
                    />
                    <StatCard 
                        title="Active Users" 
                        value={dailyActiveUsers.toLocaleString()} 
                        trend={8.2} 
                        icon={<Users />} 
                        colorClass="bg-teal-600"
                        subtext="Daily unique" 
                    />
                    <StatCard 
                        title="Total Volume" 
                        value={totalMessagesExchanged.toLocaleString()} 
                        icon={<MessageCircle />} 
                        colorClass="bg-green-600"
                        subtext="Inbound + Outbound" 
                    />
                    <StatCard 
                        title="Active Campaigns" 
                        value={filteredCampaigns.filter(c => c.status === 'Active').length} 
                        icon={<Zap />} 
                        colorClass="bg-emerald-400" 
                    />
                </div>
            </div>

            {/* Charts */}
            <CampaignCharts campaigns={filteredCampaigns} />

            {/* Campaigns Table */}
            <div className="glass-panel rounded-2xl overflow-hidden shadow-sm bg-white">
                <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center">
                    <h3 className="text-base font-bold text-slate-800">
                        {hasFilters ? 'Filtered Campaigns' : 'Recent Campaigns'}
                    </h3>
                    <div className="flex gap-2">
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded">
                            {filteredCampaigns.length} results
                        </span>
                    </div>
                </div>
                {filteredCampaigns.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">Campaign</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Sent</th>
                                    <th className="px-4 py-3 text-right">Open Rate</th>
                                    <th className="px-4 py-3 text-right">Response Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredCampaigns.map((c) => {
                                    const openRate = c.stats.delivered > 0 ? ((c.stats.read / c.stats.delivered) * 100).toFixed(1) : '0.0';
                                    return (
                                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-700 text-sm">{c.name}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">{c.date}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${
                                                    c.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    c.status === 'Completed' ? 'bg-teal-50 text-teal-600 border-teal-100' :
                                                    'bg-slate-50 text-slate-500 border-slate-200'
                                                }`}>
                                                    <span className={`w-1 h-1 rounded-full ${
                                                        c.status === 'Active' ? 'bg-emerald-500 animate-pulse' :
                                                        c.status === 'Completed' ? 'bg-teal-500' :
                                                        'bg-slate-400'
                                                    }`}></span>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right font-medium text-slate-600 text-sm">{c.stats.sent.toLocaleString()}</td>
                                            <td className="px-4 py-4 text-right">
                                                <span className="font-bold text-slate-700 text-sm">{openRate}%</span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className="font-bold text-slate-700 text-sm">{c.stats.responseRate}%</span>
                                                    <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${c.stats.responseRate}%`}}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-500">
                        <Filter className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                        <h3 className="text-base font-bold text-slate-700">No campaigns found</h3>
                        <p className="text-sm">Try adjusting your filters.</p>
                        <button onClick={clearFilters} className="mt-3 text-emerald-600 text-sm font-bold hover:underline">Clear Filters</button>
                    </div>
                )}
            </div>

          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
             {/* Settings Header */}
             <div className="glass-panel rounded-2xl p-8 shadow-sm bg-white">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200/50">
                        <Settings className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">General Settings</h3>
                        <p className="text-slate-500">Manage your WABA account configuration</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Business Account ID</div>
                        <div className="font-mono text-slate-700 font-bold">1038472938472</div>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Timezone</div>
                        <div className="font-medium text-slate-700">America/New_York (EST)</div>
                    </div>
                </div>
             </div>

             {/* Billing & Payment Section */}
             <div className="glass-panel rounded-2xl p-8 shadow-sm bg-white">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200/50">
                        <Wallet className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Billing & Payment</h3>
                        <p className="text-slate-500">Manage currency, payment methods, and invoices</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   
                   {/* Left Column: Preferences */}
                   <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Payment Currency</label>
                            <div className="relative">
                                <select 
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="USD">USD ($) - US Dollar</option>
                                    <option value="EUR">EUR (€) - Euro</option>
                                    <option value="GBP">GBP (£) - British Pound</option>
                                    <option value="INR">INR (₹) - Indian Rupee</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                                    <ChevronRight className="w-4 h-4 rotate-90" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Updating currency will reflect across all dashboard metrics.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Payment Method</label>
                            <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-emerald-200 hover:bg-slate-50 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-white text-[10px] font-bold tracking-widest">VISA</div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-800">Visa ending in 4242</div>
                                        <div className="text-xs text-slate-500">Expires 12/25</div>
                                    </div>
                                </div>
                                <button className="text-emerald-600 text-sm font-bold group-hover:underline">Change</button>
                            </div>
                            <button className="mt-3 text-sm font-bold text-slate-500 flex items-center gap-2 hover:text-emerald-600 transition-colors">
                                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">+</span>
                                Add new payment method
                            </button>
                        </div>

                        <div>
                             <label className="block text-sm font-bold text-slate-700 mb-2">Billing Address</label>
                             <textarea 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                                rows={3}
                                defaultValue="123 Innovation Drive, Suite 400&#10;San Francisco, CA 94107&#10;United States"
                             ></textarea>
                        </div>
                   </div>

                   {/* Right Column: Invoices */}
                   <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Receipt className="w-4 h-4 text-emerald-500" />
                            Recent Invoices
                        </h4>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                            <Download className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-800">Invoice #INV-2023-00{i}</div>
                                            <div className="text-[10px] text-slate-500">Oct {25 - i}, 2023 • {currentCurrencySymbol}250.00</div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Paid</div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 text-xs font-bold text-slate-500 hover:text-emerald-600 border border-dashed border-slate-300 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                            View All Invoices
                        </button>
                   </div>
                </div>
             </div>

             {/* Phone Number Management Section */}
             <NumberManager 
                numbers={numbers} 
                onAddNumber={handleAddNumber} 
                onDeleteNumber={handleDeleteNumber}
            />

            {/* Danger Zone */}
            <div className="glass-panel rounded-2xl p-6 shadow-sm border border-rose-100 bg-rose-50/30">
                <h3 className="text-base font-bold text-rose-700 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Danger Zone
                </h3>
                <p className="text-sm text-slate-500 mb-4">Actions here cannot be undone.</p>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-sm font-bold hover:bg-rose-50 transition-colors">
                        Reset Analytics Data
                    </button>
                    <button 
                        onClick={handleDisconnect}
                        className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 transition-colors"
                    >
                        Disconnect Account
                    </button>
                </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}