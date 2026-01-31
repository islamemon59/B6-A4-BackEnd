import { Category, User } from "../../../generated/prisma/client";
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

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

const updateUserStatus = async (status: string, id: string) => {
  const allowed = ["BAN", "UNBAN"];
  if (!status || typeof status !== "string" || !allowed.includes(status)) {
    throw new Error(`Invalid status. Allowed: ${allowed.join(", ")}`);
  }
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
};

export const adminServices = {
  createCategory,
  getAllUsers,
  updateUserStatus,
};
