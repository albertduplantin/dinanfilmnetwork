import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  bio: text('bio'),
  role: text('role').notNull(), // 'mentor' or 'mentee'
  skills: text('skills').array(), // array of skills
  interests: text('interests').array(), // array of interests
  experience: text('experience'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const mentorshipSessions = pgTable('mentorship_sessions', {
  id: serial('id').primaryKey(),
  mentorId: integer('mentor_id').references(() => users.id),
  menteeId: integer('mentee_id').references(() => users.id),
  scheduledAt: timestamp('scheduled_at').notNull(),
  status: text('status').notNull(), // 'pending', 'confirmed', 'completed'
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(), // 'funding', 'training', etc.
  link: text('link'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const connections = pgTable('connections', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  connectedUserId: integer('connected_user_id').references(() => users.id),
  status: text('status').notNull(), // 'pending', 'accepted'
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  genre: text('genre'),
  duration: integer('duration'), // in minutes
  productionYear: integer('production_year'),
  status: text('status').notNull(), // 'completed', 'in_progress', 'planned'
  videoUrl: text('video_url'),
  thumbnailUrl: text('thumbnail_url'),
  views: integer('views').default(0),
  likes: integer('likes').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projectMedia = pgTable('project_media', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id),
  type: text('type').notNull(), // 'image', 'video', 'document'
  url: text('url').notNull(),
  title: text('title'),
  description: text('description'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projectLikes = pgTable('project_likes', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});