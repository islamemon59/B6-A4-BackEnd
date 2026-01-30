import { Request, Response } from "express";
import { tutorServices } from "./tutor.service";

const createProfile = async (req: Request, res: Response) => {
  try {
    const result = await tutorServices.createProfile();

    res
      .status(201)
      .json({
        success: true,
        message: "Profile successfully created",
        data: result,
      });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const tutorController = {
  createProfile,
};
