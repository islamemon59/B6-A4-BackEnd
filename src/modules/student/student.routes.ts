import { Router } from "express";
import authMiddleware, { UserRole } from "../../middleware/middleware";
import { studentController } from "./student.controller";

const router = Router();

router.post(
  "/student/book-session",
  authMiddleware(UserRole.STUDENT),
  studentController.bookSession,
);

router.get(
  "/student/all-tutor",
  authMiddleware(UserRole.STUDENT),
  studentController.getAllTutors,
);

router.post(
  "/student/create-booking",
  authMiddleware(UserRole.STUDENT),
  studentController.createBooking,
);

router.patch(
  "/users/me",
  authMiddleware(
    UserRole.ADMIN,
    UserRole.STUDENT,
    UserRole.TUTOR,
    UserRole.USER,
  ),
  studentController.updateProfile,
);

export const studentRouter = router;
