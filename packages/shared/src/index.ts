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
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  tags: z.array(z.string()).optional(),
});

export type IdeaInput = z.infer<typeof IdeaSchema>;

export type Transaction = TransactionInput & { id: string; createdAt: string; updatedAt: string };
export type Idea = IdeaInput & { id: string; createdAt: string; updatedAt: string };

export const IdeaUpdateSchema = IdeaSchema.partial();
export type IdeaUpdateInput = z.infer<typeof IdeaUpdateSchema>;

export const WishlistItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  price: z.number().nonnegative().optional(),
  currency: z.string().default("INR"),
  status: z.enum(["WANT", "BOUGHT", "DROPPED"]),
  category: z.enum(["TECH", "BOOK", "MOVIE", "OTHER"]),
  author: z.string().optional(),
  genre: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export type WishlistItemInput = z.infer<typeof WishlistItemSchema>;

export const ArchiveItemSchema = z.object({
  platform: z.enum(["INSTAGRAM", "TWITTER", "WEB"]),
  url: z.string().url(),
  authorHandle: z.string().optional(),
  caption: z.string().optional(),
  ocrText: z.string().optional(),
  userCategory: z.string().optional(),
});

export type ArchiveItemInput = z.infer<typeof ArchiveItemSchema>;

export const AccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["BANK", "CREDIT_CARD", "WALLET", "CASH", "INVESTMENT"]),
  balance: z.number().default(0),
  currency: z.string().default("INR"),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export type AccountInput = z.infer<typeof AccountSchema>;

export const CategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
  budgetAmount: z.number().nonnegative().optional(),
});

export type CategoryInput = z.infer<typeof CategorySchema>;

export const LendingEntrySchema = z.object({
  personName: z.string().min(1, "Person name is required"),
  type: z.enum(["LEND", "BORROW"]),
  principalAmount: z.number().positive("Amount must be positive"),
  interestRate: z.number().nonnegative().optional(),
  dueDate: z.string().datetime().optional(),
  note: z.string().optional(),
  transactionId: z.string().min(1, "Transaction ID is required"),
});

export type LendingEntryInput = z.infer<typeof LendingEntrySchema>;
