import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { GitBranch } from "lucide-react";
import DatasetLineage from "@/components/DatasetLineage";

const Lineage = () => {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1]);
  const datasetId = params.get("dataset") ? parseInt(params.get("dataset")!) : undefined;
  
  const { data: datasets, isLoading: datasetsLoading } = useQuery({
    queryKey: ["/api/datasets"],
  });

  return (
    <div>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Lineage Tracking</h1>
            <p className="text-sm text-muted-foreground">
              Track and verify the lineage of your AI datasets throughout the ML pipeline
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {datasetsLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        ) : datasets && datasets.length > 0 ? (
          <DatasetLineage datasets={datasets} selectedDatasetId={datasetId} />
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <GitBranch className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No datasets available</h3>
            <p className="text-muted-foreground">
              Upload datasets first to track their lineage through the AI pipeline
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lineage;
