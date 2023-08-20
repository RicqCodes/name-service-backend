import { Router } from "express";
import { createMetadata, getMetadata } from "../controller.ts/metadata";

const router = Router();

router.get("/:address/:chainId", getMetadata);

export default router;
