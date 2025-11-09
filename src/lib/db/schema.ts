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

export const teamProjects = pgTable('team_projects', {
  id: serial('id').primaryKey(),
  creatorId: integer('creator_id').references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  genre: text('genre'),
  projectType: text('project_type').notNull(), // 'court_metrage', 'long_metrage', 'serie', 'documentaire'
  status: text('status').notNull(), // 'recruiting', 'in_progress', 'completed', 'cancelled'
  budget: integer('budget'),
  deadline: timestamp('deadline'),
  location: text('location'),
  requiredRoles: text('required_roles').array(), // array of role names
  createdAt: timestamp('created_at').defaultNow(),
});

export const teamApplications = pgTable('team_applications', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => teamProjects.id),
  applicantId: integer('applicant_id').references(() => users.id),
  appliedRole: text('applied_role').notNull(),
  message: text('message'),
  status: text('status').notNull(), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp('created_at').defaultNow(),
});

export const userSkills = pgTable('user_skills', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  skill: text('skill').notNull(),
  level: text('level').notNull(), // 'beginner', 'intermediate', 'expert'
  experience: integer('experience'), // years of experience
  createdAt: timestamp('created_at').defaultNow(),
});

export const externalIntegrations = pgTable('external_integrations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // 'CNC', 'Festival de Cannes', etc.
  type: text('type').notNull(), // 'funding', 'festival', 'network'
  apiEndpoint: text('api_endpoint'),
  apiKey: text('api_key'),
  isActive: boolean('is_active').default(true),
  lastSync: timestamp('last_sync'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const fundingOpportunities = pgTable('funding_opportunities', {
  id: serial('id').primaryKey(),
  externalId: text('external_id'), // ID from external API
  integrationId: integer('integration_id').references(() => externalIntegrations.id),
  title: text('title').notNull(),
  description: text('description'),
  organization: text('organization'),
  amount: integer('amount'),
  deadline: timestamp('deadline'),
  eligibility: text('eligibility'),
  applicationUrl: text('application_url'),
  category: text('category'), // 'film', 'short_film', 'documentary', etc.
  region: text('region'), // 'france', 'bretagne', 'europe', etc.
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const festivalEvents = pgTable('festival_events', {
  id: serial('id').primaryKey(),
  externalId: text('external_id'),
  integrationId: integer('integration_id').references(() => externalIntegrations.id),
  name: text('name').notNull(),
  description: text('description'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  location: text('location'),
  submissionDeadline: timestamp('submission_deadline'),
  submissionUrl: text('submission_url'),
  categories: text('categories').array(), // ['court_metrage', 'documentaire', etc.]
  entryFee: integer('entry_fee'),
  prizes: text('prizes'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});