import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { Mascot } from '@/components/auth/Mascot';
import { Mail, Lock, User, Sparkles, BarChart2, Building2, Zap } from 'lucide-react';
import avianyaLogo from '@/assets/images/avianya.png';
import { useToast } from '@/hooks/use-toast';
import { generateCreativeUsername } from '@/lib/utils/username';

enum AuthMode {
  LOGIN = 'login',
  SIGNUP = 'signup',
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  organizationName?: string;
}

export default function LiveChatLogin() {
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
  const [authStatus, setAuthStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const hasNavigatedRef = useRef(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organizationName: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const { login, signup, user, isLoading, error: authError, clearError } = useAuthStore();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/wa/dashboard');
    }
  }, [user, navigate]);

  // Track mouse position relative to the form container for the Mascot eyes
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Calculate center of the container
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 4; // Look at upper quarter where mascot is

        // Normalize values between -1 and 1, but make movement more sensitive
        const x = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 1.5)));
        const y = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 1.5)));

        setMousePos({ x, y });
        // Debug: uncomment to see mouse position
        console.log('Mouse pos:', { x, y });
      } else {
        // Fallback: track relative to viewport center if container not available
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const x = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth / 3)));
        const y = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight / 3)));
        setMousePos({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleMode = () => {
    setMode(prev => prev === AuthMode.LOGIN ? AuthMode.SIGNUP : AuthMode.LOGIN);
    setErrors({});
    setAuthStatus('idle');
    setIsPasswordFocused(false);
    clearError();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (authStatus === 'error') setAuthStatus('idle'); // Reset Mascot sadness on typing
    if (errors[e.target.name as keyof FormErrors]) {
      setErrors({ ...errors, [e.target.name as keyof FormErrors]: undefined });
    }
  };

  const handleGenerateUsername = async () => {
    if (!formData.name) {
      setErrors(prev => ({ ...prev, name: 'Enter a name first!' }));
      return;
    }
    
    setIsAiLoading(true);
    const newName = await generateCreativeUsername(formData.name);
    setFormData(prev => ({ ...prev, name: newName }));
    setIsAiLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (mode === AuthMode.SIGNUP) {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.organizationName) newErrors.organizationName = "Organization name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setAuthStatus('error');
      return;
    }

    // Start Auth Process
    setAuthStatus('submitting');
    setIsPasswordFocused(false);
    clearError();
    
    // Reset navigation ref at the start of each submit
    hasNavigatedRef.current = false;

    try {
      if (mode === AuthMode.LOGIN) {
        console.log('🔐 Attempting login...', formData.email);
        await login(formData.email, formData.password);
        
        console.log('✅ Login successful!');
        setAuthStatus('success');
        toast({
          title: 'Success! 🎉',
          description: 'Logged in successfully',
        });
        
        // Navigate after successful login
        console.log('📍 hasNavigatedRef.current:', hasNavigatedRef.current);
        if (!hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          console.log('🚀 Navigating to dashboard...');
          setTimeout(() => {
            console.log('⏰ Navigation timeout executing...');
            try {
              navigate('/wa/dashboard');
              console.log('✈️ Navigate called successfully');
            } catch (navError) {
              console.error('❌ Navigation error:', navError);
            }
          }, 500);
        } else {
          console.log('⚠️ Navigation blocked by hasNavigatedRef');
        }
      } else {
        // Sign Up Mode
        console.log('📝 Attempting signup...', formData.email);
        await signup(
          formData.email, 
          formData.password, 
          formData.name, 
          formData.organizationName
        );
        
        console.log('✅ Signup successful!');
        setAuthStatus('success');
        toast({
          title: 'Success! 🎉',
          description: 'Account created successfully! You can now login.',
        });
        
        // Wait for success animation then switch to login
        setTimeout(() => {
          setMode(AuthMode.LOGIN);
          setAuthStatus('idle');
          setFormData({ 
            name: '', 
            email: formData.email, 
            password: '', 
            organizationName: '' 
          });
        }, 2000);
      }
    } catch (err: any) {
      console.error('❌ Auth error:', err);
      setAuthStatus('error');
      const errorMessage = err?.message || authError || "An unexpected error occurred. Please try again.";
      console.error('Error message:', errorMessage);
      setErrors({ password: errorMessage });
      toast({
        title: mode === AuthMode.LOGIN ? 'Login Failed' : 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Animation Variants
  const formContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  // Auth Form
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50 overflow-hidden relative font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -z-20" />
      
      {/* Floating Animated Shapes */}
      <motion.div 
        animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[10%] text-indigo-200/50"
      >
        <Sparkles size={100} fill="currentColor" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 40, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[10%] text-pink-200/50"
      >
        <BarChart2 size={140} fill="currentColor" />
      </motion.div>

      {/* Main Card */}
      <div 
        ref={containerRef}
        className="w-full max-w-4xl min-h-[650px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col md:flex-row z-10"
      >
        {/* Left/Right Panel - Form Area */}
        <div className={`
          w-full md:w-1/2 p-8 md:p-12 flex flex-col z-10 transition-all duration-700 ease-in-out bg-white relative
          ${mode === AuthMode.SIGNUP ? 'md:translate-x-full' : ''}
        `}>
          
          {/* Mascot */}
          <div className="w-full flex justify-center mb-6 h-36">
            <Mascot 
              lookAt={mousePos} 
              isPasswordFocused={isPasswordFocused} 
              authStatus={authStatus}
            />
          </div>

          <AnimatePresence mode='wait'>
            <motion.div 
              key={mode}
              variants={formContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 flex flex-col"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
                  {mode === AuthMode.LOGIN ? 'Welcome Back!' : 'Join Us Today!'}
                </h2>
                <p className="text-gray-500 font-semibold">
                  {mode === AuthMode.LOGIN 
                    ? 'Sign in to access your WhatsApp dashboard' 
                    : 'Create an account to get started'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                {/* Sign Up: Name Input with AI Generator */}
                {mode === AuthMode.SIGNUP && (
                  <div className="relative">
                    <AuthInput 
                      label="Brand Handle / Name"
                      name="name"
                      type="text"
                      icon={User}
                      value={formData.name}
                      onChange={handleInputChange}
                      error={errors.name}
                      disabled={authStatus === 'success'}
                    />
                    <motion.button
                      type="button"
                      onClick={handleGenerateUsername}
                      disabled={isAiLoading || authStatus === 'success'}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute right-2 top-3 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 disabled:opacity-50 shadow-md hover:shadow-lg transition-shadow"
                    >
                      {isAiLoading ? (
                        <>
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles size={12} />
                          </motion.div>
                          <span>Thinking...</span>
                        </>
                      ) : (
                        <>
                          <Zap size={12} />
                          <span>AI Suggest</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                )}

                {/* Email Input */}
                <AuthInput 
                  label="Email Address"
                  name="email"
                  type="email"
                  icon={Mail}
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  success={authStatus === 'success'}
                  disabled={authStatus === 'success'}
                />

                {/* Organization Name (Sign Up Only) */}
                {mode === AuthMode.SIGNUP && (
                  <AuthInput 
                    label="Organization Name"
                    name="organizationName"
                    type="text"
                    icon={Building2}
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    error={errors.organizationName}
                    disabled={authStatus === 'success'}
                  />
                )}

                {/* Password Input */}
                <AuthInput 
                  label="Password"
                  name="password"
                  type="password"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  error={errors.password}
                  success={authStatus === 'success'}
                  disabled={authStatus === 'success'}
                />

                {/* Forgot Password Link (Login Only) */}
                {mode === AuthMode.LOGIN && (
                  <div className="mb-4 -mt-2">
                    <Link 
                      to="/wa/live-chat/forgot-password" 
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                )}

                {/* Submit Button */}
                <AuthButton 
                  type="submit" 
                  variant="primary"
                  isLoading={authStatus === 'submitting' || isLoading}
                  className="w-full mt-auto"
                >
                  {mode === AuthMode.LOGIN ? 'Sign In' : 'Create Account'}
                </AuthButton>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Overlay Section (Desktop Only) */}
        <div className={`
          hidden md:flex absolute top-0 left-0 h-full w-1/2 bg-gradient-to-br transition-all duration-700 ease-in-out z-20
          justify-center items-center p-12 text-center flex-col overflow-hidden shadow-2xl
          ${mode === AuthMode.SIGNUP 
            ? 'translate-x-0 from-indigo-500 via-purple-500 to-pink-500 rounded-r-[100px] rounded-l-none' 
            : 'translate-x-full from-pink-500 via-rose-500 to-orange-500 rounded-l-[100px] rounded-r-none'}
        `}>
          {/* Animated Background Blobs */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-96 h-96 bg-white/20 rounded-full blur-3xl"
          />
          
          <AnimatePresence mode='wait'>
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              {mode === AuthMode.LOGIN ? (
                <>
                  <div className="w-28 h-28 mx-auto mb-6 flex items-center justify-center">
                    <img
                      src={avianyaLogo}
                      alt="Avianya Logo"
                      className="w-40 h-40 object-contain rounded-2xl "
                    />
                  </div>
                  <h3 className="text-4xl font-display font-bold text-white mb-4">
                    New Here?
                  </h3>
                  <p className="text-white/90 mb-8 font-semibold text-lg">
                    Join thousands of marketers automating their WhatsApp campaigns with AI-powered tools.
                  </p>
                  <div className="flex justify-center">
                    <AuthButton 
                      onClick={toggleMode} 
                      variant="outline"
                      className="border-2"
                    >
                      Create Account
                    </AuthButton>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-28 h-28 mx-auto mb-6 flex items-center justify-center">
                    <img
                      src={avianyaLogo}
                      alt="Avianya Logo"
                      className="w-40 h-40 object-contain rounded-2xl "
                    />
                  </div>
                  <h3 className="text-4xl font-display font-bold text-white mb-4">
                    Already a Member?
                  </h3>
                  <p className="text-white/90 mb-8 font-semibold text-lg">
                    Sign in to continue managing your WhatsApp campaigns and view real-time analytics.
                  </p>
                  <div className="flex justify-center">
                    <AuthButton 
                      onClick={toggleMode} 
                      variant="outline"
                      className="border-2"
                    >
                      Sign In
                    </AuthButton>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 text-gray-400 text-xs text-center w-full font-bold tracking-widest opacity-50">
        WHATSAPP CAMPAIGN SYSTEM &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
