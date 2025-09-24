import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ads/ui/button";
import { Button } from "../../components/ads/ui/button";
import { Input } from "../../components/ads/ui/input";
import { Label } from "../../components/ads/ui/label";
import { Textarea } from "../../components/ads/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ads/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ads/ui/tabs";
import { Checkbox } from "../../components/ads/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../../components/ads/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ads/ui/select";
import { Slider } from "../../components/ads/ui/slider";
import { Badge } from "../../components/ads/ui/badge";
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Upload,
  Target,
  Users,
  DollarSign,
  Image as ImageIcon,
  Calendar
} from "lucide-react";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Campaign Level
    campaignName: "",
    objective: "",
    budgetType: "daily",
    budget: 50,
    
    // Ad Set Level  
    adSetName: "",
    ageRange: [18, 65],
    gender: "all",
    locations: [],
    interests: [],
    
    // Ad Level
    adName: "",
    primaryText: "",
    headline: "",
    description: "",
    callToAction: "learn_more",
    websiteUrl: "",
  });

  const steps = [
    { id: 0, title: "Campaign", description: "Set up your campaign objective and budget" },
    { id: 1, title: "Ad Set", description: "Define your audience and placements" },
    { id: 2, title: "Ad", description: "Create your ad creative and copy" },
  ];

  const objectives = [
    { id: "awareness", title: "Awareness", description: "Show your ads to people who are most likely to remember them" },
    { id: "traffic", title: "Traffic", description: "Send people to a destination, like your website" },
    { id: "engagement", title: "Engagement", description: "Get more messages, video views, post engagement or Page follows" },
    { id: "leads", title: "Leads", description: "Collect leads for your business or brand" },
    { id: "sales", title: "Sales", description: "Find people likely to purchase your product or service" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Campaign created:", formData);
    navigate("/ads/campaigns");
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/ads/campaigns")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create New Campaign</h1>
              <p className="text-muted-foreground">Set up your Meta advertising campaign</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  index <= currentStep 
                    ? "bg-accent-blue border-accent-blue text-white" 
                    : "border-muted-foreground text-muted-foreground"
                }`}>
                  {index < currentStep ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground max-w-24">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 w-24 mx-4 ${
                  index < currentStep ? "bg-accent-blue" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-elevated">
              <CardContent className="p-6">
                {/* Campaign Level */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-accent-blue" />
                        Campaign Details
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="campaignName">Campaign Name</Label>
                          <Input
                            id="campaignName"
                            value={formData.campaignName}
                            onChange={(e) => updateFormData("campaignName", e.target.value)}
                            placeholder="Enter campaign name"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label>Campaign Objective</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                            {objectives.map((objective) => (
                              <div
                                key={objective.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                  formData.objective === objective.id
                                    ? "border-accent-blue bg-accent-blue/10"
                                    : "border-border hover:border-accent-blue/50"
                                }`}
                                onClick={() => updateFormData("objective", objective.id)}
                              >
                                <div className="font-medium">{objective.title}</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {objective.description}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label>Budget & Schedule</Label>
                          <div className="space-y-4 mt-2">
                            <RadioGroup
                              value={formData.budgetType}
                              onValueChange={(value) => updateFormData("budgetType", value)}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="daily" id="daily" />
                                <Label htmlFor="daily">Daily Budget</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="lifetime" id="lifetime" />
                                <Label htmlFor="lifetime">Lifetime Budget</Label>
                              </div>
                            </RadioGroup>
                            
                            <div>
                              <Label>Budget Amount: ${formData.budget}</Label>
                              <Slider
                                value={[formData.budget]}
                                onValueChange={(value) => updateFormData("budget", value[0])}
                                max={1000}
                                min={5}
                                step={5}
                                className="mt-2"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ad Set Level */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-accent-blue" />
                        Audience & Targeting
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="adSetName">Ad Set Name</Label>
                          <Input
                            id="adSetName"
                            value={formData.adSetName}
                            onChange={(e) => updateFormData("adSetName", e.target.value)}
                            placeholder="Enter ad set name"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label>Age Range: {formData.ageRange[0]} - {formData.ageRange[1]}</Label>
                          <Slider
                            value={formData.ageRange}
                            onValueChange={(value) => updateFormData("ageRange", value)}
                            max={65}
                            min={13}
                            step={1}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label>Gender</Label>
                          <RadioGroup
                            value={formData.gender}
                            onValueChange={(value) => updateFormData("gender", value)}
                            className="flex gap-6 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="all" id="all" />
                              <Label htmlFor="all">All</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="men" id="men" />
                              <Label htmlFor="men">Men</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="women" id="women" />
                              <Label htmlFor="women">Women</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div>
                          <Label htmlFor="locations">Locations</Label>
                          <Input
                            id="locations"
                            placeholder="Enter countries, states, or cities"
                            className="mt-1"
                          />
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline">United States</Badge>
                            <Badge variant="outline">Canada</Badge>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="interests">Detailed Targeting</Label>
                          <Input
                            id="interests"
                            placeholder="Add demographics, interests, and behaviors"
                            className="mt-1"
                          />
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline">Technology</Badge>
                            <Badge variant="outline">Online shopping</Badge>
                            <Badge variant="outline">Small business owners</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ad Level */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <ImageIcon className="w-5 h-5 mr-2 text-accent-blue" />
                        Ad Creative
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="adName">Ad Name</Label>
                          <Input
                            id="adName"
                            value={formData.adName}
                            onChange={(e) => updateFormData("adName", e.target.value)}
                            placeholder="Enter ad name"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label>Media</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center mt-2">
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                            <div className="text-sm text-muted-foreground mb-2">
                              Upload images or videos
                            </div>
                            <Button variant="outline" size="sm">
                              Browse Files
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="primaryText">Primary Text</Label>
                          <Textarea
                            id="primaryText"
                            value={formData.primaryText}
                            onChange={(e) => updateFormData("primaryText", e.target.value)}
                            placeholder="Write your ad copy here..."
                            className="mt-1"
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label htmlFor="headline">Headline</Label>
                          <Input
                            id="headline"
                            value={formData.headline}
                            onChange={(e) => updateFormData("headline", e.target.value)}
                            placeholder="Add a headline"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => updateFormData("description", e.target.value)}
                            placeholder="Add a description"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="cta">Call to Action</Label>
                          <Select value={formData.callToAction} onValueChange={(value) => updateFormData("callToAction", value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="learn_more">Learn More</SelectItem>
                              <SelectItem value="shop_now">Shop Now</SelectItem>
                              <SelectItem value="sign_up">Sign Up</SelectItem>
                              <SelectItem value="download">Download</SelectItem>
                              <SelectItem value="contact_us">Contact Us</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="websiteUrl">Website URL</Label>
                          <Input
                            id="websiteUrl"
                            value={formData.websiteUrl}
                            onChange={(e) => updateFormData("websiteUrl", e.target.value)}
                            placeholder="https://example.com"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ad Preview Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-elevated sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Ad Preview</CardTitle>
                <CardDescription>See how your ad will look</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-center text-muted-foreground">
                    Ad preview will appear here based on your creative inputs
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button variant="success" onClick={handleSubmit}>
              Create Campaign
            </Button>
          ) : (
            <Button variant="accent-blue" onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;