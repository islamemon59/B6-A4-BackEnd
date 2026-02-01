import { Router } from "express";
import authMiddleware, { UserRole } from "../../middleware/middleware";
import { studentController } from "./student.controller";

const router = Router();

router.post(
  "/student/book-session",
  authMiddleware(UserRole.STUDENT),
  studentController.bookSession,
);

export const studentRouter = router;
