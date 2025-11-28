import { supabase } from '@/lib/supabase/client'

export async function deleteUser(userId: string) {
    console.log('🗑️ deleteUser called for userId:', userId);
    
    try {
        // Get current session and check if user is admin
        const { data: session, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
            console.error('❌ Session error:', sessionError);
            throw new Error('Authentication failed')
        }

        if (!session.session) {
            console.error('❌ No session found');
            throw new Error('Not authenticated')
        }

        console.log('🔐 Current user session:', session.session.user.email);

        // Check if current user is admin
        const { data: currentUserProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*, user_roles(*)')
            .eq('id', session.session.user.id)
            .single();

        if (profileError) {
            console.error('❌ Profile fetch error:', profileError);
            throw new Error('Failed to fetch user profile')
        }

        const currentUserRole = currentUserProfile?.user_roles?.[0]?.role;
        console.log('👤 Current user role:', currentUserRole);

        if (currentUserRole !== 'admin') {
            throw new Error('You are not authorized to delete users. Admin access required.')
        }

        // Don't allow admin to delete themselves
        if (userId === session.session.user.id) {
            throw new Error('You cannot delete your own account')
        }

        console.log('🗑️ Deleting user profile and roles...');

        // Delete user role first (due to foreign key constraint)
        const { error: roleDeleteError } = await supabase
            .from('user_roles')
            .delete()
            .eq('user_id', userId);

        if (roleDeleteError) {
            console.error('❌ Role deletion error:', roleDeleteError);
            throw new Error('Failed to delete user role')
        }

        // Delete user profile
        const { error: profileDeleteError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);

        if (profileDeleteError) {
            console.error('❌ Profile deletion error:', profileDeleteError);
            throw new Error('Failed to delete user profile')
        }

        console.log('✅ User deleted successfully');
        return { success: true, message: 'User deleted successfully' };
        
    } catch (error) {
        console.error('❌ Error in deleteUser:', error);
        throw error;
    }
}