import { Link } from "wouter";
import { Model } from "@shared/schema";
import { Brain, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface ModelCardProps {
  model: Model;
}

const ModelCard = ({ model }: ModelCardProps) => {
  const formatDate = (dateString: Date | null) => {
    if (!dateString) return "Unknown";
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <Card className="bg-card border-border hover:border-primary transition-colors">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-md flex items-center justify-center mr-3">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">{model.name}</h3>
              <p className="text-xs text-muted-foreground">
                Created {formatDate(model.createdAt)}
              </p>
            </div>
          </div>
        </div>
        
        {model.architecture && (
          <div className="text-xs text-muted-foreground mb-3">
            <span>Architecture: {model.architecture}</span>
          </div>
        )}
        
        <div className="text-xs font-mono text-muted-foreground bg-muted/50 p-2 rounded mb-3 overflow-x-auto whitespace-nowrap">
          CID: {model.cid}
        </div>
        
        {model.description && (
          <div className="text-sm mb-3 line-clamp-2">
            {model.description}
          </div>
        )}
        
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/models/${model.id}`}>
                  <a className="w-full cursor-pointer">View Details</a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/lineage?model=${model.id}`}>
                  <a className="w-full cursor-pointer">View Lineage</a>
                </Link>
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

export default ModelCard;
