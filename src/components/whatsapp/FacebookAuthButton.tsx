import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

interface FacebookAuthButtonProps {
  onSuccess?: (data: { token: string; wabaId?: string }) => void;
  onError?: (error: string) => void;
}

export const FacebookAuthButton: React.FC<FacebookAuthButtonProps> = ({
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Listen for OAuth callback messages
    const handleMessage = (event: MessageEvent) => {
      // Security: Verify the origin
      const allowedOrigins = [
        'http://localhost:8080',
        window.location.origin,
      ];
      
      if (!allowedOrigins.includes(event.origin)) {
        console.warn('Received message from untrusted origin:', event.origin);
        return;
      }

      const { type, token, user_id, waba_registered, error } = event.data;

      if (type === 'FACEBOOK_AUTH_SUCCESS') {
        setIsLoading(false);
        
        if (waba_registered) {
          toast({
            title: '✅ Success!',
            description: 'WhatsApp Business Account connected successfully',
          });
          
          if (onSuccess) {
            onSuccess({ token, wabaId: user_id });
          }
          
          // Refresh the page or navigate to dashboard
          setTimeout(() => {
            window.location.href = '/wa/dashboard';
          }, 1000);
        } else {
          toast({
            title: '⚠️ Warning',
            description: 'Authentication successful, but no WABA found. Please set up your WhatsApp Business Account.',
            variant: 'default',
          });
        }
      } else if (type === 'FACEBOOK_AUTH_WARNING') {
        setIsLoading(false);
        toast({
          title: '⚠️ Setup Required',
          description: error || 'Please complete your WhatsApp Business Account setup',
          variant: 'default',
        });
        
        if (onError) {
          onError(error || 'No WABA found');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, onError, toast]);

  const handleFacebookAuth = async () => {
    try {
      setIsLoading(true);

      // Get current Supabase user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to connect your WhatsApp Business Account',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      const userId = user.id;
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
      
      // Open OAuth popup with user_id
      const width = 600;
      const height = 800;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        `${backendUrl}/auth/facebook?user_id=${userId}`,
        'facebook-oauth',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
      );

      if (!popup) {
        toast({
          title: 'Popup Blocked',
          description: 'Please allow popups for this site to connect your Facebook account',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Check if popup was closed
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setIsLoading(false);
        }
      }, 500);

    } catch (error) {
      console.error('Facebook auth error:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to Facebook. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
      
      if (onError) {
        onError(error instanceof Error ? error.message : 'Unknown error');
      }
    }
  };

  return (
    <Button
      onClick={handleFacebookAuth}
      disabled={isLoading}
      className="bg-[#1877F2] hover:bg-[#166FE5] text-white"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        </>
      ) : (
        <>
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Connect WhatsApp Business
        </>
      )}
    </Button>
  );
};

export default FacebookAuthButton;
