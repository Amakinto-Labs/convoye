import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";

// ─── Users & Auth ───

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  image: text("image"),
  githubId: text("github_id").unique(),
  githubAccessToken: text("github_access_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Organizations ───

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const organizationMembers = pgTable("organization_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Projects ───

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: uuid("org_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  repoUrl: text("repo_url").notNull(),
  repoOwner: text("repo_owner").notNull(),
  repoName: text("repo_name").notNull(),
  gitProvider: text("git_provider").notNull().default("github"),
  defaultBranch: text("default_branch").notNull().default("main"),
  webhookSecret: text("webhook_secret"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Pipelines ───

export const pipelines = pgTable("pipelines", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  configJson: jsonb("config_json"),
  convoyeYml: text("convoye_yml"),
  isActive: boolean("is_active").notNull().default(true),
  autoSyncPrs: boolean("auto_sync_prs").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Environments ───

export const environments = pgTable("environments", {
  id: uuid("id").primaryKey().defaultRandom(),
  pipelineId: uuid("pipeline_id")
    .notNull()
    .references(() => pipelines.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  branch: text("branch").notNull(),
  deployTarget: text("deploy_target"),
  deployConfig: jsonb("deploy_config").$type<Record<string, string>>(),
  autoDeploy: boolean("auto_deploy").notNull().default(false),
  reviewersRequired: integer("reviewers_required").notNull().default(0),
  positionX: integer("position_x").notNull().default(0),
  positionY: integer("position_y").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Promotion Paths (edges) ───

export const promotionPaths = pgTable("promotion_paths", {
  id: uuid("id").primaryKey().defaultRandom(),
  pipelineId: uuid("pipeline_id")
    .notNull()
    .references(() => pipelines.id, { onDelete: "cascade" }),
  sourceEnvId: uuid("source_env_id")
    .notNull()
    .references(() => environments.id, { onDelete: "cascade" }),
  targetEnvId: uuid("target_env_id")
    .notNull()
    .references(() => environments.id, { onDelete: "cascade" }),
  requireTests: boolean("require_tests").notNull().default(false),
  requireApproval: boolean("require_approval").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Features ───

export const features = pgTable("features", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  branchName: text("branch_name").notNull(),
  title: text("title").notNull(),
  author: text("author"),
  currentEnvId: uuid("current_env_id").references(() => environments.id),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Promotions (audit trail) ───

export const promotions = pgTable("promotions", {
  id: uuid("id").primaryKey().defaultRandom(),
  featureId: uuid("feature_id")
    .notNull()
    .references(() => features.id, { onDelete: "cascade" }),
  sourceEnvId: uuid("source_env_id").references(() => environments.id),
  targetEnvId: uuid("target_env_id")
    .notNull()
    .references(() => environments.id),
  promotionBranch: text("promotion_branch").notNull(),
  prUrl: text("pr_url"),
  prNumber: integer("pr_number"),
  status: text("status").notNull().default("pending"),
  promotedBy: uuid("promoted_by").references(() => users.id),
  promotedAt: timestamp("promoted_at").defaultNow().notNull(),
  mergedAt: timestamp("merged_at"),
  deployedAt: timestamp("deployed_at"),
});
