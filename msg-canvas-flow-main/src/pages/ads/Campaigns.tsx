import { useState } from "react";
import { Button } from "@/components/whatsapp/ui/button";
import { Input } from "@/components/whatsapp/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/whatsapp/ui/select";
import { Calendar } from "@/components/whatsapp/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/whatsapp/ui/popover";
import { Badge } from "@/components/whatsapp/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/whatsapp/ui/dropdown-menu";
// Make sure the path below matches the actual location of CampaignTable.tsx
import { CampaignTable } from "../../components/ads/Dashboard/CampaignTable";
import { Header } from "../../components/ads/Dashboard/Header";
import { Sidebar } from "../../components/ads/Dashboard/Sidebar";
import { 
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  MoreHorizontal
} from "lucide-react";
import { format } from "date-fns";

// Mock campaign data
const mockCampaigns = [
  {
    id: "1",
    name: "Summer Sale Campaign",
    status: "Active",
    delivery: "Active",
    budget: "$50.00/day",
    results: "1,204 Link Clicks",
    reach: "45,230",
    impressions: "125,430",
    costPerResult: "$0.89",
    amountSpent: "$432.50",
    isActive: true,
  },
  {
    id: "2", 
    name: "Brand Awareness Q3",
    status: "In Review",
    delivery: "In Review",
    budget: "$75.00/day",
    results: "2,850 Impressions",
    reach: "12,450",
    impressions: "32,100",
    costPerResult: "$1.25",
    amountSpent: "$156.25",
    isActive: false,
  },
  {
    id: "3",
    name: "Retargeting Campaign",
    status: "Completed",
    delivery: "Completed",
    budget: "$25.00/day",
    results: "567 Conversions",
    reach: "8,900",
    impressions: "45,600",
    costPerResult: "$2.15",
    amountSpent: "$1,219.05",
    isActive: false,
  },
];

const Campaigns = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  return (
    <div className="flex h-screen bg-background">
      {/* <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      /> */}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
              <p className="text-muted-foreground">Manage your Meta advertising campaigns</p>
            </div>
            <Button variant="success" size="lg" onClick={() => window.location.href = "/ads/campaigns/create"}>
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange(range || {})}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Filters */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Active Campaigns</DropdownMenuItem>
                <DropdownMenuItem>Paused Campaigns</DropdownMenuItem>
                <DropdownMenuItem>Completed Campaigns</DropdownMenuItem>
                <DropdownMenuItem>All Campaigns</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Campaign Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card p-4 rounded-lg border shadow-card">
              <div className="text-2xl font-bold text-foreground">3</div>
              <div className="text-sm text-muted-foreground">Total Campaigns</div>
            </div>
            <div className="bg-card p-4 rounded-lg border shadow-card">
              <div className="text-2xl font-bold text-success">1</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="bg-card p-4 rounded-lg border shadow-card">
              <div className="text-2xl font-bold text-foreground">$1,807.80</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
            <div className="bg-card p-4 rounded-lg border shadow-card">
              <div className="text-2xl font-bold text-foreground">4,621</div>
              <div className="text-sm text-muted-foreground">Total Results</div>
            </div>
          </div>

          {/* Campaign Table */}
          <div className="bg-card rounded-lg border shadow-card">
            <CampaignTable campaigns={mockCampaigns} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Campaigns;