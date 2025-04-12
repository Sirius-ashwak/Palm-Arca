import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar mobile onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Mobile menu button */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setSidebarOpen(true)} 
          size="icon"
          className="bg-primary text-white rounded-full shadow-lg h-12 w-12"
        >
          <Menu />
        </Button>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
};

export default Layout;
