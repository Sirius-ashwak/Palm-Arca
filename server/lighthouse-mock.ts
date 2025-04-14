import fs from 'fs';
import path from 'path';

// Mock implementation of the Lighthouse SDK
export const mockLighthouse = {
  upload: async (filePath: string, apiKey: string, dealParams?: any, name?: string) => {
    console.log(`Mock upload: ${filePath} with name ${name || 'unnamed'}`);
    return {
      data: {
        Name: name || path.basename(filePath),
        Hash: `mock-cid-${Date.now()}`,
        Size: fs.existsSync(filePath) ? fs.statSync(filePath).size : 0
      }
    };
  },
  
  getUploads: async (apiKey: string) => {
    console.log('Mock getUploads called');
    return {
      data: {
        totalFiles: 2,
        fileList: [
          {
            cid: `mock-cid-1`,
            fileName: 'Mock File 1',
            fileSizeInBytes: 1024,
            createdAt: new Date().toISOString(),
            lastViewedAt: new Date().toISOString(),
            mimeType: 'application/octet-stream',
            status: 'verified'
          },
          {
            cid: `mock-cid-2`,
            fileName: 'Mock File 2',
            fileSizeInBytes: 2048,
            createdAt: new Date().toISOString(),
            lastViewedAt: new Date().toISOString(),
            mimeType: 'application/octet-stream',
            status: 'verified'
          }
        ]
      }
    };
  },
  
  dealStatus: async (cid: string, apiKey: string) => {
    console.log(`Mock dealStatus called for CID: ${cid}`);
    return {
      dealStatus: [
        {
          dealId: `mock-deal-${Date.now()}`,
          storageProvider: "t01000",
          status: "Active",
          pieceCid: cid,
          dataCid: cid,
          dataModelSelector: "Links/0/Links/0/Links",
          activation: new Date().toISOString(),
          expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        }
      ]
    };
  }
};