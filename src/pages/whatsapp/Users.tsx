import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MoreHorizontal, UserPlus, Loader2, Mail, Shield, User, Pencil, Trash2, LogOut, MessageSquare, Contact2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  email: string;
  raw_user_meta_data?: {
    first_name?: string;
    last_name?: string;
    full_name?: string;
    avatar_url?: string;
  };
  role?: string;
  created_at?: string;
  last_sign_in_at?: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/wa/live-chat/chats', label: 'Chats', icon: MessageSquare },
    { path: '/wa/contacts', label: 'Contacts', icon: Contact2 },
    { path: '/wa/users', label: 'Users', icon: User },
  ];

  const handleSignOut = async () => {
    await logout();
    toast({
      title: 'Signed Out',
      description: 'You have been logged out successfully',
    });
    navigate('/wa/live-chat/login');
  };

  // Role-based permission helpers
  const canEditUser = (targetUser: User) => {
    if (!user) return false;
    
    // Admin can edit everyone
    if (user.role === 'admin') return true;
    
    // Manager can edit only users (not other managers or admins)
    if (user.role === 'manager') {
      const targetRole = targetUser.role || 'user';
      return targetRole === 'user';
    }
    
    // User can only edit themselves
    if (user.role === 'user') {
      return user.id === targetUser.id;
    }
    
    return false;
  };

  const canDeleteUser = (targetUser: User) => {
    if (!user) return false;
    
    // Only admin can delete users
    if (user.role === 'admin') {
      // Admin cannot delete themselves
      return user.id !== targetUser.id;
    }
    
    return false;
  };

  const canChangeRole = (targetUser: User) => {
    if (!user) return false;
    
    // Only admin can change roles
    if (user.role === 'admin') {
      // Admin cannot change their own role (prevent lockout)
      return user.id !== targetUser.id;
    }
    
    return false;
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get token from authStore
      const { token } = useAuthStore.getState();
      
      if (!token) {
        console.error('❌ No authentication token found');
        setUsers([]);
        return;
      }
      
      console.log('🔍 Fetching all users from backend API');
      console.log('🔐 Current user:', { 
        id: user?.id, 
        email: user?.email, 
        role: user?.role, 
        organization_id: user?.organization_id 
      });
      
      const response = await fetch('http://localhost:8080/api/v2/users', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API error: ${response.status} ${response.statusText}`, errorText);
        
        if (response.status === 401) {
          console.error('❌ Unauthorized - invalid token');
          toast({
            title: 'Authentication Error',
            description: 'Your session has expired. Please log in again.',
            variant: 'destructive',
          });
        } else if (response.status === 403) {
          console.error('❌ Forbidden - insufficient permissions');
          toast({
            title: 'Access Denied', 
            description: 'You don\'t have permission to view all users.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: `Failed to load users: ${response.status} ${response.statusText}`,
            variant: 'destructive',
          });
        }
        
        // Fallback: show only current user if API fails
        if (user) {
          const currentUserData = {
            id: user.id,
            email: user.email,
            user_metadata: {
              full_name: user.name
            }
          };
          setUsers([currentUserData]);
        }
        return;
      }
      
      const data = await response.json();
      console.log('✅ Users fetched from API:', data);
      console.log(`📊 Found ${data.users?.length || 0} users in organization`);
      
      // Transform backend user format to frontend format
      const transformedUsers = (data.users || []).map((apiUser: { id: string, email: string, name: string, role?: string, organization_id?: string }) => ({
        id: apiUser.id,
        email: apiUser.email,
        role: apiUser.role,
        organization_id: apiUser.organization_id,
        user_metadata: {
          full_name: apiUser.name
        },
        raw_user_meta_data: {
          full_name: apiUser.name
        }
      }));
      
      setUsers(transformedUsers);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Limited Access',
        description: 'Admin privileges required to view all users. Showing your profile only.',
        variant: 'default',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user => {
    const firstName = user.raw_user_meta_data?.first_name || '';
    const lastName = user.raw_user_meta_data?.last_name || '';
    const fullName = user.raw_user_meta_data?.full_name || '';
    const email = user.email || '';
    const searchLower = searchQuery.toLowerCase();
    
    return (
      firstName.toLowerCase().includes(searchLower) ||
      lastName.toLowerCase().includes(searchLower) ||
      fullName.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower)
    );
  });

  const getInitials = (user: User) => {
    const firstName = user.raw_user_meta_data?.first_name || '';
    const lastName = user.raw_user_meta_data?.last_name || '';
    if (firstName || lastName) {
      return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
    }
    return user.email?.[0]?.toUpperCase() || 'U';
  };

  const getDisplayName = (user: User) => {
    const firstName = user.raw_user_meta_data?.first_name || '';
    const lastName = user.raw_user_meta_data?.last_name || '';
    const fullName = user.raw_user_meta_data?.full_name || '';
    
    if (firstName || lastName) {
      return { firstName, lastName };
    }
    if (fullName) {
      const parts = fullName.split(' ');
      return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
    }
    return { firstName: user.email?.split('@')[0] || 'Unknown', lastName: '' };
  };

  const getRoleBadgeVariant = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      case 'user':
        return 'secondary';
      case 'agent':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">
          {user?.role === 'admin' 
            ? 'Manage all team members and their permissions within your organization'
            : user?.role === 'manager'
            ? 'View team members and manage users with basic privileges'
            : 'View team members and manage your own profile'
          }
        </p>
        {user?.organization_id && (
          <p className="text-sm text-muted-foreground mt-1">
            Organization: {user.organization_id}
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Organization Team Members</CardTitle>
              <CardDescription>
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} in your organization
                {user?.role === 'admin' ? ' • Full management access' : 
                 user?.role === 'manager' ? ' • Limited management access' : 
                 ' • View access only'}
              </CardDescription>
            </div>
            {user?.role === 'admin' && (
              <Button 
                className="gap-2"
                onClick={() => navigate('/wa/users/new')}
              >
                <UserPlus className="h-4 w-4" />
                Invite User
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No users found matching your search' : 'No users yet'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Sign In</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const { firstName, lastName } = getDisplayName(user);
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.raw_user_meta_data?.avatar_url} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                              {getInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{firstName}</TableCell>
                        <TableCell>{lastName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            <Shield className="h-3 w-3 mr-1" />
                            {user.role || 'User'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(user.last_sign_in_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              {canEditUser(user) && (
                                <DropdownMenuItem 
                                  className="cursor-pointer"
                                  onClick={() => navigate(`/wa/users/edit?userId=${user.id}`)}
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                              )}
                              {canChangeRole(user) && (
                                <DropdownMenuItem className="cursor-pointer">
                                  <Shield className="h-4 w-4 mr-2" />
                                  Change Role
                                </DropdownMenuItem>
                              )}
                              {(canEditUser(user) || canChangeRole(user) || canDeleteUser(user)) && canDeleteUser(user) && (
                                <DropdownMenuSeparator />
                              )}
                              {canDeleteUser(user) && (
                                <DropdownMenuItem className="cursor-pointer text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
