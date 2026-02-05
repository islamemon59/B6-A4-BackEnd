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

router.get(
  "/student/my-bookings",
  authMiddleware(UserRole.STUDENT),
  studentController.getMyBookings,
);

router.post(
  "/student/create-booking",
  authMiddleware(UserRole.STUDENT),
  studentController.createBooking,
);

router.post(
  "/student/create-review",
  authMiddleware(UserRole.STUDENT),
  studentController.createReview,
);

router.patch(
  "/student/cancel-booking/:bookingId",
  authMiddleware(UserRole.STUDENT),
  studentController.cancelBooking,
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
