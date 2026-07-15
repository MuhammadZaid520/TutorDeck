"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBatch = exports.updateBatch = exports.createBatch = exports.getBatches = void 0;
const db_1 = __importDefault(require("../db"));
const getBatches = async (req, res) => {
    try {
        const batches = await db_1.default.batch.findMany({
            where: { userId: req.user.id },
            include: {
                _count: {
                    select: { students: true }
                }
            }
        });
        res.json(batches);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getBatches = getBatches;
const createBatch = async (req, res) => {
    try {
        const { name, subject, schedule } = req.body;
        const batch = await db_1.default.batch.create({
            data: {
                name, subject, schedule,
                userId: req.user.id
            },
        });
        res.status(201).json(batch);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createBatch = createBatch;
const updateBatch = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const existing = await db_1.default.batch.findUnique({ where: { id } });
        if (!existing || existing.userId !== req.user?.id) {
            res.status(404).json({ message: 'Batch not found' });
            return;
        }
        const batch = await db_1.default.batch.update({
            where: { id },
            data,
        });
        res.json(batch);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateBatch = updateBatch;
const deleteBatch = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await db_1.default.batch.findUnique({ where: { id } });
        if (!existing || existing.userId !== req.user?.id) {
            res.status(404).json({ message: 'Batch not found' });
            return;
        }
        await db_1.default.batch.delete({ where: { id } });
        res.json({ message: 'Batch deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteBatch = deleteBatch;
//# sourceMappingURL=batchController.js.map