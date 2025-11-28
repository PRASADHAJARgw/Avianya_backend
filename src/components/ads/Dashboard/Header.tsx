import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { User, Settings, LogOut, Megaphone, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user: {
    name: string;
    photo: string | null;
    email: string | null;
  };
  onManagerChange?: (m: 'whatsapp' | 'ads') => void;
  activeManager?: 'whatsapp' | 'ads';
}

export function Header({ user, onManagerChange, activeManager }: HeaderProps) {
  // Defensive: fallback to default user if prop is missing
  const safeUser = user || { name: "User", photo: null, email: null };
  const userName = safeUser.name;
  const userPhoto = safeUser.photo;
  const userEmail = safeUser.email;
  const navigate = useNavigate();
  const manager = activeManager || 'whatsapp';
  
  const switchManager = (m: 'whatsapp' | 'ads') => {
    if (onManagerChange) onManagerChange(m);
    if (m === 'ads') navigate('/ads/dashboard');
    else navigate('/wa/dashboard');
  };
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };
  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <img src="/src/assets/images/avianya.png" alt="Avianya Tech Logo" className="h-10 mr-2" />
        <span className="font-semibold text-2xl">Avianya Techjnjc</span>
      </div>
      <div className="flex items-center space-x-4">
        {/* Manager toggle buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => switchManager('whatsapp')}
            className="toggle-btn p-2 rounded"
            style={{
              background: manager === 'whatsapp' ? '#f5f5f5' : 'transparent',
              transition: 'background 0.2s'
            }}
            aria-label="Switch to WhatsApp Manager"
            title="WhatsApp Manager"
          >
            <img
              src="/src/assets/images/Whatsapp Icons.png"
              alt="WhatsApp Manager"
              style={{
                width: manager === 'whatsapp' ? '32px' : '28px',
                height: manager === 'whatsapp' ? '32px' : '28px',
                objectFit: 'contain'
              }}
            />
          </button>

          <button
            type="button"
            onClick={() => switchManager('ads')}
            className={`toggle-btn p-2 rounded ${manager === 'ads' ? 'bg-primary text-white' : 'bg-transparent'}`}
            aria-label="Switch to Ads Manager"
            title="Ads Manager"
          >
            <Megaphone />
          </button>
        </div>
      </div>
    </header>
  );
}