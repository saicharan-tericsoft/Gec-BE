"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.get('/bmi/:applicationId', controller_1.downloadBMIPdf);
router.get('/ishihara/:applicationId', controller_1.downloadIshiharaPdf);
exports.default = router;
