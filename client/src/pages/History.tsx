import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Download, Filter, Search, Upload, Database, Brain, GitBranch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const History = () => {
  const [timeRange, setTimeRange] = useState("all");
  
  const activities = [
    {
      id: 1,
      type: "upload",
      title: "Dataset Uploaded",
      description: "Image Classification Dataset was uploaded",
      timestamp: "2023-11-15T14:32:00Z",
      icon: <Upload className="h-4 w-4" />,
      category: "dataset"
    },
    {
      id: 2,
      type: "create",
      title: "Model Created",
      description: "Created new model: Sentiment Analysis v1.2",
      timestamp: "2023-11-14T10:15:00Z",
      icon: <Brain className="h-4 w-4" />,
      category: "model"
    },
    {
      id: 3,
      type: "verify",
      title: "Lineage Verified",
      description: "Verified lineage for NLP Training Corpus",
      timestamp: "2023-11-13T16:45:00Z",
      icon: <GitBranch className="h-4 w-4" />,
      category: "lineage"
    },
    {
      id: 4,
      type: "update",
      title: "Dataset Updated",
      description: "Updated metadata for Time Series Dataset",
      timestamp: "2023-11-12T09:20:00Z",
      icon: <Database className="h-4 w-4" />,
      category: "dataset"
    },
    {
      id: 5,
      type: "download",
      title: "Dataset Downloaded",
      description: "Downloaded Image Classification Dataset",
      timestamp: "2023-11-10T11:05:00Z",
      icon: <Download className="h-4 w-4" />,
      category: "dataset"
    },
  ];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getActivityColor = (type: string) => {
    switch (type) {
      case "upload":
        return "bg-blue-500/10 text-blue-500";
      case "create":
        return "bg-green-500/10 text-green-500";
      case "verify":
        return "bg-purple-500/10 text-purple-500";
      case "update":
        return "bg-amber-500/10 text-amber-500";
      case "download":
        return "bg-indigo-500/10 text-indigo-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Activity History</h1>
          <p className="text-muted-foreground">Track all activities related to your datasets and models</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-4">
          <TabsList>
            <TabsTrigger value="all">All Activities</TabsTrigger>
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="lineage">Lineage</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search activities..."
                className="pl-8 w-[200px]"
              />
            </div>
            <Select defaultValue="all" onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>All activities across your datasets and models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                        {activity.icon}
                      </div>
                      <div className="w-px h-full bg-border mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{activity.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDate(activity.timestamp)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <Badge variant="outline" className={getActivityColor(activity.type)}>
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </Badge>
                        <Badge variant="outline">
                          {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="datasets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dataset Activities</CardTitle>
              <CardDescription>Activities related to your datasets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activities
                  .filter(activity => activity.category === "dataset")
                  .map((activity) => (
                    <div key={activity.id} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                          {activity.icon}
                        </div>
                        <div className="w-px h-full bg-border mt-2"></div>
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{activity.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDate(activity.timestamp)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        <div className="mt-2 flex items-center space-x-2">
                          <Badge variant="outline" className={getActivityColor(activity.type)}>
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Activities</CardTitle>
              <CardDescription>Activities related to your models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activities
                  .filter(activity => activity.category === "model")
                  .map((activity) => (
                    <div key={activity.id} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                          {activity.icon}
                        </div>
                        <div className="w-px h-full bg-border mt-2"></div>
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{activity.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDate(activity.timestamp)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        <div className="mt-2 flex items-center space-x-2">
                          <Badge variant="outline" className={getActivityColor(activity.type)}>
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="lineage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lineage Activities</CardTitle>
              <CardDescription>Activities related to dataset lineage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activities
                  .filter(activity => activity.category === "lineage")
                  .map((activity) => (
                    <div key={activity.id} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                          {activity.icon}
                        </div>
                        <div className="w-px h-full bg-border mt-2"></div>
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{activity.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDate(activity.timestamp)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        <div className="mt-2 flex items-center space-x-2">
                          <Badge variant="outline" className={getActivityColor(activity.type)}>
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History;