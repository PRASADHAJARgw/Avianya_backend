// import { useEffect, useRef, useState } from "react";

// import { Header } from "../../components/ads/Dashboard/Header";
// import { Sidebar } from "../../components/ads/Dashboard/Sidebar";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ads/whatsapp/ui/card";
// import { Badge } from "../../components/ads/whatsapp/ui/badge";
// import { Button } from "../../components/ads/whatsapp/ui/button";
// import { 
//   TrendingUp, 
//   TrendingDown,
//   DollarSign,
//   Users,
//   MousePointer,
//   Eye,
//   CheckCircle2
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { useNavigate } from "react-router-dom";

// // const Dashboard = () => {
// //   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

// //   return (
// //     <div className="flex h-screen bg-background">
// //       {/* <Sidebar 
// //         collapsed={sidebarCollapsed} 
// //         onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
// //       /> */}
      
// //       <div className="flex-1 flex flex-col overflow-hidden">
// //         <Header />
        
// //         <main className="flex-1 overflow-y-auto p-6">
// //           {/* Welcome Section */}
// //           <div className="mb-8">
// //             <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, John</h1>
// //             <p className="text-muted-foreground">Here's an overview of your advertising performance.</p>
// //           </div>

// //           {/* Key Metrics */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //             <Card className="shadow-card">
// //               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //                 <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
// //                 <DollarSign className="h-4 w-4 text-muted-foreground" />
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="text-2xl font-bold">$12,234</div>
// //                 <div className="flex items-center text-xs text-success">
// //                   <TrendingUp className="w-3 h-3 mr-1" />
// //                   +12.5% from last month
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             <Card className="shadow-card">
// //               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //                 <CardTitle className="text-sm font-medium">Impressions</CardTitle>
// //                 <Eye className="h-4 w-4 text-muted-foreground" />
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="text-2xl font-bold">2.4M</div>
// //                 <div className="flex items-center text-xs text-success">
// //                   <TrendingUp className="w-3 h-3 mr-1" />
// //                   +8.2% from last month
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             <Card className="shadow-card">
// //               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //                 <CardTitle className="text-sm font-medium">Clicks</CardTitle>
// //                 <MousePointer className="h-4 w-4 text-muted-foreground" />
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="text-2xl font-bold">45,231</div>
// //                 <div className="flex items-center text-xs text-destructive">
// //                   <TrendingDown className="w-3 h-3 mr-1" />
// //                   -2.1% from last month
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             <Card className="shadow-card">
// //               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //                 <CardTitle className="text-sm font-medium">Conversions</CardTitle>
// //                 <Users className="h-4 w-4 text-muted-foreground" />
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="text-2xl font-bold">1,892</div>
// //                 <div className="flex items-center text-xs text-success">
// //                   <TrendingUp className="w-3 h-3 mr-1" />
// //                   +18.3% from last month
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>

// //           {/* Connected Platforms */}
// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// //             <Card className="shadow-card">
// //               <CardHeader>
// //                 <CardTitle className="flex items-center gap-2">
// //                   <div className="bg-[#1877F2] text-white p-2 rounded">
// //                     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
// //                       <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
// //                     </svg>
// //                   </div>
// //                   Meta Advertising
// //                   <Badge variant="outline" className="border-success text-success ml-auto">Connected</Badge>
// //                 </CardTitle>
// //                 <CardDescription>Facebook & Instagram campaigns</CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-2">
// //                   <div className="flex justify-between">
// //                     <span className="text-sm text-muted-foreground">Active Campaigns</span>
// //                     <span className="text-sm font-medium">8</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-sm text-muted-foreground">This Month Spend</span>
// //                     <span className="text-sm font-medium">$8,234</span>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             <Card className="shadow-card">
// //               <CardHeader>
// //                 <CardTitle className="flex items-center gap-2">
// //                   <div className="bg-white border p-2 rounded">
// //                     <svg className="w-5 h-5" viewBox="0 0 24 24">
// //                       <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
// //                       <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
// //                       <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
// //                       <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
// //                     </svg>
// //                   </div>
// //                   Google Advertising
// //                   <Badge variant="outline" className="border-destructive text-destructive ml-auto">Not Connected</Badge>
// //                 </CardTitle>
// //                 <CardDescription>Google Ads campaigns</CardDescription>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="text-center py-6">
// //                   <p className="text-sm text-muted-foreground mb-4">Connect your Google Ads account to manage campaigns</p>
// //                   <Button variant="accent-blue">Connect Google</Button>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>

// //           {/* Quick Actions */}
// //           <Card className="shadow-card">
// //             <CardHeader>
// //               <CardTitle>Quick Actions</CardTitle>
// //               <CardDescription>Get started with common tasks</CardDescription>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                 <Button variant="outline" className="h-24 flex-col">
// //                   <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// //                   </svg>
// //                   Create Campaign
// //                 </Button>
// //                 <Button variant="outline" className="h-24 flex-col">
// //                   <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
// //                   </svg>
// //                   Build Audience
// //                 </Button>
// //                 <Button variant="outline" className="h-24 flex-col">
// //                   <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
// //                   </svg>
// //                   View Reports
// //                 </Button>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </main>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;

// const Dashboard = () => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   // user info returned from backend
//   const [userName, setUserName] = useState<string>("");
//   const [userPhoto, setUserPhoto] = useState<string | null>(null);
//   const [userEmail, setUserEmail] = useState<string | null>(null);

//   // platform connection data returned from backend (connected flag + accounts[])
//   const [googleData, setGoogleData] = useState<{ connected: boolean; accounts: any[] }>({
//     connected: false,
//     accounts: [],
//   });
//   const [metaData, setMetaData] = useState<{ connected: boolean; accounts: any[] }>({
//     connected: false,
//     accounts: [],
//   });
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const [companyProfileExists, setCompanyProfileExists] = useState<boolean | null>(null);
//   const [companyProfileLoading, setCompanyProfileLoading] = useState<boolean>(true);
//   const hasRun = useRef(false); // Prevent multiple fetches


// const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
// const handleGoogleLogin = () => {
//     const token = localStorage.getItem("access_token");
//     console.log("Google login initiated with token:", token);
//     // Base64 encode the token and pass it as 'state'
//     const state = token ? btoa(token) : '';
//     const url = `${base}/api/auth/google?state=${state}`;
//     window.location.href = url;
// };
// const handleFacebookAuth = () => {
//     const token = localStorage.getItem("access_token");
//     console.log("Facebook login initiated with token:", token);
//     // Base64 encode the token and pass it as 'state'
//     const state = token ? btoa(token) : '';
//     const url = `${base}/api/auth/facebook?state=${state}`;
//     window.location.href = url;
// };


//   useEffect(() => {
//     // Prevent running multiple times
//     if (hasRun.current) {
//       console.log("Dashboard useEffect: Already ran, skipping");
//       return;
//     }
//     hasRun.current = true;
//     console.log("Dashboard useEffect: Running for the first time");

//     let isMounted = true; // Prevent state updates after unmount

//     // First, check company profile. If missing, send user to onboarding.
//     const fetchCompanyProfile = async () => {
//       try {
//         console.log("Dashboard: Fetching company profile...");
//         const token = localStorage.getItem("access_token");
//         const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
//         const res = await fetch(`${base}/api/company_profile`, {
//           method: "GET",
//           headers: token
//             ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
//             : { "Content-Type": "application/json" },
//         });

//         if (!isMounted) return false;

//         if (!res.ok) {
//           // treat non-200 as missing profile
//           console.log("Dashboard: Company profile fetch failed (non-200), redirecting to brand-onboarding");
//           setCompanyProfileExists(false);
//           setCompanyProfileLoading(false);
//           navigate("/brand-onboarding", { replace: true });
//           return false;
//         }

//         const json = await res.json();
//         if (!isMounted) return false;

//         if (json && json.company_profile) {
//           console.log("Dashboard: Company profile exists, loading dashboard");
//           setCompanyProfileExists(true);
//           setCompanyProfileLoading(false);
//           return true;
//         }

//         console.log("Dashboard: No company profile found, redirecting to brand-onboarding");
//         setCompanyProfileExists(false);
//         setCompanyProfileLoading(false);
//         navigate("/brand-onboarding", { replace: true });
//         return false;
//       } catch (e) {
//         console.error("Failed to fetch company profile:", e);
//         if (!isMounted) return false;
        
//         setCompanyProfileExists(false);
//         setCompanyProfileLoading(false);
//         // If network error, send to onboarding so user can create profile
//         navigate("/brand-onboarding", { replace: true });
//         return false;
//       }
//     };

//   // Fetch dashboard info from backend. Assumptions:
//   // - Backend base URL is provided via VITE_BACKEND_URL env var, otherwise fallback to the devtunnel URL used elsewhere.
//   // - Endpoint: GET /api/dashboard returns JSON shapes similar to either:
//   //   1) { user: { id, first_name, last_name, picture, email }, ad_accounts: [{platform: 'meta'|'google', ...}, ...], access_token?: string }
//   //   2) legacy: { user: {...}, google: { connected, accounts: [] }, meta: { connected, accounts: [] }, access_token?: string }
//   // This function normalizes both shapes into local state.
//   const fetchDashboard = async () => {
//       try {
//         const token = localStorage.getItem("access_token");
//         const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
//         const res = await fetch(`${base}/api/dashboard`, {
//           method: "GET",
//           headers: token
//             ? {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//               }
//             : { "Content-Type": "application/json" },
//         });

//         // Optional: validate token before relying on it
//         if (token) {
//           try {
//             const valRes = await fetch(`${base}/api/token/validate`, {
//               method: "GET",
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             if (valRes.ok) {
//               const valJson = await valRes.json();
//               if (!valJson.valid) {
//                 // token invalid, remove it
//                 localStorage.removeItem("access_token");
//               }
//             } else {
//               // validation endpoint failed (non-200) - remove token to be safe
//               localStorage.removeItem("access_token");
//             }
//           } catch (e) {
//             // network/other error validating token - don't block dashboard but clear token
//             localStorage.removeItem("access_token");
//           }
//         }

//         if (!res.ok) {
//           // Try to parse error message
//           let errText = res.statusText;
//           try {
//             const errJson = await res.json();
//             errText = errJson.message || JSON.stringify(errJson);
//           } catch (e) {
//             // ignore
//           }
//           toast({
//             title: "Dashboard Load Failed",
//             description: `Could not load dashboard: ${res.status} ${errText}`,
//             variant: "destructive",
//           });
//           return;
//         }

//         const json = await res.json();

//         // Save any token sent by backend
//         if (json.access_token || json.token) {
//           const newToken = json.access_token || json.token;
//           localStorage.setItem("access_token", newToken);
//         }

//         // Normalize user info: backend may return { first_name, last_name, picture } or { name }
//         if (json.user) {
//           const first = json.user.first_name || json.user.name || json.user.username || "";
//           const last = json.user.last_name || "";
//           const fullName = [first, last].filter(Boolean).join(" ") || "User";
//           setUserName(fullName);
//           setUserPhoto(json.user.picture || json.user.photo || json.user.avatar || null);
//           setUserEmail(json.user.email || null);
//         }

//         // New response shape: ad_accounts is an array with platform field
//         if (Array.isArray(json.ad_accounts) && json.ad_accounts.length > 0) {
//           const googleAccounts: any[] = [];
//           const metaAccounts: any[] = [];

//           json.ad_accounts.forEach((acc: any) => {
//             if (!acc) return;
//             const platform = (acc.platform || "").toLowerCase();
//             const normalized = {
//               id: acc.id || acc.account_id || acc.platform_ad_account_id,
//               name: acc.name || acc.account_name || acc.display_name || "",
//               photo: acc.photo || acc.picture || null,
//               raw: acc,
//             };

//             if (platform === "google") googleAccounts.push(normalized);
//             else if (platform === "meta" || platform === "facebook") metaAccounts.push(normalized);
//           });

//           setGoogleData({ connected: googleAccounts.length > 0, accounts: googleAccounts });
//           setMetaData({ connected: metaAccounts.length > 0, accounts: metaAccounts });
//         } else {
//           // Backwards compatible: accept legacy `google` / `meta` keys
//           if (json.google) {
//             setGoogleData({
//               connected: !!json.google.connected,
//               accounts: Array.isArray(json.google.accounts) ? json.google.accounts : [],
//             });
//           }

//           if (json.meta) {
//             setMetaData({
//               connected: !!json.meta.connected,
//               accounts: Array.isArray(json.meta.accounts) ? json.meta.accounts : [],
//             });
//           }
//         }
//       } catch (error: any) {
//         console.error("Failed to fetch dashboard:", error);
//         toast({
//           title: "Network Error",
//           description: "Unable to reach the backend to load dashboard info.",
//           variant: "destructive",
//         });
//       }
//     };

//     // Run profile check first, then fetch dashboard only if profile exists
//     (async () => {
//       const ok = await fetchCompanyProfile();
//       if (ok && isMounted) await fetchDashboard();
//     })();

//     return () => {
//       isMounted = false; // Cleanup on unmount
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div className="flex h-screen bg-background">
//       <Sidebar
//         collapsed={sidebarCollapsed}
//         onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
//       />

//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header user={{ name: userName, photo: userPhoto, email: userEmail }} />

//         <main className="flex-1 overflow-y-auto p-6">
//           {/* Welcome Section */}
//           <div className="mb-8 flex items-center gap-4">
//             <div className="flex items-center gap-4">
//               {userPhoto ? (
//                 <img
//                   src={userPhoto}
//                   alt="avatar"
//                   className="w-12 h-12 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="w-12 h-12 rounded-full bg-muted-foreground flex items-center justify-center text-white">
//                   {userName ? userName.charAt(0).toUpperCase() : "U"}
//                 </div>
//               )}
//               <div>
//                 <h1 className="text-3xl font-bold text-foreground mb-0">
//                   Welcome back, {userName}
//                 </h1>
//                 <p className="text-sm text-muted-foreground">
//                   Here's an overview of your advertising performance.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Key Metrics */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <Card className="shadow-card">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Total Spend
//                 </CardTitle>
//                 {/* Replace with DollarSign or custom Rupee SVG */}
//                 {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
//                 <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 40 40" fill="none">
//                   <text x="0" y="39" fontSize="45" fontFamily="Arial" fill="currentColor">₹</text>
//                 </svg>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   <span className="mr-1">₹</span>1000
//                 </div>
//                 <div className="flex items-center text-xs text-success">
//                   <TrendingUp className="w-3 h-3 mr-1" />
//                   +12.5% from last month
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="shadow-card">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Impressions
//                 </CardTitle>
//                 <Eye className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">2.4M</div>
//                 <div className="flex items-center text-xs text-success">
//                   <TrendingUp className="w-3 h-3 mr-1" />
//                   +8.2% from last month
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="shadow-card">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Clicks</CardTitle>
//                 <MousePointer className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">45,231</div>
//                 <div className="flex items-center text-xs text-destructive">
//                   <TrendingDown className="w-3 h-3 mr-1" />
//                   -2.1% from last month
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="shadow-card">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Conversions
//                 </CardTitle>
//                 <Users className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">1,892</div>
//                 <div className="flex items-center text-xs text-success">
//                   <TrendingUp className="w-3 h-3 mr-1" />
//                   +18.3% from last month
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Connected Platforms */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//             <Card className="shadow-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <div className="bg-[#1877F2] text-white p-2 rounded">
//                     <svg
//                       className="w-5 h-5"
//                       viewBox="0 0 24 24"
//                       fill="currentColor"
//                     >
//                       <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//                     </svg>
//                   </div>
//                   {metaData.connected ? (
//                     <Badge
//                       variant="secondary"
//                       className="ml-auto flex items-center gap-1"
//                     >
//                       <CheckCircle2 className="w-3 h-3" /> Connected
//                     </Badge>
//                   ) : (
//                     <Badge variant="destructive" className="ml-auto">
//                       Not Connected
//                     </Badge>
//                   )}
//                 </CardTitle>
//                 <CardDescription>
//                   Facebook & Instagram campaigns
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-center py-6">
//                   {metaData.connected ? (
//                     <div className="space-y-3">
//                       <p className="text-sm text-muted-foreground mb-2">
//                         Connected Meta Accounts
//                       </p>
//                       {metaData.accounts.length === 0 ? (
//                         <p className="text-sm text-muted-foreground">No linked Meta accounts found.</p>
//                       ) : (
//                         <div className="flex flex-col gap-3">
//                               {metaData.accounts.map((acc: any, idx: number) => (
//                                 <div key={idx} className="flex items-center gap-3">
//                                   {acc.photo ? (
//                                     <img src={acc.photo} alt="acc" className="w-8 h-8 rounded-full object-cover" />
//                                   ) : (
//                                     <div className="w-8 h-8 rounded-full bg-muted-foreground flex items-center justify-center text-white">M</div>
//                                   )}
//                                   <div className="text-sm">
//                                     <div className="font-medium">{acc.name || acc.account_name || acc.display_name}</div>
//                                     {/* <div className="text-xs text-muted-foreground">ID: {acc.id || acc.account_id || acc.accountId}</div> */}
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                           <div className="mt-4">
//                             <Button variant="outline" onClick={handleFacebookAuth}>Add Meta account</Button>
//                           </div>
//                         </div>
//                   ) : (
//                     <>
//                       <p className="text-sm text-muted-foreground mb-4">
//                         Connect your Meta Ads account to manage campaigns
//                       </p>
//                       <Button
//                         variant="accent-blue"
//                         onClick={handleFacebookAuth}
//                       >
//                         Connect Meta
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="shadow-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <div className="bg-white border p-2 rounded">
//                     <svg className="w-5 h-5" viewBox="0 0 24 24">
//                       <path
//                         fill="#4285F4"
//                         d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                       />
//                       <path
//                         fill="#34A853"
//                         d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                       />
//                       <path
//                         fill="#FBBC05"
//                         d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                       />
//                       <path
//                         fill="#EA4335"
//                         d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                       />
//                     </svg>
//                   </div>
//                   {googleData.connected ? (
//                     <Badge
//                       variant="secondary"
//                       className="ml-auto flex items-center gap-1"
//                     >
//                       <CheckCircle2 className="w-3 h-3" /> Connected
//                     </Badge>
//                   ) : (
//                     <Badge variant="destructive" className="ml-auto">
//                       Not Connected
//                     </Badge>
//                   )}
//                 </CardTitle>
//                 <CardDescription>Google Ads campaigns</CardDescription>
//               </CardHeader>
//               <CardContent>
//               <p>Coming soon...</p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Quick Actions */}
//           {/* <Card className="shadow-card">
//             <CardHeader>
//               <CardTitle>Quick Actions</CardTitle>
//               <CardDescription>Get started with common tasks</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <Button variant="outline" className="h-24 flex-col">
//                   <svg
//                     className="w-6 h-6 mb-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                     />
//                   </svg>
//                   Create Campaign
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="h-24 flex-col"
//                   onClick={() => navigate("/brand-onboarding")}
//                 >
//                   <svg
//                     className="w-6 h-6 mb-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                     />
//                   </svg>
//                   Brand Onboarding
//                 </Button>
//                 <Button variant="outline" className="h-24 flex-col">
//                   <svg
//                     className="w-6 h-6 mb-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//                     />
//                   </svg>
//                   View Reports
//                 </Button>
//               </div>
//             </CardContent>
//           </Card> */}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




//   // <div className="text-center py-6">
                  
//   //                {googleData.connected ? (
//   //                   <div className="space-y-3">
//   //                     <p className="text-sm text-muted-foreground mb-2">Connected Google Accounts</p>
//   //                     {googleData.accounts.length === 0 ? (
//   //                       <p className="text-sm text-muted-foreground">No linked Google accounts found.</p>
//   //                     ) : (
//   //                       <div className="flex flex-col gap-3">
//   //                         {googleData.accounts.map((acc: any, idx: number) => (
//   //                           <div key={idx} className="flex items-center gap-3">
//   //                             {acc.photo ? (
//   //                               <img src={acc.photo} alt="acc" className="w-8 h-8 rounded-full object-cover" />
//   //                             ) : (
//   //                               <div className="w-8 h-8 rounded-full bg-muted-foreground flex items-center justify-center text-white">G</div>
//   //                             )}
//   //                             <div className="text-sm">
//   //                               <div className="font-medium">{acc.name || acc.account_name || acc.display_name}</div>
//   //                               {/* <div className="text-xs text-muted-foreground">ID: {acc.id || acc.account_id || acc.accountId}</div> */}
//   //                             </div>
//   //                           </div>
//   //                         ))}
//   //                       </div>
//   //                     )}
//   //                     <div className="mt-4">
//   //                       <Button variant="outline" onClick={handleGoogleLogin}>Add Google account</Button>
//   //                     </div>
//   //                   </div>
//   //                 ) : (
//   //                   <>
//   //                     <p className="text-sm text-muted-foreground mb-4">
//   //                       Connect your Google Ads account to manage campaigns
//   //                     </p>
//   //                     <Button
//   //                       variant="accent-blue"
//   //                       onClick={handleGoogleLogin}
//   //                     >
//   //                       Connect Google
//   //                     </Button>
//   //                   </>
//   //                 )}


//   //               </div>


import { useEffect, useState } from "react";
import { Header } from "../../components/ads/Dashboard/Header";
import { Sidebar } from "../../components/ads/Dashboard/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MousePointer,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "../../components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  // const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // user info returned from backend
  const [userName, setUserName] = useState<string>("");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // platform connection data returned from backend (connected flag + accounts[])
  const [googleData, setGoogleData] = useState<{ connected: boolean; accounts: any[] }>({
    connected: false,
    accounts: [],
  });
  const [metaData, setMetaData] = useState<{ connected: boolean; accounts: any[] }>({
    connected: false,
    accounts: [],
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const [companyProfileExists, setCompanyProfileExists] = useState<boolean | null>(null);
  const [companyProfileLoading, setCompanyProfileLoading] = useState<boolean>(true);


const base = import.meta.env.VITE_BACKEND_URL || 'https://api.adceleration.co';
const handleGoogleLogin = () => {
    const token = localStorage.getItem("access_token");
    console.log("Google login initiated with token:", token);
    // Base64 encode the token and pass it as 'state'
    const state = token ? btoa(token) : '';
    const url = `${base}/api/auth/google?state=${state}`;
    window.location.href = url;
};
const handleFacebookAuth = () => {
    const token = localStorage.getItem("access_token");
    console.log("Facebook login initiated with token:", token);
    // Base64 encode the token and pass it as 'state'
    const state = token ? btoa(token) : '';
    const url = `${base}/api/auth/facebook?state=${state}`;
    window.location.href = url;
};


  useEffect(() => {
    // First, check company profile. If missing, send user to onboarding.
    const fetchCompanyProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const base = import.meta.env.VITE_BACKEND_URL || 'https://api.adceleration.co';
        
        // If no token, don't try to fetch - just mark as not loaded
        if (!token) {
          console.log("No access token found, skipping company profile check");
          setCompanyProfileExists(true); // Allow viewing dashboard without profile
          setCompanyProfileLoading(false);
          return true;
        }
        
        const res = await fetch(`${base}/api/company_profile`, {
          method: "GET",
          headers: token
            ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            : { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          // treat non-200 as missing profile
          console.log("Company profile not found or error, redirecting to onboarding");
          setCompanyProfileExists(false);
          setCompanyProfileLoading(false);
          navigate("/brand-onboarding", { replace: true });
          return false;
        }

        const json = await res.json();
        if (json && json.company_profile) {
          setCompanyProfileExists(true);
          setCompanyProfileLoading(false);
          return true;
        }

        console.log("No company profile in response, redirecting to onboarding");
        setCompanyProfileExists(false);
        setCompanyProfileLoading(false);
        navigate("/brand-onboarding", { replace: true });
        return false;
      } catch (e) {
        console.error("Failed to fetch company profile:", e);
        // On network error, allow dashboard access (don't force onboarding)
        setCompanyProfileExists(true);
        setCompanyProfileLoading(false);
        return true;
      }
    };

  // Fetch dashboard info from backend. Assumptions:
  // - Backend base URL is provided via VITE_BACKEND_URL env var, otherwise fallback to the devtunnel URL used elsewhere.
  // - Endpoint: GET /api/dashboard returns JSON shapes similar to either:
  //   1) { user: { id, first_name, last_name, picture, email }, ad_accounts: [{platform: 'meta'|'google', ...}, ...], access_token?: string }
  //   2) legacy: { user: {...}, google: { connected, accounts: [] }, meta: { connected, accounts: [] }, access_token?: string }
  // This function normalizes both shapes into local state.
  const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const base = import.meta.env.VITE_BACKEND_URL || 'https://api.adceleration.co';
        const res = await fetch(`${base}/api/dashboard`, {
          method: "GET",
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              }
            : { "Content-Type": "application/json" },
        });

        // Optional: validate token before relying on it
        if (token) {
          try {
            const valRes = await fetch(`${base}/api/token/validate`, {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (valRes.ok) {
              const valJson = await valRes.json();
              if (!valJson.valid) {
                // token invalid, remove it
                localStorage.removeItem("access_token");
              }
            } else {
              // validation endpoint failed (non-200) - remove token to be safe
              localStorage.removeItem("access_token");
            }
          } catch (e) {
            // network/other error validating token - don't block dashboard but clear token
            localStorage.removeItem("access_token");
          }
        }

        if (!res.ok) {
          // Try to parse error message
          let errText = res.statusText;
          try {
            const errJson = await res.json();
            errText = errJson.message || JSON.stringify(errJson);
          } catch (e) {
            // ignore
          }
          toast({
            title: "Dashboard Load Failed",
            description: `Could not load dashboard: ${res.status} ${errText}`,
            variant: "destructive",
          });
          return;
        }

        const json = await res.json();

        // Save any token sent by backend
        if (json.access_token || json.token) {
          const newToken = json.access_token || json.token;
          localStorage.setItem("access_token", newToken);
        }

        // Normalize user info: backend may return { first_name, last_name, picture } or { name }
        if (json.user) {
          const first = json.user.first_name || json.user.name || json.user.username || "";
          const last = json.user.last_name || "";
          const fullName = [first, last].filter(Boolean).join(" ") || "User";
          setUserName(fullName);
          setUserPhoto(json.user.picture || json.user.photo || json.user.avatar || null);
          setUserEmail(json.user.email || null);
        }

        // New response shape: ad_accounts is an array with platform field
        if (Array.isArray(json.ad_accounts) && json.ad_accounts.length > 0) {
          const googleAccounts: any[] = [];
          const metaAccounts: any[] = [];

          json.ad_accounts.forEach((acc: any) => {
            if (!acc) return;
            const platform = (acc.platform || "").toLowerCase();
            const normalized = {
              id: acc.id || acc.account_id || acc.platform_ad_account_id,
              name: acc.name || acc.account_name || acc.display_name || "",
              photo: acc.photo || acc.picture || null,
              raw: acc,
            };

            if (platform === "google") googleAccounts.push(normalized);
            else if (platform === "meta" || platform === "facebook") metaAccounts.push(normalized);
          });

          setGoogleData({ connected: googleAccounts.length > 0, accounts: googleAccounts });
          setMetaData({ connected: metaAccounts.length > 0, accounts: metaAccounts });
        } else {
          // Backwards compatible: accept legacy `google` / `meta` keys
          if (json.google) {
            setGoogleData({
              connected: !!json.google.connected,
              accounts: Array.isArray(json.google.accounts) ? json.google.accounts : [],
            });
          }

          if (json.meta) {
            setMetaData({
              connected: !!json.meta.connected,
              accounts: Array.isArray(json.meta.accounts) ? json.meta.accounts : [],
            });
          }
        }
      } catch (error: any) {
        console.error("Failed to fetch dashboard:", error);
        toast({
          title: "Network Error",
          description: "Unable to reach the backend to load dashboard info.",
          variant: "destructive",
        });
      }
    };

    // Run profile check first, then fetch dashboard only if profile exists
    (async () => {
      const ok = await fetchCompanyProfile();
      if (ok) await fetchDashboard();
    })();
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      /> */}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header user={{ name: userName, photo: userPhoto, email: userEmail }} /> */}

        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome Section */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex items-center gap-4">
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-muted-foreground flex items-center justify-center text-white">
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-0">
                  Welcome back, {userName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Here's an overview of your advertising performance.
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Spend
                </CardTitle>
                {/* Replace with DollarSign or custom Rupee SVG */}
                {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
                <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 40 40" fill="none">
                  <text x="0" y="39" fontSize="45" fontFamily="Arial" fill="currentColor">₹</text>
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <span className="mr-1">₹</span>1000
                </div>
                <div className="flex items-center text-xs text-success">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Impressions
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4M</div>
                <div className="flex items-center text-xs text-success">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.2% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,231</div>
                <div className="flex items-center text-xs text-destructive">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -2.1% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Conversions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,892</div>
                <div className="flex items-center text-xs text-success">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18.3% from last month
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Connected Platforms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-[#1877F2] text-white p-2 rounded">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  Meta Advertising
                  {metaData.connected ? (
                    <Badge
                      variant="secondary"
                      className="ml-auto flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Connected
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="ml-auto">
                      Not Connected
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Facebook & Instagram campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  {metaData.connected ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground mb-2">
                        Connected Meta Accounts
                      </p>
                      {metaData.accounts.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No linked Meta accounts found.</p>
                      ) : (
                        <div className="flex flex-col gap-3">
                              {metaData.accounts.map((acc: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-3">
                                  {acc.photo ? (
                                    <img src={acc.photo} alt="acc" className="w-8 h-8 rounded-full object-cover" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-muted-foreground flex items-center justify-center text-white">M</div>
                                  )}
                                  <div className="text-sm">
                                    <div className="font-medium">{acc.name || acc.account_name || acc.display_name}</div>
                                    {/* <div className="text-xs text-muted-foreground">ID: {acc.id || acc.account_id || acc.accountId}</div> */}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="mt-4">
                            <Button variant="outline" onClick={handleFacebookAuth}>Add Meta account</Button>
                          </div>
                        </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground mb-4">
                        Connect your Meta Ads account to manage campaigns
                      </p>
                      <Button
                        variant="accent-blue"
                        onClick={handleFacebookAuth}
                      >
                        Connect Meta
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-white border p-2 rounded">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  Google Advertising
                  {googleData.connected ? (
                    <Badge
                      variant="success"
                      className="ml-auto flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Connected
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="ml-auto">
                      Not Connected
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Google Ads campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  {googleData.connected ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground mb-2">Connected Google Accounts</p>
                      {googleData.accounts.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No linked Google accounts found.</p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {googleData.accounts.map((acc: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-3">
                              {acc.photo ? (
                                <img src={acc.photo} alt="acc" className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-muted-foreground flex items-center justify-center text-white">G</div>
                              )}
                              <div className="text-sm">
                                <div className="font-medium">{acc.name || acc.account_name || acc.display_name}</div>
                                {/* <div className="text-xs text-muted-foreground">ID: {acc.id || acc.account_id || acc.accountId}</div> */}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-4">
                        <Button variant="outline" onClick={handleGoogleLogin}>Add Google account</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground mb-4">
                        Connect your Google Ads account to manage campaigns
                      </p>
                      <Button
                        variant="accent-blue"
                        onClick={handleGoogleLogin}
                      >
                        Connect Google
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          {/* <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex-col">
                  <svg
                    className="w-6 h-6 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Create Campaign
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col"
                  onClick={() => navigate("/brand-onboarding")}
                >
                  <svg
                    className="w-6 h-6 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Brand Onboarding
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <svg
                    className="w-6 h-6 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card> */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;