import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { User, Settings, LogOut, Megaphone, MessageCircle, ChevronDown, Wallet, X, CreditCard, AlertCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";

interface HeaderProps {
  user?: {
    name?: string;
    photo?: string | null;
    email?: string | null;
  };
  onManagerChange?: (m: 'whatsapp' | 'ads' | 'instagram') => void;
  activeManager?: 'whatsapp' | 'ads' | 'instagram';
}

export function Header({ user, onManagerChange, activeManager }: HeaderProps) {
  const safeUser = user || { name: "User", photo: null, email: null };
  const userName = safeUser.name || "User";
  const userPhoto = safeUser.photo || null;
  const userEmail = safeUser.email || null;
  const navigate = useNavigate();
  const manager = activeManager || 'whatsapp';
  const { user: authUser } = useAuth();
  
  // WABA Connection State
  const [wabaConnected, setWabaConnected] = useState(false);
  const [wabaAccounts, setWabaAccounts] = useState<any[]>([]);
  const [loadingWaba, setLoadingWaba] = useState(true);
  
  // Mock accounts data for Instagram and Ads - replace with real data from your backend
  const instagramAccounts = [
    { id: '1', name: '@business_account_1', handle: '@business_1' },
    { id: '2', name: '@business_account_2', handle: '@business_2' },
    { id: '3', name: '@business_account_3', handle: '@business_3' },
  ];
  
  const adsAccounts = [
    { id: '1', name: 'Ad Account 1', accountId: 'AD-12345' },
    { id: '2', name: 'Ad Account 2', accountId: 'AD-67890' },
    { id: '3', name: 'Ad Account 3', accountId: 'AD-11223' },
  ];
  
  const [selectedWhatsApp, setSelectedWhatsApp] = useState<any>(null);
  const [selectedInstagram, setSelectedInstagram] = useState(instagramAccounts[0]);
  const [selectedAds, setSelectedAds] = useState(adsAccounts[0]);
  
  // Fetch WABA accounts on mount
  useEffect(() => {
    if (authUser?.id) {
      fetchWABAAccounts();
    }
  }, [authUser?.id]);
  
  const fetchWABAAccounts = async () => {
    if (!authUser?.id) {
      console.log('❌ No authenticated user found');
      setLoadingWaba(false);
      setWabaConnected(false);
      return;
    }
    
    try {
      setLoadingWaba(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
      
      // Get token from Supabase session (not localStorage)
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      console.log('🔍 Fetching WABA status for user:', authUser.id);
      console.log('🔗 Backend URL:', backendUrl);
      console.log('🔑 Token exists:', !!token);
      console.log('🔑 Token from:', session ? 'Supabase session' : 'not found');
      
      // Fetch WABA status
      const statusResponse = await fetch(`${backendUrl}/api/waba/status?user_id=${authUser.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📊 Status response status:', statusResponse.status);
      
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log('✅ WABA status data:', statusData);
        console.log('🔍 Connected value from API:', statusData.connected);
        console.log('🔍 Accounts array:', statusData.accounts);
        console.log('🔍 Accounts length:', statusData.accounts?.length);
        
        setWabaConnected(statusData.connected);
        console.log('✅ Set wabaConnected state to:', statusData.connected);
        
        if (statusData.connected && statusData.accounts?.length > 0) {
          // Fetch phone numbers for each WABA
          const accountsWithPhones = await Promise.all(
            statusData.accounts.map(async (account: any) => {
              try {
                console.log('📱 Fetching phone numbers for WABA:', account.waba_id);
                const phoneResponse = await fetch(
                  `${backendUrl}/api/waba/phone-numbers?waba_id=${account.waba_id}`,
                  {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                  }
                );
                
                if (phoneResponse.ok) {
                  const phoneData = await phoneResponse.json();
                  console.log('📞 Phone data:', phoneData);
                  
                  return {
                    id: account.waba_id,
                    name: phoneData.phone_numbers?.[0]?.verified_name || `WABA ${account.waba_id.substring(0, 8)}...`,
                    phone: phoneData.phone_numbers?.[0]?.display_phone_number || 'No phone',
                    waba_id: account.waba_id,
                    business_id: account.owner_business_id,
                    phone_numbers: phoneData.phone_numbers || [],
                    is_active: account.is_active,
                  };
                }
              } catch (err) {
                console.error('❌ Error fetching phone numbers:', err);
              }
              
              return {
                id: account.waba_id,
                name: `WABA ${account.waba_id.substring(0, 8)}...`,
                phone: 'Not configured',
                waba_id: account.waba_id,
                business_id: account.owner_business_id,
                is_active: account.is_active,
              };
            })
          );
          
          console.log('📋 Final accounts with phones:', accountsWithPhones);
          setWabaAccounts(accountsWithPhones);
          
          if (accountsWithPhones.length > 0 && !selectedWhatsApp) {
            setSelectedWhatsApp(accountsWithPhones[0]);
            console.log('✅ Auto-selected first account:', accountsWithPhones[0]);
          }
        } else {
          console.log('⚠️ No accounts found or not connected');
          setWabaAccounts([]);
        }
      } else {
        console.error('❌ Failed to fetch WABA status:', statusResponse.status, statusResponse.statusText);
        const errorText = await statusResponse.text();
        console.error('Error response:', errorText);
        setWabaConnected(false);
      }
    } catch (error) {
      console.error('❌ Error fetching WABA accounts:', error);
      setWabaConnected(false);
    } finally {
      setLoadingWaba(false);
    }
  };
  
  // Wallet balance and top up modal logic
  const [showTopUp, setShowTopUp] = useState(false);
  const [walletBalance, setWalletBalance] = useState(1250.75); // Replace with backend value
  const [topUpAmount, setTopUpAmount] = useState(0);
  // History modal toggle
  const [showHistory, setShowHistory] = useState(false);
  // Example payment history data
  const paymentHistory = [
    { id: 1, type: 'Top Up', amount: 1000, date: '2025-11-10', method: 'Credit Card' },
    { id: 2, type: 'Spend', amount: -250, date: '2025-11-12', method: 'WhatsApp Ads' },
    { id: 3, type: 'Top Up', amount: 500, date: '2025-11-15', method: 'UPI' },
    { id: 4, type: 'Spend', amount: -100, date: '2025-11-16', method: 'Instagram Ads' },
  ];
  
  const getSelectedAccount = () => {
    if (manager === 'whatsapp') return selectedWhatsApp;
    if (manager === 'instagram') return selectedInstagram;
    return selectedAds;
  };
  
  const getCurrentAccounts = () => {
    if (manager === 'whatsapp') return wabaAccounts;
    if (manager === 'instagram') return instagramAccounts;
    return adsAccounts;
  };
  
  const handleAccountSelect = (account: any) => {
    if (manager === 'whatsapp') setSelectedWhatsApp(account);
    else if (manager === 'instagram') setSelectedInstagram(account);
    else setSelectedAds(account);
  };
  
  const getAccountDisplayText = (account: any) => {
    if (manager === 'whatsapp') return account.phone || 'Not configured';
    if (manager === 'instagram') return account.handle;
    return account.accountId;
  };
  
  const switchManager = (m: 'whatsapp' | 'ads' | 'instagram') => {
    if (onManagerChange) onManagerChange(m);
    if (m === 'ads') navigate('/ads/dashboard');
    else if (m === 'instagram') navigate('/ig/dashboard');
    else navigate('/wa/dashboard');
  };
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };
  
  const handleTopUp = (amount: number) => {
    setWalletBalance(prev => prev + amount);
  };
  
  // Debug log for current state
  console.log('🎨 Rendering Header with state:', {
    wabaConnected,
    wabaAccountsCount: wabaAccounts.length,
    loadingWaba,
    selectedWhatsApp,
    authUserId: authUser?.id
  });
  
  return (
    <header 
      className="border-b border-border px-6 py-3 flex items-center justify-between"
      style={{
        background: 'white',
        minHeight: '64px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="flex items-center gap-3">
        <img src="/src/assets/images/avianya.png" alt="Avianya Tech Logo" className="h-12" />
        <span className="font-semibold text-3xl">Avianya Tech</span>
      </div>
      <div className="flex items-center space-x-4">
        {/* Account Selector Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="min-w-[220px] justify-between"
              style={{
                borderRadius: '8px',
                borderColor: manager === 'whatsapp' 
                  ? (wabaConnected ? '#25D366' : '#ef4444')
                  : manager === 'instagram' ? '#de628a' : '#4A90E2',
                borderWidth: '3px',
                height: '60px',
              }}
              disabled={manager === 'whatsapp' && !wabaConnected}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  {manager === 'whatsapp' ? (
                    <>
                      WhatsApp Account
                      {!wabaConnected && <AlertCircle className="w-3 h-3 text-red-500" />}
                    </>
                  ) : 
                   manager === 'instagram' ? 'Instagram Account' : 'Ad Account'}
                </span>
                <span className="text-sm font-medium">
                  {manager === 'whatsapp' ? (
                    loadingWaba ? 'Loading...' :
                    !wabaConnected ? 'Not Connected' :
                    !selectedWhatsApp ? 'Select Account' :
                    selectedWhatsApp.name
                  ) : (
                    getSelectedAccount().name
                  )}
                </span>
              </div>
              {((manager === 'whatsapp' && wabaConnected) || manager !== 'whatsapp') && (
                <ChevronDown className="ml-2 h-6 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[250px]">
            <DropdownMenuLabel>
              {manager === 'whatsapp' ? (
                <div className="flex items-center justify-between">
                  {wabaConnected ? (
                    <span>Select WhatsApp Account</span>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>No WABA Connected</span>
                    </div>
                  )}
                  {manager === 'whatsapp' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchWABAAccounts();
                      }}
                      className="ml-2 p-1 rounded hover:bg-gray-100 transition-colors"
                      title="Refresh accounts"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingWaba ? 'animate-spin' : ''}`} />
                    </button>
                  )}
                </div>
              ) : 
              manager === 'instagram' ? 'Select Instagram Account' : 'Select Ad Account'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {manager === 'whatsapp' && !wabaConnected ? (
              <DropdownMenuItem 
                onClick={() => navigate('/wa/dashboard')}
                className="cursor-pointer text-blue-600 hover:text-blue-700"
              >
                <span className="font-medium">→ Connect WhatsApp Business</span>
              </DropdownMenuItem>
            ) : (
              getCurrentAccounts().map((account) => (
                <DropdownMenuItem
                  key={account.id}
                  onClick={() => handleAccountSelect(account)}
                  className="flex flex-col items-start cursor-pointer"
                >
                  <span className="font-medium">{account.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {getAccountDisplayText(account)}
                  </span>
                  {manager === 'whatsapp' && account.is_active && (
                    <span className="text-xs text-green-600 font-semibold mt-1">● Active</span>
                  )}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Manager toggle buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => switchManager('whatsapp')}
            className="toggle-btn  rounded transition-all"
            style={{
              background: manager === 'whatsapp' ? '#E8F5E9' : 'transparent',
              border: manager === 'whatsapp' ? '2px solid #25D366' : '2px solid transparent',
                borderRadius: '10px'
            }}
            aria-label="Switch to WhatsApp Manager"
            title="WhatsApp Manager"
          >
            <img
              src="/src/assets/images/Whatsapp Icons.png"
              alt="WhatsApp Manager"
              style={{
                width: '50px',
                height: '50px',
                padding: '2px',
              }}
            />
          </button>
          <button
            type="button"
            onClick={() => switchManager('ads')}
            className="toggle-btn  rounded transition-all"
            style={{
              background: manager === 'ads' ? '#E3F2FD' : 'transparent',
              border: manager === 'ads' ? '2px solid #4A90E2' : '2px solid transparent',
               borderRadius: '10px',
            }}
            aria-label="Switch to Ads Manager"
            title="Ads Manager"
          >
           <img
              src="/src/assets/images/ads_icon.png"
              alt="WhatsApp Manager"
              style={{
                width: '50px',
                height: '50px',
                padding: '0',
              }}
            />
          </button>
          <button
            type="button"
            onClick={() => switchManager('instagram')}
            className="toggle-btn rounded transition-all"
            style={{
              background: manager === 'instagram' ? '#FFF5F7' : 'transparent',
              border: manager === 'instagram' ? '2px solid #de628a' : '2px solid transparent',
              borderRadius: '10px',
            }}
            aria-label="Switch to Instagram Manager"
            title="Instagram Manager"
          >
           <img
              src="/src/assets/images/insta_icon.png"
              alt="Instagram Manager"
              style={{
                width: '50px',
                height: '50px',
                padding: '3px',
              }}
            />
          </button>
        </div>
        {/* Wallet Balance */}
        <div 
          className="flex items-center gap-3 ml-6 px-5 py-3 rounded-xl cursor-pointer transition-all hover:shadow-lg hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            minWidth: '125px',
            maxWidth: '200px',
            maxHeight: '60px',
          }}
          onClick={() => setShowTopUp(true)}
          title="Click to top up wallet"
        >
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-white bg-opacity-25 backdrop-blur-sm">
            <Wallet className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-white text-opacity-90 font-medium tracking-wide">Wallet Balance</span>
            <span className="text-xl font-bold text-white tracking-tight">₹{walletBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Top Up Modal */}
      {showTopUp && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setShowTopUp(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl p-10 min-w-[450px] max-w-md relative animate-in"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Avianya Logo and Name */}
            <div className="flex items-center gap-3 mb-8">
              <img src="/src/assets/images/avianya.png" alt="Avianya Tech Logo" className="h-12" />
              <span className="font-semibold text-2xl">Avianya Tech</span>
            </div>
            {/* Close button */}
            <button
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition-all hover:rotate-90"
              onClick={() => setShowTopUp(false)}
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
            {/* Header with View History icon */}
            <div className="flex items-center gap-4 mb-8">
              <div 
                className="flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                <CreditCard className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Top Up Wallet</h2>
                <p className="text-sm text-gray-500 mt-1">Add funds to your account</p>
              </div>
              {/* View History icon/button */}
              <button
                className="ml-2 p-2 rounded-full hover:bg-indigo-50 transition-all flex items-center gap-1"
                title="View Payment History"
                onClick={() => setShowHistory(h => !h)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10m-9 4h6m-7 5h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline text-xs font-semibold text-indigo-500">History</span>
              </button>
            </div>
            {/* Modal content: toggle between top-up and history */}
            {showHistory ? (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-700 mb-4">Payment & Spend History</h3>
                <div className="max-h-64 overflow-y-auto">
                  {paymentHistory.length === 0 ? (
                    <div className="text-gray-400 text-sm">No history found.</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500 border-b">
                          <th className="py-2 text-left">Date</th>
                          <th className="py-2 text-left">Type</th>
                          <th className="py-2 text-left">Method</th>
                          <th className="py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map(item => (
                          <tr key={item.id} className="border-b last:border-b-0">
                            <td className="py-2">{item.date}</td>
                            <td className="py-2">{item.type}</td>
                            <td className="py-2">{item.method}</td>
                            <td className={`py-2 text-right font-bold ${item.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>₹{Math.abs(item.amount).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    className="flex-1 px-6 py-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all font-bold text-gray-700 hover:scale-105"
                    onClick={() => setShowHistory(false)}
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Current Balance */}
                <div className="mb-8 p-5 rounded-xl bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 border-2 border-purple-100 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600 tracking-wide">Current Balance</span>
                    <span className="text-2xl font-bold text-purple-600">₹{walletBalance.toFixed(2)}</span>
                  </div>
                </div>
                {/* Amount Input */}
                <div className="mb-8">
                  <label className="block mb-3 text-sm font-bold text-gray-700 tracking-wide">Enter Amount</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold text-xl">₹</span>
                    <input
                      type="number"
                      min={1}
                      value={topUpAmount || ''}
                      onChange={e => setTopUpAmount(Number(e.target.value))}
                      className="w-full pl-10 pr-5 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 transition text-xl font-bold text-gray-700"
                      placeholder="0.00"
                    />
                  </div>
                  {/* Quick amount buttons */}
                  <div className="flex gap-3 mt-4">
                    {[100, 500, 1000, 2000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setTopUpAmount(amount)}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-sm font-bold text-gray-700 hover:scale-105"
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    className="flex-1 px-6 py-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all font-bold text-gray-700 hover:scale-105"
                    onClick={() => setShowTopUp(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 px-6 py-4 rounded-xl text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg"
                    style={{
                      background: topUpAmount > 0 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#d1d5db',
                    }}
                    onClick={() => {
                      handleTopUp(topUpAmount);
                      setShowTopUp(false);
                      setTopUpAmount(0);
                    }}
                    disabled={topUpAmount <= 0}
                  >
                    Add ₹{topUpAmount > 0 ? topUpAmount.toFixed(2) : '0.00'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
