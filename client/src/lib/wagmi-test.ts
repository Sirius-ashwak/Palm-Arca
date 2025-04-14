// This file is for testing wagmi imports
import * as wagmi from 'wagmi';

// Log all exports from wagmi to see what's available
console.log('Wagmi exports:', Object.keys(wagmi));

// Check if createClient is available
console.log('createClient available:', 'createClient' in wagmi);

// Export everything for use in other files
export * from 'wagmi';