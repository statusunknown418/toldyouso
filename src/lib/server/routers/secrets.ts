import { getSecretById, getSecrets } from "@/lib/api/secrets/queries";
import { publicProcedure, router } from "../trpc";
import {
  secretIdSchema,
  insertSecretParams,
  updateSecretParams,
} from "@/lib/db/schema/secrets";
import { createSecret, deleteSecret, updateSecret } from "@/lib/api/secrets/mutations";

export const secretsRouter = router({
  getSecrets: publicProcedure.query(async () => {
    return getSecrets();
  }),
  getSecretById: publicProcedure.input(secretIdSchema).query(async ({ input }) => {
    return getSecretById(input.id);
  }),
  createSecret: publicProcedure
    .input(insertSecretParams)
    .mutation(async ({ input }) => {
      return createSecret(input);
    }),
  updateSecret: publicProcedure
    .input(updateSecretParams)
    .mutation(async ({ input }) => {
      return updateSecret(input.id, input);
    }),
  deleteSecret: publicProcedure
    .input(secretIdSchema)
    .mutation(async ({ input }) => {
      return deleteSecret(input.id);
    }),
});
