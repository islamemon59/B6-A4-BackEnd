import { TutorProfile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createProfile = async (
  payload: Omit<
    TutorProfile,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "userId"
    | "availabilitySlots"
    | "bookingsAsTutor"
    | "reviews"
    | "createdAt"
    | "updatedAt"
  >,
  id: string,
) => {
  return await prisma.tutorProfile.create({
    data: {
      ...payload,
      userId: id,
    },
  });
};

const updateProfile = async (payload: Partial<TutorProfile>, id: string) => {
  return await prisma.tutorProfile.update({
    where: {
      id,
    },
    data: payload,
  });
};

export const tutorServices = {
  createProfile,
  updateProfile,
};
