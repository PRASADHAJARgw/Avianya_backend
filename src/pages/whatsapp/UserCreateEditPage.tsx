import { useSearchParams } from 'react-router-dom';
import UserCreationFormClient from '@/components/whatsapp/live_chat/(authorized)/(panel)/users/new/pageClient';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { FEUser } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const UserCreateEditPage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
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
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (profileError) {
            console.error('❌ Profile fetch error:', profileError);
            setError('Failed to load user data');
            return;
          }

          if (profile) {
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select('*')
              .eq('user_id', userId)
              .single();

            if (roleError && roleError.code !== 'PGRST116') { // PGRST116 = no rows found
              console.error('❌ Role fetch error:', roleError);
            }

            const user: FEUser = {
              id: profile.id,
              firstName: profile.first_name,
              lastName: profile.last_name,
              email: profile.email,
              role: roleData?.role || 'agent'
            };

            console.log('✅ User data loaded:', user);
            setUserData(user);
          }
        } catch (err) {
          console.error('❌ Error fetching user:', err);
          setError('An unexpected error occurred');
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [userId]);

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