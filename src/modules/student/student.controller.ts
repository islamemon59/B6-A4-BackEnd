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

    // ✅ Basic required fields check
    const {
      tutorProfileId,
      subject,
      startTime,
      endTime,
      availabilitySlotId,
      categoryId,
    } = req.body;

    if (!tutorProfileId || !subject || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "tutorProfileId, subject, startTime, endTime are required",
      });
    }

    // ✅ Parse dates
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

export const studentController = {
  bookSession,
};
