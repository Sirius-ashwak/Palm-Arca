import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Award, Info, Users } from "lucide-react";

interface Contributor {
  address: string;
  name?: string;
  avatar?: string;
  contribution: string;
  percentage: number;
}

interface DataAttributionProps {
  contributors: Contributor[];
  license: string;
  revenueSharing?: boolean;
}

export function DataAttribution({ contributors, license, revenueSharing = false }: DataAttributionProps) {
  const getInitials = (address: string, name?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return address.slice(2, 4).toUpperCase();
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Attribution & Licensing
        </CardTitle>
        <CardDescription>
          Dataset contributors and usage rights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium flex items-center gap-1">
              <Users className="h-4 w-4" />
              Contributors
            </h3>
            {revenueSharing && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                      Revenue Sharing Enabled
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Contributors receive automatic payments based on their contribution percentage when this dataset is used.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          <div className="space-y-3">
            {contributors.map((contributor, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contributor.avatar} alt={contributor.name || contributor.address} />
                    <AvatarFallback>{getInitials(contributor.address, contributor.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {contributor.name || shortenAddress(contributor.address)}
                    </p>
                    <p className="text-xs text-muted-foreground">{contributor.contribution}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {contributor.percentage}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-2">
          <h3 className="text-sm font-medium mb-2">License</h3>
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{license}</Badge>
            <Button variant="ghost" size="sm" className="gap-1">
              <Info className="h-4 w-4" />
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}