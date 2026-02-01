import { Request, Response } from "express";
import { studentServices } from "./student.service";

const bookSession = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const { tutorProfileId, subject, startTime, endTime } = req.body;

    if (!tutorProfileId || !subject || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "tutorProfileId, subject, startTime, endTime are required",
      });
    }

    const parsedStart = new Date(startTime);
    const parsedEnd = new Date(endTime);

    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid startTime or endTime",
      });
    }

    if (parsedStart >= parsedEnd) {
      return res.status(400).json({
        success: false,
        message: "startTime must be before endTime",
      });
    }

    const result = await studentServices.bookSession(req.body, user.id);

    return res.status(201).json({
      success: true,
      message: "Session booked successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const { name, image } = req.body;

    if (!name && !image) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    const updatedUser = await studentServices.updateProfile(user.id, {
      name,
      image,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const studentController = {
  bookSession,
  updateProfile,
};
