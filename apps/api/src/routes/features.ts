import { Hono } from "hono";
import { db } from "@convoye/db";
import { features } from "@convoye/db";
import { eq } from "drizzle-orm";

export const featuresRouter = new Hono();

// List features for a project
featuresRouter.get("/", async (c) => {
  const projectId = c.req.query("projectId");
  if (!projectId) return c.json({ error: "projectId required" }, 400);

  const result = await db
    .select()
    .from(features)
    .where(eq(features.projectId, projectId));

  return c.json(result);
});

// Track a new feature branch
featuresRouter.post("/", async (c) => {
  const body = await c.req.json();

  const [feature] = await db
    .insert(features)
    .values({
      projectId: body.projectId,
      branchName: body.branchName,
      title: body.title,
      author: body.author,
      status: "open",
    })
    .returning();

  return c.json(feature, 201);
});

// Get feature with promotion history
featuresRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const result = await db
    .select()
    .from(features)
    .where(eq(features.id, id))
    .limit(1);

  if (!result.length) return c.json({ error: "Not found" }, 404);

  return c.json(result[0]);
});
