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
  LogOut,
  Sparkles
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
    { icon: Sparkles, label: "Huly Background", href: "/huly-demo", className: "text-glow text-blue-400" },
  ];

  const NavItem = ({ 
    icon: Icon, 
    label, 
    href, 
    className 
  }: {
    icon: any, 
    label: string, 
    href: string, 
    className?: string
  }) => {
    const isActive = location === href;
    
    return (
      <li>
        <Link href={href}>
          <div 
            onClick={mobile ? onClose : undefined}
            className={cn(
              "flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer",
              isActive 
                ? "bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white shadow-md" 
                : "hover:bg-white/5 text-white/70 hover:text-white",
              className
            )}
          >
            <div className={cn(
              "flex items-center justify-center",
              isActive ? "text-white" : "text-white/70"
            )}>
              <Icon className={cn("h-[18px] w-[18px]", className)} />
            </div>
            <span className="font-medium text-sm">{label}</span>
            
            {/* Active indicator dot */}
            {isActive && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80"></div>
            )}
          </div>
        </Link>
      </li>
    );
  };

  return (
    <aside className="flex flex-col w-64 h-full border-r border-border/30 bg-card/80 backdrop-blur-md">
      <div className="p-5 border-b border-border/30">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg glow-effect">
            <GitBranch className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Palm Arca
          </h1>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1.5">
          {navigationItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </ul>
        
        <div className="mt-8">
          <h2 className="px-3 text-xs font-semibold text-muted-foreground/80 uppercase mb-3 tracking-wider">
            Management
          </h2>
          <ul className="space-y-1.5">
            {managementItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </ul>
        </div>
        
        <div className="mt-8">
          <h2 className="px-3 text-xs font-semibold text-muted-foreground/80 uppercase mb-3 tracking-wider">
            Account
          </h2>
          <ul className="space-y-1.5">
            {accountItems.map((item: any) => (
              <NavItem 
                key={item.href} 
                icon={item.icon} 
                label={item.label} 
                href={item.href} 
                className={item.className} 
              />
            ))}
          </ul>
        </div>
      </nav>
      
      <div className="p-4 m-3 border border-border/30 rounded-xl bg-card/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
            <User className="h-5 w-5 text-white/80" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-white">Alex Johnson</div>
            <div className="text-xs text-blue-300/80">Connected to Filecoin</div>
          </div>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
