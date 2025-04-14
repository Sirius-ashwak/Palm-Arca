import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dataset, Model } from "@shared/schema";
import { verifyLineage } from "@/lib/web3storage";
import { useToast } from "@/hooks/use-toast";
import { Database, FlaskRound, Brain, Calendar, CheckCircle, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DatasetLineageProps {
  datasets: Dataset[];
  selectedDatasetId?: number;
}

const DatasetLineage = ({ datasets, selectedDatasetId }: DatasetLineageProps) => {
  const [selectedId, setSelectedId] = useState<number>(
    selectedDatasetId || (datasets.length > 0 ? datasets[0].id : 0)
  );
  const { toast } = useToast();

  const { data: relationships } = useQuery({
    queryKey: ["/api/relationships/dataset", selectedId],
    enabled: !!selectedId,
  });

  // Find the selected dataset
  const selectedDataset = datasets.find(dataset => dataset.id === selectedId);

  // For this example, we'll assume the first relationship if any exists
  const relationship = relationships && relationships.length > 0 ? relationships[0] : null;

  // Query to get the model if we have a relationship
  const { data: model } = useQuery({
    queryKey: ["/api/models", relationship?.modelId],
    enabled: !!relationship?.modelId,
  });

  const handleVerifyLineage = async () => {
    if (!selectedDataset || !model) {
      toast({
        title: "Verification failed",
        description: "Dataset or model not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await verifyLineage(
        selectedDataset.cid,
        relationship?.processingCid,
        model.cid
      );

      if (result) {
        toast({
          title: "Lineage verified",
          description: "The dataset lineage has been successfully verified",
          variant: "default",
        });
      } else {
        toast({
          title: "Verification failed",
          description: "Could not verify the dataset lineage",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification error",
        description: "An error occurred during verification",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Dataset Lineage</h2>
        {datasets.length > 0 && (
          <Select 
            value={selectedId.toString()} 
            onValueChange={(value) => setSelectedId(Number(value))}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a dataset" />
            </SelectTrigger>
            <SelectContent>
              {datasets.map((dataset) => (
                <SelectItem key={dataset.id} value={dataset.id.toString()}>
                  {dataset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          {selectedDataset ? (
            <>
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="bg-primary/10 border border-primary rounded-lg p-4 w-64">
                    <div className="flex items-center mb-2">
                      <Database className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-medium">{selectedDataset.name}</h3>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Uploaded: {selectedDataset.uploadedAt ? new Date(selectedDataset.uploadedAt).toLocaleDateString() : 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground bg-muted/50 p-2 rounded mb-2 overflow-x-auto whitespace-nowrap">
                      CID: {selectedDataset.cid}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full">
                        Original Source
                      </div>
                    </div>
                  </div>
                  {/* Arrow or line */}
                  {relationship && (
                    <div className="flex justify-center my-4">
                      <ArrowRight className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
              </div>
              
              {relationship?.processingCid && (
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="bg-accent/10 border border-accent rounded-lg p-4 w-64">
                      <div className="flex items-center mb-2">
                        <FlaskRound className="h-5 w-5 text-accent mr-2" />
                        <h3 className="font-medium">Preprocessing & Augmentation</h3>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Processed: {relationship.usageDate ? new Date(relationship.usageDate).toLocaleDateString() : 'Unknown'}</span>
                        </div>
                      </div>
                      <div className="text-xs font-mono text-muted-foreground bg-muted/50 p-2 rounded mb-2 overflow-x-auto whitespace-nowrap">
                        CID: {relationship.processingCid}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                          Preprocessing
                        </div>
                      </div>
                    </div>
                    {/* Arrow or line */}
                    {model && (
                      <div className="flex justify-center my-4">
                        <ArrowRight className="h-6 w-6 text-primary" />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {model && (
                <div className="flex justify-center mb-8">
                  <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 w-64">
                    <div className="flex items-center mb-2">
                      <Brain className="h-5 w-5 text-green-500 mr-2" />
                      <h3 className="font-medium">{model.name}</h3>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Trained: {model.createdAt ? new Date(model.createdAt).toLocaleDateString() : 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground bg-muted/50 p-2 rounded mb-2 overflow-x-auto whitespace-nowrap">
                      CID: {model.cid}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full">
                        Trained Model
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center mt-8">
                <Button 
                  variant="outline" 
                  onClick={handleVerifyLineage}
                  disabled={!model}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Verify Lineage</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p>No dataset selected or available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DatasetLineage;
