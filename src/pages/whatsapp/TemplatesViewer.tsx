import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TemplateCreator from '../../components/whatsapp/TemplateCreator';

const TemplatesViewer: React.FC = () => {
  const { id } = useParams();
  const [initialJson, setInitialJson] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // /templates/view/:id
    fetch(`http://localhost:8080/template/${id}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
        return r.json();
      })
      .then(data => {
        console.log('Fetched template data for viewing:', data);
        // Extract the payload field which contains the actual template JSON
        if (data && data.payload) {
          console.log('Using payload as initialTemplateJson:', data.payload);
          setInitialJson(data.payload);
        } else {
          // Fallback: try to construct from available fields
          console.log('No payload found, constructing from fields');
          const constructedTemplate = {
            name: data.name,
            language: data.language || data.lang_code,
            category: data.category,
            components: data.components || []
          };
          setInitialJson(constructedTemplate);
        }
      })
      .catch(err => {
        console.error('Failed to load template', err);
        alert(`Failed to load template: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading template...</div>;
  if (!initialJson) return <div className="p-6">Template not found or invalid data</div>;

  return (
    <div>
      <TemplateCreator initialTemplateJson={initialJson} isViewOnly={true} />
    </div>
  );
};

export default TemplatesViewer;
