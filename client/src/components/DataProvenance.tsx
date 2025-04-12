import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, FileText, Shield } from "lucide-react";
// Import all of wagmi as a namespace to avoid the specific import issues
import * as wagmi from "wagmi";

// Use the useAccount hook from the namespace
const useAccount = wagmi.useAccount;

interface DataProvenanceProps {
  datasetId: string;
  cid: string;
  owner: string;
  timestamp: string;
  verified: boolean;
}

export function DataProvenance({ datasetId, cid, owner, timestamp, verified }: DataProvenanceProps) {
  const { address } = useAccount();
  const isOwner = address?.toLowerCase() === owner.toLowerCase();
  
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  const shortenCid = (cid: string) => {
    return `${cid.slice(0, 10)}...${cid.slice(-6)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Data Provenance
        </CardTitle>
        <CardDescription>
          Immutable record of dataset ownership and storage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Dataset ID</p>
            <p className="font-mono">{datasetId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
            <p>{new Date(timestamp).toLocaleString()}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Content ID (CID)</p>
          <div className="flex items-center gap-2 mt-1">
            <code className="bg-muted p-1 rounded font-mono text-sm">{shortenCid(cid)}</code>
            <Button variant="ghost" size="icon" asChild>
              <a href={`https://gateway.lighthouse.storage/ipfs/${cid}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Owner</p>
          <div className="flex items-center gap-2 mt-1">
            <code className="bg-muted p-1 rounded font-mono text-sm">{shortenAddress(owner)}</code>
            {isOwner && (
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                You
              </Badge>
            )}
          </div>
        </div>
        
        <div className="pt-2">
          <div className="flex items-center gap-2">
            {verified ? (
              <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/20 border-green-500/20">
                <Check className="mr-1 h-3 w-3" /> Verified
              </Badge>
            ) : (
              <Badge variant="outline">Pending Verification</Badge>
            )}
            
            <Button variant="outline" size="sm" className="ml-auto gap-1">
              <FileText className="h-4 w-4" />
              View Certificate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}