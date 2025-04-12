import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { verifyLineage } from "@/lib/web3storage";
import { 
  CheckCircle, 
  Hourglass, 
  AlertCircle, 
  Search, 
  Database, 
  Brain, 
  ArrowRight, 
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Verification = () => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [verificationMessage, setVerificationMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();

  // Fetch datasets
  const { data: datasets } = useQuery({
    queryKey: ["/api/datasets"],
  });

  // Fetch models
  const { data: models } = useQuery({
    queryKey: ["/api/models"],
  });

  // Fetch relationships
  const { data: relationships } = useQuery({
    queryKey: ["/api/relationships"],
  });

  const filteredRelationships = relationships?.filter(rel => 
    rel.datasetId.toString().includes(searchQuery) || 
    rel.modelId.toString().includes(searchQuery) ||
    datasets?.find(d => d.id === rel.datasetId)?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    models?.find(m => m.id === rel.modelId)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getDatasetName = (id: number) => {
    return datasets?.find(dataset => dataset.id === id)?.name || "Unknown Dataset";
  };

  const getModelName = (id: number) => {
    return models?.find(model => model.id === id)?.name || "Unknown Model";
  };

  const getStatusIcon = (status: string) => {
    if (status === "verified") {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (status === "processing") {
      return <Hourglass className="h-4 w-4 text-amber-500" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      verified: "bg-green-500/20 text-green-500",
      processing: "bg-amber-500/20 text-amber-500",
      failed: "bg-red-500/20 text-red-500"
    };
    
    return (
      <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center ${statusStyles[status as keyof typeof statusStyles] || "bg-gray-500/20 text-gray-500"}`}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </div>
    );
  };

  const handleVerify = async () => {
    if (!selectedDatasetId || !selectedModelId) {
      toast({
        title: "Verification Error",
        description: "Please select both a dataset and a model",
        variant: "destructive",
      });
      return;
    }

    setVerificationStatus("loading");
    setVerificationMessage("Verifying dataset lineage...");

    try {
      const dataset = datasets?.find(d => d.id === parseInt(selectedDatasetId));
      const model = models?.find(m => m.id === parseInt(selectedModelId));
      
      if (!dataset || !model) {
        throw new Error("Dataset or model not found");
      }
      
      // Find existing relationship
      const relationship = relationships?.find(r => 
        r.datasetId === parseInt(selectedDatasetId) && 
        r.modelId === parseInt(selectedModelId)
      );

      const result = await verifyLineage(
        dataset.cid,
        relationship?.processingCid,
        model.cid
      );

      if (result) {
        setVerificationStatus("success");
        setVerificationMessage("The dataset lineage has been successfully verified on the blockchain.");
        toast({
          title: "Verification Successful",
          description: "Dataset lineage has been verified",
          variant: "default",
        });
      } else {
        setVerificationStatus("error");
        setVerificationMessage("Could not verify the dataset lineage. The CIDs may be invalid or not properly linked.");
        toast({
          title: "Verification Failed",
          description: "Could not verify dataset lineage",
          variant: "destructive",
        });
      }
    } catch (error) {
      setVerificationStatus("error");
      setVerificationMessage("An error occurred during verification: " + (error instanceof Error ? error.message : "Unknown error"));
      toast({
        title: "Verification Error",
        description: "An error occurred during verification",
        variant: "destructive",
      });
    }
  };

  const resetVerification = () => {
    setVerificationStatus("idle");
    setVerificationMessage("");
    setSelectedDatasetId("");
    setSelectedModelId("");
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Verification</h1>
            <p className="text-sm text-muted-foreground">
              Verify the lineage of datasets and models on Filecoin/IPFS
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="verify">
          <TabsList className="mb-4">
            <TabsTrigger value="verify">Verify Lineage</TabsTrigger>
            <TabsTrigger value="history">Verification History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="verify">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verify Dataset Lineage</CardTitle>
                  <CardDescription>
                    Select a dataset and model to verify the lineage on the blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Select Dataset</label>
                      <Select value={selectedDatasetId} onValueChange={setSelectedDatasetId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a dataset" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {datasets?.map(dataset => (
                              <SelectItem key={dataset.id} value={dataset.id.toString()}>
                                {dataset.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Select Model</label>
                      <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {models?.map(model => (
                              <SelectItem key={model.id} value={model.id.toString()}>
                                {model.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" onClick={resetVerification}>Reset</Button>
                  <Button onClick={handleVerify} disabled={verificationStatus === "loading" || !selectedDatasetId || !selectedModelId}>
                    {verificationStatus === "loading" ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Verifying...
                      </>
                    ) : "Verify Lineage"}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Verification Status</CardTitle>
                  <CardDescription>
                    Current verification status and lineage information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {verificationStatus === "idle" ? (
                    <div className="h-64 flex items-center justify-center text-center">
                      <div className="text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Select a dataset and model to verify their lineage</p>
                      </div>
                    </div>
                  ) : verificationStatus === "loading" ? (
                    <div className="h-64 flex items-center justify-center text-center">
                      <div>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">{verificationMessage}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg flex items-center ${
                        verificationStatus === "success" 
                          ? "bg-green-500/10 text-green-500" 
                          : "bg-red-500/10 text-red-500"
                      }`}>
                        {verificationStatus === "success" ? (
                          <CheckCircle className="h-5 w-5 mr-2" />
                        ) : (
                          <AlertCircle className="h-5 w-5 mr-2" />
                        )}
                        <p>{verificationMessage}</p>
                      </div>
                      
                      {selectedDatasetId && selectedModelId && (
                        <div className="space-y-4 py-2">
                          <div className="flex items-center justify-center">
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <Database className="h-6 w-6 text-primary" />
                              </div>
                              <span className="mt-1 text-sm font-medium">
                                {datasets?.find(d => d.id === parseInt(selectedDatasetId))?.name}
                              </span>
                            </div>
                            
                            <ArrowRight className="mx-4 text-primary" />
                            
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                                <Brain className="h-6 w-6 text-green-500" />
                              </div>
                              <span className="mt-1 text-sm font-medium">
                                {models?.find(m => m.id === parseInt(selectedModelId))?.name}
                              </span>
                            </div>
                          </div>
                          
                          {datasets?.find(d => d.id === parseInt(selectedDatasetId)) && (
                            <div className="text-xs font-mono text-muted-foreground bg-muted/50 p-2 rounded overflow-x-auto whitespace-nowrap">
                              <div>Dataset CID: {datasets.find(d => d.id === parseInt(selectedDatasetId))?.cid}</div>
                              <div>Model CID: {models?.find(m => m.id === parseInt(selectedModelId))?.cid}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Verification History</CardTitle>
                <CardDescription>
                  History of dataset-model relationships and their verification status
                </CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by dataset or model"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {relationships && relationships.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Dataset</TableHead>
                          <TableHead>Model</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>License</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRelationships.map((relationship) => (
                          <TableRow key={relationship.id}>
                            <TableCell className="font-medium">
                              {getDatasetName(relationship.datasetId)}
                            </TableCell>
                            <TableCell>
                              {getModelName(relationship.modelId)}
                            </TableCell>
                            <TableCell>
                              {relationship.usageDate 
                                ? new Date(relationship.usageDate).toLocaleDateString() 
                                : "Unknown"}
                            </TableCell>
                            <TableCell>
                              {relationship.licensingInfo}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(relationship.status)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No verification history found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Verification;
