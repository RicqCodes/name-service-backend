import { Router } from "express";
import { createMetadata, getMetadata } from "./controller.ts/metadata";

const router = Router();

router.post("/save-metadata", createMetadata);
router.get("/:tokenId", getMetadata);

export default router;
