import { Router } from "express";
import authMiddleware, { UserRole } from "../../middleware/middleware";
import { adminController } from "./admin.controller";

const router = Router();

router.get(
  "/admin/users",
  authMiddleware(UserRole.ADMIN),
  adminController.getAllUsers,
);

router.get(
  "/admin/bookings",
  authMiddleware(UserRole.ADMIN),
  adminController.getAllBookings,
);

router.get(
  "/admin/categories/:categoryId",
  authMiddleware(UserRole.ADMIN),
  adminController.getSingleCategory,
);

router.get(
  "/categories",
  authMiddleware(),
  adminController.getAllCategories,
);

router.post(
  "/admin/categories",
  authMiddleware(UserRole.ADMIN),
  adminController.createCategory,
);

router.patch(
  "/admin/update-status/:userId",
  authMiddleware(UserRole.ADMIN),
  adminController.updateUserStatus,
);

router.patch(
  "/admin/categories/:categoryId",
  authMiddleware(UserRole.ADMIN),
  adminController.updateCategory,
);

router.delete(
  "/admin/categories/:categoryId",
  authMiddleware(UserRole.ADMIN),
  adminController.deleteCategory,
);

export const adminRouter = router;
