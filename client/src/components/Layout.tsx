import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { WalletConnect } from "./WalletConnect";
import { AuthButton } from "./AuthButton";
import HulyBackground from "./HulyBackground";
import { useHulyBackground } from "@/hooks/use-huly-background";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Use our custom hook to control the background effects
  const hulyControls = useHulyBackground({
    showGlassmorphism: false,
    intensity: 'high',
    enableParallax: true,
    starDensity: 'medium',
    showAurora: true,
  });

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Huly-inspired background */}
      <HulyBackground 
        showGlassmorphism={hulyControls.options.showGlassmorphism}
        intensity={hulyControls.options.intensity}
        enableParallax={hulyControls.options.enableParallax}
        starDensity={hulyControls.options.starDensity}
        showAurora={hulyControls.options.showAurora}
      />
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex z-10">
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
          className="bg-primary text-white rounded-full shadow-lg h-12 w-12 glow-effect"
        >
          <Menu />
        </Button>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-transparent z-10">
        <div className="flex justify-end items-center p-4 gap-3">
          <div className="flex-1 md:flex-none">
            <div className="text-xl font-bold text-white text-glow hidden md:block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Palm Arca
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <WalletConnect />
            <AuthButton />
          </div>
        </div>
        <div className="relative z-10 px-4 md:px-8 py-6">
          {children}
        </div>
      </main>
      
      {/* Optional: Background controls - uncomment to enable
      <div className="fixed bottom-4 left-4 z-50 flex gap-2">
        <Button 
          onClick={hulyControls.toggleGlassmorphism} 
          size="sm"
          variant="outline"
          className="bg-black/30 backdrop-blur-sm text-white border-white/20"
        >
          {hulyControls.options.showGlassmorphism ? 'Hide' : 'Show'} Glass Panel
        </Button>
        <Button 
          onClick={hulyControls.toggleParallax} 
          size="sm"
          variant="outline"
          className="bg-black/30 backdrop-blur-sm text-white border-white/20"
        >
          {hulyControls.options.enableParallax ? 'Disable' : 'Enable'} Parallax
        </Button>
        <Button 
          onClick={hulyControls.toggleAurora} 
          size="sm"
          variant="outline"
          className="bg-black/30 backdrop-blur-sm text-white border-white/20"
        >
          {hulyControls.options.showAurora ? 'Hide' : 'Show'} Aurora
        </Button>
      </div>
      */}
    </div>
  );
};

export default Layout;
