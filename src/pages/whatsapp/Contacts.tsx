import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Mail, MessageSquare, Search, UserPlus, Loader2, LogOut, Users, Contact2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Contact {
  wa_id: string;
  name: string;
  phone?: string;
  email?: string;
  profile_pic_url?: string;
  last_message_at?: string;
  unread_count?: number;
  is_active?: boolean;
  created_at?: string;
}

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/wa/live-chat/chats', label: 'Chats', icon: MessageSquare },
    { path: '/wa/contacts', label: 'Contacts', icon: Contact2 },
    { path: '/wa/users', label: 'Users', icon: Users },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed Out',
      description: 'You have been logged out successfully',
    });
    navigate('/wa/live-chat/login');
  };

  useEffect(() => {
    fetchContacts();
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('contacts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'contacts' }, 
        () => {
          fetchContacts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contacts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.wa_id?.includes(searchQuery) ||
    contact.phone?.includes(searchQuery) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      {/* Top Bar with Navigation */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
            <Contact2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">WhatsApp Live Chat</h1>
            {user && (
              <p className="text-xs text-gray-500">
                Logged in as {user.email}
              </p>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate(item.path)}
                className={cn(
                  'gap-2',
                  isActive && 'bg-green-600 hover:bg-green-700'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Button>
            );
          })}
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 ml-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Contacts</h2>
            <p className="text-muted-foreground">
              Manage your WhatsApp contacts and conversations
            </p>
          </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Contacts</CardTitle>
              <CardDescription>
                {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? 'No contacts found matching your search' : 'No contacts yet'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredContacts.map((contact) => (
                <Card key={contact.wa_id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={contact.profile_pic_url} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {getInitials(contact.name || 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{contact.name || 'Unknown'}</h3>
                          {contact.is_active && (
                            <Badge variant="default" className="bg-green-500">
                              Active
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          {contact.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              <span className="truncate">{contact.phone}</span>
                            </div>
                          )}
                          {contact.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{contact.email}</span>
                            </div>
                          )}
                          {contact.last_message_at && (
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-3 w-3" />
                              <span>Last message: {formatDate(contact.last_message_at)}</span>
                            </div>
                          )}
                        </div>

                        {contact.unread_count !== undefined && contact.unread_count > 0 && (
                          <Badge variant="secondary" className="mt-2">
                            {contact.unread_count} unread
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 gap-2">
                        <MessageSquare className="h-3 w-3" />
                        Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
