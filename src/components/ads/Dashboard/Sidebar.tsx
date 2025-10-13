import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
import { Button } from "../ui/button";
import { 
  LayoutDashboard, 
  Megaphone, 
  Users, 
  CreditCard, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/ads/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Campaigns",
    href: "/ads/campaigns",
    icon: Megaphone,
  },
  {
    name: "AI Campaign",
    href: "/ads/ai-campaign",
    icon: Sparkles,
  },
  {
    name: "Audiences",
    href: "/ads/audiences", 
    icon: Users,
  },
  {
    name: "Billing",
    href: "/ads/billing",
    icon: CreditCard,
  },
  {
    name: "Settings",
    href: "/ads/settings",
    icon: Settings,
  },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={cn(
      "bg-card border-r border-border h-screen flex flex-col transition-all duration-200",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-bold text-lg">
            AdLaunch
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive 
                      ? "bg-accent-blue text-accent-blue-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", collapsed ? "" : "mr-3")} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}