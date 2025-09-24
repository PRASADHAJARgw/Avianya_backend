import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TemplatesList = ({ isSidebarHovered }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('http://localhost:8080/templates')
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
          if (mounted) setTemplates(data);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          if (mounted) setError(`JSON Parse Error: ${parseError.message}. Raw response: ${text.substring(0, 200)}...`);
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        if (mounted) setError(String(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Templates</h2>
        <div className="flex gap-2">
          <button onClick={() => navigate('/wa/templates/new')} className="bg-blue-600 text-white px-3 py-1 rounded">New Template</button>
          <button onClick={() => { setLoading(true); fetch('http://localhost:8080/templates').then(r => r.json()).then(d => setTemplates(d)).finally(()=>setLoading(false)); }} className="bg-gray-200 px-3 py-1 rounded">Refresh</button>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}

      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Last Update</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map(t => (
              <tr key={t.tempid} className="border-t">
                <td className="p-3">{t.tempid}</td>
                <td className="p-3">{t.temp_title}</td>
                <td className="p-3">{t.category}</td>
                <td className="p-3">{t.status}</td>
                <td className="p-3">{new Date(t.last_update_time).toLocaleString()}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/wa/templates/edit/${t.tempid}`)} className="bg-green-600 text-white px-2 py-1 rounded">Edit</button>
                    <button onClick={() => navigate(`/wa/templates/edit/${t.tempid}`)} className="bg-gray-200 px-2 py-1 rounded">View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TemplatesList;
