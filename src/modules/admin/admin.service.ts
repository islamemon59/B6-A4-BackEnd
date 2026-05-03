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
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const getAllBookings = async () => {
  return await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tutorProfile: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          category: true,
        },
      },
      availabilitySlot: true,
    },
  });
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

const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          tutorProfiles: true,
          bookings: true,
        },
      },
    },
  });
};

const updateCategory = async (payload: Partial<Category>, id: string) => {
  return await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });
};

const getSingleCategory = async (id: string) => {
  return await prisma.category.findUnique({
    where: {
      id,
    },
  });
};

const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: {
      id,
    },
  });
};

export const adminServices = {
  createCategory,
  getAllUsers,
  getAllBookings,
  updateUserStatus,
  getAllCategories,
  updateCategory,
  getSingleCategory,
  deleteCategory,
};
