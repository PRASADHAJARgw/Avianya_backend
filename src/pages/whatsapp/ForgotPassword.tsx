import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MailIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to send reset email',
          variant: 'destructive',
        });
      } else {
        setSent(true);
        toast({
          title: 'Email Sent',
          description: 'Check your email for password reset instructions',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center">
          <h2 className="text-2xl font-semibold mb-4">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent password reset instructions to {email}
          </p>
          <Link to="/wa/live-chat/login">
            <Button className="w-full">Back to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">Forgot Password</h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter your email and we'll send you a reset link
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Label htmlFor="email">Email:</Label>
            <div className="relative mt-2">
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <MailIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <Button type="submit" className="w-full mb-4" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
          <Link to="/wa/live-chat/login">
            <Button variant="outline" className="w-full">
              Back to Login
            </Button>
          </Link>
        </form>
      </div>
    </div>
  );
}
