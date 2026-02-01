import { Booking } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

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

      if (
        slot.startTime.getTime() !== new Date(payload.startTime).getTime() ||
        slot.endTime.getTime() !== new Date(payload.endTime).getTime()
      ) {
        throw new Error("Booking time must match the slot time");
      }

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

export const studentServices = {
  bookSession,
};
