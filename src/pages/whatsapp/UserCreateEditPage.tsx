import { useSearchParams } from 'react-router-dom';
import UserCreationFormClient from '@/components/whatsapp/live_chat/(authorized)/(panel)/users/new/pageClient';
import { useEffect, useState } from 'react';
import { FEUser } from '@/types/user';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

const UserCreateEditPage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const userId = searchParams.get('userId');
  const [userData, setUserData] = useState<FEUser | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      console.log('🔍 Loading user data for edit mode, userId:', userId);
      setLoading(true);
      setError(null);
      
      const fetchUser = async () => {
        try {
          // For now, if editing self, use data from authStore
          // TODO: Implement backend API for fetching other users
          if (userId === user?.id) {
            console.log('✅ Loading current user data from authStore');
            const currentUser: FEUser = {
              id: user.id,
              firstName: user.name.split(' ')[0] || user.name,
              lastName: user.name.split(' ').slice(1).join(' ') || '',
              email: user.email,
              role: user.role
            };
            setUserData(currentUser);
          } else {
            console.log('⚠️ Editing other users not yet implemented');
            setError('Editing other users requires backend API implementation');
            // TODO: Call backend API to get user data
            // const response = await fetch(`http://localhost:8080/api/v2/users/${userId}`, {
            //   headers: { 'Authorization': `Bearer ${authStore.token}` }
            // });
            // const userData = await response.json();
            // setUserData(userData);
          }
        } catch (err) {
          console.error('❌ Error loading user:', err);
          setError('An unexpected error occurred');
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [userId, user]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-background overflow-auto">
      <UserCreationFormClient userData={userData} />
    </div>
  );
};

export default UserCreateEditPage;