import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InstagramIndex() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Instagram dashboard by default
    navigate('/ig/dashboard', { replace: true });
  }, [navigate]);

  return null;
}
