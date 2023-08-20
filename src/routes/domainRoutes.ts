import { Router } from "express";
import { createMetadata, getMetadata } from "../controller.ts/metadata";

const router = Router();

router.get("/user-domains/:address", getMetadata);

export default router;
