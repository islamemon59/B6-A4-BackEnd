import { Request, Response } from "express";
import { tutorServices } from "./tutor.service";

const createProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    const result = await tutorServices.createProfile(
      req.body,
      user.id as string,
    );

    res.status(201).json({
      success: true,
      message: "Profile successfully created",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    const result = await tutorServices.getProfile(user.id as string);

    res.status(201).json({
      success: true,
      message: "Profile retrieved successfully",
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

    const result = await tutorServices.updateProfile(
      req.body,
      user.id as string,
    );

    res.status(201).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const setAvailability = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    const result = await tutorServices.setAvailability(
      req.body,
      user.id as string,
    );

    res.status(201).json({
      success: true,
      message: "Availability slot Added",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const allAvailabilitySlot = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    const result = await tutorServices.allAvailabilitySlot(user.id);

    res.status(200).json({
      success: true,
      message: "Retrieved availability slot",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateAvailability = async (req: Request, res: Response) => {
  try {
    const { slotId } = req.params;
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    if (!slotId) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid availability id" });
    }
    const result = await tutorServices.updateAvailability(
      req.body,
      user.id as string,
      slotId as string,
    );

    res.status(200).json({
      success: true,
      message: "Availability slot updated",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const deleteAvailability = async (req: Request, res: Response) => {
  try {
    const { slotId } = req.params;
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    if (!slotId) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid availability id" });
    }
    const result = await tutorServices.deleteAvailability(
      user.id as string,
      slotId as string,
    );

    res.status(200).json({
      success: true,
      message: "Availability slot Deleted",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getMySessions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const data = await tutorServices.getMySessions(userId);

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to load sessions",
    });
  }
};

const markSessionCompleted = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { bookingId } = req.params;

    const data = await tutorServices.markSessionCompleted(
      userId,
      bookingId as string,
    );

    return res
      .status(200)
      .json({ success: true, message: "Session marked as completed", data });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to complete session",
    });
  }
};

const cancelSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { bookingId } = req.params;
    const { reason } = req.body;

    const data = await tutorServices.cancelSession(
      userId,
      bookingId as string,
      reason,
    );

    return res
      .status(200)
      .json({ success: true, message: "Session cancelled", data });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to cancel session",
    });
  }
};

const getMyReviews = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const data = await tutorServices.getMyReviews(userId);
    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to load reviews",
    });
  }
};

export const tutorController = {
  createProfile,
  getProfile,
  updateProfile,
  setAvailability,
  updateAvailability,
  deleteAvailability,
  allAvailabilitySlot,
  getMySessions,
  markSessionCompleted,
  cancelSession,
  getMyReviews,
};
