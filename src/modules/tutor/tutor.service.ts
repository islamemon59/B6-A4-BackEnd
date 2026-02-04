import {
  AvailabilitySlot,
  TutorProfile,
} from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

async function getTutorProfileIdByUserId(userId: string) {
  if (!userId) throw new Error("Unauthorized");

  const tutorProfile = await prisma.tutorProfile.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (!tutorProfile) throw new Error("Tutor profile not found");
  return tutorProfile.id;
}

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

const getMySessions = async (userId: string) => {
  const tutorProfileId = await getTutorProfileIdByUserId(userId);

  const where: any = { tutorProfileId };

  return prisma.booking.findMany({
    where,
    orderBy: { startTime: "desc" },
    select: {
      id: true,
      subject: true,
      startTime: true,
      endTime: true,
      status: true,
      isReviewed: true,
      studentId: true,
      cancelReason: true,
      createdAt: true,
    },
  });
};

const markSessionCompleted = async (userId: string, bookingId: string) => {
  const tutorProfileId = await getTutorProfileIdByUserId(userId);

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, tutorProfileId },
    select: { id: true, status: true, endTime: true },
  });

  if (!booking) throw new Error("Session not found");
  if (booking.status === "CANCELLED")
    throw new Error("Cancelled session cannot be completed");

  // Optional rule: only after session end
  if (new Date(booking.endTime).getTime() > Date.now()) {
    throw new Error("You can complete the session only after it ends");
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: "COMPLETED" },
  });
};

const cancelSession = async (
  userId: string,
  bookingId: string,
  reason?: string,
) => {
  const tutorProfileId = await getTutorProfileIdByUserId(userId);

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, tutorProfileId },
    select: {
      id: true,
      status: true,
      availabilitySlotId: true,
      startTime: true,
    },
  });

  if (!booking) throw new Error("Session not found");
  if (booking.status === "CANCELLED")
    throw new Error("Session already cancelled");

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CANCELLED",
      cancelledBy: "TUTOR",
      cancelReason: reason || null,
    },
  });

  // Optional: free slot again
  if (booking.availabilitySlotId) {
    await prisma.availabilitySlot.update({
      where: { id: booking.availabilitySlotId },
      data: { isBooked: false },
    });
  }

  return updated;
};

const getMyReviews = async (userId: string) => {
  const tutorProfileId = await getTutorProfileIdByUserId(userId);

  return prisma.review.findMany({
    where: { tutorProfileId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      booking: {
        select: {
          id: true,
          subject: true,
          startTime: true,
        },
      },
      studentId: true,
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
  getMyReviews,
  cancelSession,
  markSessionCompleted,
  getMySessions,
};
