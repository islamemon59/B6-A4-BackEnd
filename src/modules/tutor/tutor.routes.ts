import { Router } from "express";
import { tutorController } from "./tutor.controller";
import authMiddleware, { UserRole } from "../../middleware/middleware";

const router = Router();

router.get(
  "/tutor/all-slot",
  authMiddleware(UserRole.TUTOR),
  tutorController.allAvailabilitySlot,
);

router.get(
  "/tutor/profile",
  authMiddleware(UserRole.TUTOR),
  tutorController.getProfile,
);

router.post(
  "/tutor/create-profile",
  authMiddleware(UserRole.TUTOR),
  tutorController.createProfile,
);

router.post(
  "/tutor/create-slot",
  authMiddleware(UserRole.TUTOR),
  tutorController.setAvailability,
);

router.patch(
  "/tutor/update-slot/:slotId",
  authMiddleware(UserRole.TUTOR),
  tutorController.updateAvailability,
);

router.patch(
  "/tutor/update-profile",
  authMiddleware(UserRole.TUTOR),
  tutorController.updateProfile,
);

router.delete(
  "/tutor/delete-slot/:slotId",
  authMiddleware(UserRole.TUTOR),
  tutorController.deleteAvailability,
);

export const tutorRouter = router;
