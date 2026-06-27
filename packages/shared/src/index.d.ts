import { z } from 'zod';
export declare const TransactionSchema: z.ZodObject<{
    amount: z.ZodNumber;
    type: z.ZodEnum<["EXPENSE", "INCOME", "TRANSFER", "LEND", "BORROW", "LEND_REPAYMENT", "BORROW_REPAYMENT", "GROUP_EXPENSE"]>;
    categoryId: z.ZodString;
    sourceAccountId: z.ZodString;
    date: z.ZodString;
    paymentMethod: z.ZodEnum<["UPI", "CASH", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "WALLET", "AUTO_DEBIT"]>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    type: "EXPENSE" | "INCOME" | "TRANSFER" | "LEND" | "BORROW" | "LEND_REPAYMENT" | "BORROW_REPAYMENT" | "GROUP_EXPENSE";
    date: string;
    categoryId: string;
    sourceAccountId: string;
    paymentMethod: "UPI" | "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "NET_BANKING" | "WALLET" | "AUTO_DEBIT";
}, {
    amount: number;
    type: "EXPENSE" | "INCOME" | "TRANSFER" | "LEND" | "BORROW" | "LEND_REPAYMENT" | "BORROW_REPAYMENT" | "GROUP_EXPENSE";
    date: string;
    categoryId: string;
    sourceAccountId: string;
    paymentMethod: "UPI" | "CASH" | "CREDIT_CARD" | "DEBIT_CARD" | "NET_BANKING" | "WALLET" | "AUTO_DEBIT";
}>;
export type TransactionInput = z.infer<typeof TransactionSchema>;
