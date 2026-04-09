import { Hono } from "hono";
import { db } from "@convoye/db";
import { pipelines, environments, promotionPaths } from "@convoye/db";
import { eq } from "drizzle-orm";
import { stringify as yamlStringify } from "yaml";

export const pipelinesRouter = new Hono();

// List pipelines for a project
pipelinesRouter.get("/", async (c) => {
  const projectId = c.req.query("projectId");
  if (!projectId) return c.json({ error: "projectId required" }, 400);

  const result = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.projectId, projectId));

  return c.json(result);
});

// Get a single pipeline with environments and paths
pipelinesRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const pipeline = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.id, id))
    .limit(1);

  if (!pipeline.length) return c.json({ error: "Not found" }, 404);

  const envs = await db
    .select()
    .from(environments)
    .where(eq(environments.pipelineId, id));

  const paths = await db
    .select()
    .from(promotionPaths)
    .where(eq(promotionPaths.pipelineId, id));

  return c.json({
    ...pipeline[0],
    environments: envs,
    promotionPaths: paths,
  });
});

// Create or update pipeline (save from canvas)
pipelinesRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { projectId, name, configJson, environments: envs, promotionPaths: paths } = body;

  // Create pipeline
  const [pipeline] = await db
    .insert(pipelines)
    .values({
      projectId,
      name,
      configJson,
    })
    .returning();

  // Create environments
  if (envs?.length) {
    for (const env of envs) {
      await db.insert(environments).values({
        pipelineId: pipeline.id,
        name: env.name,
        branch: env.branch,
        deployTarget: env.deployTarget || null,
        deployConfig: env.deployConfig || null,
        autoDeploy: env.autoDeploy ?? false,
        reviewersRequired: env.reviewersRequired ?? 0,
        positionX: env.positionX ?? 0,
        positionY: env.positionY ?? 0,
      });
    }
  }

  return c.json(pipeline, 201);
});

// Update pipeline canvas state
pipelinesRouter.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const [updated] = await db
    .update(pipelines)
    .set({
      configJson: body.configJson,
      convoyeYml: body.convoyeYml,
      updatedAt: new Date(),
    })
    .where(eq(pipelines.id, id))
    .returning();

  return c.json(updated);
});

// Generate convoye.yml from pipeline
pipelinesRouter.get("/:id/yml", async (c) => {
  const id = c.req.param("id");

  const pipeline = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.id, id))
    .limit(1);

  if (!pipeline.length) return c.json({ error: "Not found" }, 404);

  const envs = await db
    .select()
    .from(environments)
    .where(eq(environments.pipelineId, id));

  const paths = await db
    .select()
    .from(promotionPaths)
    .where(eq(promotionPaths.pipelineId, id));

  const yml = {
    version: "1",
    pipeline: {
      name: pipeline[0].name,
      environments: envs.map((e) => ({
        name: e.name,
        branch: e.branch,
        ...(e.deployTarget && {
          deploy: {
            target: e.deployTarget,
            ...(e.deployConfig && { config: e.deployConfig }),
          },
        }),
        auto: e.autoDeploy,
        ...(e.reviewersRequired > 0 && { reviewers: e.reviewersRequired }),
      })),
      promotions: paths.map((p) => {
        const source = envs.find((e) => e.id === p.sourceEnvId);
        const target = envs.find((e) => e.id === p.targetEnvId);
        return {
          from: source?.name || "",
          to: target?.name || "",
          ...(p.requireTests && { requireTests: true }),
          ...(p.requireApproval && { requireApproval: true }),
        };
      }),
    },
  };

  const yamlStr = yamlStringify(yml);
  return c.text(yamlStr, 200, { "Content-Type": "text/yaml" });
});
