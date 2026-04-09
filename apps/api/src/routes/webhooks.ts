import { Hono } from "hono";

export const webhooksRouter = new Hono();

// GitHub webhook handler
webhooksRouter.post("/github", async (c) => {
  const event = c.req.header("X-GitHub-Event");
  const body = await c.req.json();

  console.log(`GitHub webhook: ${event}`);

  switch (event) {
    case "push": {
      // Branch was pushed to — check if it's an environment branch
      const branch = body.ref?.replace("refs/heads/", "");
      console.log(`Push to branch: ${branch}`);
      // TODO: Trigger deploy if this is an environment branch
      break;
    }
    case "pull_request": {
      const action = body.action;
      const prBranch = body.pull_request?.head?.ref;
      console.log(`PR ${action}: ${prBranch}`);

      if (action === "closed" && body.pull_request?.merged) {
        // PR was merged — check if it's a promotion branch
        if (prBranch?.startsWith("promote/")) {
          console.log(`Promotion branch merged: ${prBranch}`);
          // TODO: Update promotion status, trigger deploy
        }
      }
      break;
    }
  }

  return c.json({ ok: true });
});
