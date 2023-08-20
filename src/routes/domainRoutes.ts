import { Router } from "express";
import { getUserDomains } from "../controller.ts/domain";

const router = Router();

router.get("/:address/:chainId", getUserDomains);

export default router;
