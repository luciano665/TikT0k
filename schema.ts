import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Users Table
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  profile_picture: text("profile_picture").notNull(),
  age: integer("age").notNull(),
  location: text("location").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
  followers_count: integer("followers_count").notNull(),
  following_count: integer("following_count").notNull(),
});

// Videos Table
export const videosTable = pgTable("videos", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => usersTable.id),
  video_url: text("video_url").notNull(),
  thumbnail_url: text("thumbnail_url").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(),
  likes_count: integer("likes_count").notNull(),
  shares_count: integer("shares_count").notNull(),
  comments_count: integer("comments_count").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

// Comments Table
export const commentsTable = pgTable("comments", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => usersTable.id),
  video_id: integer("video_id").notNull().references(() => videosTable.id),
  comment_text: text("comment_text").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// Likes Table
export const likesTable = pgTable("likes", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => usersTable.id),
  video_id: integer("video_id").notNull().references(() => videosTable.id),
  comment_id: integer("comment_id").references(() => commentsTable.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// Shares Table
export const sharesTable = pgTable("shares", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => usersTable.id),
  video_id: integer("video_id").notNull().references(() => videosTable.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// Clickstream Table
export const clickstreamTable = pgTable("clickstream", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  session_id: integer("session_id").notNull(),
  video_id: integer("video_id").notNull(),
  event_type: text("event_type").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  device_id: integer("device_id").notNull(),
  location: text("location").notNull(),
});

// Sessions Table
export const sessionsTable = pgTable("sessions", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => usersTable.id),
  device_id: integer("device_id").notNull(),
  start_time: timestamp("start_time").notNull().defaultNow(),
  end_time: timestamp("end_time").notNull().defaultNow(),
  location: text("location").notNull(),
});

// Devices Table
export const devicesTable = pgTable("devices", {
  id: serial("id").primaryKey(),
  device_type: text("device_type").notNull(),
  device_model: text("device_model").notNull(),
  operating_system: text("operating_system").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

// Follows Table
export const followsTable = pgTable("follows", {
  id: serial("id").primaryKey(),
  follower_id: integer("follower_id").notNull().references(() => usersTable.id),
  followee_id: integer("followee_id").notNull().references(() => usersTable.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// Type Inference for Inserts and Selects
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertVideo = typeof videosTable.$inferInsert;
export type SelectVideo = typeof videosTable.$inferSelect;
export type InsertComment = typeof commentsTable.$inferInsert;
export type SelectComment = typeof commentsTable.$inferSelect;
export type InsertLike = typeof likesTable.$inferInsert;
export type SelectLike = typeof likesTable.$inferSelect;
export type InsertShare = typeof sharesTable.$inferInsert;
export type SelectShare = typeof sharesTable.$inferSelect;
export type InsertClickstream = typeof clickstreamTable.$inferInsert;
export type SelectClickstream = typeof clickstreamTable.$inferSelect;
export type InsertSession = typeof sessionsTable.$inferInsert;
export type SelectSession = typeof sessionsTable.$inferSelect;
export type InsertDevice = typeof devicesTable.$inferInsert;
export type SelectDevice = typeof devicesTable.$inferSelect;
export type InsertFollow = typeof followsTable.$inferInsert;
export type SelectFollow = typeof followsTable.$inferSelect;
