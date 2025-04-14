import { type DatasetMetadata } from '@shared/schema';
import { apiRequest } from './queryClient';

// Interface for Lighthouse file object
interface LighthouseFile {
  cid: string;
  fileName: string;
  fileSizeInBytes: number;
  createdAt: string;
  lastViewedAt: string;
  mimeType: string;
  status: string;
}

// Convert a File to a blob
const fileToBlob = async (file: File): Promise<Blob> => {
  return new Blob([await file.arrayBuffer()], { type: file.type });
};

// Create metadata JSON file
const createMetadataFile = (metadata: DatasetMetadata): File => {
  const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], {
    type: 'application/json',
  });
  return new File([metadataBlob], 'metadata.json');
};

// Upload dataset files to Lighthouse (Filecoin/IPFS) through our backend API
export const uploadDataset = async (
  files: File[],
  metadata: DatasetMetadata
): Promise<{ cid: string; size: string }> => {
  try {
    // Add metadata file
    const metadataFile = createMetadataFile(metadata);
    const allFiles = [...files, metadataFile];
    
    // Create form data for file upload
    const formData = new FormData();
    allFiles.forEach(file => {
      formData.append('files', file);
    });
    
    // Add metadata and name to form data
    formData.append('metadata', JSON.stringify(metadata));
    formData.append('name', metadata.name);
    
    // Upload files through our server API
    const response = await fetch('/api/ipfs/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload to Lighthouse');
    }
    
    const data = await response.json();
    return { cid: data.cid, size: data.size };
  } catch (error) {
    console.error('Failed to upload to Lighthouse', error);
    throw new Error('Failed to upload dataset to Filecoin/IPFS');
  }
};

// Retrieve a dataset from Lighthouse by CID through our backend API
export const retrieveDataset = async (cid: string): Promise<LighthouseFile[]> => {
  try {
    // First check all uploads
    const uploadsResponse = await apiRequest('GET', '/api/ipfs/uploads');
    
    if (!uploadsResponse.ok) {
      throw new Error('Failed to retrieve uploads');
    }
    
    const uploads = await uploadsResponse.json();
    
    // Find files with matching CID
    const matchingFiles = uploads.fileList.filter(
      (file: LighthouseFile) => file.cid === cid
    );
    
    if (!matchingFiles || matchingFiles.length === 0) {
      throw new Error('No files found with the specified CID');
    }
    
    return matchingFiles;
  } catch (error) {
    console.error('Failed to retrieve from Lighthouse', error);
    throw new Error('Failed to retrieve dataset from Filecoin/IPFS');
  }
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper to check if cid exists on Lighthouse through our backend API
export const checkCidExists = async (cid: string): Promise<boolean> => {
  try {
    const response = await apiRequest('GET', `/api/ipfs/check/${cid}`);
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.exists;
  } catch {
    return false;
  }
};

// Get Filecoin deal status for a CID
export const getFilecoinDealStatus = async (cid: string) => {
  try {
    const response = await apiRequest('GET', `/api/ipfs/deal-status/${cid}`);
    
    if (!response.ok) {
      throw new Error('Failed to get deal status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get Filecoin deal status', error);
    throw new Error('Failed to get Filecoin deal status');
  }
};

// Verify the lineage between dataset and model
export const verifyLineage = async (
  datasetCid: string,
  processingCid: string | undefined,
  modelCid: string
): Promise<boolean> => {
  try {
    // Check if all CIDs exist
    const datasetExists = await checkCidExists(datasetCid);
    const modelExists = await checkCidExists(modelCid);
    
    if (!datasetExists || !modelExists) {
      return false;
    }
    
    // If there's a processing step, check that too
    if (processingCid) {
      const processingExists = await checkCidExists(processingCid);
      if (!processingExists) {
        return false;
      }
    }
    
    // For a real implementation, additional verification would be needed
    // such as checking hash references within the model to the dataset
    
    return true;
  } catch (error) {
    console.error('Failed to verify lineage', error);
    return false;
  }
};
