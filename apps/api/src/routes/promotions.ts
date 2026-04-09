import { Hono } from "hono";
import { db } from "@convoye/db";
import { promotions, features, environments } from "@convoye/db";
import { eq } from "drizzle-orm";

export const promotionsRouter = new Hono();

// List promotions for a feature
promotionsRouter.get("/", async (c) => {
  const featureId = c.req.query("featureId");
  if (!featureId) return c.json({ error: "featureId required" }, 400);

  const result = await db
    .select()
    .from(promotions)
    .where(eq(promotions.featureId, featureId));

  return c.json(result);
});

// Promote a feature to an environment
promotionsRouter.post("/promote", async (c) => {
  const body = await c.req.json();
  const { featureId, targetEnvId } = body;

  // Get feature
  const [feature] = await db
    .select()
    .from(features)
    .where(eq(features.id, featureId));

  if (!feature) return c.json({ error: "Feature not found" }, 404);

  // Get target environment
  const [targetEnv] = await db
    .select()
    .from(environments)
    .where(eq(environments.id, targetEnvId));

  if (!targetEnv) return c.json({ error: "Environment not found" }, 404);

  // Build promotion branch name
  const featureName = feature.branchName.replace(/^feature\//, "");
  const promotionBranch = `promote/${featureName}_-_${targetEnv.branch}`;

  // Create promotion record
  const [promotion] = await db
    .insert(promotions)
    .values({
      featureId,
      sourceEnvId: feature.currentEnvId,
      targetEnvId,
      promotionBranch,
      status: "creating_branch",
    })
    .returning();

  // TODO: Call GitHub service to:
  // 1. Create promotion branch from feature branch
  // 2. Merge target env branch into promotion branch
  // 3. Check for conflicts
  // 4. Open PR from promotion branch → env branch

  // Update feature status
  await db
    .update(features)
    .set({ status: "promoting", updatedAt: new Date() })
    .where(eq(features.id, featureId));

  return c.json(promotion, 201);
});

// Get promotion status
promotionsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const result = await db
    .select()
    .from(promotions)
    .where(eq(promotions.id, id))
    .limit(1);

  if (!result.length) return c.json({ error: "Not found" }, 404);

  return c.json(result[0]);
});
