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
      include: {
        category: { select: { id: true, name: true } },
      },
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
    },
    include: {
      category: true,
    },
    take: 6,
  });
};

const getSingleTutor = async (id: string) => {
  return await prisma.tutorProfile.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      availabilitySlots: true,
      reviews:{
        orderBy: { createdAt: "desc" },
      }
    },
  });
};

export const publicServices = {
  getAllTutors,
  getFeaturedTutor,
  getSingleTutor,
};
