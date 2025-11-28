// import { useState } from "react";
// import { Header } from "../../components/ads/Dashboard/Header";
// // import { Header } from "./components/Dashboard/Header";
// import { Sidebar } from "../../components/ads/Dashboard/Sidebar";
// import { Button } from "../../components/ads/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ads/whatsapp/ui/card";
// import { Input } from "../../components/ads/ui/input";
// import { Label } from "../../components/ads/ui/label";
// import { Textarea } from "../../components/ads/ui/textarea";
// import { RadioGroup, RadioGroupItem } from "../../components/ads/ui/radio-group";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ads/ui/select";
// import { Badge } from "../../components/ads/ui/badge";
// import { Sparkles, Check, Edit2 } from "lucide-react";

// interface BrandData {
//   brand_name: string;
//   product_name: string;
//   style_guide: string;
//   logo_url: string;
//   product_description: string;
//   target_audience: string;
//   unique_selling_points: string;
// }

// const mockTextOutputs = [
//   "Discover the future with our innovative products. Transform your daily routine and experience unmatched quality that speaks to your lifestyle.",
//   "Elevate your experience with premium solutions designed for the modern consumer. Quality meets innovation in every product we create.",
//   "Join thousands who've made the switch to better living. Our products deliver results that exceed expectations every single time.",
//   "Revolutionary design meets practical functionality. Experience the difference that premium quality and innovative thinking can make.",
//   "Step into excellence with products crafted for those who demand the best. Premium quality, innovative design, unbeatable results."
// ];

// const mockImages = [
//   "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop",
//   "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
//   "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop"
// ];

// export default function AICampaign() {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [brandData, setBrandData] = useState<BrandData>({
//     brand_name: "",
//     product_name: "",
//     style_guide: "",
//     logo_url: "",
//     product_description: "",
//     target_audience: "",
//     unique_selling_points: ""
//   });
//   const [campaignObjective, setCampaignObjective] = useState("");
//   const [budgetType, setBudgetType] = useState("daily");
//   const [budgetAmount, setBudgetAmount] = useState(50);
//   const [selectedText, setSelectedText] = useState("");
//   const [selectedImage, setSelectedImage] = useState("");
//   const [generatedTexts, setGeneratedTexts] = useState<string[]>([]);
//   const [generatedImages, setGeneratedImages] = useState<string[]>([]);

//   const handleBrandDataChange = (field: keyof BrandData, value: string) => {
//     setBrandData(prev => ({ ...prev, [field]: value }));
//   };

//   const generateContent = () => {
//     // Mock AI generation
//     setGeneratedTexts(mockTextOutputs);
//     setGeneratedImages(mockImages);
//     setCurrentStep(3);
//   };

//   const renderStep1 = () => (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-semibold text-foreground mb-2">Brand Information</h2>
//         <p className="text-muted-foreground">Tell us about your brand to generate personalized campaigns</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="brand_name">Brand Name</Label>
//             <Input
//               id="brand_name"
//               value={brandData.brand_name}
//               onChange={(e) => handleBrandDataChange("brand_name", e.target.value)}
//               placeholder="Enter your brand name"
//             />
//           </div>
//           <div>
//             <Label htmlFor="product_name">Product Name</Label>
//             <Input
//               id="product_name"
//               value={brandData.product_name}
//               onChange={(e) => handleBrandDataChange("product_name", e.target.value)}
//               placeholder="Enter your product name"
//             />
//           </div>
//           <div>
//             <Label htmlFor="logo_url">Logo URL</Label>
//             <Input
//               id="logo_url"
//               value={brandData.logo_url}
//               onChange={(e) => handleBrandDataChange("logo_url", e.target.value)}
//               placeholder="https://example.com/logo.png"
//             />
//           </div>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="product_description">Product Description</Label>
//             <Textarea
//               id="product_description"
//               value={brandData.product_description}
//               onChange={(e) => handleBrandDataChange("product_description", e.target.value)}
//               placeholder="Describe your product..."
//               rows={3}
//             />
//           </div>
//           <div>
//             <Label htmlFor="target_audience">Target Audience</Label>
//             <Textarea
//               id="target_audience"
//               value={brandData.target_audience}
//               onChange={(e) => handleBrandDataChange("target_audience", e.target.value)}
//               placeholder="Describe your target audience..."
//               rows={2}
//             />
//           </div>
//         </div>
//       </div>

//       <div>
//         <Label htmlFor="unique_selling_points">Unique Selling Points</Label>
//         <Textarea
//           id="unique_selling_points"
//           value={brandData.unique_selling_points}
//           onChange={(e) => handleBrandDataChange("unique_selling_points", e.target.value)}
//           placeholder="What makes your product unique?"
//           rows={3}
//         />
//       </div>

//       <div>
//         <Label htmlFor="style_guide">Style Guide</Label>
//         <Textarea
//           id="style_guide"
//           value={brandData.style_guide}
//           onChange={(e) => handleBrandDataChange("style_guide", e.target.value)}
//           placeholder="Describe your brand's tone, style, and guidelines..."
//           rows={4}
//         />
//       </div>

//       <Button 
//         onClick={() => setCurrentStep(2)}
//         className="w-full"
//         disabled={!brandData.brand_name || !brandData.product_name}
//       >
//         Continue to Campaign Setup
//       </Button>
//     </div>
//   );

//   const renderStep2 = () => (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-semibold text-foreground mb-2">Campaign Setup</h2>
//         <p className="text-muted-foreground">Configure your campaign objectives and budget</p>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Campaign Objective</CardTitle>
//           <CardDescription>What do you want to achieve with this campaign?</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Select value={campaignObjective} onValueChange={setCampaignObjective}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select campaign objective" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="awareness">Brand Awareness</SelectItem>
//               <SelectItem value="traffic">Traffic</SelectItem>
//               <SelectItem value="engagement">Engagement</SelectItem>
//               <SelectItem value="leads">Lead Generation</SelectItem>
//               <SelectItem value="sales">Sales</SelectItem>
//               <SelectItem value="conversions">Conversions</SelectItem>
//             </SelectContent>
//           </Select>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Budget & Schedule</CardTitle>
//           <CardDescription>Set your campaign budget and duration</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <Label>Budget Type</Label>
//             <RadioGroup value={budgetType} onValueChange={setBudgetType}>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="daily" id="daily" />
//                 <Label htmlFor="daily">Daily Budget</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="lifetime" id="lifetime" />
//                 <Label htmlFor="lifetime">Lifetime Budget</Label>
//               </div>
//             </RadioGroup>
//           </div>

//           <div>
//             <Label htmlFor="budget_amount">Budget Amount ($)</Label>
//             <Input
//               id="budget_amount"
//               type="number"
//               value={budgetAmount}
//               onChange={(e) => setBudgetAmount(Number(e.target.value))}
//               min={1}
//             />
//           </div>
//         </CardContent>
//       </Card>

//       <div className="flex gap-4">
//         <Button variant="outline" onClick={() => setCurrentStep(1)}>
//           Back
//         </Button>
//         <Button 
//           onClick={generateContent}
//           className="flex-1"
//           disabled={!campaignObjective}
//         >
//           <Sparkles className="w-4 h-4 mr-2" />
//           Generate AI Campaign
//         </Button>
//       </div>
//     </div>
//   );

//   const renderStep3 = () => (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-semibold text-foreground mb-2">Generated Campaign Content</h2>
//         <p className="text-muted-foreground">Select your preferred text and image for the campaign</p>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Generated Ad Copy</CardTitle>
//           <CardDescription>Choose the text that best represents your campaign</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           {generatedTexts.map((text, index) => (
//             <div 
//               key={index}
//               className={`p-4 border rounded-lg cursor-pointer transition-all ${
//                 selectedText === text 
//                   ? 'border-primary bg-primary/5' 
//                   : 'border-border hover:border-primary/50'
//               }`}
//               onClick={() => setSelectedText(text)}
//             >
//               <div className="flex items-start justify-between">
//                 <p className="text-sm flex-1">{text}</p>
//                 {selectedText === text && (
//                   <Check className="w-4 h-4 text-primary ml-2 flex-shrink-0" />
//                 )}
//               </div>
//             </div>
//           ))}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Generated Images</CardTitle>
//           <CardDescription>Select the image that best fits your campaign</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {generatedImages.map((image, index) => (
//               <div 
//                 key={index}
//                 className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
//                   selectedImage === image 
//                     ? 'border-primary' 
//                     : 'border-border hover:border-primary/50'
//                 }`}
//                 onClick={() => setSelectedImage(image)}
//               >
//                 <img src={image} alt={`Option ${index + 1}`} className="w-full h-48 object-cover" />
//                 {selectedImage === image && (
//                   <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
//                     <Check className="w-4 h-4" />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {selectedText && selectedImage && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Campaign Preview</CardTitle>
//             <CardDescription>Preview how your campaign will look</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="border rounded-lg p-4 bg-card">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
//                   <span className="text-primary-foreground text-sm font-bold">
//                     {brandData.brand_name.charAt(0)}
//                   </span>
//                 </div>
//                 <div>
//                   <p className="font-semibold text-sm">{brandData.brand_name}</p>
//                   <p className="text-xs text-muted-foreground">Sponsored</p>
//                 </div>
//               </div>
//               <img src={selectedImage} alt="Campaign" className="w-full rounded-lg mb-3" />
//               <p className="text-sm mb-2">{selectedText}</p>
//               <div className="flex gap-2">
//                 <Badge variant="secondary">{campaignObjective}</Badge>
//                 <Badge variant="outline">${budgetAmount}/{budgetType}</Badge>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       <div className="flex gap-4">
//         <Button variant="outline" onClick={() => setCurrentStep(2)}>
//           Back
//         </Button>
//         <Button 
//           className="flex-1"
//           disabled={!selectedText || !selectedImage}
//         >
//           Submit Campaign
//         </Button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-background flex">
//       {/* <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} /> */}
      
//       <div className="flex-1 flex flex-col">
//         <Header />
        
//         <main className="flex-1 p-6">
//           <div className="max-w-4xl mx-auto">
//             <div className="flex items-center gap-3 mb-6">
//               <Sparkles className="w-8 h-8 text-primary" />
//               <div>
//                 <h1 className="text-3xl font-bold text-foreground">AI Campaign Generator</h1>
//                 <p className="text-muted-foreground">Create data-driven campaigns with AI assistance</p>
//               </div>
//             </div>

//             <div className="mb-8">
//               <div className="flex items-center justify-between mb-4">
//                 {[1, 2, 3].map((step) => (
//                   <div key={step} className="flex items-center">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
//                       currentStep >= step 
//                         ? 'bg-primary text-primary-foreground' 
//                         : 'bg-muted text-muted-foreground'
//                     }`}>
//                       {step}
//                     </div>
//                     {step < 3 && (
//                       <div className={`w-24 h-0.5 mx-2 ${
//                         currentStep > step ? 'bg-primary' : 'bg-muted'
//                       }`} />
//                     )}
//                   </div>
//                 ))}
//               </div>
//               <div className="flex justify-between text-sm text-muted-foreground">
//                 <span>Brand Info</span>
//                 <span>Campaign Setup</span>
//                 <span>Generated Content</span>
//               </div>
//             </div>

//             {currentStep === 1 && renderStep1()}
//             {currentStep === 2 && renderStep2()}
//             {currentStep === 3 && renderStep3()}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
// import { Header } from "../../components/ads/Dashboard/Header";
import { Sidebar } from "../../components/ads/Dashboard/Sidebar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Sparkles, Check, Edit2, ImageIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "../../components/ui/use-toast";

interface BrandData {
  product_name: string;
  logo_url: string;
  product_description: string;
}

interface CreativeData {
  id: string;
  headlines: string[];
  descriptions: string[];
  cta: string;
  image_concepts: string[];
}

interface ApiResponse {
  structured_creative_data: CreativeData[];
}

const mockTextOutputs = [
  "Discover the future with our innovative products. Transform your daily routine and experience unmatched quality that speaks to your lifestyle.",
  "Elevate your experience with premium solutions designed for the modern consumer. Quality meets innovation in every product we create.",
  "Join thousands who've made the switch to better living. Our products deliver results that exceed expectations every single time.",
  "Revolutionary design meets practical functionality. Experience the difference that premium quality and innovative thinking can make.",
  "Step into excellence with products crafted for those who demand the best. Premium quality, innovative design, unbeatable results."
];

const mockImages = [
  "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop"
];

export default function AICampaign() {
  // const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [brandData, setBrandData] = useState<BrandData>({
    product_name: "",
    logo_url: "",
    product_description: "",
  });
  const [campaignObjective, setCampaignObjective] = useState("");
  const [budgetType, setBudgetType] = useState("daily");
  const [budgetAmount, setBudgetAmount] = useState(50);
  const [selectedText, setSelectedText] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [generatedTexts, setGeneratedTexts] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [creativeData, setCreativeData] = useState<CreativeData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [textToCreativeMap, setTextToCreativeMap] = useState<Map<string, string>>(new Map());
  const [selectedCreativeId, setSelectedCreativeId] = useState<string>("");
  const [renderedImages, setRenderedImages] = useState<{[key: string]: string}>({});
  const [isRenderingSelection, setIsRenderingSelection] = useState(false);
  const [isProductInfoExpanded, setIsProductInfoExpanded] = useState(true);
  const [hasGeneratedImages, setHasGeneratedImages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const mapObjectiveToOutcome = (obj: string) => {
    const key = (obj || '').toLowerCase();
    const map: Record<string,string> = {
      awareness: 'OUTCOME_AWARENESS',
      traffic: 'OUTCOME_TRAFFIC',
      engagement: 'OUTCOME_ENGAGEMENT',
      leads: 'OUTCOME_LEADS',
      sales: 'OUTCOME_SALES',
      conversions: 'OUTCOME_CONVERSIONS',
    };
    return map[key] || 'OUTCOME_TRAFFIC';
  };

  const submitCampaign = async () => {
    // Validate required inputs
    if (!brandData.product_name) {
      toast({ title: 'Missing Product Name', description: 'Please enter a product name.', variant: 'destructive' });
      return;
    }
    if (!campaignObjective) {
      toast({ title: 'Select Objective', description: 'Please select a campaign objective.', variant: 'destructive' });
      return;
    }
    if (!selectedText) {
      toast({ title: 'Select Ad Text', description: 'Please pick a generated text for your ad.', variant: 'destructive' });
      return;
    }
    if (!selectedImage) {
      toast({ title: 'Select Image', description: 'Please select a generated image.', variant: 'destructive' });
      return;
    }
    if (!selectedImage.startsWith('data:image/')) {
      toast({ title: 'Image must be Base64', description: 'Please generate/select an image (base64 data URL).', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      const outcomeObjective = mapObjectiveToOutcome(campaignObjective);
  // Amounts are entered in rupees; convert to minor units (paise) by *100.
  const dailyBudgetMinor = Math.max(1, Math.round(Number(budgetAmount || 0) * 100));

      const payload = {
        campaign: {
          name: `${brandData.product_name} - ${campaignObjective.charAt(0).toUpperCase()}${campaignObjective.slice(1)}`,
          objective: outcomeObjective,
          status: 'ACTIVE',
          special_ad_categories: [] as any[],
        },
        adSet: {
          name: `${brandData.product_name || 'Ad'} - Set 1`,
          daily_budget: dailyBudgetMinor,
          optimization_goal: 'LINK_CLICKS',
          billing_event: 'IMPRESSIONS',
          status: 'ACTIVE',
          bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
          // Use the same UI Budget Amount as bid_amount (also in minor units)
          bid_amount: dailyBudgetMinor,
          targeting: { geo_locations: { countries: ['IN'] } },
        },
        adCreative: {
          name: `${brandData.product_name || 'Creative'} 1`,
          object_story_spec: {},
        },
        ad: {
          name: `${brandData.product_name || 'Ad'} 1`,
          status: 'ACTIVE',
        },
        imageBase64: selectedImage,
        linkUrl: brandData.logo_url || 'https://example.com',
        message: brandData.product_description || selectedText,
      };

      const res = await fetch(`${baseUrl}/api/facebook/pipeline/create-ad`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const ct = res.headers.get('content-type') || '';
      const body = ct.includes('application/json') ? await res.json() : await res.text();

      if (!res.ok) {
        // Try to extract detailed error per provided example
        const errTitle = body?.error?.error?.error_user_title || 'Campaign creation failed';
        const errMsg = body?.error?.error?.error_user_msg || (typeof body === 'string' ? body.slice(0, 200) : JSON.stringify(body));
        toast({ title: errTitle, description: errMsg, variant: 'destructive' });
        return;
      }

      if (body?.error?.error) {
        const e = body.error.error;
        toast({ title: e.error_user_title || 'Campaign creation error', description: e.error_user_msg || e.message, variant: 'destructive' });
      } else {
        const campId = body?.partial?.fb?.campaign?.id || body?.campaign?.id || '—';
        toast({ title: 'Campaign submitted', description: `FB campaign id: ${campId}` });
      }
    } catch (e: any) {
      toast({ title: 'Network error', description: e?.message || 'Request failed', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBrandDataChange = (field: keyof BrandData, value: string) => {
    setBrandData(prev => ({ ...prev, [field]: value }));
  };

  const renderProductInfo = (isInStep2 = false) => (
    <Card className={isInStep2 ? "mb-6" : ""}>
      <CardHeader 
        className={isInStep2 ? "cursor-pointer" : ""}
        onClick={isInStep2 ? () => setIsProductInfoExpanded(!isProductInfoExpanded) : undefined}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Product Information</CardTitle>
            <CardDescription>
              {isInStep2 ? "Edit product details if needed" : "Provide minimum product details to generate a campaign"}
            </CardDescription>
          </div>
          {isInStep2 && (
            <Button variant="ghost" size="sm" className="p-1">
              {isProductInfoExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </CardHeader>
      {(!isInStep2 || isProductInfoExpanded) && (
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="product_name">Product Name</Label>
            <Input
              id="product_name"
              value={brandData.product_name}
              onChange={(e) => handleBrandDataChange("product_name", e.target.value)}
              placeholder="Enter your product name"
            />
          </div>

          <div>
            <Label htmlFor="product_description">Product Description</Label>
            <Textarea
              id="product_description"
              value={brandData.product_description}
              onChange={(e) => handleBrandDataChange("product_description", e.target.value)}
              placeholder="Describe your product..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="logo_url">Product Image (optional URL)</Label>
            <Input
              id="logo_url"
              value={brandData.logo_url}
              onChange={(e) => handleBrandDataChange("logo_url", e.target.value)}
              placeholder="https://example.com/image.png"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );

  const handleTextSelection = (text: string) => {
    setSelectedText(text);
    const creativeId = textToCreativeMap.get(text);
    
    if (creativeId) {
      setSelectedCreativeId(creativeId);
      // Reset images when selecting new text
      setHasGeneratedImages(false);
      setRenderedImages({});
      setSelectedImage('');
    }
  };

  const generateImages = async () => {
    if (!selectedText || !selectedCreativeId) return;
    
    setIsRenderingSelection(true);
    
    try {
      const token = localStorage.getItem('access_token');
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
      
      console.log('Calling render_selection API with:', {
        structured_creative_data: creativeData,
        selected_creative_id: selectedCreativeId
      });
      
      const response = await fetch(`${baseUrl}/api/render_selection`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          structured_creative_data: creativeData,
          selected_creative_id: selectedCreativeId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const renderData = await response.json();
      console.log('Render selection API response:', renderData);

      // The backend may return either:
      // - rendered_images_base64
      // - rendered_images_base64_map (preferred)
      // - rendered_image_paths (legacy)
      // Prefer base64 map, then base64, then paths (as a last resort).
      const imagesSource = renderData.rendered_images_base64_map || renderData.rendered_images_base64 || renderData.rendered_image_paths || null;

      if (!imagesSource) {
        console.error('Render API returned no images payload:', renderData);
      } else {
        const fullUrls: { [key: string]: string } = {};
        Object.entries(imagesSource).forEach(([format, val]) => {
          const asStr = String(val || '');
          if (!asStr) return;
          // If backend already provides a data URL, use it. If it looks like a base64 payload,
          // prefix with a PNG data URL. Otherwise, if it looks like a path, try to convert to full URL.
          if (asStr.startsWith('data:')) {
            fullUrls[format] = asStr;
          } else if (/^[A-Za-z0-9+/=\n\r]+$/.test(asStr) && asStr.length > 100) {
            // probable base64 string
            fullUrls[format] = `data:image/png;base64,${asStr.replace(/\s+/g, '')}`;
          } else if (asStr.startsWith('/')) {
            // path-like: prepend backend origin if available
            try {
              const origin = new URL(baseUrl).origin;
              fullUrls[format] = `${origin}${asStr}`;
            } catch (e) {
              fullUrls[format] = asStr; // fallback raw
            }
          } else {
            // Last resort: treat as base64
            fullUrls[format] = `data:image/png;base64,${asStr}`;
          }
        });

        if (Object.keys(fullUrls).length > 0) {
          setRenderedImages(fullUrls);
          setHasGeneratedImages(true);

          // If backend also returned a selected creative, surface it in the UI.
          const sel = renderData.selected_creative;
          if (sel && sel.id) {
            setSelectedCreativeId(sel.id);

            // Build a reasonable single text option from the selected creative
            const h = Array.isArray(sel.headlines) ? sel.headlines : (sel.headlines ? [String(sel.headlines)] : []);
            const d = Array.isArray(sel.descriptions) ? sel.descriptions : (sel.descriptions ? [String(sel.descriptions)] : []);
            const title = (sel as any).title ? String((sel as any).title) : '';
            const desc = (sel as any).description ? String((sel as any).description) : '';

            let combined = '';
            if (h.length > 0 && d.length > 0) combined = `${h[0]}\n\n${d[0]}`;
            else if (h.length > 0) combined = h[0];
            else if (d.length > 0) combined = d[0];
            else if (title || desc) combined = title && desc ? `${title}\n\n${desc}` : (title || desc);

            if (combined) {
              // Ensure mapping exists for UI selection
              setTextToCreativeMap(prev => {
                const m = new Map(prev);
                if (!m.has(combined)) m.set(combined, sel.id);
                return m;
              });
              setGeneratedTexts(prev => (combined ? [combined, ...prev] : prev));
              // If user hasn't selected text yet, select the backend-provided one
              setSelectedText(prev => prev || combined);
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Error calling render_selection:', error);
    } finally {
      setIsRenderingSelection(false);
    }
  };

  const generateContent = async () => {
    // Immediately clear ALL previous conversation/creative data to show fresh content
    setGeneratedTexts([]);
    setCreativeData([]);
    setTextToCreativeMap(new Map());
    setRenderedImages({});
    setSelectedText('');
    setSelectedImage('');
    setSelectedCreativeId('');
    setHasGeneratedImages(false);
    setGeneratedImages([]); // Clear any previously generated image array
    
    setIsGenerating(true);
    
    // Force UI update to show cleared state immediately
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const token = localStorage.getItem('access_token');
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
      
      console.log('Calling generate_creatives API...');
      
      const fetchUrl = `${baseUrl}/api/generate_creatives`;
      console.log('generateContent: calling', fetchUrl, 'with token present?', Boolean(token));

      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generation_options: {
            creative_count: 3
          }
        })
      });

      // Read raw text so we can log the exact response body for debugging.
      const raw = await response.text();
      console.log('generateContent: response url=', response.url, 'status=', response.status, 'ok=', response.ok);
      console.log('generateContent: raw response body:', raw);

      let data: ApiResponse;
      try {
        data = raw ? JSON.parse(raw) : { structured_creative_data: [] };
      } catch (err) {
        console.error('generateContent: failed to parse JSON response:', err);
        // If parsing fails, set an empty structure so rest of flow can fallback gracefully
        data = { structured_creative_data: [] } as ApiResponse;
      }
      console.log('Generate creatives API response (parsed):', data);
      
  setCreativeData(data.structured_creative_data);
      
      // Map API response to UI format and track creative IDs
      const texts: string[] = [];
      const textToCreativeMapping = new Map<string, string>();

      // Defensive mapping: the backend may return creatives with missing
      // headlines/descriptions or with singular fields. Normalize to arrays
      // and skip gracefully if nothing useful is present.
      data.structured_creative_data.forEach((creative) => {
        const headlines: string[] = Array.isArray(creative.headlines)
          ? creative.headlines
          : (creative.headlines ? [String(creative.headlines)] : []);
        const descriptions: string[] = Array.isArray(creative.descriptions)
          ? creative.descriptions
          : (creative.descriptions ? [String(creative.descriptions)] : []);

        // If both lists are empty, try common fallback fields (title/description,
        // text/copy) so we can support simplified API shapes.
        if (headlines.length === 0 && descriptions.length === 0) {
          const title = (creative as any).title ? String((creative as any).title) : '';
          const desc = (creative as any).description ? String((creative as any).description) : '';
          const fallback = (creative as any).text || (creative as any).copy || '';

          if (title || desc) {
            const combined = title && desc ? `${title}\n\n${desc}` : (title || desc);
            texts.push(combined);
            textToCreativeMapping.set(combined, creative.id);
          } else if (fallback) {
            texts.push(String(fallback));
            textToCreativeMapping.set(String(fallback), creative.id);
          } else {
            // Nothing to map — log for debugging and continue
            console.warn(`Creative ${creative.id || '<unknown>'} missing headlines/descriptions and no fallback text`);
          }
          return;
        }

        // Create combinations (headline + description). If descriptions is
        // empty, use headlines alone; if headlines is empty, use descriptions alone.
        if (headlines.length > 0) {
          headlines.forEach((headline) => {
            if (descriptions.length > 0) {
              descriptions.forEach((description) => {
                const combinedText = `${headline}\n\n${description}`;
                texts.push(combinedText);
                textToCreativeMapping.set(combinedText, creative.id);
              });
            } else {
              const combinedText = String(headline);
              texts.push(combinedText);
              textToCreativeMapping.set(combinedText, creative.id);
            }
          });
        } else {
          descriptions.forEach((description) => {
            const combinedText = String(description);
            texts.push(combinedText);
            textToCreativeMapping.set(combinedText, creative.id);
          });
        }
      });
      
  setGeneratedTexts(texts); // Show all generated texts
  setTextToCreativeMap(textToCreativeMapping);
  // Move to generated content view after texts are available
  setCurrentStep(2);
    } catch (error) {
      console.error('Error generating content:', error);
      // Fallback to mock data on error
  setGeneratedTexts(mockTextOutputs.slice(0, 3));
  setRenderedImages({});
  setHasGeneratedImages(false);
  setSelectedText('');
  setSelectedImage('');
      setCurrentStep(2);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {renderProductInfo(false)}
      
      {/* Campaign setup controls moved here to reduce clicks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Campaign Setup (optional)</CardTitle>
          <CardDescription className="text-xs">Quickly set objective and budget for faster generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Campaign Objective</Label>
            <Select value={campaignObjective} onValueChange={setCampaignObjective}>
              <SelectTrigger>
                <SelectValue placeholder="Select campaign objective" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="awareness">Brand Awareness</SelectItem>
                <SelectItem value="traffic">Traffic</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="leads">Lead Generation</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="conversions">Conversions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Budget Type</Label>
            <RadioGroup value={budgetType} onValueChange={setBudgetType}>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">Daily</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lifetime" id="lifetime" />
                  <Label htmlFor="lifetime">Lifetime</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="budget_amount">Budget Amount (₹)</Label>
            <Input
              id="budget_amount"
              type="number"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(Number(e.target.value))}
              min={1}
            />
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={generateContent}
        className="w-full"
        disabled={!brandData.product_name || !campaignObjective || isGenerating}
      >
        {isGenerating ? (
          <>
            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
            Generating Content...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate AI Campaign
          </>
        )}
      </Button>
    </div>
  );

  // const renderStep2 = () => (
  //   <div className="space-y-6">
  //     <div>
  //       <h2 className="text-2xl font-semibold text-foreground mb-2">Campaign Setup</h2>
  //       <p className="text-muted-foreground">Configure your campaign objectives and budget</p>
  //     </div>

  //     <Card>
  //       <CardHeader>
  //         <CardTitle>Campaign Objective</CardTitle>
  //         <CardDescription>What do you want to achieve with this campaign?</CardDescription>
  //       </CardHeader>
  //       <CardContent>
  //         <Select value={campaignObjective} onValueChange={setCampaignObjective}>
  //           <SelectTrigger>
  //             <SelectValue placeholder="Select campaign objective" />
  //           </SelectTrigger>
  //           <SelectContent>
  //             <SelectItem value="awareness">Brand Awareness</SelectItem>
  //             <SelectItem value="traffic">Traffic</SelectItem>
  //             <SelectItem value="engagement">Engagement</SelectItem>
  //             <SelectItem value="leads">Lead Generation</SelectItem>
  //             <SelectItem value="sales">Sales</SelectItem>
  //             <SelectItem value="conversions">Conversions</SelectItem>
  //           </SelectContent>
  //         </Select>
  //       </CardContent>
  //     </Card>

  //     <Card>
  //       <CardHeader>
  //         <CardTitle>Budget & Schedule</CardTitle>
  //         <CardDescription>Set your campaign budget and duration</CardDescription>
  //       </CardHeader>
  //       <CardContent className="space-y-4">
  //         <div>
  //           <Label>Budget Type</Label>
  //           <RadioGroup value={budgetType} onValueChange={setBudgetType}>
  //             <div className="flex items-center space-x-2">
  //               <RadioGroupItem value="daily" id="daily" />
  //               <Label htmlFor="daily">Daily Budget</Label>
  //             </div>
  //             <div className="flex items-center space-x-2">
  //               <RadioGroupItem value="lifetime" id="lifetime" />
  //               <Label htmlFor="lifetime">Lifetime Budget</Label>
  //             </div>
  //           </RadioGroup>
  //         </div>

  //         <div>
  //           <Label htmlFor="budget_amount">Budget Amount ($)</Label>
  //           <Input
  //             id="budget_amount"
  //             type="number"
  //             value={budgetAmount}
  //             onChange={(e) => setBudgetAmount(Number(e.target.value))}
  //             min={1}
  //           />
  //         </div>
  //       </CardContent>
  //     </Card>

  //     <div className="flex gap-4">
  //       <Button variant="outline" onClick={() => setCurrentStep(1)}>
  //         Back
  //       </Button>
  //       <Button 
  //         onClick={generateContent}
  //         className="flex-1"
  //         disabled={!campaignObjective}
  //       >
  //         <Sparkles className="w-4 h-4 mr-2" />
  //         Generate AI Campaign
  //       </Button>
  //     </div>
  //   </div>
  // );

  const renderStep2 = () => (
    <div className="space-y-6">
      {renderProductInfo(true)}
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Generated Campaign Content</h2>
          <p className="text-muted-foreground">Select your preferred text and image for the campaign</p>
        </div>
        <Button 
          variant="outline"
          onClick={generateContent}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {isGenerating ? 'Regenerating...' : 'Regenerate'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Ad Copy</CardTitle>
          <CardDescription>Choose the text that best represents your campaign</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isGenerating ? (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 mx-auto text-primary animate-spin mb-4" />
              <p className="text-lg font-medium text-primary mb-2">Generating fresh content...</p>
              <p className="text-muted-foreground">Creating new AI-powered ad copy for your campaign</p>
            </div>
          ) : generatedTexts.length > 0 ? (
            generatedTexts.map((text, index) => (
              <div 
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedText === text 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleTextSelection(text)}
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm flex-1 whitespace-pre-line">{text}</p>
                  {selectedText === text && (
                    <Check className="w-4 h-4 text-primary ml-2 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No content generated yet. Click "Regenerate" to create new ad copy.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Images Button */}
      {selectedText && (
        <div className="flex justify-center">
          <Button 
            onClick={generateImages}
            disabled={isRenderingSelection}
            className="px-8"
          >
            {isRenderingSelection ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Cooking images...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Images
              </>
            )}
          </Button>
        </div>
      )}

      {/* Show Generated Images only after generation */}
      {(hasGeneratedImages || isRenderingSelection) && (
          <Card>
          <CardHeader>
            <CardTitle>Generated Images</CardTitle>
            <CardDescription>
              Select the image that best fits your campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRenderingSelection ? (
              <div className="text-center py-12">
                <div className="relative inline-block">
                  <Sparkles className="w-16 h-16 mx-auto text-primary animate-pulse mb-4" />
                  <div className="absolute -top-2 -right-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full animate-bounce" />
                  </div>
                  <div className="absolute -bottom-2 -left-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                  </div>
                  <div className="absolute top-0 -left-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                  </div>
                </div>
                <p className="text-lg font-medium text-primary mb-2">🍳 Cooking your images...</p>
                <p className="text-muted-foreground">Our AI chef is preparing your visual feast!</p>
              </div>
            ) : isGenerating ? (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 mx-auto text-primary animate-pulse mb-4" />
                <p className="text-lg font-medium text-primary mb-2">Preparing to create new visuals...</p>
                <p className="text-muted-foreground">Fresh images will be generated after new content is ready</p>
              </div>
            ) : Object.keys(renderedImages).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(renderedImages)
                  .filter(([format]) => ![
                    'FACEBOOK_VERTICAL_4X5',
                    'FACEBOOK_SQUARE_1X1',
                    'GOOGLE_HORIZONTAL_1.91X1'
                  ].includes(format))
                  .map(([format, imagePath], index) => (
                    <div 
                      key={format}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === imagePath 
                          ? 'border-primary' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedImage(imagePath)}
                    >
                      <img 
                        src={imagePath}
                        alt={`${format} format`} 
                        className="w-full h-48 object-cover" 
                        onError={(e) => {
                          // Fallback to mock images if rendered images fail to load
                          (e.target as HTMLImageElement).src = mockImages[index % mockImages.length];
                        }}
                      />
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {format.replace(/_/g, ' ').toUpperCase()}
                      </div>
                      {selectedImage === imagePath && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Click "Generate Images" to create visual content for your campaign</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedText && selectedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Preview</CardTitle>
            <CardDescription>Preview how your campaign will look</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-bold">
                    {brandData.product_name ? brandData.product_name.charAt(0) : "P"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{brandData.product_name}</p>
                  <p className="text-xs text-muted-foreground">Sponsored</p>
                </div>
              </div>
              <img src={selectedImage} alt="Campaign" className="w-full rounded-lg mb-3" />
              <p className="text-sm mb-2">{selectedText}</p>
              <div className="flex gap-2">
                <Badge variant="secondary">{campaignObjective}</Badge>
                <Badge variant="outline">₹{budgetAmount}/{budgetType}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Back
        </Button>
        <Button 
          className="flex-1"
          disabled={!selectedText || !selectedImage || isSubmitting}
          onClick={submitCampaign}
        >
          {isSubmitting ? 'Submitting…' : 'Submit Campaign'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} /> */}
      
      <div className="flex-1 flex flex-col">
        {/* <Header user={{ name: "User", photo: null, email: null }} /> */}
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">AI Campaign Generator</h1>
                <p className="text-muted-foreground">Create data-driven campaigns with AI assistance</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-medium text-muted-foreground">Generate AI-driven ad creatives</h2>
              <p className="text-sm text-muted-foreground">Provide minimal product details then click Generate My Ads</p>
            </div>

            {/* Step-based flow: show product inputs first, then generated content */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {/* {currentStep === 3 && renderStep3()} */}
          </div>
        </main>
      </div>
    </div>
  );
}