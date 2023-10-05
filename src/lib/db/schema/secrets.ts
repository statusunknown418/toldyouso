import { mysqlTable, serial, text, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getSecrets } from "@/lib/api/secrets/queries";

export const secrets = mysqlTable("secrets", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  content: text("content"),
  userId: varchar("user_id", { length: 256 }).notNull(),
});

// Schema for secrets - used to validate API requests
export const insertSecretSchema = createInsertSchema(secrets);

export const insertSecretParams = createSelectSchema(secrets, {}).omit({
  id: true,
  userId: true,
});

export const updateSecretSchema = createSelectSchema(secrets);

export const updateSecretParams = createSelectSchema(secrets, {}).omit({
  userId: true,
});

export const secretIdSchema = updateSecretSchema.pick({ id: true });

// Types for secrets - used to type API request params and within Components
export type Secret = z.infer<typeof updateSecretSchema>;
export type NewSecret = z.infer<typeof insertSecretSchema>;
export type NewSecretParams = z.infer<typeof insertSecretParams>;
export type UpdateSecretParams = z.infer<typeof updateSecretParams>;
export type SecretId = z.infer<typeof secretIdSchema>["id"];

// this type infers the return from getSecrets() - meaning it will include any joins
export type CompleteSecret = Awaited<
  ReturnType<typeof getSecrets>
>["secrets"][number];
