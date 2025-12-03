import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Mock user for demonstration
    const [user] = useState<User>({
        id: 'user_12345',
        email: 'demo@whatsapp.com',
        user_metadata: { role: 'admin' }
    });

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);