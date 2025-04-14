import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Dataset schema
export const datasets = pgTable("datasets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cid: text("cid").notNull(), // IPFS Content Identifier
  size: text("size").notNull(),
  domain: text("domain").notNull(),
  format: text("format").notNull(),
  license: text("license").notNull(),
  accessControl: text("access_control").notNull().default("public"),
  description: text("description"),
  tags: text("tags").array(),
  filesTotalCount: integer("files_total_count").default(0),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  status: text("status").notNull().default("processing"), // processing, verified, failed
  userId: integer("user_id").references(() => users.id),
});

export const insertDatasetSchema = createInsertSchema(datasets).omit({
  id: true,
  uploadedAt: true,
});

export type InsertDataset = z.infer<typeof insertDatasetSchema>;
export type Dataset = typeof datasets.$inferSelect;

// Model schema
export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cid: text("cid").notNull(), // IPFS Content Identifier
  architecture: text("architecture"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  userId: integer("user_id").references(() => users.id),
});

export const insertModelSchema = createInsertSchema(models).omit({
  id: true,
  createdAt: true,
});

export type InsertModel = z.infer<typeof insertModelSchema>;
export type Model = typeof models.$inferSelect;

// Dataset-Model relationship schema
export const datasetModelRelationships = pgTable("dataset_model_relationships", {
  id: serial("id").primaryKey(),
  datasetId: integer("dataset_id").references(() => datasets.id).notNull(),
  modelId: integer("model_id").references(() => models.id).notNull(),
  usageDate: timestamp("usage_date").defaultNow(),
  status: text("status").notNull().default("processing"), // processing, verified
  licensingInfo: text("licensing_info").notNull(),
  processingCid: text("processing_cid"), // Optional CID for processing steps
});

export const insertRelationshipSchema = createInsertSchema(datasetModelRelationships).omit({
  id: true,
  usageDate: true,
});

export type InsertRelationship = z.infer<typeof insertRelationshipSchema>;
export type Relationship = typeof datasetModelRelationships.$inferSelect;

// Metadata schema for upload
export const datasetMetadataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  domain: z.string().min(1, "Domain is required"),
  format: z.string().min(1, "Format is required"),
  license: z.string().min(1, "License is required"),
  accessControl: z.string().min(1, "Access control is required"),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type DatasetMetadata = z.infer<typeof datasetMetadataSchema>;
