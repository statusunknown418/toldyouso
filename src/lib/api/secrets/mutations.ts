import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { 
  SecretId, 
  NewSecretParams,
  UpdateSecretParams, 
  updateSecretSchema,
  insertSecretSchema, 
  secrets,
  secretIdSchema 
} from "@/lib/db/schema/secrets";
import { getUserAuth } from "@/lib/auth/utils";

export const createSecret = async (secret: NewSecretParams) => {
  const { session } = await getUserAuth();
  const newSecret = insertSecretSchema.parse({ ...secret, userId: session?.user.id! });
  try {
    await db.insert(secrets).values(newSecret)
    return { success: true }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateSecret = async (id: SecretId, secret: UpdateSecretParams) => {
  const { session } = await getUserAuth();
  const { id: secretId } = secretIdSchema.parse({ id });
  const newSecret = updateSecretSchema.parse({ ...secret, userId: session?.user.id! });
  try {
    await db
     .update(secrets)
     .set(newSecret)
     .where(and(eq(secrets.id, secretId!), eq(secrets.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteSecret = async (id: SecretId) => {
  const { session } = await getUserAuth();
  const { id: secretId } = secretIdSchema.parse({ id });
  try {
    await db.delete(secrets).where(and(eq(secrets.id, secretId!), eq(secrets.userId, session?.user.id!)))
    return {success: true}
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

