import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ContactsClient from '@/components/whatsapp/live_chat/(authorized)/(panel)/contacts/pageClient';
import WhatsAppNavigation from '@/components/whatsapp/WhatsAppNavigation';

const queryClient = new QueryClient();

const ContactsPage = () => {
  return (
    <div className="flex flex-col h-full w-full  bg-background">
      {/* WhatsApp Navigation */}
      <WhatsAppNavigation />
      
      {/* Main Content Area - Responsive and fits within MainLayout */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <QueryClientProvider client={queryClient}>
            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <ContactsClient />
            </div>
          </QueryClientProvider>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
