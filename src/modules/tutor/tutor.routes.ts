import { Router } from "express";
import { tutorController } from "./tutor.controller";
import authMiddleware, { UserRole } from "../../middleware/middleware";

const router = Router();

router.post(
  "/tutor/profile",
  authMiddleware(UserRole.TUTOR),
  tutorController.createProfile,
);

export const tutorRouter = router;
