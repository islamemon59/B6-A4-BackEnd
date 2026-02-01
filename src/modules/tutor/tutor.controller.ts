import { Request, Response } from "express";
import { tutorServices } from "./tutor.service";
import { success } from "better-auth/*";

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

const updateProfile = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const result = await tutorServices.updateProfile(
      req.body,
      profileId as string,
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

export const tutorController = {
  createProfile,
  updateProfile,
  setAvailability,
  updateAvailability,
  deleteAvailability,
  allAvailabilitySlot
};
