import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LockIcon, MailIcon, UserIcon, BriefcaseIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    console.log('Password length:', formData.password.length);

    // Validation
    if (!formData.firstName.trim()) {
      console.log('Validation failed: First name is required');
      toast({
        title: 'Validation Error',
        description: 'First name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.email.trim()) {
      console.log('Validation failed: Email is required');
      toast({
        title: 'Validation Error',
        description: 'Email is required',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      console.log('Validation failed: Password too short');
      toast({
        title: 'Validation Error',
        description: `Password must be at least 6 characters (you entered ${formData.password.length})`,
        variant: 'destructive',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      console.log('Validation failed: Passwords do not match');
      toast({
        title: 'Validation Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.role) {
      console.log('Validation failed: Role not selected');
      toast({
        title: 'Validation Error',
        description: 'Please select a role',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Starting Supabase signup...');
      
      // Sign up with Supabase and add user metadata
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role,
            full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          },
        },
      });

      console.log('Supabase signup response:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: 'Signup Failed',
          description: error.message || 'Failed to create account',
          variant: 'destructive',
        });
      } else {
        console.log('Signup successful:', data);
        toast({
          title: 'Success',
          description: 'Account created successfully! Redirecting to login...',
        });
        
        // Redirect to login after successful signup
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Signup exception:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="firstName">First Name:</Label>
              <div className="relative mt-2">
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="pl-10"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="John"
                />
                <UserIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <Label htmlFor="lastName">Last Name:</Label>
              <div className="relative mt-2">
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="pl-10"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Doe"
                />
                <UserIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="email">Email:</Label>
            <div className="relative mt-2">
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="pl-10"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="you@example.com"
              />
              <MailIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="role">Role:</Label>
            <div className="relative mt-2">
              <Select value={formData.role} onValueChange={handleRoleChange} disabled={loading}>
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <BriefcaseIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="password">Password:</Label>
            <div className="relative mt-2">
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="pl-10"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="••••••••"
              />
              <LockIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <div className="mb-6">
            <Label htmlFor="confirmPassword">Confirm Password:</Label>
            <div className="relative mt-2">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="pl-10"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="••••••••"
              />
              <LockIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-blue-600 underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
