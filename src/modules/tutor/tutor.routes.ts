import { Router } from "express";
import { tutorController } from "./tutor.controller";
import authMiddleware, { UserRole } from "../../middleware/middleware";

const router = Router();

router.post(
  "/tutor/profile",
  authMiddleware(UserRole.TUTOR),
  tutorController.createProfile,
);

router.post("/tutor/availability", authMiddleware(UserRole.TUTOR), tutorController.setAvailability)

router.patch(
  "/tutor/:profileId",
  authMiddleware(UserRole.TUTOR),
  tutorController.updateProfile,
);

export const tutorRouter = router;
