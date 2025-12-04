import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TemplateCreator from '../../components/whatsapp/TemplateCreator';

const TemplatesEditor: React.FC = () => {
  const { id } = useParams();
  const [initialJson, setInitialJson] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // /templates/edit/:id
    fetch(`http://localhost:8080/template/${id}`)
      .then(r => r.json())
      .then(data => setInitialJson(data))
      .catch(err => console.error('Failed to load template', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading template...</div>;

  return (
    <div>
      <TemplateCreator initialTemplateJson={initialJson} />
    </div>
  );
};

export default TemplatesEditor;
