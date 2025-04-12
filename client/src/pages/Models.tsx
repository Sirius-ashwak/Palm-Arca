import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, SortDesc, Brain, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ModelCard from "@/components/ModelCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Models = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("newest");

  const { data: models, isLoading } = useQuery({
    queryKey: ["/api/models"],
  });

  const filteredAndSortedModels = () => {
    if (!models) return [];
    
    let filtered = models;
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.architecture?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
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

  return (
    <div>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">My Models</h1>
            <p className="text-sm text-muted-foreground">
              Track models trained on your datasets
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Register Model</span>
            </Button>
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
                placeholder="Search models by name, architecture, or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          
          <div className="flex gap-2">
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
        
        {/* Models Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-card border border-border rounded-lg p-4 h-64"></div>
            ))}
          </div>
        ) : (
          <>
            {filteredAndSortedModels().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedModels().map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No models found</h3>
                {searchTerm ? (
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria
                  </p>
                ) : (
                  <p className="text-muted-foreground mb-4">
                    Register your first AI model to get started
                  </p>
                )}
                <Button>
                  Register Model
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Models;
