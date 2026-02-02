import { Router } from "express";
import { publicController } from "./public.controller";

const router = Router()

router.get("/", publicController.getAllTutors)

router.get("/public/tutor/:tutorId", publicController.getSingleTutor)

router.get("/public/featured-tutor", publicController.getFeaturedTutor);

export const publicRouter = router