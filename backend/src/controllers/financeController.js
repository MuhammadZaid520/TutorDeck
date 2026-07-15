"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.createTransaction = exports.getTransactions = void 0;
const db_1 = __importDefault(require("../db"));
const getTransactions = async (req, res) => {
    try {
        const transactions = await db_1.default.transaction.findMany({
            where: { userId: req.user.id },
            orderBy: { date: 'desc' },
        });
        res.json(transactions);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getTransactions = getTransactions;
const createTransaction = async (req, res) => {
    try {
        const { amount, type, category, description, studentId } = req.body;
        const transaction = await db_1.default.transaction.create({
            data: {
                amount: Number(amount),
                type, // INCOME or EXPENSE
                category,
                description,
                studentId,
                userId: req.user.id
            },
        });
        res.status(201).json(transaction);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createTransaction = createTransaction;
const deleteTransaction = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await db_1.default.transaction.findUnique({ where: { id } });
        if (!existing || existing.userId !== req.user?.id) {
            res.status(404).json({ message: 'Transaction not found' });
            return;
        }
        await db_1.default.transaction.delete({ where: { id } });
        res.json({ message: 'Transaction deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteTransaction = deleteTransaction;
//# sourceMappingURL=financeController.js.map