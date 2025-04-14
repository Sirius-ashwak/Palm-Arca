import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Info, Shield, Check } from "lucide-react";

const Licensing = () => {
  const licenses = [
    {
      name: "MIT License",
      description: "A permissive license that allows for reuse with few restrictions",
      type: "Open Source",
      popular: true,
    },
    {
      name: "Apache 2.0",
      description: "Allows freedom to use, modify, and distribute, with patent protection",
      type: "Open Source",
      popular: true,
    },
    {
      name: "GPL v3",
      description: "Requires derivative works to be open source with the same license",
      type: "Copyleft",
      popular: true,
    },
    {
      name: "Creative Commons (CC BY)",
      description: "Allows distribution and modification with attribution",
      type: "Content",
      popular: true,
    },
    {
      name: "CC BY-SA",
      description: "Allows sharing and adapting with attribution and same license",
      type: "Content",
      popular: false,
    },
    {
      name: "CC BY-NC",
      description: "Allows non-commercial use with attribution",
      type: "Content",
      popular: false,
    },
    {
      name: "Custom License",
      description: "Create a custom license for your specific needs",
      type: "Custom",
      popular: false,
    },
  ];

  const myLicenses = [
    {
      id: 1,
      name: "Image Classification Dataset",
      license: "MIT License",
      dateApplied: "2023-10-15",
      status: "Active",
    },
    {
      id: 2,
      name: "NLP Training Corpus",
      license: "CC BY-SA",
      dateApplied: "2023-09-22",
      status: "Active",
    },
    {
      id: 3,
      name: "Sentiment Analysis Model",
      license: "Apache 2.0",
      dateApplied: "2023-11-05",
      status: "Active",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Licensing</h1>
          <p className="text-muted-foreground">Manage licenses for your datasets and models</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Create Custom License
        </Button>
      </div>

      <Tabs defaultValue="my-licenses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-licenses">My Licenses</TabsTrigger>
          <TabsTrigger value="available-licenses">Available Licenses</TabsTrigger>
          <TabsTrigger value="license-verification">License Verification</TabsTrigger>
        </TabsList>
        
        {/* My Licenses */}
        <TabsContent value="my-licenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Applied Licenses</CardTitle>
              <CardDescription>Licenses you have applied to your datasets and models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">License</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date Applied</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myLicenses.map((item) => (
                      <tr key={item.id} className="border-b border-border">
                        <td className="py-3 px-4">{item.name}</td>
                        <td className="py-3 px-4">{item.license}</td>
                        <td className="py-3 px-4">{item.dateApplied}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            {item.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Available Licenses */}
        <TabsContent value="available-licenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Licenses</CardTitle>
              <CardDescription>Choose from common licenses for your datasets and models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {licenses.map((license) => (
                  <div key={license.name} className="border border-border rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{license.name}</h3>
                      {license.popular && (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{license.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{license.type}</Badge>
                      <Button variant="outline" size="sm">Apply</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* License Verification */}
        <TabsContent value="license-verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>License Verification</CardTitle>
              <CardDescription>Verify the licenses of datasets and models you use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-4 bg-muted/30 rounded-lg border border-border">
                <Info className="h-5 w-5 text-primary mr-3" />
                <p className="text-sm">
                  License verification helps ensure that you are using datasets and models in compliance with their licenses.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Shield className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">Verify Dataset License</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check if a dataset's license is compatible with your intended use.
                  </p>
                  <Button className="w-full">Verify Dataset</Button>
                </div>
                
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">Verify Model License</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check if a model's license is compatible with your intended use.
                  </p>
                  <Button className="w-full">Verify Model</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Licensing;