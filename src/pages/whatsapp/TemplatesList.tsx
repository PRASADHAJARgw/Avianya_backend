import React, { useEffect, useState } from 'react';
import { Header } from '../../components/whatsapp/Header';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Plus, RefreshCw, Edit, Eye, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const TemplatesList = ({ isSidebarHovered }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchTemplates = () => {
    if (!user?.id) {
      console.log('No user logged in, skipping template fetch');
      return;
    }

    setLoading(true);
    fetch('http://localhost:8080/templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: user.id }),
    })
      .then(r => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.text(); // Get raw text first
      })
      .then(text => {
        console.log('Raw server response for /wa/templates:', text); // Log raw text
        try {
          const data = JSON.parse(text); // Manually parse
          console.log(`Loaded ${data.length} templates for user ${user.id}`);
          setTemplates(data);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          setError(`JSON Parse Error: ${parseError.message}. Raw response: ${text.substring(0, 200)}...`);
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user?.id) {
      fetchTemplates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const statusMap = {
      'APPROVED': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle className="w-3 h-3" /> },
      'PENDING': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: <Clock className="w-3 h-3" /> },
      'REJECTED': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <AlertCircle className="w-3 h-3" /> },
      'Active': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle className="w-3 h-3" /> },
    };
    const style = statusMap[status] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: <AlertCircle className="w-3 h-3" /> };
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}>
        {style.icon}
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans">
      {/* Glassmorphism Header */}
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
          background: 'rgba(255,255,255,0.40)',
          WebkitBackdropFilter: 'blur(20px)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left Side: Title */}
            <div className="flex items-center gap-3">
              <FileText className="text-emerald-500 w-7 h-7" />
              <div>
                <h1 className="text-xl font-bold text-slate-800">Message Templates</h1>
                <p className="text-slate-500 text-xs mt-0.5">Manage your WhatsApp message templates</p>
              </div>
            </div>

            {/* Right Side: Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/wa/templates/new')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                New Template
              </button>
              <button
                onClick={fetchTemplates}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Total Templates</p>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{Array.isArray(templates) ? templates.length : 0}</h3>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm text-emerald-600">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Approved</p>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {Array.isArray(templates) ? templates.filter(t => t.status === 'APPROVED' || t.status === 'Active').length : 0}
                </h3>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm text-emerald-600">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Pending</p>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {Array.isArray(templates) ? templates.filter(t => t.status === 'PENDING').length : 0}
                </h3>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-900 font-bold text-sm">Error loading templates</p>
              <p className="text-red-700 text-xs mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Templates Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Templates Overview</h3>
                <p className="text-slate-500 text-xs mt-1">Complete list of message templates</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Last Update</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
                        <p className="text-slate-600 text-sm font-medium">Loading templates...</p>
                      </div>
                    </td>
                  </tr>
                ) : Array.isArray(templates) && templates.length > 0 ? (
                  templates.map(t => (
                    <tr key={t.id || t.tempid} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-900">{t.id || t.tempid}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-800">{t.temp_title || t.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600">{t.category || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(t.status || 'Active')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600">
                          {t.last_update_time ? new Date(t.last_update_time).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/wa/templates/edit/${t.id || t.tempid}`)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => navigate(`/wa/templates/edit/${t.id || t.tempid}`)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="text-slate-900 font-bold text-sm mb-1">No templates found</h3>
                        <p className="text-slate-400 text-xs mb-4">Create your first message template to get started</p>
                        <button
                          onClick={() => navigate('/wa/templates/new')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          Create Template
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
    </div>
  );
};

export default TemplatesList;
