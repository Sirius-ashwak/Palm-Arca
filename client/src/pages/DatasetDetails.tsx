import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Database, HardDrive, FileText, Calendar, Tag, Clock, ExternalLink, Download, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import RelationshipTable from "@/components/RelationshipTable";
import DatasetLineage from "@/components/DatasetLineage";
import { getFilecoinDealStatus } from "@/lib/web3storage";

const DatasetDetails = () => {
  const { id } = useParams();
  const datasetId = parseInt(id as string);
  const [dealStatus, setDealStatus] = useState<any>(null);
  const [loadingDealStatus, setLoadingDealStatus] = useState(false);

  const { data: dataset, isLoading } = useQuery({
    queryKey: ["/api/datasets", datasetId],
  });

  const { data: relationships } = useQuery({
    queryKey: ["/api/relationships/dataset", datasetId],
    enabled: !!datasetId,
  });
  
  useEffect(() => {
    // Fetch Filecoin deal status when dataset is loaded
    if (dataset?.cid) {
      setLoadingDealStatus(true);
      getFilecoinDealStatus(dataset.cid)
        .then(status => {
          setDealStatus(status);
        })
        .catch(error => {
          console.error("Failed to get deal status:", error);
        })
        .finally(() => {
          setLoadingDealStatus(false);
        });
    }
  }, [dataset?.cid]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="h-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold mb-4">Dataset Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The dataset you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/datasets">
          <Button>Back to Datasets</Button>
        </Link>
      </div>
    );
  }

  const statusColor = {
    processing: "bg-amber-500/20 text-amber-500",
    verified: "bg-green-500/20 text-green-500",
    failed: "bg-red-500/20 text-red-500",
  };

  const getStatusColor = (status: string) => {
    return statusColor[status as keyof typeof statusColor] || "bg-gray-500/20 text-gray-500";
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center mb-2">
          <Link href="/datasets">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold">{dataset.name}</h1>
          <div className={`ml-4 text-xs px-2 py-1 rounded-full ${getStatusColor(dataset.status)}`}>
            {dataset.status.charAt(0).toUpperCase() + dataset.status.slice(1)}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Uploaded {dataset.uploadedAt ? new Date(dataset.uploadedAt).toLocaleDateString() : "Unknown"}
        </p>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lineage">Lineage</TabsTrigger>
            <TabsTrigger value="usage">Model Usage</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Dataset Information</CardTitle>
                  <CardDescription>Details and metadata about this dataset</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dataset.description && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">Description</h3>
                        <p className="text-sm text-muted-foreground">{dataset.description}</p>
                        <Separator className="my-4" />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Metadata</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Database className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Domain:</span>
                            <span className="ml-2">{dataset.domain}</span>
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Format:</span>
                            <span className="ml-2">{dataset.format}</span>
                          </div>
                          <div className="flex items-center">
                            <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Size:</span>
                            <span className="ml-2">{dataset.size}</span>
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Files:</span>
                            <span className="ml-2">{dataset.filesTotalCount}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">License & Access</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">License:</span>
                            <span className="ml-2">{dataset.license}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Uploaded:</span>
                            <span className="ml-2">
                              {dataset.uploadedAt 
                                ? new Date(dataset.uploadedAt).toLocaleDateString() 
                                : "Unknown"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">Access:</span>
                            <span className="ml-2 capitalize">{dataset.accessControl}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {dataset.tags && dataset.tags.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {dataset.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="bg-primary/10 text-primary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Separator className="my-4" />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">IPFS Content Identifier (CID)</h3>
                      <div className="flex items-center">
                        <code className="p-2 bg-muted rounded text-xs font-mono flex-1 overflow-x-auto">
                          {dataset.cid}
                        </code>
                        <Button variant="outline" size="sm" className="ml-2" asChild>
                          <a href={`https://gateway.lighthouse.storage/ipfs/${dataset.cid}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View on Lighthouse
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start" asChild>
                      <a href={`https://gateway.lighthouse.storage/ipfs/${dataset.cid}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Lighthouse
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download Metadata
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-muted/40 p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">Models</p>
                        <p className="text-xl font-bold">{relationships?.length || 0}</p>
                      </div>
                      <div className="bg-muted/40 p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">Verifications</p>
                        <p className="text-xl font-bold">
                          {relationships?.filter(r => r.status === "verified").length || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Server className="h-4 w-4 mr-2" />
                      Filecoin Deal Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingDealStatus ? (
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </div>
                    ) : dealStatus && dealStatus.data && dealStatus.data.length > 0 ? (
                      <Accordion type="single" collapsible>
                        <AccordionItem value="deal-info">
                          <AccordionTrigger className="text-sm">
                            <div className="bg-green-500/20 text-green-500 px-2 py-1 rounded-full text-xs">
                              Active Deal
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 text-xs">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-muted-foreground">Deal ID:</p>
                                  <p className="font-mono">{dealStatus.data[0].dealId}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Status:</p>
                                  <p>{dealStatus.data[0].dealStatus}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Storage Provider:</p>
                                  <p className="font-mono">{dealStatus.data[0].storageProvider}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Piece Size:</p>
                                  <p>{(dealStatus.data[0].pieceSize / (1024 * 1024 * 1024)).toFixed(2)} GB</p>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        <p>No active Filecoin deals found for this CID.</p>
                        <p className="text-xs mt-1">
                          Filecoin deals can take up to 48 hours to be confirmed after file upload.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Lineage Tab */}
          <TabsContent value="lineage">
            <DatasetLineage datasets={[dataset]} selectedDatasetId={dataset.id} />
          </TabsContent>
          
          {/* Usage Tab */}
          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>Model Usage</CardTitle>
                <CardDescription>
                  Models that have used this dataset in their training pipeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RelationshipTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DatasetDetails;
