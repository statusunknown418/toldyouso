import { router } from "../trpc";
import { computersRouter } from "./computers";
import { secretsRouter } from "./secrets";

export const appRouter = router({
  computers: computersRouter,
  secrets: secretsRouter,
});

export type AppRouter = typeof appRouter;
