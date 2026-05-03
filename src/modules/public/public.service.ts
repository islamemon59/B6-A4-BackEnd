import { prisma } from "../../lib/prisma";

type SortBy = "rating" | "price" | "latest";
type SortOrder = "asc" | "desc";

type TutorQuery = {
  q?: string;
  subject?: string;
  categoryId?: string;

  minRating?: string;
  minPrice?: string;
  maxPrice?: string;
  orderBy?: string;
  sortBy?: SortBy;
  sortOrder?: SortOrder;

  page?: string;
  limit?: string;
};

const tutorCardSelect = {
  id: true,
  userId: true,
  headline: true,
  about: true,
  subjects: true,
  meetingMode: true,
  hourlyRate: true,
  currency: true,
  ratingAvg: true,
  ratingCount: true,
  isFeatured: true,
  profileStatus: true,
  createdAt: true,
  updatedAt: true,
  categoryId: true,
  category: {
    select: {
      id: true,
      name: true,
      description: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
    },
  },
} as const;

const getAllTutors = async (query: TutorQuery) => {
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(50, Math.max(1, Number(query.limit || 10)));
  const skip = (page - 1) * limit;

  const where: any = {
    profileStatus: "PUBLISHED",
  };

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query.subject) {
    where.subjects = { has: query.subject };
  }

  if (query.minRating) {
    const r = Number(query.minRating);
    if (!Number.isNaN(r)) {
      where.ratingAvg = { gte: r };
    }
  }

  if (query.minPrice || query.maxPrice) {
    where.hourlyRate = {};
    if (query.minPrice) {
      const min = Number(query.minPrice);
      if (!Number.isNaN(min)) where.hourlyRate.gte = min;
    }
    if (query.maxPrice) {
      const max = Number(query.maxPrice);
      if (!Number.isNaN(max)) where.hourlyRate.lte = max;
    }
  }

  if (query.q) {
    const q = query.q.trim();
    if (q) {
      where.OR = [
        { headline: { contains: q, mode: "insensitive" } },
        { about: { contains: q, mode: "insensitive" } },
        
        { subjects: { has: q } },
      ];
    }
  }

  const sortBy: SortBy = query.sortBy || "latest";
  const sortOrder: SortOrder = query.sortOrder || "desc";

  const orderBy =
    sortBy === "price"
      ? { hourlyRate: sortOrder }
      : sortBy === "rating"
        ? { ratingAvg: sortOrder }
        : { createdAt: sortOrder };

  const [data, total] = await prisma.$transaction([
    prisma.tutorProfile.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: tutorCardSelect,
    }),
    prisma.tutorProfile.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};

const getFeaturedTutor = async () => {
  return await prisma.tutorProfile.findMany({
    where: {
      isFeatured: true,
      profileStatus: "PUBLISHED",
    },
    select: tutorCardSelect,
    take: 6,
    orderBy: [{ ratingAvg: "desc" }, { createdAt: "desc" }],
  });
};

const getSingleTutor = async (id: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      category: true,
      availabilitySlots: {
        orderBy: { startTime: "asc" },
      },
      reviews: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!tutor) {
    return null;
  }

  const relatedTutors = await prisma.tutorProfile.findMany({
    where: {
      profileStatus: "PUBLISHED",
      categoryId: tutor.categoryId,
      id: { not: tutor.id },
    },
    select: tutorCardSelect,
    take: 4,
    orderBy: [{ ratingAvg: "desc" }, { createdAt: "desc" }],
  });

  return {
    ...tutor,
    relatedTutors,
  };
};

const getPublicCategories = async () => {
  return prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      _count: {
        select: {
          tutorProfiles: true,
        },
      },
    },
  });
};

const getHomeMetrics = async () => {
  const [tutors, categories, completedBookings, featuredTutors, rating] =
    await Promise.all([
      prisma.tutorProfile.count({
        where: {
          profileStatus: "PUBLISHED",
        },
      }),
      prisma.category.count({
        where: {
          isActive: true,
        },
      }),
      prisma.booking.count({
        where: {
          status: "COMPLETED",
        },
      }),
      prisma.tutorProfile.count({
        where: {
          isFeatured: true,
          profileStatus: "PUBLISHED",
        },
      }),
      prisma.tutorProfile.aggregate({
        where: {
          profileStatus: "PUBLISHED",
        },
        _avg: {
          ratingAvg: true,
        },
      }),
    ]);

  return {
    tutors,
    categories,
    completedBookings,
    featuredTutors,
    averageRating: Number((rating._avg.ratingAvg || 0).toFixed(1)),
  };
};

export const publicServices = {
  getAllTutors,
  getFeaturedTutor,
  getSingleTutor,
  getPublicCategories,
  getHomeMetrics,
};
