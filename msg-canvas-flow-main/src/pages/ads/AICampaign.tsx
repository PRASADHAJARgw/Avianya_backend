import { useState } from "react";
import { Header } from "../../components/ads/Dashboard/Header";
// import { Header } from "./components/Dashboard/Header";
import { Sidebar } from "../../components/ads/Dashboard/Sidebar";
import { Button } from "../../components/ads/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/whatsapp/ui/card";
import { Input } from "../../components/ads/ui/input";
import { Label } from "../../components/ads/ui/label";
import { Textarea } from "../../components/ads/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../components/ads/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ads/ui/select";
import { Badge } from "../../components/ads/ui/badge";
import { Sparkles, Check, Edit2 } from "lucide-react";

interface BrandData {
  brand_name: string;
  product_name: string;
  style_guide: string;
  logo_url: string;
  product_description: string;
  target_audience: string;
  unique_selling_points: string;
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [brandData, setBrandData] = useState<BrandData>({
    brand_name: "",
    product_name: "",
    style_guide: "",
    logo_url: "",
    product_description: "",
    target_audience: "",
    unique_selling_points: ""
  });
  const [campaignObjective, setCampaignObjective] = useState("");
  const [budgetType, setBudgetType] = useState("daily");
  const [budgetAmount, setBudgetAmount] = useState(50);
  const [selectedText, setSelectedText] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [generatedTexts, setGeneratedTexts] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleBrandDataChange = (field: keyof BrandData, value: string) => {
    setBrandData(prev => ({ ...prev, [field]: value }));
  };

  const generateContent = () => {
    // Mock AI generation
    setGeneratedTexts(mockTextOutputs);
    setGeneratedImages(mockImages);
    setCurrentStep(3);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Brand Information</h2>
        <p className="text-muted-foreground">Tell us about your brand to generate personalized campaigns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="brand_name">Brand Name</Label>
            <Input
              id="brand_name"
              value={brandData.brand_name}
              onChange={(e) => handleBrandDataChange("brand_name", e.target.value)}
              placeholder="Enter your brand name"
            />
          </div>
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
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              value={brandData.logo_url}
              onChange={(e) => handleBrandDataChange("logo_url", e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="product_description">Product Description</Label>
            <Textarea
              id="product_description"
              value={brandData.product_description}
              onChange={(e) => handleBrandDataChange("product_description", e.target.value)}
              placeholder="Describe your product..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="target_audience">Target Audience</Label>
            <Textarea
              id="target_audience"
              value={brandData.target_audience}
              onChange={(e) => handleBrandDataChange("target_audience", e.target.value)}
              placeholder="Describe your target audience..."
              rows={2}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="unique_selling_points">Unique Selling Points</Label>
        <Textarea
          id="unique_selling_points"
          value={brandData.unique_selling_points}
          onChange={(e) => handleBrandDataChange("unique_selling_points", e.target.value)}
          placeholder="What makes your product unique?"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="style_guide">Style Guide</Label>
        <Textarea
          id="style_guide"
          value={brandData.style_guide}
          onChange={(e) => handleBrandDataChange("style_guide", e.target.value)}
          placeholder="Describe your brand's tone, style, and guidelines..."
          rows={4}
        />
      </div>

      <Button 
        onClick={() => setCurrentStep(2)}
        className="w-full"
        disabled={!brandData.brand_name || !brandData.product_name}
      >
        Continue to Campaign Setup
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Campaign Setup</h2>
        <p className="text-muted-foreground">Configure your campaign objectives and budget</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Objective</CardTitle>
          <CardDescription>What do you want to achieve with this campaign?</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget & Schedule</CardTitle>
          <CardDescription>Set your campaign budget and duration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Budget Type</Label>
            <RadioGroup value={budgetType} onValueChange={setBudgetType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Daily Budget</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lifetime" id="lifetime" />
                <Label htmlFor="lifetime">Lifetime Budget</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="budget_amount">Budget Amount ($)</Label>
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

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Back
        </Button>
        <Button 
          onClick={generateContent}
          className="flex-1"
          disabled={!campaignObjective}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate AI Campaign
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Generated Campaign Content</h2>
        <p className="text-muted-foreground">Select your preferred text and image for the campaign</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Ad Copy</CardTitle>
          <CardDescription>Choose the text that best represents your campaign</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {generatedTexts.map((text, index) => (
            <div 
              key={index}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedText === text 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedText(text)}
            >
              <div className="flex items-start justify-between">
                <p className="text-sm flex-1">{text}</p>
                {selectedText === text && (
                  <Check className="w-4 h-4 text-primary ml-2 flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Images</CardTitle>
          <CardDescription>Select the image that best fits your campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {generatedImages.map((image, index) => (
              <div 
                key={index}
                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === image 
                    ? 'border-primary' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img src={image} alt={`Option ${index + 1}`} className="w-full h-48 object-cover" />
                {selectedImage === image && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
                    {brandData.brand_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{brandData.brand_name}</p>
                  <p className="text-xs text-muted-foreground">Sponsored</p>
                </div>
              </div>
              <img src={selectedImage} alt="Campaign" className="w-full rounded-lg mb-3" />
              <p className="text-sm mb-2">{selectedText}</p>
              <div className="flex gap-2">
                <Badge variant="secondary">{campaignObjective}</Badge>
                <Badge variant="outline">${budgetAmount}/{budgetType}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setCurrentStep(2)}>
          Back
        </Button>
        <Button 
          className="flex-1"
          disabled={!selectedText || !selectedImage}
        >
          Submit Campaign
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} /> */}
      
      <div className="flex-1 flex flex-col">
        <Header />
        
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
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-24 h-0.5 mx-2 ${
                        currentStep > step ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Brand Info</span>
                <span>Campaign Setup</span>
                <span>Generated Content</span>
              </div>
            </div>

            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>
        </main>
      </div>
    </div>
  );
}