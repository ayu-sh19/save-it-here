import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;

export const TransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["EXPENSE", "INCOME", "TRANSFER", "LEND", "BORROW"]),
  paymentMethod: z.string().min(1, "Payment method is required"),
  date: z.string().datetime(),
  merchant: z.string().optional(),
  note: z.string().optional(),
  accountId: z.string().min(1, "Account is required"),
  categoryId: z.string().optional(),
});

export type TransactionInput = z.infer<typeof TransactionSchema>;

export const IdeaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  status: z.enum(["SPARK", "EXPLORING", "IN_PROG", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export type IdeaInput = z.infer<typeof IdeaSchema>;

export const IdeaUpdateSchema = IdeaSchema.partial();
export type IdeaUpdateInput = z.infer<typeof IdeaUpdateSchema>;
