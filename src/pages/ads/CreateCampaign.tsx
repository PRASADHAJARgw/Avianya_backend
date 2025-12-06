// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// // import { Button } from "../../components/ads/ads/ui/button";
// import { Button } from "../../components/ads/ui/button";
// import { Input } from "../../components/ads/ui/input";
// import { Label } from "../../components/ads/ui/label";
// import { Textarea } from "../../components/ads/ui/textarea";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ads/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ads/ui/tabs";
// import { Checkbox } from "../../components/ads/ui/checkbox";
// import { RadioGroup, RadioGroupItem } from "../../components/ads/ui/radio-group";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ads/ui/select";
// import { Slider } from "../../components/ads/ui/slider";
// import { Badge } from "../../components/ads/ui/badge";
// import { 
//   ArrowLeft,
//   ArrowRight,
//   CheckCircle2,
//   Upload,
//   Target,
//   Users,
//   DollarSign,
//   Image as ImageIcon,
//   Calendar
// } from "lucide-react";

// const CreateCampaign = () => {
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(0);
//   const [formData, setFormData] = useState({
//     // Campaign Level
//     campaignName: "",
//     objective: "",
//     budgetType: "daily",
//     budget: 50,
    
//     // Ad Set Level  
//     adSetName: "",
//     ageRange: [18, 65],
//     gender: "all",
//     locations: [],
//     interests: [],
    
//     // Ad Level
//     adName: "",
//     primaryText: "",
//     headline: "",
//     description: "",
//     callToAction: "learn_more",
//     websiteUrl: "",
//   });

//   const steps = [
//     { id: 0, title: "Campaign", description: "Set up your campaign objective and budget" },
//     { id: 1, title: "Ad Set", description: "Define your audience and placements" },
//     { id: 2, title: "Ad", description: "Create your ad creative and copy" },
//   ];

//   const objectives = [
//     { id: "awareness", title: "Awareness", description: "Show your ads to people who are most likely to remember them" },
//     { id: "traffic", title: "Traffic", description: "Send people to a destination, like your website" },
//     { id: "engagement", title: "Engagement", description: "Get more messages, video views, post engagement or Page follows" },
//     { id: "leads", title: "Leads", description: "Collect leads for your business or brand" },
//     { id: "sales", title: "Sales", description: "Find people likely to purchase your product or service" },
//   ];

//   const handleNext = () => {
//     if (currentStep < steps.length - 1) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleSubmit = () => {
//     console.log("Campaign created:", formData);
//     navigate("/ads/campaigns");
//   };

//   const updateFormData = (field: string, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   return (
//     <div className="min-h-screen bg-muted/30 p-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" onClick={() => navigate("/ads/campaigns")}>
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back to Campaigns
//             </Button>
//             <div>
//               <h1 className="text-2xl font-bold">Create New Campaign</h1>
//               <p className="text-muted-foreground">Set up your Meta advertising campaign</p>
//             </div>
//           </div>
//         </div>

//         {/* Progress Steps */}
//         <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
//           {steps.map((step, index) => (
//             <div key={step.id} className="flex items-center">
//               <div className="flex flex-col items-center">
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
//                   index <= currentStep 
//                     ? "bg-accent-blue border-accent-blue text-white" 
//                     : "border-muted-foreground text-muted-foreground"
//                 }`}>
//                   {index < currentStep ? (
//                     <CheckCircle2 className="w-5 h-5" />
//                   ) : (
//                     <span>{index + 1}</span>
//                   )}
//                 </div>
//                 <div className="mt-2 text-center">
//                   <div className="text-sm font-medium">{step.title}</div>
//                   <div className="text-xs text-muted-foreground max-w-24">{step.description}</div>
//                 </div>
//               </div>
//               {index < steps.length - 1 && (
//                 <div className={`h-0.5 w-24 mx-4 ${
//                   index < currentStep ? "bg-accent-blue" : "bg-muted"
//                 }`} />
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Form Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Main Form */}
//           <div className="lg:col-span-2">
//             <Card className="shadow-elevated">
//               <CardContent className="p-6">
//                 {/* Campaign Level */}
//                 {currentStep === 0 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-lg font-semibold mb-4 flex items-center">
//                         <Target className="w-5 h-5 mr-2 text-accent-blue" />
//                         Campaign Details
//                       </h3>
                      
//                       <div className="space-y-4">
//                         <div>
//                           <Label htmlFor="campaignName">Campaign Name</Label>
//                           <Input
//                             id="campaignName"
//                             value={formData.campaignName}
//                             onChange={(e) => updateFormData("campaignName", e.target.value)}
//                             placeholder="Enter campaign name"
//                             className="mt-1"
//                           />
//                         </div>

//                         <div>
//                           <Label>Campaign Objective</Label>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
//                             {objectives.map((objective) => (
//                               <div
//                                 key={objective.id}
//                                 className={`p-4 border rounded-lg cursor-pointer transition-colors ${
//                                   formData.objective === objective.id
//                                     ? "border-accent-blue bg-accent-blue/10"
//                                     : "border-border hover:border-accent-blue/50"
//                                 }`}
//                                 onClick={() => updateFormData("objective", objective.id)}
//                               >
//                                 <div className="font-medium">{objective.title}</div>
//                                 <div className="text-sm text-muted-foreground mt-1">
//                                   {objective.description}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         <div>
//                           <Label>Budget & Schedule</Label>
//                           <div className="space-y-4 mt-2">
//                             <RadioGroup
//                               value={formData.budgetType}
//                               onValueChange={(value) => updateFormData("budgetType", value)}
//                             >
//                               <div className="flex items-center space-x-2">
//                                 <RadioGroupItem value="daily" id="daily" />
//                                 <Label htmlFor="daily">Daily Budget</Label>
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 <RadioGroupItem value="lifetime" id="lifetime" />
//                                 <Label htmlFor="lifetime">Lifetime Budget</Label>
//                               </div>
//                             </RadioGroup>
                            
//                             <div>
//                               <Label>Budget Amount: ${formData.budget}</Label>
//                               <Slider
//                                 value={[formData.budget]}
//                                 onValueChange={(value) => updateFormData("budget", value[0])}
//                                 max={1000}
//                                 min={5}
//                                 step={5}
//                                 className="mt-2"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Ad Set Level */}
//                 {currentStep === 1 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-lg font-semibold mb-4 flex items-center">
//                         <Users className="w-5 h-5 mr-2 text-accent-blue" />
//                         Audience & Targeting
//                       </h3>
                      
//                       <div className="space-y-4">
//                         <div>
//                           <Label htmlFor="adSetName">Ad Set Name</Label>
//                           <Input
//                             id="adSetName"
//                             value={formData.adSetName}
//                             onChange={(e) => updateFormData("adSetName", e.target.value)}
//                             placeholder="Enter ad set name"
//                             className="mt-1"
//                           />
//                         </div>

//                         <div>
//                           <Label>Age Range: {formData.ageRange[0]} - {formData.ageRange[1]}</Label>
//                           <Slider
//                             value={formData.ageRange}
//                             onValueChange={(value) => updateFormData("ageRange", value)}
//                             max={65}
//                             min={13}
//                             step={1}
//                             className="mt-2"
//                           />
//                         </div>

//                         <div>
//                           <Label>Gender</Label>
//                           <RadioGroup
//                             value={formData.gender}
//                             onValueChange={(value) => updateFormData("gender", value)}
//                             className="flex gap-6 mt-2"
//                           >
//                             <div className="flex items-center space-x-2">
//                               <RadioGroupItem value="all" id="all" />
//                               <Label htmlFor="all">All</Label>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <RadioGroupItem value="men" id="men" />
//                               <Label htmlFor="men">Men</Label>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <RadioGroupItem value="women" id="women" />
//                               <Label htmlFor="women">Women</Label>
//                             </div>
//                           </RadioGroup>
//                         </div>

//                         <div>
//                           <Label htmlFor="locations">Locations</Label>
//                           <Input
//                             id="locations"
//                             placeholder="Enter countries, states, or cities"
//                             className="mt-1"
//                           />
//                           <div className="flex flex-wrap gap-2 mt-2">
//                             <Badge variant="outline">United States</Badge>
//                             <Badge variant="outline">Canada</Badge>
//                           </div>
//                         </div>

//                         <div>
//                           <Label htmlFor="interests">Detailed Targeting</Label>
//                           <Input
//                             id="interests"
//                             placeholder="Add demographics, interests, and behaviors"
//                             className="mt-1"
//                           />
//                           <div className="flex flex-wrap gap-2 mt-2">
//                             <Badge variant="outline">Technology</Badge>
//                             <Badge variant="outline">Online shopping</Badge>
//                             <Badge variant="outline">Small business owners</Badge>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Ad Level */}
//                 {currentStep === 2 && (
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-lg font-semibold mb-4 flex items-center">
//                         <ImageIcon className="w-5 h-5 mr-2 text-accent-blue" />
//                         Ad Creative
//                       </h3>
                      
//                       <div className="space-y-4">
//                         <div>
//                           <Label htmlFor="adName">Ad Name</Label>
//                           <Input
//                             id="adName"
//                             value={formData.adName}
//                             onChange={(e) => updateFormData("adName", e.target.value)}
//                             placeholder="Enter ad name"
//                             className="mt-1"
//                           />
//                         </div>

//                         <div>
//                           <Label>Media</Label>
//                           <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center mt-2">
//                             <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
//                             <div className="text-sm text-muted-foreground mb-2">
//                               Upload images or videos
//                             </div>
//                             <Button variant="outline" size="sm">
//                               Browse Files
//                             </Button>
//                           </div>
//                         </div>

//                         <div>
//                           <Label htmlFor="primaryText">Primary Text</Label>
//                           <Textarea
//                             id="primaryText"
//                             value={formData.primaryText}
//                             onChange={(e) => updateFormData("primaryText", e.target.value)}
//                             placeholder="Write your ad copy here..."
//                             className="mt-1"
//                             rows={3}
//                           />
//                         </div>

//                         <div>
//                           <Label htmlFor="headline">Headline</Label>
//                           <Input
//                             id="headline"
//                             value={formData.headline}
//                             onChange={(e) => updateFormData("headline", e.target.value)}
//                             placeholder="Add a headline"
//                             className="mt-1"
//                           />
//                         </div>

//                         <div>
//                           <Label htmlFor="description">Description</Label>
//                           <Input
//                             id="description"
//                             value={formData.description}
//                             onChange={(e) => updateFormData("description", e.target.value)}
//                             placeholder="Add a description"
//                             className="mt-1"
//                           />
//                         </div>

//                         <div>
//                           <Label htmlFor="cta">Call to Action</Label>
//                           <Select value={formData.callToAction} onValueChange={(value) => updateFormData("callToAction", value)}>
//                             <SelectTrigger className="mt-1">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="learn_more">Learn More</SelectItem>
//                               <SelectItem value="shop_now">Shop Now</SelectItem>
//                               <SelectItem value="sign_up">Sign Up</SelectItem>
//                               <SelectItem value="download">Download</SelectItem>
//                               <SelectItem value="contact_us">Contact Us</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>

//                         <div>
//                           <Label htmlFor="websiteUrl">Website URL</Label>
//                           <Input
//                             id="websiteUrl"
//                             value={formData.websiteUrl}
//                             onChange={(e) => updateFormData("websiteUrl", e.target.value)}
//                             placeholder="https://example.com"
//                             className="mt-1"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Ad Preview Sidebar */}
//           <div className="lg:col-span-1">
//             <Card className="shadow-elevated sticky top-4">
//               <CardHeader>
//                 <CardTitle className="text-lg">Ad Preview</CardTitle>
//                 <CardDescription>See how your ad will look</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="bg-muted/50 p-4 rounded-lg">
//                   <div className="text-center text-muted-foreground">
//                     Ad preview will appear here based on your creative inputs
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Navigation */}
//         <div className="flex justify-between items-center mt-8">
//           <Button
//             variant="outline"
//             onClick={handlePrevious}
//             disabled={currentStep === 0}
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Previous
//           </Button>

//           {currentStep === steps.length - 1 ? (
//             <Button variant="success" onClick={handleSubmit}>
//               Create Campaign
//             </Button>
//           ) : (
//             <Button variant="accent-blue" onClick={handleNext}>
//               Next
//               <ArrowRight className="w-4 h-4 ml-2" />
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateCampaign;


import { useState, useReducer, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/ads/Dashboard/Header";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Slider } from "../../components/ui/slider";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Upload,
  Target,
  Users,
  DollarSign,
  Image as ImageIcon,
  Calendar,
  Settings2,
  Megaphone,
  Palette
} from "lucide-react";

// Helper function for objectives
function getObjectives(buyingType: string) {
  const commonObjectives = [
    { 
      id: "awareness", 
      title: "Awareness", 
      icon: Target, 
      apiValue: "OUTCOME_AWARENESS",
      description: "Show your ads to people who are most likely to remember them.",
      goodFor: ["Brand awareness", "Reach"]
    },
    { 
      id: "traffic", 
      title: "Traffic", 
      icon: ArrowRight, 
      apiValue: "OUTCOME_TRAFFIC",
      description: "Send people to a destination, like your website, app or Facebook event.",
      goodFor: ["Link clicks", "Landing page views", "Messenger"]
    },
    { 
      id: "engagement", 
      title: "Engagement", 
      icon: Users, 
      apiValue: "OUTCOME_ENGAGEMENT",
      description: "Get more messages, purchases through messaging, video views, interactions, Page likes or event responses.",
      goodFor: ["Messenger, Instagram and WhatsApp", "Video views", "Interactions", "Conversions", "Calls"]
    },
    { 
      id: "leads", 
      title: "Leads", 
      icon: Upload, 
      apiValue: "OUTCOME_LEADS",
      description: "Collect leads for your business or brand.",
      goodFor: ["Instant forms", "Messenger", "Conversions", "Calls"]
    },
    { 
      id: "app_promotion", 
      title: "App Promotion", 
      icon: ImageIcon, 
      apiValue: "OUTCOME_APP_PROMOTION",
      description: "Find people to install your app or continue using it.",
      goodFor: ["App installs", "App events"]
    },
    { 
      id: "sales", 
      title: "Sales", 
      icon: DollarSign, 
      apiValue: "OUTCOME_SALES",
      description: "Find people who are likely to purchase your product or service.",
      goodFor: ["Conversions", "Catalogue sales", "Messenger"]
    },
  ];
  
  if (buyingType === "RESERVATION") {
    return commonObjectives.filter(obj => ["awareness", "traffic"].includes(obj.id));
  }
  
  return commonObjectives;
}

/**
 * @typedef {Object} CampaignFormAction
 * @property {string} type
 * @property {string} [field]
 * @property {any} [value]
 * @property {Object} [payload]
 */


interface Targeting {
  ageRange: [number, number];
  locations: string[];
}

interface CampaignFormState {
  // Campaign fields
  campaignName: string;
  buyingType: string;
  budgetType: string;
  objective: string;
  specialAdCategories: string[];
  abTestEnabled: boolean;
  specialAdEnabled: boolean;
  advancedSettingsEnabled: boolean;
  abTestType: string;
  abTestDays: string;
  abTestMetric: string;
  spendCap: number;
  bidStrategy: string;
  budgetRebalanceFlag: boolean;
  startTime: string;
  stopTime: string;
  
  // Ad Set fields
  adSetName: string;
  conversionLocationType: string;
  conversionMultipleOption: string;
  conversionSingleOption: string;
  facebookPageId: string;
  performanceGoal: string;
  dailyBudget: number;
  lifetimeBudget: number;
  billingEvent: string;
  optimizationGoal: string;
  destinationType: string;
  pacingType: string;
  targeting: Targeting;
  genders: number[];
  publisherPlatforms: string[];
  devicePlatforms: string[];
  
  // Ad Creative fields
  adName: string;
  adSource: string;
  adFormat: string;
  primaryText: string;
  headline: string;
  websiteUrl: string;
  callToAction: string;
  imageHash: string;
  leadGenFormId: string;
  caption: string;
  
  // Tracking
  selectedAdAccount: string | null;
  selectedCampaign?: string;
  selectedAdSet?: string;
  createdCampaignId?: string;
  createdPlatformCampaignId?: string;
  createdAdSetId?: string;
  createdCreativeId?: string;
}

const initialState: CampaignFormState = {
  // Campaign fields
  campaignName: "",
  buyingType: "AUCTION",
  budgetType: "none",
  objective: "",
  specialAdCategories: [],
  abTestEnabled: false,
  specialAdEnabled: false,
  advancedSettingsEnabled: false,
  abTestType: "",
  abTestDays: "",
  abTestMetric: "",
  spendCap: 0,
  bidStrategy: "LOWEST_COST_WITHOUT_CAP",
  budgetRebalanceFlag: true,
  startTime: "",
  stopTime: "",
  
  // Ad Set fields
  adSetName: "",
  conversionLocationType: "",
  conversionMultipleOption: "",
  conversionSingleOption: "",
  facebookPageId: "",
  performanceGoal: "",
  dailyBudget: 0,
  lifetimeBudget: 0,
  billingEvent: "IMPRESSIONS",
  optimizationGoal: "REACH",
  destinationType: "",
  pacingType: "standard",
  targeting: {
    ageRange: [18, 65],
    locations: ["India"],
  },
  genders: [1, 2],
  publisherPlatforms: ["facebook", "instagram"],
  devicePlatforms: ["mobile", "desktop"],
  
  // Ad Creative fields
  adName: "",
  adSource: "",
  adFormat: "",
  primaryText: "",
  headline: "",
  websiteUrl: "",
  callToAction: "LEARN_MORE",
  imageHash: "",
  leadGenFormId: "",
  caption: "",
  
  // Tracking
  selectedAdAccount: null,
};

const formReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_FIELD': {
      return { ...state, [action.field]: action.value };
    }
    case 'UPDATE_TARGETING':
      return { ...state, targeting: { ...state.targeting, ...action.payload } };
    default:
      return state;
  }
};


const specialAdCategoriesList = [
    {
    value: "NONE",
    label: "None",
    description:
      "",
  },
  {
    value: "FINANCIAL",
    label: "Financial products and services",
    description:
      "Ads for credit cards, long-term financing, checking and savings accounts, investment services, insurance services, or other related financial opportunities.",
  },
  {
    value: "EMPLOYMENT",
    label: "Employment",
    description:
      "Ads for job offers, internships, professional certification programs or other related opportunities.",
  },
  {
    value: "HOUSING",
    label: "Housing",
    description:
      "Ads for real estate listings, homeowners insurance, mortgage loans or other related opportunities.",
  },
  {
    value: "POLITICAL",
    label: "Social issues, elections or politics",
    description:
      "Ads about social issues (such as the economy, or civil and social rights), elections, or political figures or campaigns.",
  },
];

const countryList = [
  "None",
  "United States",
  "India",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Brazil",
  "Japan",
  "South Africa",
  // Add more as needed
];

const CampaignStep = ({ state, dispatch, adAccounts }: any) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Ad Account Selection */}
      <Card className="p-6">
        <CardTitle className="text-lg font-semibold mb-2">Ad Account</CardTitle>
        <CardDescription className="mb-4">Select the ad account to create this campaign under.</CardDescription>
        <Select
          value={state.selectedAdAccount ? state.selectedAdAccount : ''}
          onValueChange={(val: string) => {
            dispatch({ type: 'UPDATE_FIELD', field: 'selectedAdAccount', value: val });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select ad account" />
          </SelectTrigger>
          <SelectContent>
            {adAccounts && adAccounts.length > 0 ? (
              adAccounts.map((acc: any) => (
                <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
              ))
            ) : (
              <SelectItem value="no-accounts" disabled>No ad accounts found</SelectItem>
            )}
          </SelectContent>
        </Select>
      </Card>
      {/* 1. Campaign Name */}
      <Card className="p-6">
        <CardTitle className="text-lg font-semibold mb-2">Campaign Name</CardTitle>
        <CardDescription className="mb-4">Choose a name that will help you identify this campaign later.</CardDescription>
        <Input
          id="campaignName"
          type="text"
          value={state.campaignName}
          onChange={(e: any) => dispatch({ type: "UPDATE_FIELD", field: "campaignName", value: e.target.value })}
          placeholder="e.g., Q4 Holiday Sale - 2025"
          className="text-lg h-12"
        />
      </Card>

      {/* 2. Campaign Details */}
      <Card className="p-6">
        <CardTitle className="text-lg font-semibold mb-2">Campaign Details</CardTitle>
        <CardDescription className="mb-4">Choose your buying type for this campaign.</CardDescription>
        <Select
          value={state.buyingType}
          onValueChange={(val: string) => dispatch({ type: "UPDATE_FIELD", field: "buyingType", value: val })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select buying type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AUCTION">
              <div>
                <div className="font-medium">Auction</div>
                <div className="text-xs text-muted-foreground">
                  Buy in real-time with cost-effective bidding.
                </div>
              </div>
            </SelectItem>
            <SelectItem value="RESERVATION">
              <div>
                <div className="font-medium">Reservation</div>
                <div className="text-xs text-muted-foreground">
                  Buy in advance for more predictable outcomes.
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="mt-6">
          <CardTitle className="text-base font-semibold mb-2">Choose a campaign objective</CardTitle>
          <CardDescription className="mb-4">Choose a campaign objective that aligns with your business goals.</CardDescription>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            <TooltipProvider>
              {getObjectives(state.buyingType).map((obj: any) => {
                const Icon = obj.icon;
                return (
                  <Tooltip key={obj.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center transition-colors ${state.objective === obj.id ? "border-accent-blue bg-accent-blue/10" : "border-border hover:border-accent-blue/50"}`}
                        onClick={() => dispatch({ type: "UPDATE_FIELD", field: "objective", value: obj.id })}
                      >
                        {Icon ? <Icon className="w-8 h-8 mb-2 text-accent-blue" /> : null}
                        <span className="font-medium">{obj.title}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs p-4">
                      <p className="font-semibold mb-2">{obj.title}</p>
                      <p className="text-sm mb-3">{obj.description}</p>
                      <div className="text-sm">
                        <p className="font-medium mb-1">Good for:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {obj.goodFor.map((item: string, idx: number) => (
                            <li key={idx} className="text-muted-foreground">{item}</li>
                          ))}
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>
        </div>
      </Card>

      {/* Rest of CampaignStep code... */}
      {state.buyingType === 'auction' && (
        <Card className="p-6">
          <CardTitle className="text-lg font-semibold mb-2">Budget Type <span className="text-xs text-muted-foreground">(optional)</span></CardTitle>
          <CardDescription className="mb-4">Set a daily or lifetime budget for your campaign (optional).</CardDescription>
          <Select
            value={state.budgetType || "none"}
            onValueChange={(val: string) => dispatch({ type: "UPDATE_FIELD", field: "budgetType", value: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select budget type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="daily">Daily Budget</SelectItem>
              <SelectItem value="lifetime">Lifetime Budget</SelectItem>
            </SelectContent>
          </Select>
          {(state.budgetType === "daily" || state.budgetType === "lifetime") && (
            <div className="mt-4">
              <Label>{state.budgetType === "daily" ? "Daily Budget : ₹" : "Lifetime Budget : ₹"}</Label>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                min={89}
                value={state.dailyBudget}
                onChange={(e: any) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  dispatch({ type: "UPDATE_FIELD", field: "dailyBudget", value: val });
                }}
                placeholder={state.budgetType === "daily" ? "Enter daily budget (min ₹89)" : "Enter lifetime budget (min ₹89)"}
                className="mt-1"
              />
            </div>
          )}
        </Card>
      )}

      {/* A/B Test and Special Ad Categories sections... */}
      <Card className="p-6 mb-6 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg font-semibold">A/B Test <span className="text-xs text-muted-foreground">(optional)</span></CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="abTestToggle" className="text-sm">Enable</Label>
            <Switch id="abTestToggle" checked={!!state.abTestEnabled} onCheckedChange={(val: boolean) => dispatch({ type: "UPDATE_FIELD", field: "abTestEnabled", value: val })} />
          </div>
        </div>
        {state.abTestEnabled && (
          <>
            <CardDescription className="mb-4">Set up an A/B test to compare different strategies and improve your campaign performance.</CardDescription>
            <div className="space-y-4">
              <Label className="font-semibold mb-1">What do you want to test?</Label>
              <Select
                value={state.abTestType || ""}
                onValueChange={(val: string) => dispatch({ type: "UPDATE_FIELD", field: "abTestType", value: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creative">Creative - Find out which images, videos or ad text work best.</SelectItem>
                  <SelectItem value="audience">Audience - See how targeting a new audience can impact performance.</SelectItem>
                  <SelectItem value="placement">Placement - Discover the most effective places to show your ads.</SelectItem>
                  <SelectItem value="custom">Custom - Learn how changing multiple variables can affect results.</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </Card>

      {/* Advanced Campaign Settings */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg font-semibold">Advanced Settings <span className="text-xs text-muted-foreground">(optional)</span></CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="advancedSettingsToggle" className="text-sm">Enable</Label>
            <Switch id="advancedSettingsToggle" checked={!!state.advancedSettingsEnabled} onCheckedChange={(val: boolean) => dispatch({ type: "UPDATE_FIELD", field: "advancedSettingsEnabled", value: val })} />
          </div>
        </div>
        {state.advancedSettingsEnabled && (
          <>
            <CardDescription className="mb-4">Configure additional campaign parameters.</CardDescription>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bidStrategy">Bid Strategy</Label>
                <Select
                  value={state.bidStrategy}
                  onValueChange={(val: string) => dispatch({ type: "UPDATE_FIELD", field: "bidStrategy", value: val })}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select bid strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOWEST_COST_WITHOUT_CAP">Lowest Cost (No Cap)</SelectItem>
                    <SelectItem value="LOWEST_COST_WITH_BID_CAP">Lowest Cost (With Bid Cap)</SelectItem>
                    <SelectItem value="COST_CAP">Cost Cap</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="spendCap">Spend Cap (₹) <span className="text-xs text-muted-foreground">(optional)</span></Label>
                <Input
                  id="spendCap"
                  type="number"
                  min={0}
                  value={state.spendCap || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    dispatch({ type: "UPDATE_FIELD", field: "spendCap", value: val });
                  }}
                  placeholder="e.g., 100000 (in smallest currency unit)"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="budgetRebalance"
                  checked={state.budgetRebalanceFlag}
                  onCheckedChange={(val: boolean) => dispatch({ type: "UPDATE_FIELD", field: "budgetRebalanceFlag", value: val })}
                />
                <Label htmlFor="budgetRebalance">Enable Budget Rebalance</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time <span className="text-xs text-muted-foreground">(optional)</span></Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={state.startTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: "UPDATE_FIELD", field: "startTime", value: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="stopTime">Stop Time <span className="text-xs text-muted-foreground">(optional)</span></Label>
                  <Input
                    id="stopTime"
                    type="datetime-local"
                    value={state.stopTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: "UPDATE_FIELD", field: "stopTime", value: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

      <Card className="p-6 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg font-semibold">Special Ad Categories <span className="text-xs text-muted-foreground">(optional)</span></CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="specialAdToggle" className="text-sm">Enable</Label>
            <Switch id="specialAdToggle" checked={!!state.specialAdEnabled} onCheckedChange={(val: boolean) => dispatch({ type: "UPDATE_FIELD", field: "specialAdEnabled", value: val })} />
          </div>
        </div>
        {state.specialAdEnabled && (
          <>
            <CardDescription className="mb-4">If your ad belongs to a special category, select it below.</CardDescription>
            <div className="space-y-4">
              <Select
                value={state.specialAdCategories[0] || ""}
                onValueChange={(val: string) => dispatch({ type: "UPDATE_FIELD", field: "specialAdCategories", value: val ? [val] : [] })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {specialAdCategoriesList.map((cat: any) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div>
                        <div className="font-medium">{cat.label}</div>
                        <div className="text-xs text-muted-foreground">{cat.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};




interface AdSetStepProps {
  state: CampaignFormState;
  dispatch: React.Dispatch<{ type: string; field?: string; value?: any; payload?: any }>;
  createdCampaignId?: string;
}
const AdSetStep = ({ state, dispatch, createdCampaignId }: AdSetStepProps) => {
  // Budget was set in Step 1 if it's not 'none'
  const budgetSetInStep1 = state.budgetType === 'daily' || state.budgetType === 'lifetime';

  // Campaign dropdown state
  const [campaigns, setCampaigns] = useState<{ id: string; name: string; platform_campaign_id: string }[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [campaignsError, setCampaignsError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingCampaigns(true);
    setCampaignsError(null);
    const token = localStorage.getItem('access_token');
    if (!token) {
      setCampaignsError('No access token found. Please log in.');
      setLoadingCampaigns(false);
      return;
    }
    fetch('http://localhost:8080/api/campaigns', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch campaigns');
        return res.json();
      })
      .then(data => {
        setCampaigns(data);
        // Default to campaign just created in Step 1 - use platform_campaign_id
        if (createdCampaignId && data.length > 0 && !state.selectedCampaign) {
          const found = data.find((c: { id: string }) => c.id === createdCampaignId);
          if (found && found.platform_campaign_id) {
            dispatch({ type: 'UPDATE_FIELD', field: 'selectedCampaign', value: found.platform_campaign_id });
          }
        }
      })
      .catch(err => {
        setCampaignsError(err.message);
      })
      .finally(() => setLoadingCampaigns(false));
    // eslint-disable-next-line
  }, [createdCampaignId]);

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="p-6">
        <CardTitle className="text-lg font-semibold mb-2">Select Campaign</CardTitle>
        <CardDescription className="mb-4">Choose the campaign for this ad set. Defaults to the campaign you just created.</CardDescription>
        {loadingCampaigns && <div className="mb-2 text-sm text-muted-foreground">Loading campaigns...</div>}
        {campaignsError && <div className="mb-2 text-sm text-red-500">{campaignsError}</div>}
        <Select
          value={state.selectedCampaign || ''}
          onValueChange={(val: string) => dispatch({ type: 'UPDATE_FIELD', field: 'selectedCampaign', value: val })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select campaign" />
          </SelectTrigger>
          <SelectContent>
            {campaigns && campaigns.length > 0 ? (
              campaigns.map((c) => (
                <SelectItem key={c.id} value={c.platform_campaign_id || c.id}>{c.name}</SelectItem>
              ))
            ) : (
              <SelectItem value="no-campaigns" disabled>No campaigns found</SelectItem>
            )}
          </SelectContent>
        </Select>
      </Card>

      <Card className="p-6">
        <CardTitle className="text-lg font-semibold mb-2">Ad Set Name</CardTitle>
        <CardDescription className="mb-4">Give this ad set a name that describes its targeting strategy.</CardDescription>
        <Input
          id="adSetName"
          value={state.adSetName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch({ type: 'UPDATE_FIELD', field: 'adSetName', value: e.target.value })}
          placeholder="e.g., Men 25-40 - Tech Enthusiasts"
          className="mt-1"
        />
      </Card>

      <Card className="p-6">
        <CardTitle className="text-lg font-semibold mb-2">Budget & Schedule</CardTitle>
        <CardDescription className="mb-4">Set your budget strategy, spending limits, and schedule for this ad set.</CardDescription>
        
        {budgetSetInStep1 ? (
          <div className="p-4 bg-muted/50 rounded-md">
            <p className="text-sm text-muted-foreground">
              Budget already set in Campaign step: <span className="font-semibold text-foreground capitalize">{state.budgetType} Budget</span> of <span className="font-semibold text-foreground">₹{state.dailyBudget.toLocaleString()}</span>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="font-semibold">Budget Type</Label>
              <RadioGroup
                value={state.budgetType === 'none' ? 'daily' : state.budgetType}
                onValueChange={(val: string) => dispatch({ type: 'UPDATE_FIELD', field: 'budgetType', value: val })}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="adset-daily" />
                  <Label htmlFor="adset-daily">Daily Budget</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lifetime" id="adset-lifetime" />
                  <Label htmlFor="adset-lifetime">Lifetime Budget</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label>{state.budgetType === 'lifetime' ? 'Lifetime Budget' : 'Daily Budget'} (₹)</Label>
              <Input
                type="number"
                min={89}
                value={state.dailyBudget || 89}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  let val = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
                  if (isNaN(val) || val < 89) val = 89;
                  dispatch({ type: 'UPDATE_FIELD', field: 'dailyBudget', value: val });
                }}
                placeholder={state.budgetType === 'lifetime' ? 'Enter lifetime budget (min ₹89)' : 'Enter daily budget (min ₹89)'}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Minimum budget:</p>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <CardTitle className="text-lg font-semibold mb-2">Optimization & Billing</CardTitle>
        <CardDescription className="mb-4">Configure how Facebook optimizes and bills for your ad set.</CardDescription>
        <div className="space-y-4">
          <div>
            <Label htmlFor="billingEvent">Billing Event</Label>
            <Select
              value={state.billingEvent}
              onValueChange={(val: string) => dispatch({ type: 'UPDATE_FIELD', field: 'billingEvent', value: val })}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select billing event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IMPRESSIONS">Impressions</SelectItem>
                <SelectItem value="LINK_CLICKS">Link Clicks</SelectItem>
                <SelectItem value="APP_INSTALLS">App Installs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="optimizationGoal">Optimization Goal</Label>
            <Select
              value={state.optimizationGoal}
              onValueChange={(val: string) => dispatch({ type: 'UPDATE_FIELD', field: 'optimizationGoal', value: val })}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select optimization goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REACH">Reach</SelectItem>
                <SelectItem value="LEAD_GENERATION">Lead Generation</SelectItem>
                <SelectItem value="CONVERSIONS">Conversions</SelectItem>
                <SelectItem value="LINK_CLICKS">Link Clicks</SelectItem>
                <SelectItem value="IMPRESSIONS">Impressions</SelectItem>
                <SelectItem value="APP_INSTALLS">App Installs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="destinationType">Destination Type <span className="text-xs text-muted-foreground">(optional)</span></Label>
            <Select
              value={state.destinationType || "NONE"}
              onValueChange={(val: string) => dispatch({ type: 'UPDATE_FIELD', field: 'destinationType', value: val === "NONE" ? "" : val })}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">None</SelectItem>
                <SelectItem value="WEBSITE">Website</SelectItem>
                <SelectItem value="APP">App</SelectItem>
                <SelectItem value="MESSENGER">Messenger</SelectItem>
                <SelectItem value="LEAD_FORM">Lead Form</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="facebookPageId">Facebook Page ID</Label>
            <Input
              id="facebookPageId"
              value={state.facebookPageId}
              onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch({ type: 'UPDATE_FIELD', field: 'facebookPageId', value: e.target.value })}
              placeholder="e.g., 7755991051"
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <CardTitle className="text-lg font-semibold mb-2">Audience Targeting</CardTitle>
        <CardDescription className="mb-4">Define your target audience demographics and placements.</CardDescription>
        <div className="space-y-4">
          <div>
            <Label className="font-semibold">Locations (Countries)</Label>
            <Input
              id="locations"
              value={state.targeting.locations.join(', ')}
              onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch({ type: 'UPDATE_TARGETING', payload: { locations: e.target.value.split(',').map((l) => l.trim()) }})}
              placeholder="e.g., IN, US"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">Use country codes (e.g., IN for India, US for United States)</p>
          </div>

          <div>
            <Label className="font-semibold">Target Age Range: {state.targeting.ageRange[0]} - {state.targeting.ageRange[1]}</Label>
            <Slider
              value={state.targeting.ageRange}
              onValueChange={(value: number[]) => dispatch({ type: 'UPDATE_TARGETING', payload: { ageRange: [value[0], value[1]] }})}
              max={65}
              min={13}
              step={1}
              className="mt-3"
            />
          </div>

          <div>
            <Label className="font-semibold">Gender</Label>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gender-all"
                  checked={state.genders.includes(1) && state.genders.includes(2)}
                  onCheckedChange={(val: boolean) => {
                    dispatch({ type: 'UPDATE_FIELD', field: 'genders', value: val ? [1, 2] : [] });
                  }}
                />
                <Label htmlFor="gender-all">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gender-male"
                  checked={state.genders.includes(1)}
                  onCheckedChange={(val: boolean) => {
                    const current = state.genders;
                    dispatch({ 
                      type: 'UPDATE_FIELD', 
                      field: 'genders', 
                      value: val ? [...current, 1].filter((v, i, a) => a.indexOf(v) === i) : current.filter(g => g !== 1)
                    });
                  }}
                />
                <Label htmlFor="gender-male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gender-female"
                  checked={state.genders.includes(2)}
                  onCheckedChange={(val: boolean) => {
                    const current = state.genders;
                    dispatch({ 
                      type: 'UPDATE_FIELD', 
                      field: 'genders', 
                      value: val ? [...current, 2].filter((v, i, a) => a.indexOf(v) === i) : current.filter(g => g !== 2)
                    });
                  }}
                />
                <Label htmlFor="gender-female">Female</Label>
              </div>
            </div>
          </div>

          <div>
            <Label className="font-semibold">Publisher Platforms</Label>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="platform-facebook"
                  checked={state.publisherPlatforms.includes('facebook')}
                  onCheckedChange={(val: boolean) => {
                    const current = state.publisherPlatforms;
                    dispatch({ 
                      type: 'UPDATE_FIELD', 
                      field: 'publisherPlatforms', 
                      value: val ? [...current, 'facebook'].filter((v, i, a) => a.indexOf(v) === i) : current.filter(p => p !== 'facebook')
                    });
                  }}
                />
                <Label htmlFor="platform-facebook">Facebook</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="platform-instagram"
                  checked={state.publisherPlatforms.includes('instagram')}
                  onCheckedChange={(val: boolean) => {
                    const current = state.publisherPlatforms;
                    dispatch({ 
                      type: 'UPDATE_FIELD', 
                      field: 'publisherPlatforms', 
                      value: val ? [...current, 'instagram'].filter((v, i, a) => a.indexOf(v) === i) : current.filter(p => p !== 'instagram')
                    });
                  }}
                />
                <Label htmlFor="platform-instagram">Instagram</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="platform-audience_network"
                  checked={state.publisherPlatforms.includes('audience_network')}
                  onCheckedChange={(val: boolean) => {
                    const current = state.publisherPlatforms;
                    dispatch({ 
                      type: 'UPDATE_FIELD', 
                      field: 'publisherPlatforms', 
                      value: val ? [...current, 'audience_network'].filter((v, i, a) => a.indexOf(v) === i) : current.filter(p => p !== 'audience_network')
                    });
                  }}
                />
                <Label htmlFor="platform-audience_network">Audience Network</Label>
              </div>
            </div>
          </div>

          <div>
            <Label className="font-semibold">Device Platforms</Label>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="device-mobile"
                  checked={state.devicePlatforms.includes('mobile')}
                  onCheckedChange={(val: boolean) => {
                    const current = state.devicePlatforms;
                    dispatch({ 
                      type: 'UPDATE_FIELD', 
                      field: 'devicePlatforms', 
                      value: val ? [...current, 'mobile'].filter((v, i, a) => a.indexOf(v) === i) : current.filter(d => d !== 'mobile')
                    });
                  }}
                />
                <Label htmlFor="device-mobile">Mobile</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="device-desktop"
                  checked={state.devicePlatforms.includes('desktop')}
                  onCheckedChange={(val: boolean) => {
                    const current = state.devicePlatforms;
                    dispatch({ 
                      type: 'UPDATE_FIELD', 
                      field: 'devicePlatforms', 
                      value: val ? [...current, 'desktop'].filter((v, i, a) => a.indexOf(v) === i) : current.filter(d => d !== 'desktop')
                    });
                  }}
                />
                <Label htmlFor="device-desktop">Desktop</Label>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

interface AdStepProps {
  state: CampaignFormState;
  dispatch: React.Dispatch<{ type: string; field?: string; value?: any; payload?: any }>;
  createdAdSetId?: string;
}
const AdStep = ({ state, dispatch, createdAdSetId }: AdStepProps) => {
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [carouselCards, setCarouselCards] = useState<number>(0);

  // Ad Set dropdown state
  const [adSets, setAdSets] = useState<{ id: string; name: string; platform_adset_id?: string }[]>([]);
  const [loadingAdSets, setLoadingAdSets] = useState(false);
  const [adSetsError, setAdSetsError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingAdSets(true);
    setAdSetsError(null);
    const token = localStorage.getItem('access_token');
    if (!token) {
      setAdSetsError('No access token found. Please log in.');
      setLoadingAdSets(false);
      return;
    }
    fetch('http://localhost:8080/api/ad-sets', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch ad sets');
        return res.json();
      })
      .then(data => {
        setAdSets(data);
        // Default to ad set just created in Step 2 - store both internal ID and platform ID
        if (createdAdSetId && data.length > 0 && !state.createdAdSetId) {
          const found = data.find((a: { id: string }) => a.id === createdAdSetId);
          if (found) {
            dispatch({ type: 'UPDATE_FIELD', field: 'createdAdSetId', value: found.id });
            if (found.platform_adset_id) {
              dispatch({ type: 'UPDATE_FIELD', field: 'selectedAdSet', value: found.platform_adset_id });
            }
          }
        }
      })
      .catch(err => {
        setAdSetsError(err.message);
      })
      .finally(() => setLoadingAdSets(false));
    // eslint-disable-next-line
  }, [createdAdSetId]);

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="p-6">
        <CardTitle className="text-lg font-semibold mb-2">Select Ad Set</CardTitle>
        <CardDescription className="mb-4">Choose the ad set for this ad. Defaults to the ad set you just created.</CardDescription>
        {loadingAdSets && <div className="mb-2 text-sm text-muted-foreground">Loading ad sets...</div>}
        {adSetsError && <div className="mb-2 text-sm text-red-500">{adSetsError}</div>}
        <Select
          value={state.createdAdSetId || ''}
          onValueChange={(val: string) => {
            dispatch({ type: 'UPDATE_FIELD', field: 'createdAdSetId', value: val });
            // Also store the platform ad set ID for later use
            const selected = adSets.find(a => a.id === val);
            if (selected && selected.platform_adset_id) {
              dispatch({ type: 'UPDATE_FIELD', field: 'selectedAdSet', value: selected.platform_adset_id });
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select ad set" />
          </SelectTrigger>
          <SelectContent>
            {adSets && adSets.length > 0 ? (
              adSets.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>No ad sets available</SelectItem>
            )}
          </SelectContent>
        </Select>
      </Card>

      <Card className="p-6">
        <CardTitle className="text-lg font-semibold mb-2">Ad Name</CardTitle>
        <CardDescription className="mb-4">Name this specific ad creative to identify it later.</CardDescription>
        <Input
          id="adName"
          value={state.adName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch({ type: 'UPDATE_FIELD', field: 'adName', value: e.target.value })}
          placeholder="e.g., Blue Widget - Lifestyle Image"
          className="mt-1"
        />
      </Card>

      <Card className="p-6">
        <CardTitle className="text-lg font-semibold mb-2">Ad Setup</CardTitle>
        <CardDescription className="mb-4">Select an existing post or create a new one, and choose your ad format.</CardDescription>
        <div className="mb-4">
          <Label className="font-semibold">Ad Source</Label>
          <Select
            value={state.adSource || ''}
            onValueChange={(val: string) => dispatch({ type: 'UPDATE_FIELD', field: 'adSource', value: val })}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select ad source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="create">Create ad</SelectItem>
              <SelectItem value="existing">Use existing content</SelectItem>
              <SelectItem value="mockup">Use Creative Hub mockup</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="font-semibold">Format</Label>
          <Select
            value={state.adFormat || ''}
            onValueChange={(val: string) => dispatch({ type: 'UPDATE_FIELD', field: 'adFormat', value: val })}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single image or video</SelectItem>
              <SelectItem value="carousel">Carousel</SelectItem>
              <SelectItem value="multi">Multi-advertiser ads</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {state.adFormat === 'single' && (
        <Card className="p-6">
          <CardTitle className="text-lg font-semibold mb-2">Ad Creative</CardTitle>
          <CardDescription className="mb-4">Create your ad creative with text, media, and call-to-action.</CardDescription>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="facebookPageIdAd">Facebook Page ID</Label>
              <Input
                id="facebookPageIdAd"
                value={state.facebookPageId}
                onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch({ type: 'UPDATE_FIELD', field: 'facebookPageId', value: e.target.value })}
                placeholder="e.g., 7755991051"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="primaryText">Primary Text (Message)</Label>
              <Textarea
                id="primaryText"
                value={state.primaryText}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => dispatch({ type: 'UPDATE_FIELD', field: 'primaryText', value: e.target.value })}
                placeholder="Get 20% off this Diwali! Fill the form below 🎉"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={state.headline}
                onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch({ type: 'UPDATE_FIELD', field: 'headline', value: e.target.value })}
                placeholder="Special Diwali Offer"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="caption">Caption <span className="text-xs text-muted-foreground">(optional)</span></Label>
              <Input
                id="caption"
                value={state.caption}
                onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch({ type: 'UPDATE_FIELD', field: 'caption', value: e.target.value })}
                placeholder="Special Offer"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="websiteUrl">Website URL / Link</Label>
              <Input
                id="websiteUrl"
                value={state.websiteUrl}
                onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch({ type: 'UPDATE_FIELD', field: 'websiteUrl', value: e.target.value })}
                placeholder="https://m.me/yourpage or https://your-landing-page.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="imageHash">Image Hash <span className="text-xs text-muted-foreground">(optional)</span></Label>
              <Input
                id="imageHash"
                value={state.imageHash}
                onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch({ type: 'UPDATE_FIELD', field: 'imageHash', value: e.target.value })}
                placeholder="e.g., 7e5c9d93ab..."
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Upload an image to your ad account and use the hash here</p>
            </div>

            <div>
              <Label htmlFor="callToAction">Call to Action</Label>
              <Select
                value={state.callToAction}
                onValueChange={(value: string) => dispatch({ type: 'UPDATE_FIELD', field: 'callToAction', value })}
              >
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LEARN_MORE">Learn More</SelectItem>
                  <SelectItem value="SHOP_NOW">Shop Now</SelectItem>
                  <SelectItem value="SIGN_UP">Sign Up</SelectItem>
                  <SelectItem value="SUBSCRIBE">Subscribe</SelectItem>
                  <SelectItem value="CONTACT_US">Contact Us</SelectItem>
                  <SelectItem value="DOWNLOAD">Download</SelectItem>
                  <SelectItem value="GET_QUOTE">Get Quote</SelectItem>
                  <SelectItem value="APPLY_NOW">Apply Now</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="leadGenFormId">Lead Gen Form ID <span className="text-xs text-muted-foreground">(optional, for lead ads)</span></Label>
              <Input
                id="leadGenFormId"
                value={state.leadGenFormId}
                onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch({ type: 'UPDATE_FIELD', field: 'leadGenFormId', value: e.target.value })}
                placeholder="e.g., 9876543210"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Required if your CTA uses lead generation</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

interface CampaignSummaryProps {
  state: CampaignFormState;
}
const CampaignSummary = ({ state }: CampaignSummaryProps) => {
    return (
        <Card className="shadow-lg sticky top-6 animate-fade-in">
            <CardHeader>
                <CardTitle className="text-lg flex items-center"><Settings2 className="w-5 h-5 mr-3 text-accent-blue"/>Campaign Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                    <h4 className="font-semibold flex items-center"><Megaphone className="w-4 h-4 mr-2 text-muted-foreground"/>Campaign</h4>
                    <div className="flex justify-between items-center text-muted-foreground pl-6">
                        <span>Objective:</span>
                        <Badge variant={state.objective ? "default" : "secondary"} className="capitalize bg-accent-blue/10 text-accent-blue border-accent-blue/20">{state.objective.replace('_', ' ') || "Not Set"}</Badge>
                    </div>
                </div>
                <div className="space-y-2 border-t pt-4">
                    <h4 className="font-semibold flex items-center"><Users className="w-4 h-4 mr-2 text-muted-foreground"/>Ad Set</h4>
                    <div className="flex justify-between text-muted-foreground pl-6">
                        <span>Audience Age:</span>
                        <span className="font-medium text-foreground">{state.targeting.ageRange[0]} - {state.targeting.ageRange[1]}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground pl-6">
                        <span>Daily Budget:</span>
                        <span className="font-medium text-foreground">₹{state.dailyBudget.toLocaleString()}</span>
                    </div>
                </div>
                <div className="space-y-2 border-t pt-4">
                    <h4 className="font-semibold flex items-center"><Palette className="w-4 h-4 mr-2 text-muted-foreground"/>Ad</h4>
                    <div className="flex justify-between items-center text-muted-foreground pl-6">
                        <span>Call to Action:</span>
                        <Badge variant="outline" className="capitalize">{state.callToAction.replace('_', ' ')}</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [adAccounts, setAdAccounts] = useState<{ id: string; name: string; platform_ad_account_id: string }[]>([]);
  const [loadingAdAccounts, setLoadingAdAccounts] = useState(false);
  const [adAccountsError, setAdAccountsError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch ad accounts on Step 1
    if (currentStep !== 0) return;
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
        // Optionally, set default selected ad account
        if (data.length > 0 && !state.selectedAdAccount) {
          dispatch({ type: 'UPDATE_FIELD', field: 'selectedAdAccount', value: data[0].id });
        }
      })
      .catch(err => {
        setAdAccountsError(err.message);
      })
      .finally(() => setLoadingAdAccounts(false));
  }, [currentStep, state.selectedAdAccount, dispatch]);

  const steps = [ { id: 0, title: "Campaign" }, { id: 1, title: "Ad Set" }, { id: 2, title: "Ad" } ];
  
  const validateStep = () => {
    if (currentStep === 0 && !state.selectedAdAccount) { alert("Please select an ad account."); return false; }
    if (currentStep === 0 && !state.campaignName) { alert("Please enter a campaign name."); return false; }
    if (currentStep === 0 && !state.objective) { alert("Please select a campaign objective."); return false; }
    if (currentStep === 1 && !state.adSetName) { alert("Please enter an ad set name."); return false; }
    if (currentStep === 2 && !state.adName) { alert("Please enter an ad name."); return false; }
    if (currentStep === 2 && !state.primaryText) { alert("Please provide primary text for your ad."); return false; }
    if (currentStep === 2 && !state.headline) { alert("Please provide a headline for your ad."); return false; }
    if (currentStep === 2 && !state.facebookPageId) { alert("Please provide a Facebook Page ID."); return false; }
    if (currentStep === 2 && state.websiteUrl && !state.websiteUrl.match(/^https?:\/\/.+/)) { 
      alert("Please provide a valid URL starting with http:// or https://"); 
      return false; 
    }
    return true;
  };


  // Map UI objective to Facebook API value
  const objectiveMap: Record<string, string> = {
    awareness: "OUTCOME_AWARENESS",
    leads: "OUTCOME_LEADS",
    sales: "OUTCOME_SALES",
    engagement: "OUTCOME_ENGAGEMENT",
    traffic: "OUTCOME_TRAFFIC",
    app_promotion: "OUTCOME_APP_PROMOTION",
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('No access token found. Please log in.');
      return;
    }

    const selectedAccount = adAccounts.find(acc => acc.id === state.selectedAdAccount);
    if (!selectedAccount) {
      alert("No ad account selected.");
      return;
    }
    // Strip 'act_' prefix if present
    let platformAdAccountId = selectedAccount.platform_ad_account_id;
    console.log('[CreateCampaign] Selected account:', selectedAccount);
    console.log('[CreateCampaign] Platform ad account ID (before strip):', platformAdAccountId);
    if (platformAdAccountId.startsWith('act_')) {
      platformAdAccountId = platformAdAccountId.replace(/^act_/, '');
    }
    console.log('[CreateCampaign] Platform ad account ID (after strip):', platformAdAccountId);
    console.log('[CreateCampaign] Current step:', currentStep);

    // Step 0: Create Campaign
    if (currentStep === 0) {
      const apiObjective = objectiveMap[state.objective] || "OUTCOME_AWARENESS";
      
      const campaignPayload: Record<string, unknown> = {
        name: state.campaignName,
        objective: apiObjective,
        status: "ACTIVE",
        special_ad_categories: state.specialAdCategories.filter(c => c !== "NONE") || [],
      };

      // Add optional fields
      if (state.spendCap > 0) campaignPayload.spend_cap = state.spendCap;
      if (state.startTime) campaignPayload.start_time = new Date(state.startTime).toISOString();
      if (state.stopTime) campaignPayload.stop_time = new Date(state.stopTime).toISOString();

      try {
        console.log('[CreateCampaign] Creating campaign with payload:', campaignPayload);
        const res = await fetch(`http://localhost:8080/api/facebook/act/${platformAdAccountId}/campaigns`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(campaignPayload),
        });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || 'Failed to create campaign');
        }
        const data = await res.json();
        console.log('[CreateCampaign] Campaign creation response:', data);
        // Store both internal and platform campaign IDs
        const platformCampaignId = data.meta?.platform_campaign_id || data.fb?.id || data.campaign_id;
        const internalCampaignId = data.meta?.id || data.id;
        dispatch({ type: 'UPDATE_FIELD', field: 'createdCampaignId', value: internalCampaignId });
        dispatch({ type: 'UPDATE_FIELD', field: 'createdPlatformCampaignId', value: platformCampaignId });
        dispatch({ type: 'UPDATE_FIELD', field: 'selectedCampaign', value: platformCampaignId });
        setCurrentStep(currentStep + 1);
      } catch (err) {
        if (err instanceof Error) {
          alert('Failed to create campaign: ' + err.message);
        } else {
          alert('Failed to create campaign.');
        }
      }
    } 
    // Step 1: Create AdSet
    else if (currentStep === 1) {
      // Use platform campaign ID for ad set creation
      const platformCampaignId = state.createdPlatformCampaignId || state.selectedCampaign;
      if (!platformCampaignId) {
        alert('No campaign selected. Please go back and select a campaign.');
        return;
      }

      const targeting = {
        geo_locations: {
          countries: state.targeting.locations || ["IN"],
        },
        age_min: state.targeting.ageRange[0],
        age_max: state.targeting.ageRange[1],
        genders: state.genders,
        publisher_platforms: state.publisherPlatforms,
        device_platforms: state.devicePlatforms,
        targeting_automation: {
          advantage_audience: 0 // Explicitly disable Advantage Audience
        }
      };

      const adSetPayload: Record<string, unknown> = {
        name: state.adSetName,
        campaign_id: platformCampaignId,
        billing_event: state.billingEvent,
        optimization_goal: state.optimizationGoal,
        bid_strategy: state.bidStrategy || "LOWEST_COST_WITHOUT_CAP",
        targeting,
        status: "ACTIVE",
      };

      // Add promoted_object only if page_id is provided
      if (state.facebookPageId) {
        adSetPayload.promoted_object = {
          page_id: state.facebookPageId
        };
      }

      
      // Add budget fields - REQUIRED by Meta API
      // UI collects budget in rupees (₹). Meta expects smallest currency unit (paise) — multiply by 100.
      const toSmallestUnit = (amountInRupees: number) => Math.round(Number(amountInRupees) * 100);
      const MIN_DAILY_PAISE = 9000; // ₹90 => 9000 paise (Meta minimum is ₹88.34)

      if (state.budgetType === 'daily' && state.dailyBudget > 0) {
        const dailyPaise = toSmallestUnit(state.dailyBudget);
        adSetPayload.daily_budget = Math.max(dailyPaise, MIN_DAILY_PAISE);
        console.log('[CreateCampaign] daily_budget (paise):', adSetPayload.daily_budget);
      } else if (state.budgetType === 'lifetime' && (state.lifetimeBudget > 0 || state.dailyBudget > 0)) {
        const lifetimeSource = state.lifetimeBudget > 0 ? state.lifetimeBudget : state.dailyBudget;
        const lifetimePaise = toSmallestUnit(lifetimeSource);
        adSetPayload.lifetime_budget = Math.max(lifetimePaise, MIN_DAILY_PAISE);
        console.log('[CreateCampaign] lifetime_budget (paise):', adSetPayload.lifetime_budget);
      } else {
        // Default to a safe daily budget if none specified
        adSetPayload.daily_budget = MIN_DAILY_PAISE;
        console.log('[CreateCampaign] using default daily_budget (paise):', adSetPayload.daily_budget);
      }

      // Add optional fields
      if (state.destinationType && state.destinationType !== "") {
        adSetPayload.destination_type = state.destinationType;
      }

      // Ensure pacing_type is ALWAYS an array as required by Meta API
      // Use state's value when present, otherwise default to ['standard']
      const paceVal = Array.isArray(state.pacingType) ? state.pacingType : [String(state.pacingType || 'standard')];
      adSetPayload.pacing_type = paceVal;
      console.log('[CreateCampaign] pacing_type set to:', adSetPayload.pacing_type);

      // Ensure targeting is a plain object and convert country names -> ISO2 codes
      if (typeof adSetPayload.targeting === 'string') {
        try {
          adSetPayload.targeting = JSON.parse(adSetPayload.targeting as string);
          console.log('[CreateCampaign] parsed targeting from string to object');
        } catch (e) {
          console.warn('[CreateCampaign] targeting is a string but could not be parsed, sending as-is');
        }
      }

      // Country name -> ISO2 mapping (extend as needed)
      const countryNameToISO: Record<string, string> = {
        india: 'IN',
        'united states': 'US',
        'united kingdom': 'GB',
        canada: 'CA',
        australia: 'AU',
        germany: 'DE',
        france: 'FR',
        brazil: 'BR',
        japan: 'JP',
        'south africa': 'ZA',
      };

      try {
        const tgt = adSetPayload.targeting as any;
        if (tgt && tgt.geo_locations && Array.isArray(tgt.geo_locations.countries)) {
          tgt.geo_locations.countries = tgt.geo_locations.countries.map((c: string) => {
            if (!c) return c;
            const trimmed = String(c).trim();
            // If already an ISO2 code (length 2), uppercase and return
            if (/^[A-Za-z]{2}$/.test(trimmed)) return trimmed.toUpperCase();
            const lower = trimmed.toLowerCase();
            if (countryNameToISO[lower]) return countryNameToISO[lower];
            // Fallback: return uppercased first two letters (best-effort)
            return trimmed.slice(0, 2).toUpperCase();
          });
          console.log('[CreateCampaign] converted geo_locations.countries to ISO2:', tgt.geo_locations.countries);
        }
      } catch (e) {
        console.warn('[CreateCampaign] failed to normalize geo_locations.countries', e);
      }

      try {
        console.log('[CreateCampaign] Creating ad set with payload:', adSetPayload);
        // Log the exact JSON we'll send to the backend
        console.log('Sending this JSON:', JSON.stringify(adSetPayload));
        const res = await fetch(`http://localhost:8080/api/facebook/act/${platformCampaignId}/adsets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(adSetPayload),
        });
        if (!res.ok) {
          const errText = await res.text();
          console.error('[CreateCampaign] Ad set creation error:', errText);
          let errorMessage = 'Failed to create ad set';
          try {
            const errorJson = JSON.parse(errText);
            errorMessage = errorJson.error?.message || errorJson.message || errText;
          } catch {
            errorMessage = errText;
          }
          throw new Error(errorMessage);
        }
        const data = await res.json();
        console.log('[CreateCampaign] Ad set creation response:', data);
        console.log('[CreateCampaign] Full ad set response JSON:', JSON.stringify(data));
        // Store both internal and platform ad set IDs
        const internalAdSetId = data.meta?.id || data.id;
        const platformAdSetId = data.meta?.platform_adset_id || data.fb?.id || data.adset_id || data.id;
        console.log('[CreateCampaign] Internal ad set ID:', internalAdSetId);
        console.log('[CreateCampaign] Platform ad set ID:', platformAdSetId);
        console.log('[CreateCampaign] THIS IS THE AD SET ID THAT WILL BE USED FOR AD CREATION:', platformAdSetId);
        console.log('[CreateCampaign] Ad account ID for reference:', platformAdAccountId);
        dispatch({ type: 'UPDATE_FIELD', field: 'createdAdSetId', value: internalAdSetId });
        dispatch({ type: 'UPDATE_FIELD', field: 'selectedAdSet', value: platformAdSetId });
        setCurrentStep(currentStep + 1);
      } catch (err) {
        if (err instanceof Error) {
          alert('Failed to create ad set: ' + err.message);
        } else {
          alert('Failed to create ad set.');
        }
      }
    } 
    else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('No access token found. Please log in.');
      return;
    }

    const selectedAccount = adAccounts.find(acc => acc.id === state.selectedAdAccount);
    if (!selectedAccount) {
      alert("No ad account selected.");
      return;
    }
    // Strip 'act_' prefix if present
    let platformAdAccountId = selectedAccount.platform_ad_account_id;
    console.log('[CreateCampaign] handleSubmit - Platform ad account ID (before strip):', platformAdAccountId);
    if (platformAdAccountId.startsWith('act_')) {
      platformAdAccountId = platformAdAccountId.replace(/^act_/, '');
    }
    console.log('[CreateCampaign] handleSubmit - Platform ad account ID (after strip):', platformAdAccountId);
    
    // Use platform ad set ID (from Meta), not internal database ID
    const platformAdSetId = state.selectedAdSet;
    if (!platformAdSetId) {
      alert('No ad set selected. Please go back and select an ad set.');
      return;
    }
    console.log('[CreateCampaign] Using platform ad set ID:', platformAdSetId);
    console.log('[CreateCampaign] Using platform ad account ID:', platformAdAccountId);
    console.log('[CreateCampaign] VALIDATION: Ad set and ad account must match!');
    console.log('[CreateCampaign] Ad set was created under ad account:', platformAdAccountId);
    console.log('[CreateCampaign] Now creating ad with ad set:', platformAdSetId, 'under account:', platformAdAccountId);

    try {
      // Step 1: Create Ad Creative
      console.log('[CreateCampaign] Creating ad creative...');
      console.log('[CreateCampaign] Ad creative URL will be: http://localhost:8080/api/facebook/act/' + platformAdAccountId + '/adcreatives');
      
      const link_data: Record<string, unknown> = {
        message: state.primaryText,
        link: state.websiteUrl,
        call_to_action: {
          type: state.callToAction,
          value: {} as Record<string, string>,
        },
      };

      // Add caption only if it's a valid URL, otherwise omit it
      if (state.caption && state.caption.match(/^https?:\/\/.+/)) {
        link_data.caption = state.caption;
      }

      // Add image hash if provided
      if (state.imageHash) {
        link_data.image_hash = state.imageHash;
      }

      // Add lead gen form if provided
      if (state.leadGenFormId) {
        (link_data.call_to_action as { value: Record<string, string> }).value.lead_gen_form_id = state.leadGenFormId;
      }

      const object_story_spec = {
        page_id: state.facebookPageId,
        link_data,
      };

      const creativePayload = {
        name: state.adName + " - Creative",
        object_story_spec,
      };

      console.log('[CreateCampaign] Creative payload:', creativePayload);
      console.log('[CreateCampaign] Facebook Page ID being used:', state.facebookPageId);
      
      const creativeRes = await fetch(`http://localhost:8080/api/facebook/act/${platformAdAccountId}/adcreatives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(creativePayload),
      });

      if (!creativeRes.ok) {
        const errText = await creativeRes.text();
        throw new Error('Failed to create ad creative: ' + errText);
      }

      const creativeData = await creativeRes.json();
      console.log('[CreateCampaign] Ad creative creation response:', creativeData);
      console.log('[CreateCampaign] Full creative response:', JSON.stringify(creativeData));
      
      // Extract the Facebook creative ID (from fb.id), NOT the internal database ID (meta.id)
      const creativeId = creativeData.fb?.id ||           // Facebook ID (CORRECT)
                        creativeData.id || 
                        creativeData.creative_id || 
                        creativeData.meta?.id ||           // Internal DB ID (fallback only)
                        creativeData.data?.id;
      
      console.log('[CreateCampaign] Extracted creative ID:', creativeId);
      
      if (!creativeId) {
        throw new Error('Failed to extract creative ID from response: ' + JSON.stringify(creativeData));
      }

      // Step 2: Create Ad
      console.log('[CreateCampaign] Creating ad...');
      console.log('[CreateCampaign] platformAdSetId value:', platformAdSetId);
      console.log('[CreateCampaign] platformAdAccountId value:', platformAdAccountId);
      console.log('[CreateCampaign] state.selectedAdSet value:', state.selectedAdSet);
      console.log('[CreateCampaign] state.createdAdSetId value:', state.createdAdSetId);
      
      const adPayload = {
        name: state.adName,
        adset_id: platformAdSetId, // Use platform ad set ID
        creative: {
          creative_id: creativeId,
        },
        status: "PAUSED",
      };

      console.log('[CreateCampaign] Ad payload:', adPayload);
      console.log('[CreateCampaign] Ad payload JSON string:', JSON.stringify(adPayload));
      console.log('[CreateCampaign] Ad creation URL will be: http://localhost:8080/api/facebook/act/' + platformAdSetId + '/ads');

      // Use ad account ID (NOT ad set ID) for the ads endpoint
      const adRes = await fetch(`http://localhost:8080/api/facebook/act/${platformAdSetId}/ads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(adPayload),
      });

      if (!adRes.ok) {
        const errText = await adRes.text();
        throw new Error('Failed to create ad: ' + errText);
      }

      const adData = await adRes.json();
      console.log('[CreateCampaign] Ad creation response:', adData);
      
      alert("Campaign, Ad Set, Ad Creative, and Ad created successfully!");
      navigate("/campaigns");

    } catch (error) {
      console.error("Failed to create campaign:", error);
      if (error instanceof Error) {
        alert("Error: " + error.message);
      } else {
        alert("An error occurred. Please check the console for more details.");
      }
    }
  };

  return (
    <>
      {/* <Header user={{ name: "User", photo: null, email: null }} /> */}
      <div className="min-h-screen bg-muted/20 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate("/ads/campaigns")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Create New Meta Campaign</h1>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-xl rounded-lg border">
              <CardHeader className="bg-muted/30 rounded-t-lg border-b p-4">
                  <h2 className="text-xl font-bold">Step {currentStep + 1}: {steps[currentStep].title}</h2>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                {currentStep === 0 && (
                  <>
                    {loadingAdAccounts && <div className="mb-4 text-sm text-muted-foreground">Loading ad accounts...</div>}
                    {adAccountsError && <div className="mb-4 text-sm text-red-500">{adAccountsError}</div>}
                    <CampaignStep state={state} dispatch={dispatch} adAccounts={adAccounts} />
                  </>
                )}
                {currentStep === 1 && <AdSetStep state={state} dispatch={dispatch} createdCampaignId={state.createdCampaignId} />}
                {currentStep === 2 && <AdStep state={state} dispatch={dispatch} createdAdSetId={state.createdAdSetId} />}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <CampaignSummary state={state} />
          </div>
        </div>

        <div className="flex justify-between items-center mt-8 p-4 bg-background border-t fixed bottom-0 left-0 right-0 md:static z-10 shadow-top">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="w-32"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center justify-center flex-grow">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                 <div className={`w-3 h-3 rounded-full transition-colors ${index <= currentStep ? "bg-accent-blue" : "bg-muted"}`}/>
                 {index < steps.length - 1 && (
                     <div className={`h-0.5 w-16 mx-2 ${index < currentStep ? "bg-accent-blue" : "bg-muted"}`}/>
                 )}
              </div>
            ))}
          </div>

          {currentStep === steps.length - 1 ? (
            <Button className="bg-green-600 hover:bg-green-700 text-white w-40" onClick={handleSubmit}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Publish Campaign
            </Button>
          ) : (
            <Button variant="accent-blue" onClick={handleNext} className="w-32">
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default CreateCampaign;
