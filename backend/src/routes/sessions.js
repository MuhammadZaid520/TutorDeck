"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionController_1 = require("../controllers/sessionController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', sessionController_1.getSessions);
router.post('/', sessionController_1.createSession);
router.put('/:id', sessionController_1.updateSession);
router.delete('/:id', sessionController_1.deleteSession);
exports.default = router;
//# sourceMappingURL=sessions.js.map