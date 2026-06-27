"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionSchema = void 0;
const zod_1 = require("zod");
exports.TransactionSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    type: zod_1.z.enum(['EXPENSE', 'INCOME', 'TRANSFER', 'LEND', 'BORROW', 'LEND_REPAYMENT', 'BORROW_REPAYMENT', 'GROUP_EXPENSE']),
    categoryId: zod_1.z.string().cuid(),
    sourceAccountId: zod_1.z.string().cuid(),
    date: zod_1.z.string().datetime(),
    paymentMethod: zod_1.z.enum(['UPI', 'CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET', 'AUTO_DEBIT']),
});
