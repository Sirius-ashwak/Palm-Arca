import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Upload, Search, Filter, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatasetCard from "@/components/DatasetCard";
import UploadForm from "@/components/UploadForm";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Datasets = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const { toast } = useToast();

  const { data: datasets, isLoading } = useQuery({
    queryKey: ["/api/datasets"],
  });

  const filteredAndSortedDatasets = () => {
    if (!datasets) return [];
    
    let filtered = datasets;
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(dataset => 
        dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dataset.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dataset.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply domain filter
    if (domainFilter !== "all") {
      filtered = filtered.filter(dataset => dataset.domain === domainFilter);
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime();
      } else if (sortOrder === "oldest") {
        return new Date(a.uploadedAt || 0).getTime() - new Date(b.uploadedAt || 0).getTime();
      } else if (sortOrder === "name-asc") {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is reactive, so just preventing the form submission
  };

  // Get unique domains for filter
  const uniqueDomains = datasets 
    ? [...new Set(datasets.map(d => d.domain))]
    : [];

  return (
    <div>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">My Datasets</h1>
            <p className="text-sm text-muted-foreground">
              Manage and explore your AI training datasets
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload Dataset</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] p-0">
                <DialogTitle className="sr-only">Upload Dataset</DialogTitle>
                <UploadForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search datasets by name, description, or tag"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          
          <div className="flex gap-2">
            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Domain</SelectLabel>
                  <SelectItem value="all">All Domains</SelectItem>
                  {uniqueDomains.map(domain => (
                    <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-40">
                <SortDesc className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort by</SelectLabel>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Datasets Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-card border border-border rounded-lg p-4 h-64"></div>
            ))}
          </div>
        ) : (
          <>
            {filteredAndSortedDatasets().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedDatasets().map((dataset) => (
                  <DatasetCard key={dataset.id} dataset={dataset} />
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No datasets found</h3>
                {searchTerm || domainFilter !== "all" ? (
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                ) : (
                  <p className="text-muted-foreground mb-4">
                    Upload your first dataset to get started
                  </p>
                )}
                <Button onClick={() => setUploadDialogOpen(true)}>
                  Upload Dataset
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Datasets;
