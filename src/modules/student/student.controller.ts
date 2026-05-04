import { Request, Response } from "express";
import { studentServices } from "./student.service";
import { Prisma } from "../../../generated/prisma/client";
//issue
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

const getAllTutors = async (req: Request, res: Response) => {
  try {
    const result = await studentServices.getAllTutors();
    res.status(200).json({
      success: true,
      message: "Tutors retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getMyBookings = async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user?.id;

    const result = await studentServices.getMyBookings(studentId);
    return res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to load bookings",
    });
  }
};

const createBooking = async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user?.id;
    const payload = req.body;

    const result = await studentServices.createBooking(studentId, payload);

    return res.status(201).json({
      success: true,
      message: "Booking successfully created",
      data: result,
    });
  } catch (err: any) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      
      const target = (err.meta as any)?.target;

      if (Array.isArray(target) && target.includes("availabilitySlotId")) {
        return res.status(409).json({
          success: false,
          message: "This slot is already booked. Please choose another slot.",
        });
      }

      return res.status(409).json({
        success: false,
        message: "Duplicate value. Please try again.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to create booking",
    });
  }
};

const cancelBooking = async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user?.id;
    const { bookingId } = req.params;
    const { reason } = req.body;

    const result = await studentServices.cancelBooking(
      studentId,
      bookingId as string,
      reason,
    );
    return res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to cancel booking",
    });
  }
};

const createReview = async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user?.id;
    const result = await studentServices.createReview(studentId, req.body);

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: result,
    });
  } catch (err: any) {
  
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "You already reviewed this booking.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to submit review",
    });
  }
};

export const studentController = {
  bookSession,
  updateProfile,
  getAllTutors,
  createBooking,
  getMyBookings,
  cancelBooking,
  createReview
};
