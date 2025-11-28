import { useState } from "react";
import { Button } from "../../ui/button";
import { Switch } from "../../ui/switch";
import { Badge } from "../../ui/badge";
import { Checkbox } from "../../ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { 
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: string;
  delivery: string;
  budget: string;
  results: string;
  reach: string;
  impressions: string;
  costPerResult: string;
  amountSpent: string;
  isActive: boolean;
}

interface CampaignTableProps {
  campaigns: Campaign[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <CheckCircle2 className="w-4 h-4 text-success" />;
    case "In Review":
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case "Completed":
      return <XCircle className="w-4 h-4 text-muted-foreground" />;
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return <Badge variant="outline" className="border-success text-success">Active</Badge>;
    case "In Review":
      return <Badge variant="outline" className="border-yellow-500 text-yellow-600">In Review</Badge>;
    case "Completed":
      return <Badge variant="outline">Completed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function CampaignTable({ campaigns }: CampaignTableProps) {
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [campaignStates, setCampaignStates] = useState<Record<string, boolean>>(
    campaigns.reduce((acc, campaign) => ({
      ...acc,
      [campaign.id]: campaign.isActive
    }), {})
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCampaigns(campaigns.map(campaign => campaign.id));
    } else {
      setSelectedCampaigns([]);
    }
  };

  const handleSelectCampaign = (campaignId: string, checked: boolean) => {
    if (checked) {
      setSelectedCampaigns([...selectedCampaigns, campaignId]);
    } else {
      setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaignId));
    }
  };

  const handleToggleCampaign = (campaignId: string, active: boolean) => {
    setCampaignStates(prev => ({
      ...prev,
      [campaignId]: active
    }));
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedCampaigns.length > 0 && (
        <div className="bg-accent/50 p-3 rounded-md border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedCampaigns.length} campaign{selectedCampaigns.length === 1 ? '' : 's'} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Play className="w-4 h-4 mr-1" />
                Start
              </Button>
              <Button variant="outline" size="sm">
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-1" />
                Duplicate
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedCampaigns.length === campaigns.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Campaign Name</TableHead>
            <TableHead>On/Off</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Results</TableHead>
            <TableHead>Reach</TableHead>
            <TableHead>Impressions</TableHead>
            <TableHead>Cost per Result</TableHead>
            <TableHead>Amount Spent</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow 
              key={campaign.id}
              className="hover:bg-muted/50 cursor-pointer"
            >
              <TableCell>
                <Checkbox
                  checked={selectedCampaigns.includes(campaign.id)}
                  onCheckedChange={(checked) => 
                    handleSelectCampaign(campaign.id, checked as boolean)
                  }
                />
              </TableCell>
              <TableCell>
                <div className="font-medium text-accent-blue hover:underline">
                  {campaign.name}
                </div>
              </TableCell>
              <TableCell>
                <Switch
                  checked={campaignStates[campaign.id]}
                  onCheckedChange={(checked) => 
                    handleToggleCampaign(campaign.id, checked)
                  }
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(campaign.delivery)}
                  {getStatusBadge(campaign.delivery)}
                </div>
              </TableCell>
              <TableCell className="font-medium">{campaign.budget}</TableCell>
              <TableCell className="font-medium text-accent-blue">
                {campaign.results}
              </TableCell>
              <TableCell>{campaign.reach}</TableCell>
              <TableCell>{campaign.impressions}</TableCell>
              <TableCell className="font-medium">{campaign.costPerResult}</TableCell>
              <TableCell className="font-medium">{campaign.amountSpent}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}