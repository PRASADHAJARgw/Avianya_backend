import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

interface PlatformStatus {
  meta: boolean;
  google: boolean;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [connected, setConnected] = useState<PlatformStatus>({
    meta: false,
    google: false,
  });

  const handleConnect = (platform: keyof PlatformStatus) => {
    // Simulate connection process
    setConnected(prev => ({
      ...prev,
      [platform]: true,
    }));
  };

  const canFinish = connected.meta || connected.google;

  const handleFinishOnboarding = () => {
    if (canFinish) {
      navigate("/ads/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-xl">
              AdLaunch
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Connect your ad platforms</h1>
          <p className="text-lg text-muted-foreground">
            Grant AdLaunch access to manage your campaigns
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Meta Card */}
          <Card className="shadow-elevated hover:shadow-overlay transition-all duration-200">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-[#1877F2] text-white p-3 rounded-lg">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
              </div>
              <CardTitle className="text-xl">Connect Meta</CardTitle>
              <CardDescription className="text-base">
                Manage your Facebook and Instagram campaigns, ad sets, and ads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant={connected.meta ? "success" : "accent-blue"}
                onClick={() => handleConnect("meta")}
                className="w-full"
                size="lg"
                disabled={connected.meta}
              >
                {connected.meta ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Connected
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
              
              <div className="flex items-center justify-center">
                {connected.meta ? (
                  <Badge variant="outline" className="border-success text-success">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-destructive text-destructive">
                    <Circle className="w-3 h-3 mr-1" />
                    Not Connected
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Google Card */}
          <Card className="shadow-elevated hover:shadow-overlay transition-all duration-200">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white border p-3 rounded-lg">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
              </div>
              <CardTitle className="text-xl">Connect Google</CardTitle>
              <CardDescription className="text-base">
                Manage your Google Search, Display, and YouTube campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant={connected.google ? "success" : "accent-blue"}
                onClick={() => handleConnect("google")}
                className="w-full"
                size="lg"
                disabled={connected.google}
              >
                {connected.google ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Connected
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
              
              <div className="flex items-center justify-center">
                {connected.google ? (
                  <Badge variant="outline" className="border-success text-success">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-destructive text-destructive">
                    <Circle className="w-3 h-3 mr-1" />
                    Not Connected
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button
            variant={canFinish ? "success" : "outline"}
            onClick={handleFinishOnboarding}
            disabled={!canFinish}
            size="lg"
            className="px-8"
          >
            Finish Onboarding
          </Button>
          {!canFinish && (
            <p className="text-sm text-muted-foreground mt-2">
              Connect at least one platform to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;