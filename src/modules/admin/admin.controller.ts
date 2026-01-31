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

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.getAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.json({ success: false, message: "Input valid category id" });
    }
    const result = await adminServices.updateCategory(
      req.body,
      categoryId as string,
    );
    res.status(201).json({
      success: true,
      message: "Category updated",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getSingleCategory = async (req: Request, res: Response) => {
  try {
    console.log("hello");
    const { categoryId } = req.params;
    console.log(categoryId);
    if (!categoryId) {
      return res.json({ success: false, message: "Input valid category id" });
    }
    const result = await adminServices.getSingleCategory(
      categoryId as string,
    );
    res.status(201).json({
      success: true,
      message: "Category retrieved successfully",
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
  getAllCategories,
  updateCategory,
  getSingleCategory
};
