import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Database, 
  Brain, 
  GitBranch, 
  VerifiedIcon, 
  FileText, 
  Clock, 
  Settings, 
  User,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ mobile, onClose }: SidebarProps) => {
  const [location] = useLocation();

  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Database, label: "My Datasets", href: "/datasets" },
    { icon: Brain, label: "My Models", href: "/models" },
    { icon: GitBranch, label: "Lineage Tracking", href: "/lineage" },
  ];

  const managementItems = [
    { icon: VerifiedIcon, label: "Verification", href: "/verification" },
    { icon: FileText, label: "Licensing", href: "/licensing" },
    { icon: Clock, label: "History", href: "/history" },
  ];

  const accountItems = [
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const NavItem = ({ icon: Icon, label, href }: {icon: any, label: string, href: string}) => {
    const isActive = location === href;
    
    return (
      <li>
        <Link href={href}>
          <div 
            onClick={mobile ? onClose : undefined}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors cursor-pointer",
              isActive 
                ? "bg-primary text-white" 
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </div>
        </Link>
      </li>
    );
  };

  return (
    <aside className="flex flex-col w-64 h-full border-r border-border bg-card">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <GitBranch className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">Cactus</h1>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </ul>
        
        <div className="mt-6">
          <h2 className="px-3 text-xs font-semibold text-muted-foreground uppercase mb-2">
            Management
          </h2>
          <ul className="space-y-1">
            {managementItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </ul>
        </div>
        
        <div className="mt-6">
          <h2 className="px-3 text-xs font-semibold text-muted-foreground uppercase mb-2">
            Account
          </h2>
          <ul className="space-y-1">
            {accountItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </ul>
        </div>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Alex Johnson</div>
            <div className="text-xs text-muted-foreground">Connected to Filecoin</div>
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
