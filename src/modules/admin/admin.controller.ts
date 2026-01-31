import { Request, Response } from "express";
import { adminServices } from "./admin.service";

const createCategory = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.json({ success: false, message: "Input valid user id" });
    }
    const result = await adminServices.updateUserStatus(
      req.body.status,
      userId as string,
    );
    res.status(201).json({
      success: true,
      message: "User status updated",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const adminController = {
  createCategory,
  getAllUsers,
  updateUserStatus,
};
