import { Button } from "@/components/ui/button";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { useToast } from "@/hooks/use-toast";
// Import all of wagmi as a namespace to avoid the specific import issues
import * as wagmi from "wagmi";
import { Loader2 } from "lucide-react";

// Use the useAccount hook from the namespace
const useAccount = wagmi.useAccount;

export function AuthButton() {
  const { isConnected } = useAccount();
  const { isAuthenticated, isAuthenticating, authenticate, logout, error } = useWalletAuth();
  const { toast } = useToast();

  const handleAuth = async () => {
    if (isAuthenticated) {
      logout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } else {
      try {
        const success = await authenticate();
        if (success) {
          toast({
            title: "Authentication successful",
            description: "You are now authenticated with your wallet",
          });
        } else {
          toast({
            title: "Authentication failed",
            description: error || "Failed to authenticate with wallet",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Authentication error",
          description: err instanceof Error ? err.message : "An unknown error occurred",
          variant: "destructive",
        });
      }
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <Button 
      onClick={handleAuth} 
      disabled={isAuthenticating}
      size="sm"
      className={`ml-2 ${
        isAuthenticated 
          ? "bg-green-600/80 hover:bg-green-700 text-white" 
          : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
      } border-none shadow-md transition-all duration-200`}
    >
      {isAuthenticating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span className="text-sm">Authenticating...</span>
        </>
      ) : isAuthenticated ? (
        <span className="text-sm font-medium">Verified ✓</span>
      ) : (
        <span className="text-sm font-medium">Authenticate</span>
      )}
    </Button>
  );
}