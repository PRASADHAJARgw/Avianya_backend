import { supabase } from '@/lib/supabase/client'
import { z } from 'zod'

const userSchema = z.object({
    id: z.string().optional(),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    role: z.enum(["agent", "admin"]),
})

export async function createUser(data: z.infer<typeof userSchema>) {
    console.log('🚀 createUser called with:', data);
    
    const validatedData = userSchema.parse(data)
    console.log('✅ Data validated:', validatedData);

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

        // Check if current user is admin (you may need to adjust this based on your user role system)
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
            throw new Error('You are not authorized to create users. Admin access required.')
        }

        if (validatedData.id) {
            // Update existing user
            console.log('📝 Updating existing user...');
            
            // Update profile
            const { data: updateProfileData, error: updateProfileError } = await supabase
                .from('profiles')
                .update({
                    first_name: validatedData.firstName,
                    last_name: validatedData.lastName,
                    email: validatedData.email,
                    last_updated: new Date().toISOString()
                })
                .eq('id', validatedData.id)
                .select()
                .single();

            if (updateProfileError) {
                console.error('❌ Profile update error:', updateProfileError);
                throw new Error('Failed to update user profile')
            }

            // Update or insert user role
            const { data: roleData, error: roleError } = await supabase
                .from('user_roles')
                .upsert({
                    user_id: validatedData.id,
                    role: validatedData.role
                }, {
                    onConflict: 'user_id'
                });

            if (roleError) {
                console.error('❌ Role update error:', roleError);
                throw new Error('Failed to update user role')
            }

            console.log('✅ User updated successfully');
        } else {
            // Create new user
            console.log('➕ Creating new user...');
            
            // For new users, we'll create a profile entry and send an invitation
            // Note: In a real app, you'd typically use Supabase auth admin functions
            // For now, we'll create a profile entry that can be activated when user signs up
            
            const newUserId = crypto.randomUUID();
            
            const { data: newProfile, error: createProfileError } = await supabase
                .from('profiles')
                .insert({
                    id: newUserId,
                    first_name: validatedData.firstName,
                    last_name: validatedData.lastName,
                    email: validatedData.email,
                    created_at: new Date().toISOString(),
                    last_updated: new Date().toISOString()
                })
                .select()
                .single();

            if (createProfileError) {
                console.error('❌ Profile creation error:', createProfileError);
                throw new Error('Failed to create user profile')
            }

            // Create user role
            const { data: roleData, error: roleError } = await supabase
                .from('user_roles')
                .insert({
                    user_id: newUserId,
                    role: validatedData.role
                });

            if (roleError) {
                console.error('❌ Role creation error:', roleError);
                throw new Error('Failed to assign user role')
            }

            console.log('✅ User created successfully');
        }

        return { success: true, message: validatedData.id ? 'User updated successfully' : 'User created successfully' };
        
    } catch (error) {
        console.error('❌ Error in createUser:', error);
        throw error;
    }
}