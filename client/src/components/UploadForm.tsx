import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { datasetMetadataSchema, type DatasetMetadata } from "@shared/schema";
import { uploadDataset } from "@/lib/web3storage";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { X, Check, Upload, Plus, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const UploadForm = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<DatasetMetadata>({
    resolver: zodResolver(datasetMetadataSchema),
    defaultValues: {
      name: "",
      domain: "",
      format: "",
      license: "",
      accessControl: "public",
      description: "",
      tags: [],
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: DatasetMetadata) => {
      if (files.length === 0) {
        throw new Error("Please select files to upload");
      }

      // Upload files to Lighthouse via our server API
      const { cid, size } = await uploadDataset(files, { ...data, tags });

      // Create dataset in the backend
      const response = await apiRequest("POST", "/api/datasets", {
        name: data.name,
        cid,
        size,
        domain: data.domain,
        format: data.format,
        license: data.license,
        accessControl: data.accessControl,
        description: data.description,
        tags: tags,
        filesTotalCount: files.length,
        status: "processing", // Initial status
        userId: 1, // Hardcoded for demo
      });

      return response.json();
    },
    onSuccess: () => {
      // Reset form and state
      form.reset();
      setFiles([]);
      setTags([]);
      setNewTag("");
      
      // Invalidate queries to refetch datasets
      queryClient.invalidateQueries({ queryKey: ["/api/datasets"] });
      
      toast({
        title: "Dataset uploaded successfully",
        description: "Your dataset is now being processed on Filecoin/IPFS via Lighthouse",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to upload dataset",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags((prevTags) => [...prevTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const onSubmit = (data: DatasetMetadata) => {
    uploadMutation.mutate(data);
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <h2 className="text-lg font-bold mb-4">Upload New Dataset</h2>
        
        {/* Upload area */}
        <div
          className={cn(
            "border-2 border-dashed border-border rounded-lg p-8 mb-6 text-center",
            isDragging && "border-primary bg-primary/5"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-foreground mb-2">Drag & drop your dataset files here</p>
            <p className="text-sm text-muted-foreground mb-4">or</p>
            <Button onClick={handleBrowseClick}>
              Browse Files
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileInputChange}
            />
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: CSV, JSON, Parquet, Images (.jpg, .png), up to 50GB
            </p>
          </div>
        </div>
        
        {/* Selected files */}
        {files.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Selected Files ({files.length})</h3>
            <div className="max-h-40 overflow-y-auto border border-border rounded-md p-2">
              {files.map((file, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(file)}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Metadata form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dataset Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Image Classification Dataset v1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Computer Vision">Computer Vision</SelectItem>
                        <SelectItem value="Natural Language Processing">Natural Language Processing</SelectItem>
                        <SelectItem value="Audio Processing">Audio Processing</SelectItem>
                        <SelectItem value="Tabular Data">Tabular Data</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Format</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CSV">CSV</SelectItem>
                        <SelectItem value="JSON">JSON</SelectItem>
                        <SelectItem value="Parquet">Parquet</SelectItem>
                        <SelectItem value="Images">Images</SelectItem>
                        <SelectItem value="Text">Text</SelectItem>
                        <SelectItem value="Mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="license"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select license" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MIT">MIT</SelectItem>
                        <SelectItem value="Apache 2.0">Apache 2.0</SelectItem>
                        <SelectItem value="GPL">GPL</SelectItem>
                        <SelectItem value="CC BY 4.0">CC BY 4.0</SelectItem>
                        <SelectItem value="CC BY-SA 4.0">CC BY-SA 4.0</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="accessControl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Control</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select access control" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="custom">Custom Permissions</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="md:col-span-2">
                <FormLabel>Tags</FormLabel>
                <div className="p-2 bg-muted/50 border border-border rounded-md flex flex-wrap gap-2 mb-1">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-primary"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  <div className="flex-1 flex items-center min-w-[100px]">
                    <Input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add tag..."
                      className="border-0 bg-transparent p-0 h-auto text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAddTag}
                      disabled={!newTag.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the contents, source, and intended use of this dataset..."
                        className="resize-none h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setFiles([]);
                  setTags([]);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploadMutation.isPending || files.length === 0}
                className="gap-2"
              >
                {uploadMutation.isPending ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload via Lighthouse</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UploadForm;
