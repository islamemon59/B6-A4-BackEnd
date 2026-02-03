import {
  AvailabilitySlot,
  TutorProfile,
} from "../../../generated/prisma/client";
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

const getProfile = async (id: string) => {
  return await prisma.tutorProfile.findUnique({
    where: {
      userId: id,
    },
  });
};

const updateProfile = async (payload: Partial<TutorProfile>, id: string) => {
  return await prisma.tutorProfile.update({
    where: {
      userId: id,
    },
    data: payload,
  });
};

const setAvailability = async (
  payload: Omit<AvailabilitySlot, "id" | "createdAt" | "updatedAt">,
  userId: string,
) => {
  const { startTime, endTime } = payload;

  if (!startTime || !endTime) {
    throw new Error("Start time and end time are required");
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) {
    throw new Error("End time must be after start time");
  }

  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }

  const overlapping = await prisma.availabilitySlot.findFirst({
    where: {
      tutorProfileId: tutorProfile.id,
      isBooked: false,
      OR: [
        {
          startTime: { lt: end },
          endTime: { gt: start },
        },
      ],
    },
  });

  if (overlapping) {
    throw new Error("This time slot overlaps with an existing slot");
  }

  return prisma.availabilitySlot.create({
    data: {
      tutorProfileId: tutorProfile.id,
      startTime: start,
      endTime: end,
    },
  });
};

const allAvailabilitySlot = async (id: string) => {
  const tutorProfile = await prisma.tutorProfile.findFirstOrThrow({
    where: {
      userId: id,
    },
    select: {
      id: true,
    },
  });

  return await prisma.availabilitySlot.findMany({
    where: {
      tutorProfileId: tutorProfile.id,
    },
  });
};

const updateAvailability = async (
  payload: Partial<AvailabilitySlot>,
  id: string,
  slotId: string,
) => {
  await prisma.tutorProfile.findFirstOrThrow({
    where: {
      userId: id,
    },
    select: {
      id: true,
    },
  });

  return await prisma.availabilitySlot.update({
    where: {
      id: slotId,
    },
    data: payload,
  });
};

const deleteAvailability = async (id: string, slotId: string) => {
  await prisma.tutorProfile.findFirstOrThrow({
    where: {
      userId: id,
    },
    select: {
      id: true,
    },
  });

  return await prisma.availabilitySlot.delete({
    where: {
      id: slotId,
    },
  });
};

export const tutorServices = {
  createProfile,
  getProfile,
  updateProfile,
  setAvailability,
  updateAvailability,
  deleteAvailability,
  allAvailabilitySlot,
};
