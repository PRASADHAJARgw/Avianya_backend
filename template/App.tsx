import React from 'react';
import TemplateCreator from './TemplateCreator';
import { AuthProvider } from './contexts/AuthContext';
import { MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  return (
    <AuthProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                        <MessageCircle size={20} fill="currentColor" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">WhatsApp Manager</h1>
                </div>
            </header>
            
            <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <TemplateCreator />
                </div>
            </main>
        </div>
    </AuthProvider>
  );
};

export default App;