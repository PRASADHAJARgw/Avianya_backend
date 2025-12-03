import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Contact2, Users, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';

const navItems = [
  { 
    path: '/wa/live-chat/chats', 
    label: 'Live Chat', 
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Real-time conversations and customer support'
  },
  { 
    path: '/wa/contacts', 
    label: 'Contacts', 
    icon: Contact2,
    title: 'Contact Management',
    description: 'Manage your WhatsApp contacts and customer information'
  },
  { 
    path: '/wa/users', 
    label: 'Users', 
    icon: Users,
    title: 'User Management',
    description: 'Manage WhatsApp users and their roles'
  },
];

export default function WhatsAppNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get current page info dynamically
  const currentPageInfo = useMemo(() => {
    const currentItem = navItems.find(item => 
      location.pathname === item.path || 
      (item.path === '/wa/live-chat/chats' && location.pathname.startsWith('/wa/live-chat'))
    );
    
    return currentItem || {
      label: 'WhatsApp',
      title: 'WhatsApp Manager',
      description: 'Manage your WhatsApp business communications',
      icon: MessageSquare
    };
  }, [location.pathname]);

  const handleSignOut = async () => {
    logout();
    toast({
      title: 'Signed Out',
      description: 'You have been logged out successfully',
    });
    navigate('/wa/live-chat/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single Line Navigation */}
        <div className="flex items-center justify-between h-16">
          {/* Left side - WhatsApp Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
              <currentPageInfo.icon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{currentPageInfo.title}</h1>
            </div>
          </div>

          {/* Right side - Navigation + Sign Out */}
          <div className="flex items-center space-x-1">
            {/* Desktop Navigation Links */}
            <div className="hidden sm:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                               (item.path === '/wa/live-chat/chats' && location.pathname.startsWith('/wa/live-chat'));
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? 'default' : 'ghost'}
                    onClick={() => handleNavigation(item.path)}
                    size="sm"
                    className={cn(
                      'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                      isActive 
                        ? 'bg-green-600 text-white shadow-sm hover:bg-green-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    )}
                    title={item.description}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Sign Out Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut} 
              className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 ml-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 bg-white">
            <div className="py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                               (item.path === '/wa/live-chat/chats' && location.pathname.startsWith('/wa/live-chat'));
                
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      'w-full justify-start gap-3 px-4 py-3 text-left',
                      isActive 
                        ? 'bg-green-50 text-green-700 border-r-2 border-green-600' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-gray-500">{item.description}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}