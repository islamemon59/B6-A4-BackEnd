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
  // ✅ pagination (recommended)
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(50, Math.max(1, Number(query.limit || 10)));
  const skip = (page - 1) * limit;

  // ✅ build WHERE
  const where: any = {
    profileStatus: "PUBLISHED", // only show published tutors
  };

  // category filter
  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  // subject filter (array contains)
  if (query.subject) {
    where.subjects = { has: query.subject };
  }

  // rating filter (min)
  if (query.minRating) {
    const r = Number(query.minRating);
    if (!Number.isNaN(r)) {
      // If you store ratingAvg use that instead.
      // You currently have ratingCount only; most apps store ratingAvg too.
      where.ratingAvg = { gte: r };
    }
  }

  // price range
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

  // search across headline/about + subjects
  if (query.q) {
    const q = query.q.trim();
    if (q) {
      where.OR = [
        { headline: { contains: q, mode: "insensitive" } },
        { about: { contains: q, mode: "insensitive" } },
        // subjects array search (Postgres only supports string[] contains via has/hasSome)
        { subjects: { has: q } }, // if someone searches "React"
      ];
    }
  }

  // ✅ sorting
  const sortBy: SortBy = query.sortBy || "latest";
  const sortOrder: SortOrder = query.sortOrder || "desc";

  const orderBy =
    sortBy === "price"
      ? { hourlyRate: sortOrder }
      : sortBy === "rating"
      ? { ratingAvg: sortOrder } // requires ratingAvg field
      : { createdAt: "desc" };

  // ✅ list + count together
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
    where:{
      isFeatured: true
    }
  })
}

export const publicServices = {
    getAllTutors,
    getFeaturedTutor,
}
