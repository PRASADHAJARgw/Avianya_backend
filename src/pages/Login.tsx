// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "../whatsapp/ui/button";
// import { Input } from "../whatsapp/ui/input";
// import { Label } from "../whatsapp/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../whatsapp/ui/card";
// import { Separator } from "../whatsapp/ui/separator";
// import { Eye, EyeOff, Mail, Lock } from "lucide-react";

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Handle login logic
//     console.log("Login attempt", formData);
//   };

//   return (
//     <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md shadow-elevated">
//         <CardHeader className="space-y-1 text-center">
//           <div className="flex items-center justify-center mb-4">
//             <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-xl">
//               AdLaunch
//             </div>
//           </div>
//           <CardTitle className="text-2xl font-semibold">Log in to your account</CardTitle>
//           <CardDescription>
//             Choose your preferred sign in method
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {/* Social Login Buttons */}
//           <div className="space-y-2">
//             <Button variant="social" className="w-full justify-start" size="lg">
//               <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//               </svg>
//               Continue with Google
//             </Button>
//             <Button variant="social" className="w-full justify-start" size="lg">
//               <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                 <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//               </svg>
//               Continue with Facebook
//             </Button>
//           </div>

//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <Separator />
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-card px-2 text-muted-foreground">Or</span>
//             </div>
//           </div>

//           {/* Email/Password Form */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email Address</Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="you@example.com"
//                   className="pl-10"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   className="pl-10 pr-10"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                 >
//                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-end">
//               <Link
//                 to="/forgot-password"
//                 className="text-sm text-accent-blue hover:underline"
//               >
//                 Forgot Password?
//               </Link>
//             </div>

//             <Button variant="accent-blue" type="submit" className="w-full" size="lg">
//               Log In
//             </Button>
//           </form>

//           <div className="text-center text-sm text-muted-foreground">
//             Don't have an account?{" "}
//             <Link to="/onboarding" className="text-accent-blue hover:underline font-medium">
//               Sign Up
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Login;




import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { auth, googleProvider, facebookProvider } from "@/firebaseConfig";
import { signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const base = import.meta.env.VITE_BACKEND_URL;
  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Only redirect if authenticated and NOT already on dashboard
      if (user && window.location.pathname === '/login') {
        navigate('/dashboard', { replace: true });
      }
      // Do not redirect if already on /dashboard or not authenticated
    });
    return () => unsubscribe();
  }, [navigate]);

  const sendDataToBackend = async (provider: string, result: any) => {
    console.log("🚀 Starting backend data send...");
    const user = result.user;
    const credential = provider === 'google'
      ? GoogleAuthProvider.credentialFromResult(result)
      : null;

    const idToken = await user.getIdToken();
    const accessToken = credential?.accessToken || '';
    const [firstName, lastName] = user.displayName?.split(" ") || ["", ""];

    const dataToSend = {
      provider,
      providerId: user.uid,
      accessToken,
      refreshToken: user.refreshToken || "",
      idToken,
      profile: {
        email: user.email,
        firstName,
        lastName,
        displayName: user.displayName,
        photo: user.photoURL,
      },
    };

    console.log("📤 Sending data to backend:", { 
      provider, 
      providerId: user.uid, 
      email: user.email,
      backendUrl: `${base}/api/auth/external`
    });

    try {
      const response = await fetch(`${base}/api/auth/external`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      console.log("📡 Backend response status:", response.status);
      console.log("📡 Backend response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Backend error response:", errorText);
        throw new Error(`Backend responded with ${response.status}: ${errorText}`);
      }

      // If backend returns tokens, save them
      try {
        const json = await response.json();
        console.log("✅ Backend response data:", json);
        
        if (json.access_token) {
          localStorage.setItem('access_token', json.access_token);
          console.log("💾 Access token saved to localStorage");
        } else {
          console.warn("⚠️ No access_token in backend response");
        }
        
        if (json.refresh_token) {
          localStorage.setItem('refresh_token', json.refresh_token);
          console.log("💾 Refresh token saved to localStorage");
        }
      } catch (e) {
        console.warn("⚠️ Failed to parse JSON response:", e);
        // ignore JSON parse errors but log them
      }

      console.log("✅ Data sent to backend successfully");
    } catch (error) {
      console.error("❌ Error sending data to backend:", error);
      console.log("🔄 Continuing with authentication anyway...");
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      console.log("Starting Google authentication...");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google User:", result.user);
      console.log("Authentication successful, sending data to backend...");
      
      await sendDataToBackend("google", result);
      console.log("Backend data sent successfully");
      
      // Give you time to see logs before redirect
      console.log("Will redirect to dashboard in 2 seconds...");
      const timer = setTimeout(() => {
        console.log("Forcing immediate redirect to dashboard...");
        window.location.replace("/dashboard");
      }, 2000);
      setRedirectTimer(timer);
      
    } catch (error: any) {
      console.error("Google login error:", error);
      setIsLoading(false);
      
      // Handle specific COOP-related errors
      if (error.code === 'auth/popup-blocked' || 
          error.code === 'auth/cancelled-popup-request' ||
          error.message?.includes('Cross-Origin-Opener-Policy')) {
        console.log("COOP or popup issue detected, trying manual redirect...");
        alert("Authentication popup was blocked. Please try again and allow popups for this site.");
      } else {
        alert("Google login failed. Please try again.");
      }
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log("Logged in with Facebook:", result.user);
      await sendDataToBackend("facebook", result);
      
      // Force navigation with a delay to handle COOP issues
      setTimeout(() => {
        console.log("Navigating to dashboard...");
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error: any) {
      console.error("Facebook login error:", error.message);
      // If popup fails due to COOP, try redirect instead
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        console.log("Popup blocked, trying alternative flow...");
        alert("Please try again. If the issue persists, try disabling popup blockers.");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const base = import.meta.env.VITE_BACKEND_URL;
    try {
      // Try direct backend email login first
      const resp = await fetch(`${base}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password, login_type: 'email' }),
      });

      if (resp.ok) {
        try {
          const json = await resp.json();
          console.log('Backend login response:', json);
          if (json.access_token) {
            localStorage.setItem('access_token', json.access_token);
            if (json.refresh_token) localStorage.setItem('refresh_token', json.refresh_token);
            // Optional: store some user info
            if (json.data?.first_name || json.data?.last_name) {
              const name = [json.data.first_name, json.data.last_name].filter(Boolean).join(' ');
              localStorage.setItem('user_name', name);
            }
            // Redirect to dashboard
            window.location.replace('/dashboard');
            return;
          }
        } catch (err) {
          console.warn('Failed to parse backend login JSON:', err);
        }
      }

      // If backend login fails or did not return tokens, fall back to Firebase email sign-in
      console.log('Backend email login failed or returned no tokens - falling back to Firebase auth');
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        console.log('Email User (Firebase):', userCredential.user);

        // Exchange Firebase idToken with backend for access/refresh tokens
        try {
          const idToken = await userCredential.user.getIdToken();
          const resp2 = await fetch(`${base}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          });

          if (resp2.ok) {
            const json2 = await resp2.json();
            if (json2.access_token) localStorage.setItem('access_token', json2.access_token);
            if (json2.refresh_token) localStorage.setItem('refresh_token', json2.refresh_token);
          } else {
            console.warn('Backend login exchange failed with status', resp2.status);
          }
        } catch (err) {
          console.warn('Failed to exchange idToken with backend', err);
        }

        // Force navigation to avoid any routing issues
        setTimeout(() => {
          console.log('Navigating to dashboard...');
          window.location.href = '/dashboard';
        }, 500);
      } catch (error) {
        console.error('Firebase email login failed:', error);
        alert('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/assets/logo.jpg" alt="Avianya Tech Logo" className="h-8 mr-2" />
            <div className="px-4 py-2 rounded-lg font-bold text-xl">
            Avianya Tech
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold">Sign in to your account</CardTitle>
          <CardDescription>
            Choose your preferred sign in method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button
              variant="social"
              className="w-full justify-start"
              size="lg"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {isLoading ? "Signing in..." : "Continue with Google"}
            </Button>
            <Button
              variant="social"
              className="w-full justify-start"
              size="lg"
              onClick={handleFacebookLogin}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-accent-blue hover:underline"
              >
                Forgot Password?
              </Link>
            </div> */}

            <Button variant="accent-blue" type="submit" className="w-full" size="lg">
              Log In
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-accent-blue hover:underline font-medium">
              Create New User
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;