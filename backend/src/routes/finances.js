"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const financeController_1 = require("../controllers/financeController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', financeController_1.getTransactions);
router.post('/', financeController_1.createTransaction);
router.delete('/:id', financeController_1.deleteTransaction);
exports.default = router;
//# sourceMappingURL=finances.js.map