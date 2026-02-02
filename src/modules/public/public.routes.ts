import { Router } from "express";
import { publicController } from "./public.controller";

const router = Router()

router.get("/", publicController.getAllTutors)
export const publicRouter = router