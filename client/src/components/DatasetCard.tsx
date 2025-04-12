import { Link } from "wouter";
import { Dataset } from "@shared/schema";
import { Database, HardDrive, FileText, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface DatasetCardProps {
  dataset: Dataset;
}

const DatasetCard = ({ dataset }: DatasetCardProps) => {
  const statusColor = {
    processing: "bg-amber-500/20 text-amber-500",
    verified: "bg-green-500/20 text-green-500",
    failed: "bg-red-500/20 text-red-500",
  };

  const getStatusColor = (status: string) => {
    return statusColor[status as keyof typeof statusColor] || "bg-gray-500/20 text-gray-500";
  };

  const getDomainColor = (domain: string) => {
    const domainMap: Record<string, string> = {
      "Computer Vision": "bg-primary/10 text-primary",
      "Natural Language Processing": "bg-accent/10 text-accent",
      "Audio Processing": "bg-amber-500/10 text-amber-500",
      "Tabular Data": "bg-green-500/10 text-green-500",
    };
    return domainMap[domain] || "bg-primary/10 text-primary";
  };

  const formatDate = (dateString: Date | null) => {
    if (!dateString) return "Unknown";
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <Card className="bg-card border-border hover:border-primary transition-colors">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${getDomainColor(dataset.domain)} rounded-md flex items-center justify-center mr-3`}>
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">{dataset.name}</h3>
              <p className="text-xs text-muted-foreground">
                Uploaded {formatDate(dataset.uploadedAt)}
              </p>
            </div>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(dataset.status)}`}>
            {dataset.status.charAt(0).toUpperCase() + dataset.status.slice(1)}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {dataset.tags && dataset.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="bg-primary/10 text-primary text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground mb-3">
          <div className="flex items-center">
            <HardDrive className="h-4 w-4 mr-1" />
            <span>{dataset.size}</span>
            <span className="mx-2">•</span>
            <FileText className="h-4 w-4 mr-1" />
            <span>{dataset.filesTotalCount} files</span>
          </div>
        </div>
        
        <div className="text-xs font-mono text-muted-foreground bg-muted/50 p-2 rounded mb-3 overflow-x-auto whitespace-nowrap">
          CID: {dataset.cid}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            <span>Domain: {dataset.domain}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/datasets/${dataset.id}`}>
                  <div className="w-full cursor-pointer">View Details</div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/lineage?dataset=${dataset.id}`}>
                  <div className="w-full cursor-pointer">View Lineage</div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a 
                  href={`https://gateway.lighthouse.storage/ipfs/${dataset.cid}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full cursor-pointer"
                >
                  View on IPFS
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Download Metadata
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatasetCard;
