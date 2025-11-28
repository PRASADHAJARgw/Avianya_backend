import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Instagram } from 'lucide-react';

export default function InstagramNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <Instagram className="h-16 w-16 text-[#E1306C] mb-4" />
      <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The Instagram page you're looking for doesn't exist.
      </p>
      <Link to="/ig/dashboard">
        <Button className="bg-[#E1306C] hover:bg-[#C13584]">
          Go to Instagram Dashboard
        </Button>
      </Link>
    </div>
  );
}
