import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Eye, MoreVertical, Clock, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Database, Brain } from "lucide-react";

const RelationshipTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);

  const { data: relationships, isLoading } = useQuery({
    queryKey: ["/api/relationships"],
  });

  const { data: datasets } = useQuery({
    queryKey: ["/api/datasets"],
  });

  const { data: models } = useQuery({
    queryKey: ["/api/models"],
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-muted rounded mb-4"></div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!relationships || relationships.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <p className="text-muted-foreground">No dataset-model relationships found</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(relationships.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedRelationships = relationships.slice(startIndex, startIndex + pageSize);

  const getDataset = (datasetId: number) => {
    return datasets?.find(dataset => dataset.id === datasetId);
  };

  const getModel = (modelId: number) => {
    return models?.find(model => model.id === modelId);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Dataset
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Model
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date Used
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                License
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {paginatedRelationships.map((relationship) => {
              const dataset = getDataset(relationship.datasetId);
              const model = getModel(relationship.modelId);
              
              return (
                <tr key={relationship.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center mr-3">
                        <Database className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{dataset?.name || "Unknown Dataset"}</div>
                        <div className="text-xs text-muted-foreground">{dataset?.size || "Unknown size"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500/10 rounded-md flex items-center justify-center mr-3">
                        <Brain className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{model?.name || "Unknown Model"}</div>
                        <div className="text-xs text-muted-foreground">{model?.architecture || "Unknown architecture"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      {relationship.usageDate ? new Date(relationship.usageDate).toLocaleDateString() : "Unknown"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {relationship.status === "verified" ? (
                      <div className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full inline-flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>Verified</span>
                      </div>
                    ) : (
                      <div className="bg-amber-500/20 text-amber-500 text-xs px-2 py-1 rounded-full inline-flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Processing</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{relationship.licensingInfo}</div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <Button variant="ghost" size="sm" className="text-primary">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-primary ml-2">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Verify Lineage</DropdownMenuItem>
                        <DropdownMenuItem>Export Data</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="bg-card px-6 py-3 border-t border-border flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(startIndex + pageSize, relationships.length)}
          </span>{" "}
          of <span className="font-medium">{relationships.length}</span> results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "default" : "ghost"}
              size="sm"
              onClick={() => setPage(i + 1)}
              className="w-8 h-8"
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RelationshipTable;
