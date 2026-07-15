"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.getStudents = void 0;
const db_1 = __importDefault(require("../db"));
const getStudents = async (req, res) => {
    try {
        const students = await db_1.default.student.findMany({
            where: { userId: req.user.id },
            include: { batch: true },
        });
        res.json(students);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getStudents = getStudents;
const createStudent = async (req, res) => {
    try {
        const { name, email, phone, grade, parentName, parentPhone, batchId } = req.body;
        const student = await db_1.default.student.create({
            data: {
                name, email, phone, grade, parentName, parentPhone, batchId,
                userId: req.user.id
            },
            include: { batch: true },
        });
        res.status(201).json(student);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createStudent = createStudent;
const updateStudent = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        // Ensure student belongs to user
        const existing = await db_1.default.student.findUnique({ where: { id } });
        if (!existing || existing.userId !== req.user?.id) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        const student = await db_1.default.student.update({
            where: { id },
            data,
            include: { batch: true },
        });
        res.json(student);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateStudent = updateStudent;
const deleteStudent = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await db_1.default.student.findUnique({ where: { id } });
        if (!existing || existing.userId !== req.user?.id) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        await db_1.default.student.delete({ where: { id } });
        res.json({ message: 'Student deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteStudent = deleteStudent;
//# sourceMappingURL=studentController.js.map