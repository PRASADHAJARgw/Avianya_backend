import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SearchBar from '@/components/whatsapp/live_chat/(authorized)/(panel)/users/SearchBar';
import DeleteUser from '@/components/whatsapp/live_chat/(authorized)/(panel)/users/DeleteUser';
import WhatsAppNavigation from '@/components/whatsapp/WhatsAppNavigation';

interface FEUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const pageSize = 10;

const UsersPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState<FEUser[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  const pageString = searchParams.get('page');
  const page = pageString ? parseInt(pageString) : 1;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const searchString = searchParams.get('search')?.trim();
  const search = searchString ? `%${searchString}%` : undefined;

  // TODO: Replace with backend API call to GET /api/v2/users
  // Currently simplified since backend API endpoint is not yet available
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // For now, just show the current logged-in user until backend API is implemented
      if (user) {
        const currentUser: FEUser = {
          id: user.id,
          firstName: user.name.split(' ')[0] || user.name,
          lastName: user.name.split(' ').slice(1).join(' ') || '',
          email: user.email,
          role: user.role
        };
        setUsers([currentUser]);
        setCount(1);
      } else {
        setUsers([]);
        setCount(0);
      }
      
      // TODO: Implement proper API call like:
      // const response = await fetch('http://localhost:8080/api/v2/users', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const data = await response.json();
      // setUsers(data.users);
      // setCount(data.total);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Get current user's role from authStore (already in JWT token)
  const fetchCurrentUserRole = useCallback(async () => {
    if (!user?.id) {
      console.log('⚠️ No user ID found, skipping role fetch');
      return;
    }
    
    try {
      setIsLoadingRole(true);
      console.log('🔍 Getting user role from authStore for:', user.email, 'ID:', user.id);
      
      // User role is already in the authStore user object from JWT token
      const role = user.role || 'user';
      console.log('🎭 User role from JWT token:', role);
      console.log('🔒 Admin access:', role === 'admin' ? 'GRANTED' : 'DENIED');
      setCurrentUserRole(role);
    } catch (err) {
      console.error('❌ Error getting user role:', err);
    } finally {
      setIsLoadingRole(false);
    }
  }, [user?.id, user?.email, user?.role]);

  // TODO: Role management should be handled by backend API
  // Admin users should be created/managed through backend endpoints
  const makeCurrentUserAdmin = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      console.log('⚠️ Role management should be handled by backend API');
      toast({
        title: "Feature Not Available",
        description: "Role management is handled by the backend admin panel.",
        variant: "default",
      });
      
      // Note: In the new multi-tenant system, roles are assigned when creating users
      // or can be updated through backend API endpoints by super admins
      
    } catch (error) {
      console.error('❌ Error:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  }, [user?.id, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchCurrentUserRole();
  }, [fetchCurrentUserRole]);

  return (
    <div className="flex flex-col h-full w-full  bg-background">
      {/* WhatsApp Navigation */}
      <WhatsAppNavigation />
      
      {/* Main Content Area - Responsive and fits within MainLayout */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* User Info Card */}
          {user && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Current User:</span> {user.email} 
                <span className="mx-2">•</span>
                <span className="font-medium">Role:</span> {isLoadingRole ? 'Loading...' : currentUserRole || 'Unknown'}
              </p>
            </div>
          )}
          
          <Card className="w-full shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <div className="w-full lg:w-auto">
                  <SearchBar />
                </div>
                <div className="flex gap-2 items-center w-full lg:w-auto">
                  {/* Temporary admin setup button - remove after use */}
                  {currentUserRole !== 'admin' && !isLoadingRole && (
                    <Button 
                      onClick={makeCurrentUserAdmin}
                      variant="outline"
                      className="text-orange-600 border-orange-600 hover:bg-orange-50 font-medium w-full sm:w-auto"
                    >
                      Make Me Admin
                    </Button>
                  )}
                  
                  {currentUserRole === 'admin' && !isLoadingRole && (
                    <Button 
                      onClick={() => navigate('/wa/users/new')} 
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm w-full sm:w-auto"
                    >
                      Add User
                    </Button>
                  )}
                  {isLoadingRole && (
                    <div className="w-[100px] h-[36px] flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : users?.length && users.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">First Name</TableHead>
                        <TableHead className="min-w-[120px]">Last Name</TableHead>
                        <TableHead className="min-w-[100px]">Role</TableHead>
                        <TableHead className="min-w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((userItem) => (
                        <TableRow key={userItem.id}>
                          <TableCell className="font-medium">{userItem.firstName}</TableCell>
                          <TableCell className="font-medium">{userItem.lastName}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              userItem.role === 'admin' ? 'bg-red-100 text-red-800' :
                              userItem.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {userItem.role}
                            </span>
                          </TableCell>
                          <TableCell>
                            {currentUserRole === 'admin' ? (
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => navigate(`/wa/users/new?userId=${userItem.id}`)}>
                                  Edit
                                </Button>
                                <DeleteUser userId={userItem.id} userName={`${userItem.firstName} ${userItem.lastName}`} />
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">No access</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      👥
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
                  </div>
                </div>
              )}
              
              {count > 0 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => page > 1 && navigate(`/wa/users?page=${page - 1}`)}
                          className={page === 1 ? "pointer-events-none opacity-30" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.ceil(count / pageSize) }, (_, i) => i + 1).map((pageNumber) => (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => navigate(`/wa/users?page=${pageNumber}`)}
                            isActive={pageNumber === page}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => page < Math.ceil(count / pageSize) && navigate(`/wa/users?page=${page + 1}`)}
                          className={(page >= Math.ceil(count / pageSize)) ? "pointer-events-none opacity-30" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
