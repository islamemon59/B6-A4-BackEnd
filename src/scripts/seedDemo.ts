import "dotenv/config";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

type DemoUser = {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  image: string;
};

type DemoTutorProfile = {
  email: string;
  categoryName: string;
  headline: string;
  about: string;
  subjects: string[];
  meetingMode: "ONLINE" | "IN_PERSON" | "BOTH";
  hourlyRate: number;
  isFeatured?: boolean;
};

const demoUsers: DemoUser[] = [
  {
    name: "Nadia Rahman",
    email: "student.demo@skillbridge.dev",
    password: "SkillBridge123!",
    role: "STUDENT",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Farhan Kabir",
    email: "student.plus@skillbridge.dev",
    password: "SkillBridge123!",
    role: "STUDENT",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Aisha Karim",
    email: "student.pro@skillbridge.dev",
    password: "SkillBridge123!",
    role: "STUDENT",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Tanvir Hasan",
    email: "tutor.react@skillbridge.dev",
    password: "SkillBridge123!",
    role: "TUTOR",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Maliha Noor",
    email: "tutor.english@skillbridge.dev",
    password: "SkillBridge123!",
    role: "TUTOR",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Rezaul Alam",
    email: "tutor.data@skillbridge.dev",
    password: "SkillBridge123!",
    role: "TUTOR",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Sadia Islam",
    email: "tutor.design@skillbridge.dev",
    password: "SkillBridge123!",
    role: "TUTOR",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mahfuz Hossain",
    email: "tutor.math@skillbridge.dev",
    password: "SkillBridge123!",
    role: "TUTOR",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Priyanka Dutta",
    email: "tutor.ielts@skillbridge.dev",
    password: "SkillBridge123!",
    role: "TUTOR",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616c6d8f64d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Arif Chowdhury",
    email: "tutor.product@skillbridge.dev",
    password: "SkillBridge123!",
    role: "TUTOR",
    image:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Samira Ahmed",
    email: "tutor.ai@skillbridge.dev",
    password: "SkillBridge123!",
    role: "TUTOR",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
  },
];

const demoCategories = [
  {
    name: "Web Development",
    description:
      "Hands-on tutoring for React, Next.js, TypeScript, APIs, and portfolio-ready full stack projects.",
  },
  {
    name: "Spoken English",
    description:
      "Confidence-building sessions for conversation, vocabulary, pronunciation, and interview fluency.",
  },
  {
    name: "Data Science",
    description:
      "Applied learning in Python, SQL, analytics, machine learning, and storytelling with data.",
  },
  {
    name: "UI/UX Design",
    description:
      "Product thinking, Figma workflows, wireframes, interaction design, and case study coaching.",
  },
  {
    name: "Mathematics",
    description:
      "Structured support for algebra, calculus, problem solving, and exam preparation.",
  },
  {
    name: "IELTS Preparation",
    description:
      "Goal-based coaching for speaking, writing, reading, and listening with feedback loops.",
  },
  {
    name: "Product Management",
    description:
      "Mentorship on roadmaps, prioritization, stakeholder communication, and product strategy.",
  },
  {
    name: "AI Foundations",
    description:
      "Practical introduction to AI tools, prompting, automation, and responsible AI workflows.",
  },
];

const demoTutorProfiles: DemoTutorProfile[] = [
  {
    email: "tutor.react@skillbridge.dev",
    categoryName: "Web Development",
    headline: "React & Next.js mentor for real product-building practice",
    about:
      "I help learners move beyond tutorial loops by building polished, deployable products with React, Next.js, TypeScript, and modern APIs. Every session includes clear milestones, code review, and portfolio-focused feedback.",
    subjects: ["React", "Next.js", "TypeScript", "Node.js"],
    meetingMode: "ONLINE",
    hourlyRate: 1800,
    isFeatured: true,
  },
  {
    email: "tutor.english@skillbridge.dev",
    categoryName: "Spoken English",
    headline: "English speaking coach for confident interviews and meetings",
    about:
      "My sessions focus on practical communication, not memorized scripts. Students improve fluency, pronunciation, and confidence through guided speaking practice, role-play, and corrective feedback.",
    subjects: ["Conversation Practice", "Pronunciation", "Interview English"],
    meetingMode: "BOTH",
    hourlyRate: 1400,
    isFeatured: true,
  },
  {
    email: "tutor.data@skillbridge.dev",
    categoryName: "Data Science",
    headline: "Data mentor for analytics, dashboards, and machine learning basics",
    about:
      "I work with aspiring analysts and junior data professionals who want to get sharper with Python, SQL, EDA, and dashboard storytelling. We translate concepts into real business-style projects.",
    subjects: ["Python", "SQL", "Power BI", "Machine Learning"],
    meetingMode: "ONLINE",
    hourlyRate: 2200,
    isFeatured: true,
  },
  {
    email: "tutor.design@skillbridge.dev",
    categoryName: "UI/UX Design",
    headline: "UI/UX design tutor for portfolio-ready mobile and web case studies",
    about:
      "I guide students through structured product design workflows from discovery to polished UI. Sessions combine critique, systems thinking, accessibility, and Figma best practices.",
    subjects: ["Figma", "Wireframing", "Design Systems", "UX Research"],
    meetingMode: "ONLINE",
    hourlyRate: 2000,
    isFeatured: true,
  },
  {
    email: "tutor.math@skillbridge.dev",
    categoryName: "Mathematics",
    headline: "Math problem-solving tutor for school, college, and admission prep",
    about:
      "I simplify complex ideas with strong foundations, targeted drills, and step-by-step explanations. Students leave each class with clear strategies they can reuse independently.",
    subjects: ["Algebra", "Calculus", "Geometry", "Exam Prep"],
    meetingMode: "IN_PERSON",
    hourlyRate: 1300,
  },
  {
    email: "tutor.ielts@skillbridge.dev",
    categoryName: "IELTS Preparation",
    headline: "IELTS coach for band score improvement with feedback on every task",
    about:
      "I specialize in helping learners raise their IELTS band score through timed practice, speaking simulations, and detailed writing corrections. Plans are customized to target weak sections quickly.",
    subjects: ["IELTS Writing", "IELTS Speaking", "Mock Tests"],
    meetingMode: "ONLINE",
    hourlyRate: 1900,
  },
  {
    email: "tutor.product@skillbridge.dev",
    categoryName: "Product Management",
    headline: "Product management mentor for roadmap thinking and execution skills",
    about:
      "I support new product managers and founders who want to learn prioritization, requirement writing, experimentation, and stakeholder alignment through realistic product scenarios.",
    subjects: ["Roadmapping", "PRDs", "Prioritization", "Product Strategy"],
    meetingMode: "BOTH",
    hourlyRate: 2400,
  },
  {
    email: "tutor.ai@skillbridge.dev",
    categoryName: "AI Foundations",
    headline: "AI workflow tutor for prompt design, automation, and responsible use",
    about:
      "I teach practical AI fluency for students, freelancers, and teams. We focus on real use cases like prompt design, content workflows, research acceleration, and task automation.",
    subjects: ["Prompt Engineering", "Automation", "AI Tools", "Research Workflows"],
    meetingMode: "ONLINE",
    hourlyRate: 2100,
    isFeatured: true,
  },
];

function addDays(days: number, hour: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(hour, 0, 0, 0);
  return date;
}

async function ensureUser(user: DemoUser) {
  let existing = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!existing) {
    await auth.api.signUpEmail({
      body: {
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role,
      } as any,
    });

    existing = await prisma.user.findUnique({
      where: { email: user.email },
    });
  }

  if (!existing) {
    throw new Error(`Unable to create demo user: ${user.email}`);
  }

  return prisma.user.update({
    where: { id: existing.id },
    data: {
      name: user.name,
      role: user.role,
      status: "UNBAN",
      emailVerified: true,
      image: user.image,
    },
  });
}

async function ensureCategories() {
  const categoryMap = new Map<string, string>();

  for (const category of demoCategories) {
    const saved = await prisma.category.upsert({
      where: { name: category.name },
      update: {
        description: category.description,
        isActive: true,
      },
      create: {
        ...category,
        isActive: true,
      },
    });

    categoryMap.set(saved.name, saved.id);
  }

  return categoryMap;
}

async function ensureTutorProfiles(categoryMap: Map<string, string>) {
  const profiles = new Map<string, string>();

  for (const profile of demoTutorProfiles) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: profile.email },
    });

    const saved = await prisma.tutorProfile.upsert({
      where: { userId: user.id },
      update: {
        categoryId: categoryMap.get(profile.categoryName)!,
        headline: profile.headline,
        about: profile.about,
        subjects: profile.subjects,
        meetingMode: profile.meetingMode,
        hourlyRate: profile.hourlyRate,
        currency: "BDT",
        isFeatured: profile.isFeatured ?? false,
        profileStatus: "PUBLISHED",
      },
      create: {
        userId: user.id,
        categoryId: categoryMap.get(profile.categoryName)!,
        headline: profile.headline,
        about: profile.about,
        subjects: profile.subjects,
        meetingMode: profile.meetingMode,
        hourlyRate: profile.hourlyRate,
        currency: "BDT",
        isFeatured: profile.isFeatured ?? false,
        profileStatus: "PUBLISHED",
      },
    });

    profiles.set(profile.email, saved.id);
  }

  return profiles;
}

async function ensureAvailabilitySlots(profileIds: Map<string, string>) {
  for (const [email, tutorProfileId] of profileIds.entries()) {
    const existingSlots = await prisma.availabilitySlot.findMany({
      where: { tutorProfileId },
      orderBy: { startTime: "asc" },
    });

    if (existingSlots.length >= 2) {
      continue;
    }

    const slotPlan =
      email === "tutor.react@skillbridge.dev"
        ? [
            { startTime: addDays(1, 12), endTime: addDays(1, 13) },
            { startTime: addDays(3, 18), endTime: addDays(3, 19) },
          ]
        : email === "tutor.data@skillbridge.dev"
          ? [
              { startTime: addDays(2, 14), endTime: addDays(2, 15) },
              { startTime: addDays(4, 19), endTime: addDays(4, 20) },
            ]
          : [
              { startTime: addDays(2, 11), endTime: addDays(2, 12) },
              { startTime: addDays(5, 17), endTime: addDays(5, 18) },
            ];

    for (const slot of slotPlan) {
      const duplicate = await prisma.availabilitySlot.findFirst({
        where: {
          tutorProfileId,
          startTime: slot.startTime,
          endTime: slot.endTime,
        },
      });

      if (!duplicate) {
        await prisma.availabilitySlot.create({
          data: {
            tutorProfileId,
            startTime: slot.startTime,
            endTime: slot.endTime,
          },
        });
      }
    }
  }
}

async function ensureBookingWithOptionalReview(params: {
  studentEmail: string;
  tutorEmail: string;
  subject: string;
  startTime: Date;
  endTime: Date;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
  review?: { rating: number; comment: string };
  cancelledBy?: "STUDENT" | "TUTOR" | "ADMIN";
  cancelReason?: string;
}) {
  const student = await prisma.user.findUniqueOrThrow({
    where: { email: params.studentEmail },
  });
  const tutor = await prisma.user.findUniqueOrThrow({
    where: { email: params.tutorEmail },
    include: { tutorProfile: true },
  });

  if (!tutor.tutorProfile) {
    throw new Error(`Tutor profile missing for ${params.tutorEmail}`);
  }

  const booking = await prisma.booking.upsert({
    where: {
      id: `${student.id}-${tutor.tutorProfile.id}-${params.subject}-${params.startTime.toISOString()}`,
    },
    update: {
      status: params.status,
      cancelledBy: params.cancelledBy ?? null,
      cancelReason: params.cancelReason ?? null,
      isReviewed: Boolean(params.review),
    },
    create: {
      id: `${student.id}-${tutor.tutorProfile.id}-${params.subject}-${params.startTime.toISOString()}`,
      studentId: student.id,
      tutorProfileId: tutor.tutorProfile.id,
      categoryId: tutor.tutorProfile.categoryId,
      subject: params.subject,
      startTime: params.startTime,
      endTime: params.endTime,
      status: params.status,
      cancelledBy: params.cancelledBy ?? null,
      cancelReason: params.cancelReason ?? null,
      isReviewed: Boolean(params.review),
    },
  });

  if (params.review) {
    await prisma.review.upsert({
      where: { bookingId: booking.id },
      update: {
        rating: params.review.rating,
        comment: params.review.comment,
      },
      create: {
        bookingId: booking.id,
        tutorProfileId: tutor.tutorProfile.id,
        studentId: student.id,
        rating: params.review.rating,
        comment: params.review.comment,
      },
    });
  }
}

async function syncTutorRatings() {
  const tutors = await prisma.tutorProfile.findMany({
    select: { id: true },
  });

  for (const tutor of tutors) {
    const aggregate = await prisma.review.aggregate({
      where: { tutorProfileId: tutor.id },
      _avg: { rating: true },
      _count: { id: true },
    });

    await prisma.tutorProfile.update({
      where: { id: tutor.id },
      data: {
        ratingAvg: aggregate._avg.rating
          ? Number(aggregate._avg.rating.toFixed(1))
          : 0,
        ratingCount: aggregate._count.id,
      },
    });
  }
}

async function main() {
  for (const user of demoUsers) {
    await ensureUser(user);
  }

  const categoryMap = await ensureCategories();
  const profileIds = await ensureTutorProfiles(categoryMap);
  await ensureAvailabilitySlots(profileIds);

  await ensureBookingWithOptionalReview({
    studentEmail: "student.demo@skillbridge.dev",
    tutorEmail: "tutor.react@skillbridge.dev",
    subject: "Next.js",
    startTime: addDays(-5, 14),
    endTime: addDays(-5, 15),
    status: "COMPLETED",
    review: {
      rating: 5,
      comment:
        "Excellent mentor. We shipped a clean project plan and fixed deployment issues in one session.",
    },
  });

  await ensureBookingWithOptionalReview({
    studentEmail: "student.plus@skillbridge.dev",
    tutorEmail: "tutor.data@skillbridge.dev",
    subject: "SQL",
    startTime: addDays(-3, 16),
    endTime: addDays(-3, 17),
    status: "COMPLETED",
    review: {
      rating: 5,
      comment:
        "Very practical teaching style. I finally understood how to structure joins and dashboard-ready queries.",
    },
  });

  await ensureBookingWithOptionalReview({
    studentEmail: "student.pro@skillbridge.dev",
    tutorEmail: "tutor.design@skillbridge.dev",
    subject: "Design Systems",
    startTime: addDays(-2, 11),
    endTime: addDays(-2, 12),
    status: "COMPLETED",
    review: {
      rating: 4,
      comment:
        "Clear feedback and strong visual thinking. The critique helped my case study feel much more polished.",
    },
  });

  await ensureBookingWithOptionalReview({
    studentEmail: "student.demo@skillbridge.dev",
    tutorEmail: "tutor.english@skillbridge.dev",
    subject: "Interview English",
    startTime: addDays(2, 18),
    endTime: addDays(2, 19),
    status: "CONFIRMED",
  });

  await ensureBookingWithOptionalReview({
    studentEmail: "student.plus@skillbridge.dev",
    tutorEmail: "tutor.ai@skillbridge.dev",
    subject: "Prompt Engineering",
    startTime: addDays(4, 13),
    endTime: addDays(4, 14),
    status: "CONFIRMED",
  });

  await ensureBookingWithOptionalReview({
    studentEmail: "student.pro@skillbridge.dev",
    tutorEmail: "tutor.product@skillbridge.dev",
    subject: "Roadmapping",
    startTime: addDays(1, 10),
    endTime: addDays(1, 11),
    status: "CANCELLED",
    cancelledBy: "STUDENT",
    cancelReason: "Scheduling conflict",
  });

  await syncTutorRatings();

  const [users, tutors, categories, bookings, reviews] = await Promise.all([
    prisma.user.count(),
    prisma.tutorProfile.count(),
    prisma.category.count(),
    prisma.booking.count(),
    prisma.review.count(),
  ]);

  console.log(
    JSON.stringify(
      {
        seeded: true,
        demoLogin: {
          email: "student.demo@skillbridge.dev",
          password: "SkillBridge123!",
        },
        totals: { users, tutors, categories, bookings, reviews },
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error("Demo seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
