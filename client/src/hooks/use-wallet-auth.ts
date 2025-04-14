import { useState, useEffect } from 'react';
// Import all of wagmi as a namespace to avoid the specific import issues
import * as wagmi from 'wagmi';
import { ethers } from 'ethers';

// Use the hooks from the namespace
const useAccount = wagmi.useAccount;
const useSignMessage = wagmi.useSignMessage;

interface UseWalletAuthReturn {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  authenticate: () => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

export function useWalletAuth(): UseWalletAuthReturn {
  const { address, isConnected } = useAccount();
  const { signMessage } = useSignMessage();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (err) {
        console.error('Failed to check authentication status:', err);
        setIsAuthenticated(false);
      }
    };

    if (isConnected && address) {
      checkAuth();
    } else {
      setIsAuthenticated(false);
    }
  }, [isConnected, address]);

  const authenticate = async (): Promise<boolean> => {
    if (!isConnected || !address) {
      setError('Wallet not connected');
      return false;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      // 1. Get nonce from server
      const nonceResponse = await fetch(`/api/auth/nonce?address=${address}`);
      const { nonce } = await nonceResponse.json();

      // 2. Sign the message with wallet
      const message = `Sign this message to authenticate with Cactus: ${nonce}`;
      const signature = await signMessage({ message });

      // 3. Verify signature on server
      const verifyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          signature,
          message,
        }),
      });

      const result = await verifyResponse.json();

      if (result.authenticated) {
        setIsAuthenticated(true);
        return true;
      } else {
        setError(result.error || 'Authentication failed');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return {
    isAuthenticated,
    isAuthenticating,
    authenticate,
    logout,
    error,
  };
}