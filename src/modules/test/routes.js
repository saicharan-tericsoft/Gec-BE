"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.post('/submit', controller_1.submitTest);
router.get('/firstTime/:applicationId/:route', controller_1.firstTime);
exports.default = router;
