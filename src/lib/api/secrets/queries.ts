import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import {
  secretIdSchema,
  secrets,
  type SecretId,
} from "@/lib/db/schema/secrets";
import { and, eq } from "drizzle-orm";

export const getSecrets = async () => {
  const { session } = await getUserAuth();

  const s = await db
    .select()
    .from(secrets)
    .where(eq(secrets.userId, session?.user.id!));
  return { secrets: s };
};

export const getSecretById = async (id: SecretId) => {
  const { session } = await getUserAuth();
  const { id: secretId } = secretIdSchema.parse({ id });
  const [s] = await db
    .select()
    .from(secrets)
    .where(
      and(eq(secrets.id, secretId), eq(secrets.userId, session?.user.id!))
    );
  return { secret: s };
};
