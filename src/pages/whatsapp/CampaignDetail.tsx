import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  AlertCircle,
  Phone,
  MessageSquare,
  CheckCheck
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface Campaign {
  id: string;
  name: string;
  template_id: number;
  template_name: string;
  template_language: string;
  status: string;
  total_recipients: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  pending: number;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

interface Recipient {
  id: string;
  phone_number: string;
  country_code: string;
  full_phone: string;
  status: string;
  message_id: string | null;
  error_message: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  parameters: Record<string, any>;
}

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        setLoading(true);
        await Promise.all([
          fetchCampaignDetails(),
          fetchRecipients()
        ]);
        setLoading(false);
      }
    };

    loadData();
    
    // Auto-refresh every 5 seconds if campaign is active
    const interval = setInterval(() => {
      if (campaign?.status === 'active') {
        fetchCampaignDetails();
        fetchRecipients();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [id, campaign?.status]);

  const fetchCampaignDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/campaigns/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch campaign');
      
      const data = await response.json();
      setCampaign(data);
    } catch (err) {
      console.error('Error fetching campaign:', err);
      setError(String(err));
    }
  };

  const fetchRecipients = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/campaigns/${id}/recipients`,
        {
          headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch recipients');
      
      const data = await response.json();
      setRecipients(data || []);
    } catch (err) {
      console.error('Error fetching recipients:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'pending': { bg: 'bg-slate-100', text: 'text-slate-700', icon: <Clock className="w-3 h-3" /> },
      'sent': { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Send className="w-3 h-3" /> },
      'delivered': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <CheckCircle className="w-3 h-3" /> },
      'read': { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: <CheckCheck className="w-3 h-3" /> },
      'failed': { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle className="w-3 h-3" /> },
    };
    
    const style = statusMap[status.toLowerCase()] || statusMap['pending'];
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
        {style.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCampaignStatusBadge = (status: string) => {
    if (!status) return null; // Add null check
    
    const statusMap = {
      'draft': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
      'active': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
      'completed': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      'paused': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    };
    
    const style = statusMap[status.toLowerCase()] || statusMap['draft'];
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${style.bg} ${style.text} ${style.border}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredRecipients = recipients.filter(r => 
    filterStatus === 'all' || r.status.toLowerCase() === filterStatus
  );

  const calculateSuccessRate = () => {
    if (!campaign || campaign.total_recipients === 0) return 0;
    // Success = delivered + read (both are successful delivery)
    return (((campaign.delivered + (campaign.read || 0)) / campaign.total_recipients) * 100).toFixed(1);
  };

  const handleRecalculate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/campaigns/${id}/recalculate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to recalculate stats');
      
      const data = await response.json();
      console.log('✅ Stats recalculated:', data);
      
      // Refresh campaign details
      await fetchCampaignDetails();
      
      alert('Campaign statistics recalculated successfully!');
    } catch (err) {
      console.error('Error recalculating stats:', err);
      alert('Failed to recalculate statistics. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Campaign Not Found</h2>
          <p className="text-slate-600 mb-6">{error || 'Unable to load campaign details'}</p>
          <button
            onClick={() => navigate('/wa/campaigns')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans">
      {/* Header */}
      <header className="px-4 md:px-8 pt-6 pb-4 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/wa/campaigns')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Campaigns</span>
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">{campaign.name}</h1>
              <div className="flex items-center gap-3">
                {getCampaignStatusBadge(campaign.status)}
                <span className="text-sm text-slate-500">
                  Template: <span className="font-semibold text-slate-700">{campaign.template_name}</span>
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {campaign.status === 'active' && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span className="text-sm font-bold text-emerald-700">Live</span>
                </div>
              )}
              
              {campaign.status === 'completed' && (
                <button
                  onClick={handleRecalculate}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors"
                  title="Recalculate statistics from actual recipient statuses"
                >
                  <RefreshCw className="w-4 h-4" />
                  Fix Stats
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            {/* Total Recipients */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-slate-100">
                  <Users className="w-5 h-5 text-slate-600" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total</p>
              </div>
              <p className="text-2xl font-bold text-slate-800">{campaign.total_recipients}</p>
            </div>

            {/* Sent */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Sent</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{campaign.sent}</p>
            </div>

            {/* Delivered */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Delivered</p>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{campaign.delivered}</p>
            </div>

            {/* Read */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-indigo-100">
                  <CheckCheck className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Read</p>
              </div>
              <p className="text-2xl font-bold text-indigo-600">{campaign.read || 0}</p>
            </div>

            {/* Failed */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-red-100">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Failed</p>
              </div>
              <p className="text-2xl font-bold text-red-600">{campaign.failed}</p>
            </div>

            {/* Success Rate */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-purple-100">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Success</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">{calculateSuccessRate()}%</p>
            </div>
          </div>

          {/* Recipients Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Recipients</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Showing {filteredRecipients.length} of {recipients.length} recipients
                  </p>
                </div>
                
                {/* Filter Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      filterStatus === 'all'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All ({recipients.length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('pending')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      filterStatus === 'pending'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Pending ({recipients.filter(r => r.status === 'pending').length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('sent')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      filterStatus === 'sent'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    Sent ({recipients.filter(r => r.status === 'sent').length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('delivered')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      filterStatus === 'delivered'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                    }`}
                  >
                    Delivered ({recipients.filter(r => r.status === 'delivered').length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('read')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      filterStatus === 'read'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                    }`}
                  >
                    Read ({recipients.filter(r => r.status === 'read').length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('failed')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      filterStatus === 'failed'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                  >
                    Failed ({recipients.filter(r => r.status === 'failed').length})
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Message ID</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Sent At</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Delivered At</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecipients.length > 0 ? (
                    filteredRecipients.map(recipient => (
                      <tr key={recipient.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="font-mono text-sm font-semibold text-slate-800">
                              {recipient.full_phone || `+${String(recipient.country_code)}${String(recipient.phone_number)}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(recipient.status)}
                        </td>
                        <td className="px-6 py-4">
                          {recipient.message_id ? (
                            <span className="font-mono text-xs text-slate-600">{recipient.message_id.substring(0, 20)}...</span>
                          ) : (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {recipient.sent_at ? (
                            <span className="text-sm text-slate-600">
                              {new Date(recipient.sent_at).toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {recipient.delivered_at ? (
                            <span className="text-sm text-slate-600">
                              {new Date(recipient.delivered_at).toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {recipient.error_message ? (
                            <span className="text-xs text-red-600 font-medium">{recipient.error_message}</span>
                          ) : (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">No recipients found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
