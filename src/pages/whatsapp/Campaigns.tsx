import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { 
  Send, 
  Plus, 
  RefreshCw, 
  Upload, 
  FileSpreadsheet, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  StopCircle,
  Play,
  Pause,
  Trash2,
  Eye,
  Download,
  
  Users,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface Template {
  id: string;
  tempid?: string;
  temp_title?: string;
  name?: string;
  category?: string;
  status?: string;
  variables?: string[];
}

interface Campaign {
  id: string;
  name: string;
  template_id: string;
  template_name: string;
  status: 'Draft' | 'Active' | 'Paused' | 'Completed' | 'Stopped';
  total_recipients: number;
  sent: number;
  delivered: number;
  failed: number;
  created_at: string;
  updated_at: string;
}

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Create Campaign Form State
  const [campaignName, setCampaignName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<Record<string, string | number>[]>([]);
  const [creating, setCreating] = useState(false);

  // Fetch campaigns
  const fetchCampaigns = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setCampaigns(data || []);
    } catch (err) {
      console.error('Fetch campaigns error:', err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  // Fetch templates
  const fetchTemplates = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch('http://localhost:8080/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setTemplates(data || []);
    } catch (err) {
      console.error('Fetch templates error:', err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchCampaigns();
      fetchTemplates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Handle Excel file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFile(file);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, string | number>[];
        
        setExcelData(jsonData);
        console.log('Excel data loaded:', jsonData);
      } catch (err) {
        console.error('Error parsing Excel:', err);
        setError('Failed to parse Excel file');
      }
    };
    
    reader.readAsBinaryString(file);
  };

  // Download sample Excel template
  const downloadSampleTemplate = () => {
    const sampleData = [
      { phone_number: '+1234567890', variable1: 'John', variable2: 'Doe', variable3: 'Sample' },
      { phone_number: '+0987654321', variable1: 'Jane', variable2: 'Smith', variable3: 'Example' },
    ];
    
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Recipients');
    XLSX.writeFile(wb, 'campaign_template_sample.xlsx');
  };

  // Create Campaign
  const handleCreateCampaign = async () => {
    if (!campaignName || !selectedTemplate || !excelFile || excelData.length === 0) {
      setError('Please fill all fields and upload a valid Excel file');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('http://localhost:8080/campaigns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          name: campaignName,
          template_id: selectedTemplate,
          recipients: excelData,
        }),
      });

      if (!response.ok) throw new Error('Failed to create campaign');

      const result = await response.json();
      console.log('Campaign created:', result);
      
      // Reset form
      setCampaignName('');
      setSelectedTemplate('');
      setExcelFile(null);
      setExcelData([]);
      setShowCreateModal(false);
      
      // Refresh campaigns
      fetchCampaigns();
    } catch (err) {
      console.error('Create campaign error:', err);
      setError(String(err));
    } finally {
      setCreating(false);
    }
  };

  // Send Campaign
  const handleSendCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/campaigns/${campaignId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });

      if (!response.ok) throw new Error('Failed to send campaign');

      fetchCampaigns();
    } catch (err) {
      console.error('Send campaign error:', err);
      setError(String(err));
    }
  };

  // Stop Campaign
  const handleStopCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/campaigns/${campaignId}/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });

      if (!response.ok) throw new Error('Failed to stop campaign');

      fetchCampaigns();
    } catch (err) {
      console.error('Stop campaign error:', err);
      setError(String(err));
    }
  };

  // Pause Campaign
  const handlePauseCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/campaigns/${campaignId}/pause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });

      if (!response.ok) throw new Error('Failed to pause campaign');

      fetchCampaigns();
    } catch (err) {
      console.error('Pause campaign error:', err);
      setError(String(err));
    }
  };

  // Delete Campaign
  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const response = await fetch(`http://localhost:8080/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });

      if (!response.ok) throw new Error('Failed to delete campaign');

      fetchCampaigns();
    } catch (err) {
      console.error('Delete campaign error:', err);
      setError(String(err));
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusMap = {
      'Draft': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: <Clock className="w-3 h-3" /> },
      'Active': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: <Play className="w-3 h-3" /> },
      'Paused': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: <Pause className="w-3 h-3" /> },
      'Completed': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <CheckCircle className="w-3 h-3" /> },
      'Stopped': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <StopCircle className="w-3 h-3" /> },
    };
    const style = statusMap[status] || statusMap['Draft'];
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}>
        {style.icon}
        {status}
      </span>
    );
  };

  // Calculate stats
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
  const totalSent = campaigns.reduce((sum, c) => sum + (c.sent || 0), 0);
  const totalRecipients = campaigns.reduce((sum, c) => sum + (c.total_recipients || 0), 0);

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans">
      {/* Glassmorphism Header */}
      <header
        className="px-4 md:px-8 pt-4 md:pt-6 pb-4 sticky top-0 z-50 shadow-sm bg-white/40 backdrop-blur-md border-b border-slate-200/60 transition-all mb-3"
        style={{
          background: 'rgba(255,255,255,0.40)',
          WebkitBackdropFilter: 'blur(20px)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Send className="text-emerald-500 w-7 h-7" />
              <div>
                <h1 className="text-xl font-bold text-slate-800">Campaign Manager</h1>
                <p className="text-slate-500 text-xs mt-0.5">Create and manage WhatsApp broadcast campaigns</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                New Campaign
              </button>
              <button
                onClick={fetchCampaigns}
                disabled={loading}
                className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold border border-slate-200 shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-8 pb-8 w-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Total Campaigns</p>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{totalCampaigns}</h3>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm text-emerald-600">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Active Now</p>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{activeCampaigns}</h3>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm text-emerald-600">
                <Play className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Messages Sent</p>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{totalSent.toLocaleString()}</h3>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm text-emerald-600">
                <Send className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Total Recipients</p>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{totalRecipients.toLocaleString()}</h3>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm text-emerald-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-900 font-bold text-sm">Error</p>
              <p className="text-red-700 text-xs mt-1">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
              ×
            </button>
          </div>
        )}

        {/* Campaigns Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800">All Campaigns</h3>
                <p className="text-slate-500 text-xs mt-1">Manage your broadcast campaigns</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Template</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Recipients</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Sent</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Delivered</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Failed</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
                        <p className="text-slate-600 text-sm font-medium">Loading campaigns...</p>
                      </div>
                    </td>
                  </tr>
                ) : campaigns.length > 0 ? (
                  campaigns.map(campaign => (
                    <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-800">{campaign.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{campaign.template_name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(campaign.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">{campaign.total_recipients.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-emerald-600">{campaign.sent.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-blue-600">{campaign.delivered.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-red-600">{campaign.failed.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600">
                          {new Date(campaign.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {campaign.status === 'Draft' && (
                            <button
                              onClick={() => handleSendCampaign(campaign.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                              title="Send Campaign"
                            >
                              <Send className="w-3.5 h-3.5" />
                              Send
                            </button>
                          )}
                          {campaign.status === 'Active' && (
                            <>
                              <button
                                onClick={() => handlePauseCampaign(campaign.id)}
                                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                                title="Pause Campaign"
                              >
                                <Pause className="w-3.5 h-3.5" />
                                Pause
                              </button>
                              <button
                                onClick={() => handleStopCampaign(campaign.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                                title="Stop Campaign"
                              >
                                <StopCircle className="w-3.5 h-3.5" />
                                Stop
                              </button>
                            </>
                          )}
                          {campaign.status === 'Paused' && (
                            <button
                              onClick={() => handleSendCampaign(campaign.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                              title="Resume Campaign"
                            >
                              <Play className="w-3.5 h-3.5" />
                              Resume
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/wa/campaigns/${campaign.id}`)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                            title="Delete Campaign"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Send className="w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="text-slate-900 font-bold text-sm mb-1">No campaigns yet</h3>
                        <p className="text-slate-400 text-xs mb-4">Create your first campaign to start sending messages</p>
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          Create Campaign
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Create New Campaign</h2>
              <p className="text-slate-500 text-sm mt-1">Set up a new WhatsApp broadcast campaign</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Campaign Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., Summer Sale 2025"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Template Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select Template</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Choose a template...</option>
                  {templates.map(template => (
                    <option key={template.id || template.tempid} value={template.id || template.tempid}>
                      {template.temp_title || template.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Don't have a template? <button onClick={() => navigate('/wa/templates/new')} className="text-emerald-600 hover:text-emerald-700 font-bold">Create one</button>
                </p>
              </div>

              {/* Excel Upload */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Upload Recipients (Excel)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="excel-upload"
                  />
                  <label htmlFor="excel-upload" className="cursor-pointer">
                    <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    {excelFile ? (
                      <div>
                        <p className="text-emerald-600 font-bold text-sm">{excelFile.name}</p>
                        <p className="text-slate-500 text-xs mt-1">{excelData.length} recipients loaded</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-slate-700 font-bold text-sm">Click to upload Excel file</p>
                        <p className="text-slate-500 text-xs mt-1">Must include phone_number column and variable columns</p>
                      </div>
                    )}
                  </label>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <button
                    onClick={downloadSampleTemplate}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download Sample Template
                  </button>
                  {excelFile && (
                    <button
                      onClick={() => {
                        setExcelFile(null);
                        setExcelData([]);
                      }}
                      className="text-xs text-red-600 hover:text-red-700 font-bold"
                    >
                      Remove File
                    </button>
                  )}
                </div>
              </div>

              {/* Preview Data */}
              {excelData.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Data Preview</label>
                  <div className="bg-slate-50 rounded-lg p-4 max-h-40 overflow-auto">
                    <pre className="text-xs text-slate-700">
                      {JSON.stringify(excelData.slice(0, 3), null, 2)}
                    </pre>
                    {excelData.length > 3 && (
                      <p className="text-xs text-slate-500 mt-2">... and {excelData.length - 3} more</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCampaignName('');
                  setSelectedTemplate('');
                  setExcelFile(null);
                  setExcelData([]);
                }}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-bold transition-all"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                disabled={creating || !campaignName || !selectedTemplate || !excelFile || excelData.length === 0}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Campaign
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
