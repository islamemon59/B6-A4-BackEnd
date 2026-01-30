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

export const adminController = {
  createCategory,
};
