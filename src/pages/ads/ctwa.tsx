import { useState, useEffect } from "react";
import { Header } from "../../components/ads/Dashboard/Header";
import { Sidebar } from "../../components/ads/Dashboard/Sidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import { MessageCircle, Phone, Send, Image as ImageIcon, Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";

const specialAdCategoriesList = [
  {
    value: "NONE",
    label: "None",
    description: "",
  },
  {
    value: "FINANCIAL",
    label: "Financial products and services",
    description: "Ads for credit cards, long-term financing, checking and savings accounts, investment services, insurance services, or other related financial opportunities.",
  },
  {
    value: "EMPLOYMENT",
    label: "Employment",
    description: "Ads for job offers, internships, certification programs, or other related employment opportunities.",
  },
  {
    value: "HOUSING",
    label: "Housing",
    description: "Ads for real estate listings, homeowners insurance, mortgage loans, or other related housing opportunities.",
  },
  {
    value: "CREDIT",
    label: "Credit",
    description: "Ads for credit card offers, auto loans, or other related credit opportunities.",
  },
  {
    value: "ISSUES_ELECTIONS_POLITICS",
    label: "Social issues, elections or politics",
    description: "Ads about social issues, elections, or politics.",
  },
  {
    value: "ONLINE_GAMBLING_AND_GAMING",
    label: "Online gambling and gaming",
    description: "Ads for online gambling and gaming.",
  },
];

export default function CTWA() {
  // User data for header
  const user = {
    name: localStorage.getItem("user_name") || "User",
    photo: localStorage.getItem("user_photo") || null,
    email: localStorage.getItem("user_email") || null,
  };
  
  // Ad Accounts state
  const [adAccounts, setAdAccounts] = useState<{ id: string; name: string; platform_ad_account_id: string }[]>([]);
  const [loadingAdAccounts, setLoadingAdAccounts] = useState(false);
  const [adAccountsError, setAdAccountsError] = useState<string | null>(null);
  const [selectedAdAccount, setSelectedAdAccount] = useState<string>("");
  
  const [formData, setFormData] = useState({
    campaignName: "",
    specialAdEnabled: false,
    specialAdCategory: "",
    adName: "",
    phoneNumber: "",
    countryCode: "+91",
    primaryText: "",
    headline: "",
    description: "",
    websiteUrl: "",
    callToAction: "WHATSAPP_MESSAGE",
    imageUrl: "",
  });

  // Fetch ad accounts on component mount
  useEffect(() => {
    setLoadingAdAccounts(true);
    setAdAccountsError(null);
    const token = localStorage.getItem('access_token');
    if (!token) {
      setAdAccountsError('No access token found. Please log in.');
      setLoadingAdAccounts(false);
      return;
    }
    fetch('http://localhost:8080/api/ad-accounts', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch ad accounts');
        return res.json();
      })
      .then(data => {
        setAdAccounts(data);
        // Set default selected ad account only if not already set
        if (data.length > 0) {
          setSelectedAdAccount(data[0].id);
        }
      })
      .catch(err => {
        setAdAccountsError(err.message);
      })
      .finally(() => setLoadingAdAccounts(false));
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === "specialAdEnabled") {
      setFormData(prev => ({ ...prev, [field]: value === "true" || value === true }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCreateAd = () => {
    // Validation
    if (!selectedAdAccount) {
      alert("Please select an ad account");
      return;
    }
    if (!formData.campaignName) {
      alert("Please enter a campaign name");
      return;
    }
    if (!formData.adName) {
      alert("Please enter an ad name");
      return;
    }
    if (!formData.phoneNumber) {
      alert("Please enter a WhatsApp Business number");
      return;
    }
    if (!formData.primaryText) {
      alert("Please enter primary text");
      return;
    }
    if (!formData.headline) {
      alert("Please enter a headline");
      return;
    }

    const selectedAccount = adAccounts.find(acc => acc.id === selectedAdAccount);
    
    console.log("Creating CTWA ad with data:", {
      adAccount: selectedAccount,
      ...formData
    });
    // TODO: Integrate with backend API
    alert("Click to WhatsApp Ad creation coming soon!");
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header user={user} /> */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Click to WhatsApp Ads</h1>
            <p className="text-muted-foreground">Create ads that drive conversations on WhatsApp</p>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="mb-6 border-green-500/20 bg-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-700 dark:text-green-400 mb-1">
                  Drive Customer Conversations
                </h3>
                <p className="text-sm text-muted-foreground">
                  Click to WhatsApp ads help you connect with customers directly on WhatsApp. 
                  Start conversations, answer questions, and drive conversions through messaging.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <div className="space-y-6">
          {/* Ad Account Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Ad Account</CardTitle>
              <CardDescription>Select the ad account to create this campaign under.</CardDescription>
            </CardHeader>
            <CardContent>
              {adAccountsError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{adAccountsError}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="adAccount">Select ad account *</Label>
                <Select
                  value={selectedAdAccount}
                  onValueChange={setSelectedAdAccount}
                  disabled={loadingAdAccounts}
                >
                  <SelectTrigger id="adAccount" className="w-full mt-2">
                    <SelectValue placeholder={loadingAdAccounts ? "Loading ad accounts..." : "Select an ad account"} />
                  </SelectTrigger>
                  <SelectContent>
                    {adAccounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name} ({acc.platform_ad_account_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!loadingAdAccounts && adAccounts.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    No ad accounts found. Please connect your Facebook account first.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Set up your WhatsApp campaign details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="campaignName">Campaign Name *</Label>
                <Input
                  id="campaignName"
                  placeholder="e.g., Summer Sale WhatsApp Campaign"
                  value={formData.campaignName}
                  onChange={(e) => handleInputChange("campaignName", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="adName">Ad Name *</Label>
                <Input
                  id="adName"
                  placeholder="e.g., WhatsApp Ad 1"
                  value={formData.adName}
                  onChange={(e) => handleInputChange("adName", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="countryCode">Country Code</Label>
                  <Select
                    value={formData.countryCode}
                    onValueChange={(val) => handleInputChange("countryCode", val)}
                  >
                    <SelectTrigger id="countryCode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">🇮🇳 +91 (India)</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1 (USA)</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44 (UK)</SelectItem>
                      <SelectItem value="+971">🇦🇪 +971 (UAE)</SelectItem>
                      <SelectItem value="+65">🇸🇬 +65 (Singapore)</SelectItem>
                      <SelectItem value="+61">🇦🇺 +61 (Australia)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="phoneNumber">WhatsApp Business Number *</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="e.g., 9876543210"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your WhatsApp Business number without country code
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Ad Categories */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Special Ad Categories <span className="text-xs text-muted-foreground">(optional)</span></CardTitle>
                  <CardDescription>If your ad belongs to a special category, select it below.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="specialAdToggle" className="text-sm">Enable</Label>
                  <Switch 
                    id="specialAdToggle" 
                    checked={formData.specialAdEnabled} 
                    onCheckedChange={(val: boolean) => handleInputChange("specialAdEnabled", val.toString())} 
                  />
                </div>
              </div>
            </CardHeader>
            {formData.specialAdEnabled && (
              <CardContent>
                <Select
                  value={formData.specialAdCategory}
                  onValueChange={(val: string) => handleInputChange("specialAdCategory", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialAdCategoriesList.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div>
                          <div className="font-medium">{cat.label}</div>
                          {cat.description && (
                            <div className="text-xs text-muted-foreground">{cat.description}</div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            )}
          </Card>

          {/* Ad Creative */}
          <Card>
            <CardHeader>
              <CardTitle>Ad Creative</CardTitle>
              <CardDescription>Design your ad content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primaryText">Primary Text *</Label>
                <Textarea
                  id="primaryText"
                  placeholder="Write your main ad message here..."
                  value={formData.primaryText}
                  onChange={(e) => handleInputChange("primaryText", e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.primaryText.length}/500 characters
                </p>
              </div>

              <div>
                <Label htmlFor="headline">Headline *</Label>
                <Input
                  id="headline"
                  placeholder="e.g., Get 20% off today!"
                  value={formData.headline}
                  onChange={(e) => handleInputChange("headline", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details about your offer..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">Image</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    placeholder="Image URL or upload"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card>
            <CardHeader>
              <CardTitle>Call to Action</CardTitle>
              <CardDescription>Choose how customers will connect</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="callToAction">CTA Button</Label>
                <Select
                  value={formData.callToAction}
                  onValueChange={(val) => handleInputChange("callToAction", val)}
                >
                  <SelectTrigger id="callToAction">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WHATSAPP_MESSAGE">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Send WhatsApp Message
                      </div>
                    </SelectItem>
                    <SelectItem value="CALL_NOW">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Call Now
                      </div>
                    </SelectItem>
                    <SelectItem value="GET_QUOTE">
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Get Quote
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
                <Input
                  id="websiteUrl"
                  placeholder="https://your-website.com"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Ad Preview</CardTitle>
              <CardDescription>How your ad will appear</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-card max-w-md">
                {formData.imageUrl && (
                  <div className="mb-3 bg-muted rounded-md h-48 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <p className="text-sm mb-2">{formData.primaryText || "Your primary text will appear here..."}</p>
                <h3 className="font-semibold mb-1">{formData.headline || "Your headline"}</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {formData.description || "Your description"}
                </p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Send Message
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formData.countryCode} {formData.phoneNumber || "XXXXXXXXXX"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Save Draft</Button>
            <Button onClick={handleCreateAd} className="bg-green-500 hover:bg-green-600">
              <MessageCircle className="w-4 h-4 mr-2" />
              Create WhatsApp Ad
            </Button>
          </div>
        </div>
          </div>
        </main>
      </div>
    </div>
  );
}
