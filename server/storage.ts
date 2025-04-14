import {
  type User, type InsertUser,
  type Dataset, type InsertDataset,
  type Model, type InsertModel,
  type Relationship, type InsertRelationship
} from "@shared/schema";
import { 
  db, 
  usersCollection, 
  datasetsCollection, 
  modelsCollection, 
  relationshipsCollection 
} from "./firebase";
import { 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  setDoc,
  query, 
  where, 
  collection, 
  Timestamp, 
  serverTimestamp 
} from "firebase/firestore";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Dataset methods
  getDatasets(): Promise<Dataset[]>;
  getDataset(id: number): Promise<Dataset | undefined>;
  createDataset(dataset: InsertDataset): Promise<Dataset>;
  updateDatasetStatus(id: number, status: string): Promise<Dataset | undefined>;
  
  // Model methods
  getModels(): Promise<Model[]>;
  getModel(id: number): Promise<Model | undefined>;
  createModel(model: InsertModel): Promise<Model>;
  
  // Relationship methods
  getRelationships(): Promise<Relationship[]>;
  getRelationshipsByDataset(datasetId: number): Promise<Relationship[]>;
  getRelationshipsByModel(modelId: number): Promise<Relationship[]>;
  createRelationship(relationship: InsertRelationship): Promise<Relationship>;
  updateRelationshipStatus(id: number, status: string): Promise<Relationship | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Helper function to convert Firestore document to our model
  private convertFirestoreDoc<T>(doc: any): T {
    const data = doc.data();
    return {
      id: parseInt(doc.id),
      ...data,
      // Convert Firestore timestamps to JavaScript Date objects
      ...(data.uploadedAt && { uploadedAt: data.uploadedAt.toDate() }),
      ...(data.createdAt && { createdAt: data.createdAt.toDate() }),
      ...(data.usageDate && { usageDate: data.usageDate.toDate() })
    } as T;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const userDoc = await getDoc(doc(usersCollection, id.toString()));
      if (!userDoc.exists()) return undefined;
      return this.convertFirestoreDoc<User>(userDoc);
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const q = query(usersCollection, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return undefined;
      return this.convertFirestoreDoc<User>(querySnapshot.docs[0]);
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      // Get the highest ID to generate a new one
      const querySnapshot = await getDocs(usersCollection);
      const ids = querySnapshot.docs.map(doc => parseInt(doc.id) || 0);
      const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
      
      // Create the new user document
      await addDoc(usersCollection, {
        ...insertUser,
        id: newId
      });
      
      return {
        id: newId,
        ...insertUser
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Dataset methods
  async getDatasets(): Promise<Dataset[]> {
    try {
      console.log("Fetching datasets from Firestore...");
      const querySnapshot = await getDocs(datasetsCollection);
      
      if (querySnapshot.empty) {
        console.log("No datasets found in Firestore");
        return [];
      }
      
      const datasets = querySnapshot.docs.map(doc => {
        const dataset = this.convertFirestoreDoc<Dataset>(doc);
        console.log(`Found dataset: ${JSON.stringify(dataset)}`);
        return dataset;
      });
      
      console.log(`Retrieved ${datasets.length} datasets from Firestore`);
      return datasets;
    } catch (error) {
      console.error("Error getting datasets:", error);
      return [];
    }
  }

  async getDataset(id: number): Promise<Dataset | undefined> {
    try {
      console.log(`Fetching dataset with ID: ${id}`);
      
      // First try to get by document ID
      const datasetDoc = await getDoc(doc(datasetsCollection, id.toString()));
      if (datasetDoc.exists()) {
        console.log(`Found dataset with document ID: ${id}`);
        return this.convertFirestoreDoc<Dataset>(datasetDoc);
      }
      
      // If not found, try to query by id field
      console.log(`Dataset not found with document ID ${id}, trying to query by id field`);
      const q = query(datasetsCollection, where("id", "==", id));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.log(`Found dataset with id field: ${id}`);
        return this.convertFirestoreDoc<Dataset>(querySnapshot.docs[0]);
      }
      
      console.log(`Dataset with ID ${id} not found`);
      return undefined;
    } catch (error) {
      console.error("Error getting dataset:", error);
      return undefined;
    }
  }

  async createDataset(insertDataset: InsertDataset): Promise<Dataset> {
    try {
      // Get the highest ID to generate a new one
      const querySnapshot = await getDocs(datasetsCollection);
      const ids = querySnapshot.docs.map(doc => parseInt(doc.id) || 0);
      const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
      
      // Create the new dataset document
      const datasetData = {
        ...insertDataset,
        uploadedAt: serverTimestamp(),
        status: 'verified'
      };
      
      // Use the numeric ID as the document ID
      const docRef = doc(datasetsCollection, newId.toString());
      
      // Use setDoc to create or update the document
      await setDoc(docRef, {
        ...datasetData,
        id: newId
      });
      console.log(`Created dataset with ID: ${newId}`);
      
      console.log(`Dataset created successfully with ID: ${newId}`);
      
      return {
        ...datasetData,
        uploadedAt: new Date(),
        id: newId
      } as Dataset;
    } catch (error) {
      console.error("Error creating dataset:", error);
      throw error;
    }
  }

  async updateDatasetStatus(id: number, status: string): Promise<Dataset | undefined> {
    try {
      const datasetRef = doc(datasetsCollection, id.toString());
      const datasetDoc = await getDoc(datasetRef);
      
      if (!datasetDoc.exists()) return undefined;
      
      await updateDoc(datasetRef, { status });
      
      const updatedDoc = await getDoc(datasetRef);
      return this.convertFirestoreDoc<Dataset>(updatedDoc);
    } catch (error) {
      console.error("Error updating dataset status:", error);
      return undefined;
    }
  }

  // Model methods
  async getModels(): Promise<Model[]> {
    try {
      const querySnapshot = await getDocs(modelsCollection);
      return querySnapshot.docs.map(doc => this.convertFirestoreDoc<Model>(doc));
    } catch (error) {
      console.error("Error getting models:", error);
      return [];
    }
  }

  async getModel(id: number): Promise<Model | undefined> {
    try {
      const modelDoc = await getDoc(doc(modelsCollection, id.toString()));
      if (!modelDoc.exists()) return undefined;
      return this.convertFirestoreDoc<Model>(modelDoc);
    } catch (error) {
      console.error("Error getting model:", error);
      return undefined;
    }
  }

  async createModel(insertModel: InsertModel): Promise<Model> {
    try {
      // Get the highest ID to generate a new one
      const querySnapshot = await getDocs(modelsCollection);
      const ids = querySnapshot.docs.map(doc => parseInt(doc.id) || 0);
      const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
      
      // Create the new model document
      const modelData = {
        ...insertModel,
        id: newId,
        createdAt: serverTimestamp()
      };
      
      await addDoc(modelsCollection, modelData);
      
      return {
        ...modelData,
        createdAt: new Date(),
        id: newId
      } as Model;
    } catch (error) {
      console.error("Error creating model:", error);
      throw error;
    }
  }

  // Relationship methods
  async getRelationships(): Promise<Relationship[]> {
    try {
      const querySnapshot = await getDocs(relationshipsCollection);
      return querySnapshot.docs.map(doc => this.convertFirestoreDoc<Relationship>(doc));
    } catch (error) {
      console.error("Error getting relationships:", error);
      return [];
    }
  }

  async getRelationshipsByDataset(datasetId: number): Promise<Relationship[]> {
    try {
      const q = query(relationshipsCollection, where("datasetId", "==", datasetId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.convertFirestoreDoc<Relationship>(doc));
    } catch (error) {
      console.error("Error getting relationships by dataset:", error);
      return [];
    }
  }

  async getRelationshipsByModel(modelId: number): Promise<Relationship[]> {
    try {
      const q = query(relationshipsCollection, where("modelId", "==", modelId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.convertFirestoreDoc<Relationship>(doc));
    } catch (error) {
      console.error("Error getting relationships by model:", error);
      return [];
    }
  }

  async createRelationship(insertRelationship: InsertRelationship): Promise<Relationship> {
    try {
      // Get the highest ID to generate a new one
      const querySnapshot = await getDocs(relationshipsCollection);
      const ids = querySnapshot.docs.map(doc => parseInt(doc.id) || 0);
      const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
      
      // Create the new relationship document
      const relationshipData = {
        ...insertRelationship,
        id: newId,
        usageDate: serverTimestamp(),
        status: 'verified'
      };
      
      await addDoc(relationshipsCollection, relationshipData);
      
      return {
        ...relationshipData,
        usageDate: new Date(),
        id: newId
      } as Relationship;
    } catch (error) {
      console.error("Error creating relationship:", error);
      throw error;
    }
  }

  async updateRelationshipStatus(id: number, status: string): Promise<Relationship | undefined> {
    try {
      const relationshipRef = doc(relationshipsCollection, id.toString());
      const relationshipDoc = await getDoc(relationshipRef);
      
      if (!relationshipDoc.exists()) return undefined;
      
      await updateDoc(relationshipRef, { status });
      
      const updatedDoc = await getDoc(relationshipRef);
      return this.convertFirestoreDoc<Relationship>(updatedDoc);
    } catch (error) {
      console.error("Error updating relationship status:", error);
      return undefined;
    }
  }
}

// Create a demo user if one doesn't exist
const initializeDatabase = async () => {
  try {
    console.log('Initializing Firestore database...');
    
    // Check if demo user exists
    const q = query(usersCollection, where("username", "==", "demo"));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('Creating demo user...');
      await addDoc(usersCollection, {
        id: 1,
        username: "demo",
        password: "password"
      });
      console.log('Demo user created successfully');
    } else {
      console.log('Demo user already exists');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Initialize database with demo user
initializeDatabase();

// Use the database storage implementation
export const storage = new DatabaseStorage();
