export type GitProvider = "github" | "gitlab" | "bitbucket" | "azure";

export type DeployTarget = "railway" | "vercel" | "fly" | "custom";

export type EnvironmentStatus = "idle" | "deploying" | "deployed" | "failed";

export type FeatureStatus =
  | "open"
  | "promoting"
  | "conflict"
  | "deployed"
  | "rolled_back";

export type PromotionStatus =
  | "pending"
  | "creating_branch"
  | "conflict"
  | "pr_open"
  | "validating"
  | "merging"
  | "deploying"
  | "deployed"
  | "failed";

export interface EnvironmentConfig {
  id: string;
  name: string;
  branch: string;
  deployTarget: DeployTarget | null;
  deployConfig: Record<string, string>;
  autoDeploy: boolean;
  reviewersRequired: number;
}

export interface PromotionPathConfig {
  id: string;
  sourceEnvId: string;
  targetEnvId: string;
  requireTests: boolean;
  requireApproval: boolean;
}

export interface PipelineConfig {
  environments: EnvironmentConfig[];
  promotionPaths: PromotionPathConfig[];
}

export interface ConvoyeYml {
  version: string;
  pipeline: {
    name: string;
    environments: Array<{
      name: string;
      branch: string;
      deploy?: {
        target: DeployTarget;
        config?: Record<string, string>;
      };
      auto: boolean;
      reviewers?: number;
    }>;
    promotions: Array<{
      from: string;
      to: string;
      requireTests?: boolean;
      requireApproval?: boolean;
    }>;
  };
}

export interface FeatureInfo {
  id: string;
  branch: string;
  title: string;
  author: string;
  currentEnvironment: string | null;
  status: FeatureStatus;
  promotions: PromotionInfo[];
}

export interface PromotionInfo {
  id: string;
  sourceEnv: string;
  targetEnv: string;
  promotionBranch: string;
  prUrl: string | null;
  status: PromotionStatus;
  promotedBy: string;
  promotedAt: string;
  deployedAt: string | null;
}
