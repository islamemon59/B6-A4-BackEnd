import { Router } from "express";
import authMiddleware, { UserRole } from "../../middleware/middleware";
import { adminController } from "./admin.controller";

const router = Router();

router.get(
  "/users",
  authMiddleware(UserRole.ADMIN),
  adminController.getAllUsers,
);

router.post(
  "/categories",
  authMiddleware(UserRole.ADMIN),
  adminController.createCategory,
);

router.patch(
  "/update-status/:userId",
  authMiddleware(UserRole.ADMIN),
  adminController.updateUserStatus,
);

export const adminRouter = router;
