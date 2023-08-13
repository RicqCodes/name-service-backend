"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const metadata_1 = require("./controller.ts/metadata");
const router = (0, express_1.Router)();
router.post("/save-metadata", metadata_1.createMetadata);
router.get("/test/:tokenId", metadata_1.getMetadata);
exports.default = router;
