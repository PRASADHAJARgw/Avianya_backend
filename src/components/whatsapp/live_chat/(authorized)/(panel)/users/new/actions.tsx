import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'

const API_BASE = 'http://localhost:8080/api/v2'

const userSchema = z.object({
    id: z.string().optional(),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    role: z.enum(["user", "manager", "admin"]),
    password: z.string().optional(),
})

export async function createUser(data: z.infer<typeof userSchema>) {
    console.log('🚀 createUser called with:', data);
    const validatedData = userSchema.parse(data)
    console.log('✅ Data validated:', validatedData);

    try {
        // Get token and user role from authStore
        const { token, user } = useAuthStore.getState();
        console.log('🔍 Auth state check:', { hasToken: !!token, hasUser: !!user, userRole: user?.role });
        
        if (!token) {
            console.error('❌ No token found in authStore');
            throw new Error('Not authenticated')
        }

        if (!user || user.role !== 'admin') {
            console.error('❌ Access denied:', { hasUser: !!user, userRole: user?.role });
            throw new Error('You are not authorized to create users. Admin access required.')
        }

        // Construct request payload for backend
        const payload: {
            name: string;
            email: string;
            role: string;
            password?: string;
        } = {
            name: `${validatedData.firstName} ${validatedData.lastName}`,
            email: validatedData.email,
            role: validatedData.role,
        }

        // For create, backend requires password
        if (!validatedData.id) {
            payload.password = validatedData.password || crypto.randomUUID().slice(0, 12)
        }

        if (validatedData.id) {
            // Update existing user
            const response = await fetch(`${API_BASE}/users/${validatedData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const text = await response.text()
                console.error('❌ Failed to update user', text)
                throw new Error('Failed to update user')
            }

            console.log('✅ User updated successfully');
        } else {
            // Create new user
            const response = await fetch(`${API_BASE}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const text = await response.text()
                console.error('❌ Failed to create user', text)
                throw new Error('Failed to create user')
            }

            console.log('✅ User created successfully');
        }

        return { success: true, message: validatedData.id ? 'User updated successfully' : 'User created successfully' };

    } catch (error) {
        console.error('❌ Error in createUser:', error);
        throw error;
    }
}