import { Request, Response } from "express";
import { publicServices } from "./public.service";

const getAllTutors = async (req: Request, res: Response) => {
  try {
    const result = await publicServices.getAllTutors(req.query);

    res.status(200).json({
      success: true,
      message: "Tutors fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getFeaturedTutor = async (req: Request, res: Response) => {
  try {
    const result = await publicServices.getFeaturedTutor();

    res.status(200).json({
      success: true,
      message: "Featured tutor fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}

export const publicController = { getAllTutors, getFeaturedTutor };
