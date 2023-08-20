import { Router } from "express";
import { createMetadata, getMetadata } from "../controller.ts/metadata";
import metadataRoutes from "./metadataRoutes";
import domainRoutes from "./domainRoutes";

const router = Router();

router.get("/walletid", metadataRoutes);
router.get("/user-domains", metadataRoutes);

export default router;
