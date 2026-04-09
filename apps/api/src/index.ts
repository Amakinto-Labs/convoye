import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { pipelinesRouter } from "./routes/pipelines";
import { environmentsRouter } from "./routes/environments";
import { featuresRouter } from "./routes/features";
import { promotionsRouter } from "./routes/promotions";
import { webhooksRouter } from "./routes/webhooks";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (c) => c.json({ name: "Convoye API", version: "0.0.1" }));
app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/api/pipelines", pipelinesRouter);
app.route("/api/environments", environmentsRouter);
app.route("/api/features", featuresRouter);
app.route("/api/promotions", promotionsRouter);
app.route("/api/webhooks", webhooksRouter);

const port = parseInt(process.env.PORT || "3001");

console.log(`Convoye API running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });

export default app;
