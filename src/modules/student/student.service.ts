import { Booking } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type { CreateBookingPayload, CreateReviewPayload } from "../../../types";

const syncTutorRating = async (
  tx: typeof prisma,
  tutorProfileId: string,
) => {
  const aggregate = await tx.review.aggregate({
    where: { tutorProfileId },
    _avg: { rating: true },
    _count: { id: true },
  });

  await tx.tutorProfile.update({
    where: { id: tutorProfileId },
    data: {
      ratingAvg: aggregate._avg.rating
        ? Number(aggregate._avg.rating.toFixed(1))
        : 0,
      ratingCount: aggregate._count.id,
    },
  });
};

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
    where: {
      profileStatus: "PUBLISHED",
    },
    orderBy: [{ isFeatured: "desc" }, { ratingAvg: "desc" }, { createdAt: "desc" }],
    include: {
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      availabilitySlots: {
        orderBy: {
          startTime: "asc",
        },
      },
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
            ratingAvg: true,
            ratingCount: true,
            meetingMode: true,
            subjects: true,
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            category: { select: { id: true, name: true, description: true } },
          },
        },
        availabilitySlot: true,
      },
    });

    await tx.availabilitySlot.update({
      where: { id: availabilitySlotId },
      data: { isBooked: true },
    });

    return booking;
  });
};

const getMyBookings = async (studentId: string) => {
  if (!studentId) throw new Error("Unauthorized");

  return await prisma.booking.findMany({
    where: { studentId },
    orderBy: { startTime: "desc" },
    include: {
      tutorProfile: {
        select: {
          id: true,
          headline: true,
          hourlyRate: true,
          currency: true,
          ratingAvg: true,
          ratingCount: true,
          meetingMode: true,
          subjects: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: { select: { id: true, name: true, description: true } },
        },
      },
      availabilitySlot: true,
    },
  });
};

const cancelBooking = async (
  studentId: string,
  bookingId: string,
  reason?: string,
) => {
  if (!studentId) throw new Error("Unauthorized");
  if (!bookingId) throw new Error("bookingId is required");

  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findFirst({
      where: { id: bookingId, studentId },
      select: {
        id: true,
        status: true,
        availabilitySlotId: true,
        startTime: true,
      },
    });

    if (!booking) throw new Error("Booking not found");
    if (booking.status === "CANCELLED")
      throw new Error("Booking already cancelled");

    if (new Date(booking.startTime).getTime() < Date.now()) {
      throw new Error("You can’t cancel a booking that already started");
    }

    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        cancelledBy: "STUDENT",
        cancelReason: reason || null,
      },
    });

    if (booking.availabilitySlotId) {
      await tx.availabilitySlot.update({
        where: { id: booking.availabilitySlotId },
        data: { isBooked: false },
      });
    }

    return updated;
  });
};

const createReview = async (
  studentId: string,
  payload: CreateReviewPayload,
) => {
  if (!studentId) throw new Error("Unauthorized");

  const { bookingId, rating, comment } = payload;

  if (!bookingId) throw new Error("bookingId is required");
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("rating must be an integer between 1 and 5");
  }

  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findFirst({
      where: { id: bookingId, studentId },
      select: {
        id: true,
        status: true,
        isReviewed: true,
        tutorProfileId: true,
      },
    });

    if (!booking) throw new Error("Booking not found");
    if (booking.status !== "COMPLETED") {
      throw new Error("You can review only after the session is completed.");
    }
    if (booking.isReviewed)
      throw new Error("This booking is already reviewed.");

    const review = await tx.review.create({
      data: {
        bookingId,
        studentId,
        tutorProfileId: booking.tutorProfileId,
        rating,
        comment: comment?.trim() || null,
      },
    });

    await tx.booking.update({
      where: { id: bookingId },
      data: { isReviewed: true },
    });

    await syncTutorRating(tx, booking.tutorProfileId);

    return review;
  });
};

export const studentServices = {
  bookSession,
  updateProfile,
  getAllTutors,
  createBooking,
  getMyBookings,
  cancelBooking,
  createReview,
};
