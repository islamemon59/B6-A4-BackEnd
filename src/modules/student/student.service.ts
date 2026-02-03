import { Booking } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { CreateBookingPayload } from "../../types";

const bookSession = async (
  payload: Omit<
    Booking,
    | "id"
    | "studentId"
    | "status"
    | "cancelledBy"
    | "isReviewed"
    | "review"
    | "createdAt"
    | "updatedAt"
  >,
  studentId: string,
) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: payload.tutorProfileId },
  });
  if (!tutorProfile) throw new Error("Tutor profile not found");

  if (payload.availabilitySlotId) {
    return prisma.$transaction(async (tx) => {
      const slot = await tx.availabilitySlot.findUnique({
        where: { id: payload.availabilitySlotId! },
      });

      if (!slot) throw new Error("Slot not found");
      if (slot.isBooked) throw new Error("Slot already booked");
      if (slot.tutorProfileId !== payload.tutorProfileId) {
        throw new Error("Slot does not belong to this tutor");
      }

      //   if (
      //     slot.startTime.getTime() !== new Date(payload.startTime).getTime() ||
      //     slot.endTime.getTime() !== new Date(payload.endTime).getTime()
      //   ) {
      //     throw new Error("Booking time must match the slot time");
      //   }

      const booking = await tx.booking.create({
        data: {
          studentId,
          tutorProfileId: payload.tutorProfileId,
          categoryId: payload.categoryId,
          availabilitySlotId: payload.availabilitySlotId,
          subject: payload.subject,
          startTime: payload.startTime,
          endTime: payload.endTime,
        },
      });

      await tx.availabilitySlot.update({
        where: { id: payload.availabilitySlotId! },
        data: { isBooked: true },
      });

      return booking;
    });
  }
};

const updateProfile = async (
  userId: string,
  payload: { name: string; image: string },
) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      ...(payload.name && { name: payload.name }),
      ...(payload.image && { image: payload.image }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const getAllTutors = async () => {
  return await prisma.tutorProfile.findMany({
    include: {
      category: true,
      availabilitySlots: true,
    },
  });
};

const createBooking = async (
  studentId: string,
  payload: CreateBookingPayload,
) => {
  const { tutorProfileId, availabilitySlotId, subject } = payload;

  if (!studentId) {
    throw new Error("Unauthorized");
  }

  if (!tutorProfileId || !availabilitySlotId || !subject) {
    throw new Error(
      "tutorProfileId, availabilitySlotId and subject are required",
    );
  }

  return await prisma.$transaction(async (tx) => {
    const slot = await tx.availabilitySlot.findFirst({
      where: {
        id: availabilitySlotId,
        tutorProfileId,
      },
    });

    if (!slot) throw new Error("Slot not found for this tutor");
    if (slot.isBooked) throw new Error("This slot is already booked");

    const tutor = await tx.tutorProfile.findUnique({
      where: {
        id: tutorProfileId,
      },
      select: { id: true, categoryId: true },
    });

    if (!tutor) throw new Error("Tutor profile not found");

    const booking = await tx.booking.create({
      data: {
        studentId,
        tutorProfileId,
        availabilitySlotId,
        categoryId: tutor.categoryId ?? null,

        subject,
        startTime: slot.startTime,
        endTime: slot.endTime,

        status: "CONFIRMED",
      },
      include: {
        tutorProfile: {
          select: {
            id: true,
            headline: true,
            hourlyRate: true,
            currency: true,
            meetingMode: true,
            subjects: true,
            userId: true,
            category: { select: { id: true, name: true } },
          },
        },
        availabilitySlot: true,
      },
    });

    // 4) mark slot booked
    await tx.availabilitySlot.update({
      where: { id: availabilitySlotId },
      data: { isBooked: true },
    });

    return booking;
  });
};

export const studentServices = {
  bookSession,
  updateProfile,
  getAllTutors,
  createBooking,
};
