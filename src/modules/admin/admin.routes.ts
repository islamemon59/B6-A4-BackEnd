import { Router } from "express";
import authMiddleware, { UserRole } from "../../middleware/middleware";
import { adminController } from "./admin.controller";

const router = Router();

router.get(
  "/users",
  authMiddleware(UserRole.ADMIN),
  adminController.getAllUsers,
);

router.get(
  "/categories/:categoryId",
  authMiddleware(UserRole.ADMIN),
  adminController.getSingleCategory,
);

router.get(
  "/categories",
  authMiddleware(),
  adminController.getAllCategories,
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

router.patch(
  "/categories/:categoryId",
  authMiddleware(UserRole.ADMIN),
  adminController.updateCategory,
);

router.delete(
  "/categories/:categoryId",
  authMiddleware(UserRole.ADMIN),
  adminController.deleteCategory,
);

export const adminRouter = router;
