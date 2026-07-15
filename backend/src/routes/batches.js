"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const batchController_1 = require("../controllers/batchController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', batchController_1.getBatches);
router.post('/', batchController_1.createBatch);
router.put('/:id', batchController_1.updateBatch);
router.delete('/:id', batchController_1.deleteBatch);
exports.default = router;
//# sourceMappingURL=batches.js.map