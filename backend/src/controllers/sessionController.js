"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSession = exports.updateSession = exports.createSession = exports.getSessions = void 0;
const db_1 = __importDefault(require("../db"));
const getSessions = async (req, res) => {
    try {
        const sessions = await db_1.default.session.findMany({
            where: { userId: req.user.id },
            include: {
                batch: true,
                students: true,
            },
            orderBy: { date: 'asc' },
        });
        res.json(sessions);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getSessions = getSessions;
const createSession = async (req, res) => {
    try {
        const { title, date, duration, type, status, batchId } = req.body;
        const session = await db_1.default.session.create({
            data: {
                title,
                date: new Date(date),
                duration: Number(duration),
                type,
                status,
                batchId,
                userId: req.user.id
            },
        });
        res.status(201).json(session);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createSession = createSession;
const updateSession = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        if (data.date)
            data.date = new Date(data.date);
        if (data.duration)
            data.duration = Number(data.duration);
        const existing = await db_1.default.session.findUnique({ where: { id } });
        if (!existing || existing.userId !== req.user?.id) {
            res.status(404).json({ message: 'Session not found' });
            return;
        }
        const session = await db_1.default.session.update({
            where: { id },
            data,
        });
        res.json(session);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateSession = updateSession;
const deleteSession = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await db_1.default.session.findUnique({ where: { id } });
        if (!existing || existing.userId !== req.user?.id) {
            res.status(404).json({ message: 'Session not found' });
            return;
        }
        await db_1.default.session.delete({ where: { id } });
        res.json({ message: 'Session deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteSession = deleteSession;
//# sourceMappingURL=sessionController.js.map