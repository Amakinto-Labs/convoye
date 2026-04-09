import { Hono } from "hono";
import { db } from "@convoye/db";
import { environments } from "@convoye/db";
import { eq } from "drizzle-orm";

export const environmentsRouter = new Hono();

// List environments for a pipeline
environmentsRouter.get("/", async (c) => {
  const pipelineId = c.req.query("pipelineId");
  if (!pipelineId) return c.json({ error: "pipelineId required" }, 400);

  const result = await db
    .select()
    .from(environments)
    .where(eq(environments.pipelineId, pipelineId));

  return c.json(result);
});

// Update an environment
environmentsRouter.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const [updated] = await db
    .update(environments)
    .set(body)
    .where(eq(environments.id, id))
    .returning();

  return c.json(updated);
});

// Delete an environment
environmentsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(environments).where(eq(environments.id, id));
  return c.json({ ok: true });
});
