import { Router } from "express";
import authMiddleware, { UserRole } from "../../middleware/middleware";
import { adminController } from "./admin.controller";

const router = Router()

router.post("/categories", authMiddleware(UserRole.ADMIN), adminController.createCategory)

export const adminRouter = router;