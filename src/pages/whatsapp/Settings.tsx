import React, { useState, useEffect } from 'react';
import { Phone, Server, User, Plus, Trash2, Edit2, Save, X, CheckCircle, AlertCircle, Key, Loader2, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/store/authStore';

interface PhoneNumber {
  id: string;
  phone_number: string;
  display_name: string;
  waba_id: string;
  status: 'active' | 'inactive';
  created_at: string;
  profile_about?: string;
  profile_description?: string;
  profile_address?: string;
  profile_email?: string;
  profile_websites?: string[];
  profile_vertical?: string;
}

interface WABAAccount {
  id: string;
  name: string;
  waba_id: string;
  business_id: string;
  api_version: string;
  status: 'active' | 'inactive';
  phone_numbers_count: number;
}

interface UserInfo {
  name: string;
  email: string;
  company: string;
  timezone: string;
}

const Settings: React.FC = () => {
  // Get token from auth store
  const { token } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('phone-numbers');
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [wabaAccounts, setWABAAccounts] = useState<WABAAccount[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    company: '',
    timezone: 'UTC',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Add Phone Number form state
  const [showAddPhone, setShowAddPhone] = useState(false);
  const [newPhone, setNewPhone] = useState({
    phone_number: '',
    display_name: '',
    waba_id: '',
  });

  // Edit WABA form state
  const [editingWABA, setEditingWABA] = useState<string | null>(null);
  const [editWABAForm, setEditWABAForm] = useState({
    name: '',
    api_version: '',
  });

  // Edit User Info state
  const [editingUser, setEditingUser] = useState(false);
  const [editUserForm, setEditUserForm] = useState<UserInfo>({
    name: '',
    email: '',
    company: '',
    timezone: 'UTC',
  });

  // Change Password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Edit Phone Number Profile state
  const [editingPhoneProfile, setEditingPhoneProfile] = useState<string | null>(null);
  const [phoneProfileForm, setPhoneProfileForm] = useState({
    about: '',
    description: '',
    address: '',
    email: '',
    website1: '',
    website2: '',
    vertical: 'OTHER',
  });
  const [showVerticalPopup, setShowVerticalPopup] = useState(false);

  const verticalOptions = [
    'ALCOHOL', 'APPAREL', 'AUTO', 'BEAUTY', 'EDU', 'ENTERTAIN', 'EVENT_PLAN',
    'FINANCE', 'GOVT', 'GROCERY', 'HEALTH', 'HOTEL', 'MATRIMONY_SERVICE',
    'NONPROFIT', 'ONLINE_GAMBLING', 'OTHER', 'OTC_DRUGS', 'PHYSICAL_GAMBLING',
    'PROF_SERVICES', 'RESTAURANT', 'RETAIL', 'TRAVEL'
  ];

  useEffect(() => {
    if (token) {
      fetchPhoneNumbers();
      fetchWABAAccounts();
      fetchUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchPhoneNumbers = async () => {
    console.log('📱 Settings: Fetching phone numbers...');
    setLoading(true);
    try {
      if (!token) {
        console.error('❌ No token available');
        setMessage({ type: 'error', text: 'Not authenticated' });
        return;
      }
      
      console.log('🔑 Token exists:', !!token);
      const response = await fetch('http://localhost:8080/settings/phone-numbers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Phone numbers response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Phone numbers data:', data);
        setPhoneNumbers(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch phone numbers:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setPhoneNumbers([]);
      }
    } catch (error) {
      console.error('Failed to fetch phone numbers:', error);
      setMessage({ type: 'error', text: 'Failed to load phone numbers' });
      setPhoneNumbers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWABAAccounts = async () => {
    console.log('🏢 Settings: Fetching WABA accounts...');
    try {
      if (!token) {
        console.error('❌ No token available');
        return;
      }
      
      const response = await fetch('http://localhost:8080/settings/waba-accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setWABAAccounts(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch WABA accounts:', response.status);
        setWABAAccounts([]);
      }
    } catch (error) {
      console.error('Failed to fetch WABA accounts:', error);
      setWABAAccounts([]);
    }
  };

  const fetchUserInfo = async () => {
    console.log('👤 Settings: Fetching user info...');
    try {
      if (!token) {
        console.error('❌ No token available');
        return;
      }
      
      const response = await fetch('http://localhost:8080/settings/user-info', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
        setEditUserForm(data);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const handleAddPhoneNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated' });
        return;
      }
      
      const response = await fetch('http://localhost:8080/settings/phone-numbers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPhone),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Phone number added successfully!' });
        setShowAddPhone(false);
        setNewPhone({ phone_number: '', display_name: '', waba_id: '' });
        fetchPhoneNumbers();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to add phone number' });
      }
    } catch (error) {
      console.error('Error adding phone number:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoneNumber = async (id: string) => {
    if (!confirm('Are you sure you want to delete this phone number?')) return;
    
    setLoading(true);
    try {
      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated' });
        return;
      }
      
      const response = await fetch(`http://localhost:8080/settings/phone-numbers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Phone number deleted successfully!' });
        fetchPhoneNumbers();
      } else {
        setMessage({ type: 'error', text: 'Failed to delete phone number' });
      }
    } catch (error) {
      console.error('Error deleting phone number:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWABA = async (wabaId: string) => {
    setLoading(true);
    setMessage(null);
    
    try {
      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated' });
        return;
      }
      
      const response = await fetch(`http://localhost:8080/settings/waba-accounts/${wabaId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editWABAForm),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'WABA account updated successfully!' });
        setEditingWABA(null);
        fetchWABAAccounts();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to update WABA account' });
      }
    } catch (error) {
      console.error('Error updating WABA:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated' });
        return;
      }
      
      const response = await fetch('http://localhost:8080/settings/user-info', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editUserForm),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setEditingUser(false);
        setUserInfo(editUserForm);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      if (!token) {
        setPasswordError('Not authenticated');
        return;
      }

      const response = await fetch('http://localhost:8080/settings/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword
        })
      });

      if (response.ok) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setShowChangePassword(false);
          setPasswordSuccess('');
        }, 2000);
      } else {
        const data = await response.json();
        setPasswordError(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Failed to change password:', error);
      setPasswordError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePhoneProfile = async (phoneId: string) => {
    setLoading(true);
    setMessage(null);

    try {
      if (!token) {
        setMessage({ type: 'error', text: 'Not authenticated' });
        return;
      }

      // Prepare websites array
      const websites = [];
      if (phoneProfileForm.website1) websites.push(phoneProfileForm.website1);
      if (phoneProfileForm.website2) websites.push(phoneProfileForm.website2);

      const response = await fetch(`http://localhost:8080/settings/phone-numbers/${phoneId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          about: phoneProfileForm.about,
          description: phoneProfileForm.description,
          address: phoneProfileForm.address,
          email: phoneProfileForm.email,
          websites: websites,
          vertical: phoneProfileForm.vertical,
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'WhatsApp Business Profile updated successfully!' });
        setEditingPhoneProfile(null);
        setPhoneProfileForm({
          about: '',
          description: '',
          address: '',
          email: '',
          website1: '',
          website2: '',
          vertical: 'OTHER',
        });
        fetchPhoneNumbers(); // Refresh the list
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Failed to update phone profile:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen min-w-screen bg-white p-4">
      <div className="max-w-screen mx-auto mr-4 ml-4 mt-4 ">
        {/* Header */}
         <div className="bg-white border border-slate-200 rounded-2xl p-1 shadow-md mb-4 ">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 m-2">
        <div className="mb-2">
          <div className="flex items-center gap-3 pl-3">
            <SettingsIcon className="text-emerald-500 w-7 h-7 " />
            <div>
              <h1 className="text-xl font-bold text-slate-800">Settings</h1>
              <p className="text-slate-500 text-xs mt-0.5">Manage your account, phone numbers, and business preferences</p>
            </div>
          </div>
        </div>
        </div>
        </div>

        {/* Alert Messages */}
        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'border-emerald-500 bg-emerald-50' : 'border-red-500 bg-red-50'}`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === 'success' ? 'text-emerald-700' : 'text-red-700'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1 shadow-sm">
            <TabsTrigger value="phone-numbers" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Phone className="w-4 h-4 mr-2" />
              Phone Numbers
            </TabsTrigger>
            <TabsTrigger value="waba" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Server className="w-4 h-4 mr-2" />
              WABA Management
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Account Info
            </TabsTrigger>
          </TabsList>

          {/* Phone Numbers Tab */}
          <TabsContent value="phone-numbers" className="space-y-4">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl text-slate-800">Phone Numbers</CardTitle>
                    <CardDescription className="text-slate-600">Manage phone numbers linked to your WABA accounts</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowAddPhone(!showAddPhone)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Phone Number
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Add Phone Form */}
                {showAddPhone && (
                  <form onSubmit={handleAddPhoneNumber} className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label htmlFor="phone_number" className="text-slate-700">Phone Number</Label>
                        <Input
                          id="phone_number"
                          type="text"
                          placeholder="+1234567890"
                          value={newPhone.phone_number}
                          onChange={(e) => setNewPhone({ ...newPhone, phone_number: e.target.value })}
                          required
                          className="border-slate-300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="display_name" className="text-slate-700">Display Name</Label>
                        <Input
                          id="display_name"
                          type="text"
                          placeholder="Customer Support"
                          value={newPhone.display_name}
                          onChange={(e) => setNewPhone({ ...newPhone, display_name: e.target.value })}
                          required
                          className="border-slate-300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="waba_id" className="text-slate-700">WABA Account</Label>
                        <select
                          id="waba_id"
                          value={newPhone.waba_id}
                          onChange={(e) => setNewPhone({ ...newPhone, waba_id: e.target.value })}
                          required
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                          <option value="">Select WABA Account</option>
                          {wabaAccounts.map((waba) => (
                            <option key={waba.id} value={waba.id}>
                              {waba.name} ({waba.id})
                            </option>
                          ))}
                        </select>
                        {wabaAccounts.length === 0 && (
                          <p className="text-xs text-amber-600 mt-1">⚠️ No WABA accounts found. Please add a WABA account first.</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading || wabaAccounts.length === 0} className="bg-emerald-600 hover:bg-emerald-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save Phone Number
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowAddPhone(false);
                          setNewPhone({ phone_number: '', display_name: '', waba_id: '' });
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                {/* Phone Numbers List */}
                <div className="space-y-3">
                  {loading && phoneNumbers.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">Loading phone numbers...</div>
                  ) : phoneNumbers.length === 0 ? (
                    <div className="text-center py-8">
                      <Phone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No phone numbers added yet</p>
                      <p className="text-sm text-slate-400 mt-1">Click "Add Phone Number" to get started</p>
                    </div>
                  ) : (
                    phoneNumbers.map((phone) => (
                      <div 
                        key={phone.id} 
                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${phone.status === 'active' ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                            <Phone className={`w-5 h-5 ${phone.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{phone.display_name}</p>
                            <p className="text-sm text-slate-600">{phone.phone_number}</p>
                            <p className="text-xs text-slate-500">WABA ID: {phone.waba_id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            phone.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {phone.status}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingPhoneProfile(phone.id);
                              // Pre-fill form with existing data
                              setPhoneProfileForm({
                                about: phone.profile_about || '',
                                description: phone.profile_description || '',
                                address: phone.profile_address || '',
                                email: phone.profile_email || '',
                                website1: phone.profile_websites?.[0] || '',
                                website2: phone.profile_websites?.[1] || '',
                                vertical: phone.profile_vertical || 'OTHER',
                              });
                            }}
                            className="text-emerald-600 hover:bg-emerald-50"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePhoneNumber(phone.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WABA Management Tab */}
          <TabsContent value="waba" className="space-y-4">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
                <CardTitle className="text-2xl text-slate-800">WABA Accounts</CardTitle>
                <CardDescription className="text-slate-600">Manage your WhatsApp Business API accounts</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {wabaAccounts.length === 0 ? (
                    <div className="text-center py-8">
                      <Server className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No WABA accounts configured</p>
                      <p className="text-sm text-slate-400 mt-1">Contact support to set up your WABA account</p>
                    </div>
                  ) : (
                    wabaAccounts.map((waba) => (
                      <div 
                        key={waba.id} 
                        className="p-5 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
                      >
                        {editingWABA === waba.id ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="edit_name" className="text-slate-700">Account Name</Label>
                                <Input
                                  id="edit_name"
                                  type="text"
                                  value={editWABAForm.name}
                                  onChange={(e) => setEditWABAForm({ ...editWABAForm, name: e.target.value })}
                                  className="border-slate-300"
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit_api_version" className="text-slate-700">API Version</Label>
                                <Input
                                  id="edit_api_version"
                                  type="text"
                                  value={editWABAForm.api_version}
                                  onChange={(e) => setEditWABAForm({ ...editWABAForm, api_version: e.target.value })}
                                  className="border-slate-300"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleUpdateWABA(waba.id)}
                                disabled={loading}
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setEditingWABA(null)}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className={`p-3 rounded-full ${waba.status === 'active' ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                                <Server className={`w-6 h-6 ${waba.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`} />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-800 mb-1">{waba.name}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-slate-500">WABA ID:</span>
                                    <span className="ml-2 text-slate-700 font-mono">{waba.waba_id}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Business ID:</span>
                                    <span className="ml-2 text-slate-700 font-mono">{waba.business_id}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">API Version:</span>
                                    <span className="ml-2 text-slate-700">{waba.api_version}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Phone Numbers:</span>
                                    <span className="ml-2 text-slate-700 font-semibold">{waba.phone_numbers_count}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                waba.status === 'active' 
                                  ? 'bg-emerald-100 text-emerald-700' 
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {waba.status}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingWABA(waba.id);
                                  setEditWABAForm({ name: waba.name, api_version: waba.api_version });
                                }}
                                className="text-emerald-600 hover:bg-emerald-50"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Info Tab */}
          <TabsContent value="account" className="space-y-4">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl text-slate-800">Account Information</CardTitle>
                    <CardDescription className="text-slate-600">Manage your profile and preferences</CardDescription>
                  </div>
                  {!editingUser && (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => setShowChangePassword(true)}
                        variant="outline"
                        className="border-gray-600 text-gray-700 hover:bg-gray-50"
                      >
                        <Key className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                      <Button 
                        onClick={() => setEditingUser(true)}
                        variant="outline"
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {editingUser ? (
                  <form onSubmit={handleUpdateUserInfo} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="user_name" className="text-slate-700">Full Name</Label>
                        <Input
                          id="user_name"
                          type="text"
                          value={editUserForm.name}
                          onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                          className="border-slate-300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="user_email" className="text-slate-700">Email</Label>
                        <Input
                          id="user_email"
                          type="email"
                          value={editUserForm.email}
                          onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                          className="border-slate-300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="user_company" className="text-slate-700">Company</Label>
                        <Input
                          id="user_company"
                          type="text"
                          value={editUserForm.company}
                          onChange={(e) => setEditUserForm({ ...editUserForm, company: e.target.value })}
                          className="border-slate-300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="user_timezone" className="text-slate-700">Timezone</Label>
                        <Input
                          id="user_timezone"
                          type="text"
                          value={editUserForm.timezone}
                          onChange={(e) => setEditUserForm({ ...editUserForm, timezone: e.target.value })}
                          className="border-slate-300"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => {
                          setEditingUser(false);
                          setEditUserForm(userInfo);
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-500 mb-1">Full Name</p>
                        <p className="text-lg font-semibold text-slate-800">{userInfo.name || 'Not set'}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-500 mb-1">Email</p>
                        <p className="text-lg font-semibold text-slate-800">{userInfo.email || 'Not set'}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-500 mb-1">Company</p>
                        <p className="text-lg font-semibold text-slate-800">{userInfo.company || 'Not set'}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-500 mb-1">Timezone</p>
                        <p className="text-lg font-semibold text-slate-800">{userInfo.timezone}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Key className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowChangePassword(false);
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setPasswordError('');
                      setPasswordSuccess('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-800">{passwordError}</p>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <p className="text-sm text-green-800">{passwordSuccess}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter new password (min 8 characters)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Password requirements:</strong>
                  </p>
                  <ul className="text-sm text-blue-700 mt-1 ml-4 list-disc">
                    <li>At least 8 characters long</li>
                    <li>Mix of letters, numbers recommended</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordError('');
                    setPasswordSuccess('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{loading ? 'Changing...' : 'Change Password'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Phone Profile Modal */}
        {editingPhoneProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 flex flex-col" style={{ maxHeight: '85vh' }}>
              {/* Fixed Header */}
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-semibold text-gray-900">Edit WhatsApp Business Profile</h3>
                  </div>
                  <button
                    onClick={() => {
                      setEditingPhoneProfile(null);
                      setPhoneProfileForm({
                        about: '',
                        description: '',
                        address: '',
                        email: '',
                        website1: '',
                        website2: '',
                        vertical: 'OTHER',
                      });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This information will be displayed in your WhatsApp Business profile
                </p>
              </div>

              {/* Scrollable Content */}
              <div className="p-4 space-y-3 overflow-y-auto flex-1">
                {/* About */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    About <span className="text-xs text-gray-500">(Short description)</span>
                  </label>
                  <textarea
                    value={phoneProfileForm.about}
                    onChange={(e) => setPhoneProfileForm({ ...phoneProfileForm, about: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Providing WhatsApp Business API solutions"
                    rows={2}
                    maxLength={139}
                  />
                  <p className="text-xs text-gray-500 mt-1">{phoneProfileForm.about.length}/139 characters</p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-xs text-gray-500">(Detailed description)</span>
                  </label>
                  <textarea
                    value={phoneProfileForm.description}
                    onChange={(e) => setPhoneProfileForm({ ...phoneProfileForm, description: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="We provide the best services in our category."
                    rows={2}
                    maxLength={512}
                  />
                  <p className="text-xs text-gray-500 mt-1">{phoneProfileForm.description.length}/512 characters</p>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={phoneProfileForm.address}
                    onChange={(e) => setPhoneProfileForm({ ...phoneProfileForm, address: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Nagpur, Maharashtra, India"
                    maxLength={256}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={phoneProfileForm.email}
                    onChange={(e) => setPhoneProfileForm({ ...phoneProfileForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="contact@avianya.com"
                  />
                </div>

                {/* Websites */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website 1
                    </label>
                    <input
                      type="url"
                      value={phoneProfileForm.website1}
                      onChange={(e) => setPhoneProfileForm({ ...phoneProfileForm, website1: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="https://avianya.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website 2 <span className="text-xs text-gray-500">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={phoneProfileForm.website2}
                      onChange={(e) => setPhoneProfileForm({ ...phoneProfileForm, website2: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                {/* Vertical (Industry) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry Vertical
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowVerticalPopup(true)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-left flex items-center justify-between hover:bg-gray-50"
                  >
                    <span>{phoneProfileForm.vertical.replace(/_/g, ' ')}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> These changes will be submitted to Meta WhatsApp API and reflected in your WhatsApp Business profile.
                  </p>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="p-4 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
                <button
                  onClick={() => {
                    setEditingPhoneProfile(null);
                    setPhoneProfileForm({
                      about: '',
                      description: '',
                      address: '',
                      email: '',
                      website1: '',
                      website2: '',
                      vertical: 'OTHER',
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdatePhoneProfile(editingPhoneProfile)}
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{loading ? 'Updating...' : 'Update Profile'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Industry Vertical Popup */}
        {showVerticalPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4" style={{ maxHeight: '80vh' }}>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Select Industry Vertical</h3>
                <button
                  onClick={() => setShowVerticalPopup(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Options */}
              <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
                <div className="grid grid-cols-2 gap-2">
                  {verticalOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setPhoneProfileForm({ ...phoneProfileForm, vertical: option });
                        setShowVerticalPopup(false);
                      }}
                      className={`px-4 py-3 text-sm border rounded-lg text-left transition-colors ${
                        phoneProfileForm.vertical === option
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-medium'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowVerticalPopup(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
