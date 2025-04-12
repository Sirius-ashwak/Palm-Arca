import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDatasetSchema, insertModelSchema, insertRelationshipSchema, datasetMetadataSchema } from "@shared/schema";
import { z } from "zod";
import { mockLighthouse } from "./lighthouse-mock";
import authRoutes from "./auth";

// Import lighthouse with a fallback mock implementation
let lighthouse: any;
try {
  // Try to load the real Lighthouse SDK
  lighthouse = require('@lighthouse-web3/sdk');
  console.log('Lighthouse SDK loaded successfully');
} catch (error) {
  console.warn('Lighthouse SDK not available, using mock implementation');
  lighthouse = mockLighthouse;
}

// Always use mock implementation if no API key is available
if (!process.env.LIGHTHOUSE_API_KEY) {
  console.warn('No Lighthouse API key found, using mock implementation');
  lighthouse = mockLighthouse;
}
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Define interface for multer file
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = express.Router();
  
  // Mount auth routes
  apiRouter.use('/auth', authRoutes);
  
  // Datasets endpoints
  apiRouter.get("/datasets", async (req, res) => {
    try {
      const datasets = await storage.getDatasets();
      res.json(datasets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch datasets" });
    }
  });

  apiRouter.get("/datasets/:id", async (req, res) => {
    try {
      const dataset = await storage.getDataset(Number(req.params.id));
      if (!dataset) {
        return res.status(404).json({ message: "Dataset not found" });
      }
      res.json(dataset);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dataset" });
    }
  });

  apiRouter.post("/datasets", async (req, res) => {
    try {
      const validation = insertDatasetSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid dataset data", errors: validation.error.format() });
      }
      
      const dataset = await storage.createDataset(validation.data);
      res.status(201).json(dataset);
    } catch (error) {
      res.status(500).json({ message: "Failed to create dataset" });
    }
  });

  apiRouter.patch("/datasets/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const dataset = await storage.updateDatasetStatus(Number(req.params.id), status);
      if (!dataset) {
        return res.status(404).json({ message: "Dataset not found" });
      }
      
      res.json(dataset);
    } catch (error) {
      res.status(500).json({ message: "Failed to update dataset status" });
    }
  });

  // Models endpoints
  apiRouter.get("/models", async (req, res) => {
    try {
      const models = await storage.getModels();
      res.json(models);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch models" });
    }
  });

  apiRouter.get("/models/:id", async (req, res) => {
    try {
      const model = await storage.getModel(Number(req.params.id));
      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }
      res.json(model);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch model" });
    }
  });

  apiRouter.post("/models", async (req, res) => {
    try {
      const validation = insertModelSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid model data", errors: validation.error.format() });
      }
      
      const model = await storage.createModel(validation.data);
      res.status(201).json(model);
    } catch (error) {
      res.status(500).json({ message: "Failed to create model" });
    }
  });

  // Relationships endpoints
  apiRouter.get("/relationships", async (req, res) => {
    try {
      const relationships = await storage.getRelationships();
      res.json(relationships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch relationships" });
    }
  });

  apiRouter.get("/relationships/dataset/:datasetId", async (req, res) => {
    try {
      const relationships = await storage.getRelationshipsByDataset(Number(req.params.datasetId));
      res.json(relationships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch relationships by dataset" });
    }
  });

  apiRouter.get("/relationships/model/:modelId", async (req, res) => {
    try {
      const relationships = await storage.getRelationshipsByModel(Number(req.params.modelId));
      res.json(relationships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch relationships by model" });
    }
  });

  apiRouter.post("/relationships", async (req, res) => {
    try {
      const validation = insertRelationshipSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid relationship data", errors: validation.error.format() });
      }
      
      // Verify that the dataset and model exist
      const dataset = await storage.getDataset(validation.data.datasetId);
      if (!dataset) {
        return res.status(400).json({ message: "Dataset not found" });
      }
      
      const model = await storage.getModel(validation.data.modelId);
      if (!model) {
        return res.status(400).json({ message: "Model not found" });
      }
      
      const relationship = await storage.createRelationship(validation.data);
      res.status(201).json(relationship);
    } catch (error) {
      res.status(500).json({ message: "Failed to create relationship" });
    }
  });

  apiRouter.patch("/relationships/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const relationship = await storage.updateRelationshipStatus(Number(req.params.id), status);
      if (!relationship) {
        return res.status(404).json({ message: "Relationship not found" });
      }
      
      res.json(relationship);
    } catch (error) {
      res.status(500).json({ message: "Failed to update relationship status" });
    }
  });

  // Validate dataset metadata
  apiRouter.post("/validate/metadata", (req, res) => {
    try {
      const validation = datasetMetadataSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid metadata", 
          errors: validation.error.format() 
        });
      }
      res.json({ valid: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to validate metadata" });
    }
  });
  
  // Debug endpoint to create a test dataset
  apiRouter.post("/debug/create-test-dataset", async (req, res) => {
    try {
      console.log("Creating test dataset...");
      
      const testDataset = {
        name: "Test Dataset " + new Date().toISOString(),
        cid: "mock-cid-test-" + Date.now(),
        size: "1.5 MB",
        domain: "Computer Vision",
        format: "CSV",
        license: "MIT",
        accessControl: "public",
        description: "This is a test dataset created for debugging purposes",
        tags: ["test", "debug"],
        filesTotalCount: 1,
        status: "verified",
        userId: 1
      };
      
      const dataset = await storage.createDataset(testDataset);
      console.log("Test dataset created:", dataset);
      
      res.status(201).json(dataset);
    } catch (error) {
      console.error("Failed to create test dataset:", error);
      res.status(500).json({ 
        message: "Failed to create test dataset", 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Configure multer for file uploads
  const upload = multer({ 
    dest: path.join(os.tmpdir(), 'uploads'),
    limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit
  });

  // Lighthouse IPFS endpoints
  // Upload files to IPFS via Lighthouse
  apiRouter.post("/ipfs/upload", upload.array('files'), async (req, res) => {
    try {
      console.log("Upload request received");
      
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        console.error("No files in request");
        return res.status(400).json({ message: "No files uploaded" });
      }
      
      console.log(`Received ${Array.isArray(req.files) ? req.files.length : 1} files`);

      // Use API key or mock key
      const apiKey = process.env.LIGHTHOUSE_API_KEY || 'mock-api-key';
      console.log(`Using ${process.env.LIGHTHOUSE_API_KEY ? 'real' : 'mock'} Lighthouse implementation`);

      // Create metadata file if metadata is provided
      let allFiles: MulterFile[] = Array.isArray(req.files) ? req.files as MulterFile[] : [];
      
      if (req.body.metadata) {
        let metadata;
        try {
          console.log("Processing metadata");
          metadata = JSON.parse(req.body.metadata);
          // Create a metadata file
          const metadataPath = path.join(os.tmpdir(), 'metadata.json');
          fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
          console.log(`Metadata file created at ${metadataPath}`);
          
          // Add metadata file (with required multer fields)
          const metadataFile: MulterFile = {
            path: metadataPath,
            originalname: 'metadata.json',
            mimetype: 'application/json',
            fieldname: 'files',
            encoding: '7bit',
            size: fs.statSync(metadataPath).size,
            destination: os.tmpdir(),
            filename: 'metadata.json'
          };
          
          // Add buffer if needed
          if (Buffer.from) {
            (metadataFile as any).buffer = Buffer.from(JSON.stringify(metadata, null, 2));
          }
          
          allFiles.push(metadataFile);
        } catch (err) {
          console.error("Invalid metadata JSON", err);
          return res.status(400).json({ message: "Invalid metadata JSON", error: err instanceof Error ? err.message : String(err) });
        }
      }

      // Lighthouse expects individual file paths, not an array
      // Upload to Lighthouse - handle files one by one
      let cid = '';
      let fileSize = 0;
      
      console.log(`Processing ${allFiles.length} files for upload`);
      
      for (const file of allFiles) {
        try {
          console.log(`Processing file: ${file.originalname || 'unknown'}`);
          
          // Calculate size
          fileSize += file.size;
          
          // Check if file path exists
          if (!file.path || !fs.existsSync(file.path)) {
            console.error(`File path does not exist or is invalid: ${file.path}`);
            continue;
          }
          
          console.log(`Uploading file: ${file.path}`);
          
          // Upload each file individually
          const response = await lighthouse.upload(
            file.path, 
            apiKey,
            undefined, // Use default deal parameters
            req.body.name // Optional name
          );
          
          console.log(`Upload response:`, response);
          
          // Use the first file's CID as the overall CID
          if (!cid && response.data && response.data.Hash) {
            cid = response.data.Hash;
            console.log(`Got CID: ${cid}`);
          }
        } catch (fileError) {
          console.error(`Error uploading file ${file.originalname || 'unknown'}:`, fileError);
        }
      }
      
      // Clean up temporary files
      console.log("Cleaning up temporary files");
      allFiles.forEach((file: MulterFile) => {
        try {
          if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log(`Deleted temp file: ${file.path}`);
          }
        } catch (err) {
          console.error('Error deleting temp file:', err);
        }
      });

      if (!cid) {
        console.error("Failed to get CID from Lighthouse");
        return res.status(500).json({ message: "Failed to get CID from Lighthouse" });
      }
      
      // Create a dataset record in Firestore
      try {
        console.log("Creating dataset record in Firestore");
        if (req.body.metadata) {
          const metadata = JSON.parse(req.body.metadata);
          await storage.createDataset({
            name: metadata.name || req.body.name || "Unnamed Dataset",
            cid: cid,
            size: formatFileSize(fileSize),
            domain: metadata.domain || "General",
            format: metadata.format || "Unknown",
            license: metadata.license || "Unknown",
            accessControl: metadata.accessControl || "public",
            description: metadata.description || "",
            tags: metadata.tags || [],
            filesTotalCount: allFiles.length,
            status: "verified",
            userId: 1 // Default user ID
          });
          console.log("Dataset record created successfully");
        }
      } catch (dbError) {
        console.error("Error creating dataset record:", dbError);
        // Continue anyway, as we still want to return the CID
      }
      
      // Return CID and size
      console.log(`Returning CID: ${cid} with size: ${formatFileSize(fileSize)}`);
      res.json({ 
        cid: cid,
        size: formatFileSize(fileSize)
      });

    } catch (error) {
      console.error('Failed to upload to Lighthouse', error);
      res.status(500).json({ 
        message: "Failed to upload to IPFS/Filecoin", 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Get uploads from Lighthouse
  apiRouter.get("/ipfs/uploads", async (req, res) => {
    try {
      console.log("Getting uploads from Lighthouse");
      
      const apiKey = process.env.LIGHTHOUSE_API_KEY;
      if (!apiKey) {
        console.error("Missing Lighthouse API key");
        return res.status(500).json({ message: "Lighthouse API key not configured" });
      }
      
      // Check if lighthouse has getUploads method
      if (typeof lighthouse.getUploads !== 'function') {
        console.log("Using mock getUploads implementation");
        // Mock implementation
        const datasets = await storage.getDatasets();
        const mockUploads = {
          data: {
            totalFiles: datasets.length,
            fileList: datasets.map(dataset => ({
              cid: dataset.cid,
              fileName: dataset.name,
              fileSizeInBytes: parseInt(dataset.size) || 1024,
              createdAt: dataset.uploadedAt?.toISOString() || new Date().toISOString(),
              lastViewedAt: new Date().toISOString(),
              mimeType: "application/octet-stream",
              status: dataset.status
            }))
          }
        };
        return res.json(mockUploads.data);
      }
      
      const response = await lighthouse.getUploads(apiKey);
      console.log("Got uploads from Lighthouse");
      res.json(response.data);
    } catch (error) {
      console.error('Failed to get uploads from Lighthouse', error);
      res.status(500).json({ 
        message: "Failed to retrieve uploads from IPFS/Filecoin",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Check if a CID exists in Lighthouse
  apiRouter.get("/ipfs/check/:cid", async (req, res) => {
    try {
      const { cid } = req.params;
      console.log(`Checking if CID exists: ${cid}`);
      
      const apiKey = process.env.LIGHTHOUSE_API_KEY;
      if (!apiKey) {
        console.error("Missing Lighthouse API key");
        return res.status(500).json({ message: "Lighthouse API key not configured" });
      }
      
      // Check if lighthouse has getUploads method
      if (typeof lighthouse.getUploads !== 'function') {
        console.log("Using mock CID check implementation");
        // Mock implementation - check if CID exists in our database
        const datasets = await storage.getDatasets();
        const exists = datasets.some(dataset => dataset.cid === cid);
        return res.json({ exists });
      }
      
      const response = await lighthouse.getUploads(apiKey);
      const exists = response.data.fileList.some((file: any) => file.cid === cid);
      
      console.log(`CID ${cid} exists: ${exists}`);
      res.json({ exists });
    } catch (error) {
      console.error('Failed to check CID in Lighthouse', error);
      res.status(500).json({ 
        message: "Failed to check if CID exists in IPFS/Filecoin",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Get Filecoin deal status for a CID
  apiRouter.get("/ipfs/deal-status/:cid", async (req, res) => {
    try {
      const { cid } = req.params;
      console.log(`Getting deal status for CID: ${cid}`);
      
      const apiKey = process.env.LIGHTHOUSE_API_KEY;
      if (!apiKey) {
        console.error("Missing Lighthouse API key");
        return res.status(500).json({ message: "Lighthouse API key not configured" });
      }
      
      // Check if lighthouse has dealStatus method
      if (typeof lighthouse.dealStatus !== 'function') {
        console.log("Using mock deal status implementation");
        // Mock implementation
        return res.json({
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
        });
      }
      
      const status = await lighthouse.dealStatus(cid, apiKey);
      console.log("Got deal status from Lighthouse");
      res.json(status);
    } catch (error) {
      console.error('Failed to get deal status from Lighthouse', error);
      res.status(500).json({ 
        message: "Failed to get Filecoin deal status",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Format file size helper
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Mount all routes under /api
  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
