// import { useState } from "react";
// import { Button } from "../../components/whatsapp/ui/button";
// import { Input } from "../../components/whatsapp/ui/input";
// import { 
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/whatsapp/ui/select";
// import { Calendar } from "../../components/whatsapp/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "../../components/whatsapp/ui/popover";
// import { Badge } from "../../components/whatsapp/ui/badge";
// import { 
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "../../components/whatsapp/ui/dropdown-menu";
// // Make sure the path below matches the actual location of CampaignTable.tsx
// import { CampaignTable } from "../../components/Dashboard/CampaignTable";
// import { Header } from "../../components/Dashboard/Header";
// import { Sidebar } from "../../components/Dashboard/Sidebar";
// import { 
//   Plus,
//   Search,
//   Filter,
//   Calendar as CalendarIcon,
//   MoreHorizontal
// } from "lucide-react";
// import { format } from "date-fns";

// // Mock campaign data
// const mockCampaigns = [
//   {
//     id: "1",
//     name: "Summer Sale Campaign",
//     status: "Active",
//     delivery: "Active",
//     budget: "$50.00/day",
//     results: "1,204 Link Clicks",
//     reach: "45,230",
//     impressions: "125,430",
//     costPerResult: "$0.89",
//     amountSpent: "$432.50",
//     isActive: true,
//   },
//   {
//     id: "2", 
//     name: "Brand Awareness Q3",
//     status: "In Review",
//     delivery: "In Review",
//     budget: "$75.00/day",
//     results: "2,850 Impressions",
//     reach: "12,450",
//     impressions: "32,100",
//     costPerResult: "$1.25",
//     amountSpent: "$156.25",
//     isActive: false,
//   },
//   {
//     id: "3",
//     name: "Retargeting Campaign",
//     status: "Completed",
//     delivery: "Completed",
//     budget: "$25.00/day",
//     results: "567 Conversions",
//     reach: "8,900",
//     impressions: "45,600",
//     costPerResult: "$2.15",
//     amountSpent: "$1,219.05",
//     isActive: false,
//   },
// ];

// const Campaigns = () => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

//   return (
//     <div className="flex h-screen bg-background">
//       {/* <Sidebar 
//         collapsed={sidebarCollapsed} 
//         onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
//       /> */}
      
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header />
        
//         <main className="flex-1 overflow-y-auto p-6">
//           {/* Page Header */}
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
//               <p className="text-muted-foreground">Manage your Meta advertising campaigns</p>
//             </div>
//             <Button variant="success" size="lg" onClick={() => window.location.href = "/campaigns/create"}>
//               <Plus className="w-4 h-4 mr-2" />
//               Create
//             </Button>
//           </div>

//           {/* Toolbar */}
//           <div className="flex items-center gap-4 mb-6">
//             {/* Search */}
//             <div className="relative flex-1 max-w-sm">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search campaigns..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>

//             {/* Date Range Picker */}
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button variant="outline" className="justify-start text-left font-normal">
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {dateRange.from ? (
//                     dateRange.to ? (
//                       <>
//                         {format(dateRange.from, "LLL dd, y")} -{" "}
//                         {format(dateRange.to, "LLL dd, y")}
//                       </>
//                     ) : (
//                       format(dateRange.from, "LLL dd, y")
//                     )
//                   ) : (
//                     <span>Pick a date range</span>
//                   )}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   initialFocus
//                   mode="range"
//                   defaultMonth={dateRange.from}
//                   selected={{ from: dateRange.from, to: dateRange.to }}
//                   onSelect={(range) => setDateRange(range || {})}
//                   numberOfMonths={2}
//                 />
//               </PopoverContent>
//             </Popover>

//             {/* Filters */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline">
//                   <Filter className="w-4 h-4 mr-2" />
//                   Filters
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem>Active Campaigns</DropdownMenuItem>
//                 <DropdownMenuItem>Paused Campaigns</DropdownMenuItem>
//                 <DropdownMenuItem>Completed Campaigns</DropdownMenuItem>
//                 <DropdownMenuItem>All Campaigns</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           {/* Campaign Statistics Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             <div className="bg-card p-4 rounded-lg border shadow-card">
//               <div className="text-2xl font-bold text-foreground">3</div>
//               <div className="text-sm text-muted-foreground">Total Campaigns</div>
//             </div>
//             <div className="bg-card p-4 rounded-lg border shadow-card">
//               <div className="text-2xl font-bold text-success">1</div>
//               <div className="text-sm text-muted-foreground">Active</div>
//             </div>
//             <div className="bg-card p-4 rounded-lg border shadow-card">
//               <div className="text-2xl font-bold text-foreground">$1,807.80</div>
//               <div className="text-sm text-muted-foreground">Total Spent</div>
//             </div>
//             <div className="bg-card p-4 rounded-lg border shadow-card">
//               <div className="text-2xl font-bold text-foreground">4,621</div>
//               <div className="text-sm text-muted-foreground">Total Results</div>
//             </div>
//           </div>

//           {/* Campaign Table */}
//           <div className="bg-card rounded-lg border shadow-card">
//             <CampaignTable campaigns={mockCampaigns} />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Campaigns;



import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Header } from "../../components/ads/Dashboard/Header";
import { Sidebar } from "../../components/ads/Dashboard/Sidebar";
import { Plus, Search, Filter, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "../../components/ui/use-toast";

const Campaigns = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const parseJson = async (res: Response) => {
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const text = await res.text();
      throw new Error(`Expected JSON but received: ${text.slice(0, 120)}`);
    }
    return res.json();
  };
  // Layout and toolbar state
  // Sidebar removed
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // State for campaigns, loading, error, drilldown
  const [campaignsForTable, setCampaignsForTable] = useState<any[]>([]);
  // Summary variables
  const totalCount = campaignsForTable.length;
  const activeCount = campaignsForTable.filter(c => String(c.status || "").toUpperCase() === 'ACTIVE').length;
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null);
  const [adSets, setAdSets] = useState<any[]>([]);
  const [adSetsLoading, setAdSetsLoading] = useState(false);
  const [adSetsError, setAdSetsError] = useState<string | null>(null);
  const [expandedAdSetId, setExpandedAdSetId] = useState<string | null>(null);
  const [ads, setAds] = useState<any[]>([]);
  const [adsLoading, setAdsLoading] = useState(false);
  const [adsError, setAdsError] = useState<string | null>(null);
  const [adStatusLoading, setAdStatusLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const [adInsightsLoading, setAdInsightsLoading] = useState<Record<string, boolean>>({});
  const [adInsights, setAdInsights] = useState<Record<string, any>>({});

  // Derived: filtered campaigns by search and status
  const filteredCampaigns = campaignsForTable.filter((c) => {
    const matchesSearch = searchQuery.trim()
      ? c.name?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesStatus = statusFilter === "All"
      ? true
      : (String(c.status || "").toUpperCase() === statusFilter.toUpperCase() || String(c.delivery || "").toUpperCase() === statusFilter.toUpperCase());
    return matchesSearch && matchesStatus;
  });

  // Summary metrics (based on filtered campaigns) - memoized to avoid repeated work
  const parseNumber = (v: any) => {
    if (v === null || v === undefined) return 0;
    if (typeof v === 'number') return v;
    const s = String(v).replace(/,/g, '');
    const n = parseFloat(s.replace(/[^0-9.-]+/g, ''));
    return Number.isFinite(n) ? n : 0;
  };

  const { summaryTotalCampaigns, summaryActive, summaryTotalSpent, summaryTotalResults } = useMemo(() => {
    const totalCampaigns = filteredCampaigns.length;
    const activeCount = filteredCampaigns.filter((c) => String(c.status || "").toUpperCase() === 'ACTIVE').length;
    // Prefer ad insights when available (they are more recent); aggregate across cached adInsights
    const insightValues = Object.values(adInsights).filter(Boolean) as any[];
    const spentFromInsights = insightValues.reduce((acc, ins) => acc + parseNumber(ins?.spend ?? 0), 0);
    // for results prefer actions sum (link_click / other actions), otherwise use clicks
    const resultsFromInsights = insightValues.reduce((acc, ins) => {
      if (!ins) return acc;
      let actionsSum = 0;
      if (Array.isArray(ins.actions) && ins.actions.length > 0) {
        actionsSum = ins.actions.reduce((s: number, a: any) => s + parseNumber(a?.value ?? 0), 0);
      }
      const clicks = parseNumber(ins?.clicks ?? 0);
      return acc + (actionsSum > 0 ? actionsSum : clicks);
    }, 0);

    const totalSpentFromCampaigns = filteredCampaigns.reduce((acc, c) => acc + parseNumber(c.amountSpent ?? c.amount_spent ?? c.spend ?? 0), 0);
    const totalResultsFromCampaigns = filteredCampaigns.reduce((acc, c) => acc + parseNumber(c.results ?? 0), 0);

    const totalSpent = spentFromInsights > 0 ? spentFromInsights : totalSpentFromCampaigns;
    const totalResults = resultsFromInsights > 0 ? resultsFromInsights : totalResultsFromCampaigns;
    return { summaryTotalCampaigns: totalCampaigns, summaryActive: activeCount, summaryTotalSpent: totalSpent, summaryTotalResults: totalResults };
  }, [filteredCampaigns, adInsights]);

  const fmtCurrency = (n: number) => {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);
    } catch (e) {
      return `₹${n.toFixed(2)}`;
    }
  };

  // UI helpers
  const renderStatusBadge = (statusRaw: string) => {
    const s = String(statusRaw || "").toUpperCase();
    if (s === "ACTIVE") return <Badge variant="outline" className="border-success text-success">Active</Badge>;
    if (s === "PAUSED") return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Paused</Badge>;
    if (s === "IN REVIEW" || s === "IN_REVIEW") return <Badge variant="outline" className="border-amber-500 text-amber-600">In Review</Badge>;
    if (s === "COMPLETED") return <Badge variant="outline" className="text-muted-foreground">Completed</Badge>;
    if (s === "ERROR" || s === "FAILED") return <Badge variant="destructive">Error</Badge>;
    return <Badge variant="outline">{statusRaw ?? "-"}</Badge>;
  };

  // Fetch campaigns on mount
  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    fetch(`${baseUrl}/api/campaigns/my?page=1&pageSize=10`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then(parseJson)
      .then((data) => {
        const rawItems = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.campaigns)
          ? data.campaigns
          : [];
        const mapped = rawItems.map((it: any, idx: number) => ({
          id: String(it.id ?? it.platform_campaign_id ?? idx),
          name: it.name ?? 'Untitled',
          status: it.status ?? it.delivery ?? 'NA',
          delivery: it.delivery ?? it.status ?? 'NA',
          objective: it.objective ?? '-',
          buyingType: it.buying_type ?? 'AUCTION',
          budget: it.budget ?? it.daily_budget ?? '-',
          results: it.results ?? '-',
          reach: it.reach ?? '-',
          impressions: it.impressions ?? '-',
          costPerResult: it.cost_per_result ?? it.costPerResult ?? '-',
          amountSpent: it.amount_spent ?? it.amountSpent ?? '-',
        }));
        setCampaignsForTable(mapped);
      })
      .catch((err) => {
        setIsError(true);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Fetch ad sets for a campaign
  const fetchAdSets = (campaignId: string) => {
    setAdSetsLoading(true);
    setAdSetsError(null);
    fetch(`${baseUrl}/api/campaigns/adsets/my?campaignId=${campaignId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then(parseJson)
      .then((data) => {
        const raw = Array.isArray(data?.items) ? data.items : (data?.adSets || []);
        // Backend may return all ad sets; filter to only those belonging to the requested campaignId
        const filtered = raw.filter((a: any) => {
          const campaignField = String(a.campaign_id ?? a.campaignId ?? "");
          return campaignField === String(campaignId);
        });
        console.debug("fetchAdSets: returned", raw.length, "items; filtered to", filtered.length);
        setAdSets(filtered);
      })
      .catch((err) => {
        setAdSetsError(err.message);
      })
      .finally(() => setAdSetsLoading(false));
  };

  // Fetch ads for an ad set
  const fetchAds = (adSetId: string) => {
    setAdsLoading(true);
    setAdsError(null);
    fetch(`${baseUrl}/api/campaigns/my?adSetId=${adSetId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then(parseJson)
      .then((data) => {
        const raw = Array.isArray(data?.items) ? data.items : (data?.ads || []);
        // Backend may return all ads; filter to only those belonging to the requested adSetId
        const filtered = raw.filter((ad: any) => {
          const adSetField = String(ad.ad_set_id ?? ad.adSetId ?? ad.ad_set ?? "");
          return adSetField === String(adSetId);
        });
        console.debug("fetchAds: returned", raw.length, "items; filtered to", filtered.length);
        setAds(filtered);
      })
      .catch((err) => {
        setAdsError(err.message);
      })
      .finally(() => setAdsLoading(false));
  };

  // Update ad status (ACTIVE / PAUSED)
  const updateAdStatus = async (ad: any, newStatusRaw: string) => {
    const newStatus = String(newStatusRaw || "").toUpperCase();
    const currentStatus = String(ad.status || "").toUpperCase();
    if (newStatus === currentStatus) return;

    setAdStatusLoading((s) => ({ ...s, [ad.id]: true }));
    try {
      // Try to infer accountId from ad object or fallback to localStorage
      // const accountId = ad.account_id || ad.accountId || ad.account?.id || localStorage.getItem("facebook_account_id");
      // if (!accountId) {
      //   toast({ title: "Missing account id", description: "Unable to find account id for this ad.", variant: 'destructive' });
      //   return;
      // }

      const token = localStorage.getItem("access_token");
      if (!token) {
        toast({ title: "Not authenticated", description: "You must be logged in to update ad status.", variant: 'destructive' });
        return;
      }

      const url = `${baseUrl}/api/facebook/act/<accountId>/updatestatus`;
      const body = {
        name: ad.name ?? ad.id,
        status: newStatus,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      // Try to parse JSON but accept non-json responses
      let parsed: any = null;
      try {
        parsed = await res.json();
      } catch (e) {
        parsed = null;
      }

      if (!res.ok) {
        const msg = parsed?.message || parsed?.error || `HTTP ${res.status} ${res.statusText}`;
        toast({ title: "Failed to update ad status", description: String(msg), variant: 'destructive' });
        return;
      }

      // On success, update local ads state so UI reflects new status
      setAds((prev) => prev.map((x) => (x.id === ad.id ? { ...x, status: newStatus } : x)));
      toast({ title: "Ad status updated", description: `${ad.name ?? ad.id} → ${newStatus}`, });
    } catch (err: any) {
      toast({ title: "Network error", description: err?.message || "Request failed", variant: 'destructive' });
    } finally {
      setAdStatusLoading((s) => ({ ...s, [ad.id]: false }));
    }
  };

  // Fetch ad insights for a single ad and cache result in adInsights state
  const fetchAdInsights = async (ad: any) => {
    if (!ad) return;
    const adKey = String(ad.id || ad.platform_ad_id || ad.name || ad.id);
    setAdInsightsLoading((s) => ({ ...s, [adKey]: true }));
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast({ title: "Not authenticated", description: "You must be logged in to fetch insights.", variant: 'destructive' });
        return;
      }

      const payload = {
        ad_name: ad.name ?? ad.id,
        date_preset: "last_7d",
        fields: "impressions,clicks,spend,ctr,cpc,actions",
      };

      const res = await fetch(`${baseUrl}/api/facebook/insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let parsed: any = null;
      try {
        parsed = await res.json();
      } catch (e) {
        parsed = null;
      }

      if (!res.ok) {
        const msg = parsed?.message || parsed?.error || `HTTP ${res.status} ${res.statusText}`;
        toast({ title: "Failed to fetch insights", description: String(msg), variant: 'destructive' });
        setAdInsights((s) => ({ ...s, [adKey]: null }));
        return;
      }

      // Response shape: { results: [ { platform_ad_id, insights: { data: [ { ...metrics } ] } } ] }
      const result = Array.isArray(parsed?.results) && parsed.results.length > 0 ? parsed.results[0] : null;
      const insight = result?.insights?.data && result.insights.data.length > 0 ? result.insights.data[0] : null;
      setAdInsights((s) => ({ ...s, [adKey]: insight }));
    } catch (err: any) {
      toast({ title: "Network error", description: err?.message || "Request failed", variant: 'destructive' });
      setAdInsights((s) => ({ ...s, [adKey]: null }));
    } finally {
      setAdInsightsLoading((s) => ({ ...s, [adKey]: false }));
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header user={{ name: "User", photo: null, email: null }} /> */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
              <p className="text-muted-foreground">Manage your Meta advertising campaigns</p>
            </div>
            <Button variant="success" size="lg" onClick={() => (window.location.href = "/campaigns/create") }>
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
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
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
                  {statusFilter === "All" ? "Filters" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {["All", "Active", "Paused", "In Review", "Completed"].map((label) => (
                  <DropdownMenuItem key={label} onClick={() => setStatusFilter(label)}>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Campaign Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card p-4 rounded-lg border shadow-card">
              <div className="text-2xl font-bold text-foreground">{summaryTotalCampaigns}</div>
              <div className="text-sm text-muted-foreground">Total Campaigns</div>
            </div>
            <div className="bg-card p-4 rounded-lg border shadow-card">
              <div className="text-2xl font-bold text-success">{summaryActive}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="bg-card p-4 rounded-lg border shadow-card">
              <div className="text-2xl font-bold text-foreground">{fmtCurrency(summaryTotalSpent)}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
            <div className="bg-card p-4 rounded-lg border shadow-card">
              <div className="text-2xl font-bold text-foreground">{summaryTotalResults}</div>
              <div className="text-sm text-muted-foreground">Total Results</div>
            </div>
          </div>

          {/* Campaigns table with drilldown (modernized) */}
          <div className="bg-card rounded-lg border shadow-card p-4">
            {isLoading ? (
              <div>Loading campaigns…</div>
            ) : isError ? (
              <div className="text-red-600">Error: {error ?? "Unknown error"}</div>
            ) : !filteredCampaigns || filteredCampaigns.length === 0 ? (
              <div className="text-muted-foreground">No campaigns found.</div>
            ) : (
              <table className="w-full table-auto border-collapse text-sm">
                <thead>
                  <tr className="text-left sticky top-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75 z-10">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Objective</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Buying Type</th>
                    <th className="pb-2">Budget</th>
                    <th className="pb-2">Results</th>
                    <th className="pb-2">Reach</th>
                    <th className="pb-2">Impressions</th>
                    <th className="pb-2">Cost per Result</th>
                    <th className="pb-2">Amount Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map((c) => (
                    <React.Fragment key={c.id}>
                      <tr className="border-t hover:bg-muted/50 transition-colors">
                        <td className="py-2 max-w-[340px] truncate">
                          <span
                            className="font-medium text-accent-blue hover:underline cursor-pointer"
                            onClick={() => {
                              if (expandedCampaignId === c.id) {
                                setExpandedCampaignId(null);
                              } else {
                                setExpandedCampaignId(c.id);
                                fetchAdSets(c.id);
                              }
                            }}
                          >
                            {c.name}
                          </span>
                        </td>
                        <td className="py-2">
                          <Badge variant="outline" className="text-xs">
                            {String(c.objective || '-').replace('OUTCOME_', '').replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="py-2">{renderStatusBadge(c.status)}</td>
                        <td className="py-2">
                          <Badge variant="secondary" className="text-xs">{c.buyingType}</Badge>
                        </td>
                        <td className="py-2"><Badge variant="secondary">{c.budget}</Badge></td>
                        <td className="py-2 text-accent-blue font-medium">{c.results}</td>
                        <td className="py-2">{c.reach}</td>
                        <td className="py-2">{c.impressions}</td>
                        <td className="py-2">{c.costPerResult}</td>
                        <td className="py-2">{c.amountSpent}</td>
                      </tr>
                      {expandedCampaignId === c.id && (
                        <tr>
                          <td colSpan={10} className="bg-muted/50 p-4">
                            {adSetsLoading ? (
                              <div>Loading ad sets…</div>
                            ) : adSetsError ? (
                              <div className="text-red-600">{adSetsError}</div>
                            ) : !adSets || adSets.length === 0 ? (
                              <div className="text-muted-foreground">No ad sets found.</div>
                            ) : (
                              <table className="w-full table-auto border-collapse">
                                <thead>
                                  <tr className="text-left">
                                    <th className="pb-2">Ad Set Name</th>
                                    <th className="pb-2">Status</th>
                                    <th className="pb-2">Optimization Goal</th>
                                    <th className="pb-2">Billing Event</th>
                                    <th className="pb-2">Daily Budget</th>
                                    <th className="pb-2">Geo</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {adSets.map((a: any) => (
                                    <React.Fragment key={a.id}>
                                      <tr className="border-t hover:bg-muted/30">
                                        <td className="py-2">
                                          <span
                                            className="font-medium text-accent-blue hover:underline cursor-pointer"
                                            onClick={() => {
                                              if (expandedAdSetId === a.id) {
                                                setExpandedAdSetId(null);
                                              } else {
                                                setExpandedAdSetId(a.id);
                                                fetchAds(a.id);
                                              }
                                            }}
                                          >
                                            {a.name ?? "na"}
                                          </span>
                                        </td>
                                        <td className="py-2">{renderStatusBadge(a.status ?? "-")}</td>
                                        <td className="py-2">
                                          <Badge variant="outline" className="text-xs">
                                            {String(a.optimization_goal ?? a.optimizationGoal ?? "na").replace(/_/g, ' ')}
                                          </Badge>
                                        </td>
                                        <td className="py-2">
                                          <Badge variant="outline" className="text-xs">
                                            {String(a.billing_event ?? a.billingEvent ?? "na").replace(/_/g, ' ')}
                                          </Badge>
                                        </td>
                                        <td className="py-2">{a.daily_budget ?? a.dailyBudget ?? "na"}</td>
                                        <td className="py-2">{a.targeting?.geo_locations?.countries?.join(", ") ?? a.geo ?? "na"}</td>
                                      </tr>
                                      {expandedAdSetId === a.id && (
                                        <tr>
                                          <td colSpan={6} className="bg-muted/50 p-4">
                                            {adsLoading ? (
                                              <div>Loading ads…</div>
                                            ) : adsError ? (
                                              <div className="text-red-600">{adsError}</div>
                                            ) : !ads || ads.length === 0 ? (
                                              <div className="text-muted-foreground">No ads found.</div>
                                            ) : (
                                              <table className="w-full table-auto border-collapse">
                                                <thead>
                                                  <tr className="text-left">
                                                    <th className="pb-2">Ad Name</th>
                                                    <th className="pb-2">Status</th>
                                                    <th className="pb-2">Impressions</th>
                                                    <th className="pb-2">Clicks</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {ads.map((ad: any) => {
                                                    const adKey = String(ad.id || ad.platform_ad_id || ad.name || ad.id);
                                                    const insight = adInsights[adKey];
                                                    return (
                                                      <React.Fragment key={ad.id}>
                                                        <tr className="border-t">
                                                          <td className="py-2">{ad.name ?? "na"}</td>
                                                          <td className="py-2">
                                                            <div className="flex items-center gap-2">
                                                              <select
                                                                value={String(ad.status || "").toUpperCase()}
                                                                onChange={(e) => updateAdStatus(ad, e.target.value)}
                                                                disabled={!!adStatusLoading[ad.id]}
                                                                className="bg-transparent border px-2 py-1 rounded"
                                                              >
                                                                <option value="ACTIVE">ACTIVE</option>
                                                                <option value="PAUSED">PAUSED</option>
                                                                <option value="DELETED">DELETED</option>
                                                                <option value="ARCHIVED">ARCHIVED</option>
                                                              </select>
                                                              {adStatusLoading[ad.id] && <span className="text-xs text-muted-foreground">Saving…</span>}
                                                              <Button size="sm" onClick={() => fetchAdInsights(ad)} disabled={!!adInsightsLoading[adKey]}>
                                                                {adInsightsLoading[adKey] ? 'Loading…' : 'Load Insights'}
                                                              </Button>
                                                            </div>
                                                          </td>
                                                          <td className="py-2">{ad.impressions ?? "na"}</td>
                                                          <td className="py-2">{ad.clicks ?? "na"}</td>
                                                        </tr>
                                                        {insight && (
                                                          <tr key={`${adKey}-insight`}>
                                                            <td colSpan={4} className="bg-muted/10 p-3">
                                                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                                                <div>
                                                                  <div className="text-xs text-muted-foreground">Impressions</div>
                                                                  <div className="font-medium">{insight.impressions ?? '-'}</div>
                                                                </div>
                                                                <div>
                                                                  <div className="text-xs text-muted-foreground">Clicks</div>
                                                                  <div className="font-medium">{insight.clicks ?? '-'}</div>
                                                                </div>
                                                                <div>
                                                                  <div className="text-xs text-muted-foreground">Spend</div>
                                                                  <div className="font-medium">{insight.spend ?? '-'}</div>
                                                                </div>
                                                                <div>
                                                                  <div className="text-xs text-muted-foreground">CTR / CPC</div>
                                                                  <div className="font-medium">{insight.ctr ?? '-'} / {insight.cpc ?? '-'}</div>
                                                                </div>
                                                              </div>
                                                              {Array.isArray(insight.actions) && insight.actions.length > 0 && (
                                                                <div className="mt-3 text-sm">
                                                                  <div className="text-xs text-muted-foreground">Actions</div>
                                                                  <ul className="list-disc ml-4">
                                                                    {insight.actions.map((a: any, idx: number) => (
                                                                      <li key={idx}>{a.action_type}: {a.value}</li>
                                                                    ))}
                                                                  </ul>
                                                                </div>
                                                              )}
                                                            </td>
                                                          </tr>
                                                        )}
                                                      </React.Fragment>
                                                    );
                                                  })}
                                                </tbody>
                                              </table>
                                            )}
                                          </td>
                                        </tr>
                                      )}
                                    </React.Fragment>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
export default Campaigns;