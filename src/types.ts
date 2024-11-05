import { z } from "zod";

export const GroupEntity = z.object({
  companyId: z.string().nullable(),
  userId: z.string().nullable(),
  productId: z.string().nullable(),
  taskId: z.string().nullable(),
});
export type GroupEntity = z.infer<typeof GroupEntity>;

export const GroupSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const PermissionSchema = z.object({
  name: z.string(),
  subject: z.string().nullable(),
  object: z.string().nullable(),
});

export const GroupLinkSchema = z.object({
  id: z.string().nullable(),
  companyId: z.string().nullable(),
  userId: z.string().nullable(),
  productId: z.string().nullable(),
  taskId: z.string().nullable(),
});
