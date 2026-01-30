import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (
  payload: Omit<
    Category,
    "id" | "isActive" | "createdAt" | "updatedAt" | "tutorProfiles" | "bookings"
  >,
) => {
  return await prisma.category.create({
    data: payload,
  });
};
export const adminServices = {
  createCategory,
};
