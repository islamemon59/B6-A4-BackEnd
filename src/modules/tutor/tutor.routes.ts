import { Router } from "express";
import { tutorController } from "./tutor.controller";
import authMiddleware from "../../middleware/middleware";
import { UserRole } from "../../types";

const router =  Router();

router.post("/tutor/profile", authMiddleware(UserRole.TUTOR), tutorController.createProfile)

export const tutorRouter = router;