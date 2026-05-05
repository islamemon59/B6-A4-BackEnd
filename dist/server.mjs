var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { getOAuthState } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import "process";
import * as path from "path";
import { fileURLToPath } from "url";
import "@prisma/client/runtime/client";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Booking {\n  id String @id @default(uuid())\n\n  studentId      String\n  student        User         @relation("StudentBookings", fields: [studentId], references: [id], onDelete: Cascade)\n  tutorProfileId String\n  tutorProfile   TutorProfile @relation(fields: [tutorProfileId], references: [id], onDelete: Cascade)\n\n  categoryId String?\n  category   Category? @relation(fields: [categoryId], references: [id])\n\n  availabilitySlotId String?           @unique\n  availabilitySlot   AvailabilitySlot? @relation(fields: [availabilitySlotId], references: [id], onDelete: SetNull)\n\n  subject   String\n  startTime DateTime\n  endTime   DateTime\n\n  status       BookingStatus @default(CONFIRMED)\n  cancelledBy  CancelledBy?\n  cancelReason String?\n\n  isReviewed Boolean @default(false)\n  review     Review?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([studentId])\n  @@index([tutorProfileId])\n  @@index([status])\n  @@index([startTime])\n  @@map("bookings")\n}\n\nenum BookingStatus {\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\nenum CancelledBy {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nmodel Category {\n  id            String         @id @default(uuid())\n  name          String         @unique\n  description   String\n  isActive      Boolean        @default(true)\n  tutorProfiles TutorProfile[]\n  bookings      Booking[]\n  createdAt     DateTime       @default(now())\n  updatedAt     DateTime       @updatedAt\n\n  @@map("categories")\n}\n\nmodel AvailabilitySlot {\n  id String @id @default(uuid())\n\n  tutorProfileId String\n  tutorProfile   TutorProfile @relation(fields: [tutorProfileId], references: [id], onDelete: Cascade)\n  startTime      DateTime\n  endTime        DateTime\n  isBooked       Boolean      @default(false)\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n  booking        Booking?\n\n  @@index([tutorProfileId])\n  @@index([startTime])\n  @@map("availability_slots")\n}\n\nmodel Review {\n  id String @id @default(uuid())\n\n  bookingId String  @unique\n  booking   Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  studentId String\n  student   User   @relation("StudentReviews", fields: [studentId], references: [id], onDelete: Cascade)\n\n  tutorProfileId String\n  tutorProfile   TutorProfile @relation(fields: [tutorProfileId], references: [id], onDelete: Cascade)\n\n  rating  Int\n  comment String? @db.Text\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([tutorProfileId])\n  @@map("reviews")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel TutorProfile {\n  id                String             @id @default(uuid())\n  userId            String             @unique\n  user              User               @relation(fields: [userId], references: [id], onDelete: Cascade)\n  categoryId        String\n  category          Category           @relation(fields: [categoryId], references: [id])\n  headline          String\n  about             String\n  subjects          String[]\n  meetingMode       MeetingMode        @default(ONLINE)\n  hourlyRate        Float\n  currency          String             @default("BDT")\n  ratingAvg         Float              @default(0)\n  ratingCount       Int                @default(0)\n  isFeatured        Boolean            @default(false)\n  profileStatus     ProfileStatus      @default(PUBLISHED)\n  availabilitySlots AvailabilitySlot[]\n  bookingsAsTutor   Booking[]\n  reviews           Review[]\n  createdAt         DateTime           @default(now())\n  updatedAt         DateTime           @updatedAt\n\n  @@index([categoryId])\n  @@map("tutor_profiles")\n}\n\nenum MeetingMode {\n  ONLINE\n  IN_PERSON\n  BOTH\n}\n\nenum ProfileStatus {\n  DRAFT\n  PUBLISHED\n}\n\nmodel User {\n  id              String        @id\n  name            String\n  email           String\n  emailVerified   Boolean       @default(true)\n  role            String        @default("USER")\n  status          String        @default("UNBAN")\n  image           String?\n  createdAt       DateTime      @default(now())\n  updatedAt       DateTime      @updatedAt\n  sessions        Session[]\n  accounts        Account[]\n  tutorProfile    TutorProfile?\n  studentBookings Booking[]     @relation("StudentBookings")\n  studentReviews  Review[]      @relation("StudentReviews")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"BookingToCategory"},{"name":"availabilitySlotId","kind":"scalar","type":"String"},{"name":"availabilitySlot","kind":"object","type":"AvailabilitySlot","relationName":"AvailabilitySlotToBooking"},{"name":"subject","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"cancelledBy","kind":"enum","type":"CancelledBy"},{"name":"cancelReason","kind":"scalar","type":"String"},{"name":"isReviewed","kind":"scalar","type":"Boolean"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"bookings"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"tutorProfiles","kind":"object","type":"TutorProfile","relationName":"CategoryToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToCategory"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"categories"},"AvailabilitySlot":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"AvailabilitySlotToTutorProfile"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"AvailabilitySlotToBooking"}],"dbName":"availability_slots"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"StudentReviews"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorProfile"},{"name":"headline","kind":"scalar","type":"String"},{"name":"about","kind":"scalar","type":"String"},{"name":"subjects","kind":"scalar","type":"String"},{"name":"meetingMode","kind":"enum","type":"MeetingMode"},{"name":"hourlyRate","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"ratingAvg","kind":"scalar","type":"Float"},{"name":"ratingCount","kind":"scalar","type":"Int"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"profileStatus","kind":"enum","type":"ProfileStatus"},{"name":"availabilitySlots","kind":"object","type":"AvailabilitySlot","relationName":"AvailabilitySlotToTutorProfile"},{"name":"bookingsAsTutor","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"tutor_profiles"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"studentBookings","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"studentReviews","kind":"object","type":"Review","relationName":"StudentReviews"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AvailabilitySlotScalarFieldEnum: () => AvailabilitySlotScalarFieldEnum,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorProfileScalarFieldEnum: () => TutorProfileScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Booking: "Booking",
  Category: "Category",
  AvailabilitySlot: "AvailabilitySlot",
  Review: "Review",
  TutorProfile: "TutorProfile",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var BookingScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  tutorProfileId: "tutorProfileId",
  categoryId: "categoryId",
  availabilitySlotId: "availabilitySlotId",
  subject: "subject",
  startTime: "startTime",
  endTime: "endTime",
  status: "status",
  cancelledBy: "cancelledBy",
  cancelReason: "cancelReason",
  isReviewed: "isReviewed",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AvailabilitySlotScalarFieldEnum = {
  id: "id",
  tutorProfileId: "tutorProfileId",
  startTime: "startTime",
  endTime: "endTime",
  isBooked: "isBooked",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  studentId: "studentId",
  tutorProfileId: "tutorProfileId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TutorProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  categoryId: "categoryId",
  headline: "headline",
  about: "about",
  subjects: "subjects",
  meetingMode: "meetingMode",
  hourlyRate: "hourlyRate",
  currency: "currency",
  ratingAvg: "ratingAvg",
  ratingCount: "ratingCount",
  isFeatured: "isFeatured",
  profileStatus: "profileStatus",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  role: "role",
  status: "status",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var signupRoles = /* @__PURE__ */ new Set(["STUDENT", "TUTOR"]);
function normalizeSignupRole(role) {
  if (typeof role !== "string") {
    return null;
  }
  const normalizedRole = role.toUpperCase();
  return signupRoles.has(normalizedRole) ? normalizedRole : null;
}
var trustedOrigins = [
  process.env.APP_URL,
  process.env.PROD_APP_URL,
  "https://b6-a4-front-end.vercel.app",
  "http://localhost:3000"
].filter(Boolean);
var socialProviders = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    accessType: "offline",
    disableImplicitSignUp: true,
    prompt: "select_account consent"
  };
}
var auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins,
  cookies: {
    sessionToken: {
      sameSite: "none",
      secure: true
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
      // 5 minutes
    }
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false
    },
    disableCSRFCheck: true
    // Allow requests without Origin header (Postman, mobile apps, etc.)
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const oAuthState = await getOAuthState();
          const roleFromOAuth = normalizeSignupRole(
            oAuthState?.role
          );
          return {
            data: {
              ...user,
              role: roleFromOAuth ?? user.role ?? "USER",
              status: typeof user.status === "string" ? user.status : "UNBAN"
            }
          };
        }
      }
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "UNBAN",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false
  },
  socialProviders
});

// src/modules/tutor/tutor.routes.ts
import { Router } from "express";

// src/modules/tutor/tutor.controller.ts
import "express";

// src/modules/tutor/tutor.service.ts
async function getTutorProfileIdByUserId(userId) {
  if (!userId) throw new Error("Unauthorized");
  const tutorProfile = await prisma.tutorProfile.findFirst({
    where: { userId },
    select: { id: true }
  });
  if (!tutorProfile) throw new Error("Tutor profile not found");
  return tutorProfile.id;
}
var createProfile = async (payload, id) => {
  return await prisma.tutorProfile.create({
    data: {
      ...payload,
      userId: id
    }
  });
};
var getProfile = async (id) => {
  return await prisma.tutorProfile.findUnique({
    where: {
      userId: id
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      category: true,
      availabilitySlots: {
        orderBy: {
          startTime: "asc"
        }
      }
    }
  });
};
var updateProfile = async (payload, id) => {
  return await prisma.tutorProfile.update({
    where: {
      userId: id
    },
    data: payload
  });
};
var setAvailability = async (payload, userId) => {
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
    where: { userId }
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
          endTime: { gt: start }
        }
      ]
    }
  });
  if (overlapping) {
    throw new Error("This time slot overlaps with an existing slot");
  }
  return prisma.availabilitySlot.create({
    data: {
      tutorProfileId: tutorProfile.id,
      startTime: start,
      endTime: end
    }
  });
};
var allAvailabilitySlot = async (id) => {
  const tutorProfile = await prisma.tutorProfile.findFirstOrThrow({
    where: {
      userId: id
    },
    select: {
      id: true
    }
  });
  return await prisma.availabilitySlot.findMany({
    where: {
      tutorProfileId: tutorProfile.id
    }
  });
};
var updateAvailability = async (payload, id, slotId) => {
  await prisma.tutorProfile.findFirstOrThrow({
    where: {
      userId: id
    },
    select: {
      id: true
    }
  });
  return await prisma.availabilitySlot.update({
    where: {
      id: slotId
    },
    data: payload
  });
};
var deleteAvailability = async (id, slotId) => {
  await prisma.tutorProfile.findFirstOrThrow({
    where: {
      userId: id
    },
    select: {
      id: true
    }
  });
  return await prisma.availabilitySlot.delete({
    where: {
      id: slotId
    }
  });
};
var getMySessions = async (userId) => {
  const tutorProfileId = await getTutorProfileIdByUserId(userId);
  const where = { tutorProfileId };
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
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      cancelReason: true,
      createdAt: true
    }
  });
};
var markSessionCompleted = async (userId, bookingId) => {
  const tutorProfileId = await getTutorProfileIdByUserId(userId);
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, tutorProfileId },
    select: { id: true, status: true, endTime: true }
  });
  if (!booking) throw new Error("Session not found");
  if (booking.status === "CANCELLED")
    throw new Error("Cancelled session cannot be completed");
  if (new Date(booking.endTime).getTime() > Date.now()) {
    throw new Error("You can complete the session only after it ends");
  }
  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: "COMPLETED" }
  });
};
var cancelSession = async (userId, bookingId, reason) => {
  const tutorProfileId = await getTutorProfileIdByUserId(userId);
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, tutorProfileId },
    select: {
      id: true,
      status: true,
      availabilitySlotId: true,
      startTime: true
    }
  });
  if (!booking) throw new Error("Session not found");
  if (booking.status === "CANCELLED")
    throw new Error("Session already cancelled");
  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CANCELLED",
      cancelledBy: "TUTOR",
      cancelReason: reason || null
    }
  });
  if (booking.availabilitySlotId) {
    await prisma.availabilitySlot.update({
      where: { id: booking.availabilitySlotId },
      data: { isBooked: false }
    });
  }
  return updated;
};
var getMyReviews = async (userId) => {
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
          startTime: true
        }
      },
      studentId: true,
      student: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  });
};
var tutorServices = {
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
  getMySessions
};

// src/modules/tutor/tutor.controller.ts
var createProfile2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }
    const result = await tutorServices.createProfile(
      req.body,
      user.id
    );
    res.status(201).json({
      success: true,
      message: "Profile successfully created",
      data: result
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var getProfile2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }
    const result = await tutorServices.getProfile(user.id);
    res.status(201).json({
      success: true,
      message: "Profile retrieved successfully",
      data: result
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var updateProfile2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }
    const result = await tutorServices.updateProfile(
      req.body,
      user.id
    );
    res.status(201).json({
      success: true,
      message: "Profile updated successfully",
      data: result
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var setAvailability2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }
    const result = await tutorServices.setAvailability(
      req.body,
      user.id
    );
    res.status(201).json({
      success: true,
      message: "Availability slot Added",
      data: result
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var allAvailabilitySlot2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }
    const result = await tutorServices.allAvailabilitySlot(user.id);
    res.status(200).json({
      success: true,
      message: "Retrieved availability slot",
      data: result
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var updateAvailability2 = async (req, res) => {
  try {
    const { slotId } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }
    if (!slotId) {
      return res.status(404).json({ success: false, message: "Invalid availability id" });
    }
    const result = await tutorServices.updateAvailability(
      req.body,
      user.id,
      slotId
    );
    res.status(200).json({
      success: true,
      message: "Availability slot updated",
      data: result
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var deleteAvailability2 = async (req, res) => {
  try {
    const { slotId } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }
    if (!slotId) {
      return res.status(404).json({ success: false, message: "Invalid availability id" });
    }
    const result = await tutorServices.deleteAvailability(
      user.id,
      slotId
    );
    res.status(200).json({
      success: true,
      message: "Availability slot Deleted",
      data: result
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var getMySessions2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const data = await tutorServices.getMySessions(userId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to load sessions"
    });
  }
};
var markSessionCompleted2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { bookingId } = req.params;
    const data = await tutorServices.markSessionCompleted(
      userId,
      bookingId
    );
    return res.status(200).json({ success: true, message: "Session marked as completed", data });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to complete session"
    });
  }
};
var cancelSession2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { bookingId } = req.params;
    const { reason } = req.body;
    const data = await tutorServices.cancelSession(
      userId,
      bookingId,
      reason
    );
    return res.status(200).json({ success: true, message: "Session cancelled", data });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to cancel session"
    });
  }
};
var getMyReviews2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const data = await tutorServices.getMyReviews(userId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to load reviews"
    });
  }
};
var tutorController = {
  createProfile: createProfile2,
  getProfile: getProfile2,
  updateProfile: updateProfile2,
  setAvailability: setAvailability2,
  updateAvailability: updateAvailability2,
  deleteAvailability: deleteAvailability2,
  allAvailabilitySlot: allAvailabilitySlot2,
  getMySessions: getMySessions2,
  markSessionCompleted: markSessionCompleted2,
  cancelSession: cancelSession2,
  getMyReviews: getMyReviews2
};

// src/middleware/middleware.ts
import "express";
var authMiddleware = (...roles) => {
  return async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    if (!session) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = session.user;
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified
    };
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden access" });
    }
    next();
  };
};
var middleware_default = authMiddleware;

// src/modules/tutor/tutor.routes.ts
var router = Router();
router.get(
  "/tutor/all-slot",
  middleware_default("TUTOR" /* TUTOR */),
  tutorController.allAvailabilitySlot
);
router.get(
  "/tutor/profile",
  middleware_default("TUTOR" /* TUTOR */),
  tutorController.getProfile
);
router.get(
  "/tutor/sessions",
  middleware_default("TUTOR" /* TUTOR */),
  tutorController.getMySessions
);
router.get(
  "/tutor/reviews",
  middleware_default("TUTOR" /* TUTOR */),
  tutorController.getMyReviews
);
router.patch(
  "/tutor/sessions/complete/:bookingId",
  middleware_default("TUTOR" /* TUTOR */),
  tutorController.markSessionCompleted
);
router.patch(
  "/tutor/sessions/cancel/:bookingId",
  middleware_default("TUTOR" /* TUTOR */),
  tutorController.cancelSession
);
router.post(
  "/tutor/create-profile",
  middleware_default("TUTOR" /* TUTOR */),
  tutorController.createProfile
);
router.post(
  "/tutor/create-slot",
  middleware_default("TUTOR" /* TUTOR */),
  tutorController.setAvailability
);
router.patch(
  "/tutor/update-slot/:slotId",
  middleware_default("TUTOR" /* TUTOR */),
  tutorController.updateAvailability
);
router.patch(
  "/tutor/update-profile",
  middleware_default("TUTOR" /* TUTOR */),
  tutorController.updateProfile
);
router.delete(
  "/tutor/delete-slot/:slotId",
  middleware_default("TUTOR" /* TUTOR */),
  tutorController.deleteAvailability
);
var tutorRouter = router;

// src/modules/admin/admin.routes.ts
import { Router as Router2 } from "express";

// src/modules/admin/admin.controller.ts
import "express";

// src/modules/admin/admin.service.ts
var createCategory = async (payload) => {
  return await prisma.category.create({
    data: payload
  });
};
var getAllUsers = async () => {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });
};
var getAllBookings = async () => {
  return await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      student: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      tutorProfile: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          category: true
        }
      },
      availabilitySlot: true
    }
  });
};
var updateUserStatus = async (status, id) => {
  const allowed = ["BAN", "UNBAN"];
  if (!status || typeof status !== "string" || !allowed.includes(status)) {
    throw new Error(`Invalid status. Allowed: ${allowed.join(", ")}`);
  }
  return await prisma.user.update({
    where: {
      id
    },
    data: {
      status
    }
  });
};
var getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          tutorProfiles: true,
          bookings: true
        }
      }
    }
  });
};
var updateCategory = async (payload, id) => {
  return await prisma.category.update({
    where: {
      id
    },
    data: payload
  });
};
var getSingleCategory = async (id) => {
  return await prisma.category.findUnique({
    where: {
      id
    }
  });
};
var deleteCategory = async (id) => {
  return await prisma.category.delete({
    where: {
      id
    }
  });
};
var adminServices = {
  createCategory,
  getAllUsers,
  getAllBookings,
  updateUserStatus,
  getAllCategories,
  updateCategory,
  getSingleCategory,
  deleteCategory
};

// src/modules/admin/admin.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const result = await adminServices.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var getAllUsers2 = async (req, res) => {
  try {
    const result = await adminServices.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var getAllBookings2 = async (req, res) => {
  try {
    const result = await adminServices.getAllBookings();
    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};
var updateUserStatus2 = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.json({ success: false, message: "Input valid user id" });
    }
    const result = await adminServices.updateUserStatus(
      req.body.status,
      userId
    );
    res.status(201).json({
      success: true,
      message: "User status updated",
      data: result
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var getAllCategories2 = async (req, res) => {
  try {
    const result = await adminServices.getAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: result
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var updateCategory2 = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.json({ success: false, message: "Input valid category id" });
    }
    const result = await adminServices.updateCategory(
      req.body,
      categoryId
    );
    res.status(201).json({
      success: true,
      message: "Category updated",
      data: result
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var getSingleCategory2 = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.json({ success: false, message: "Input valid category id" });
    }
    const result = await adminServices.getSingleCategory(categoryId);
    res.status(201).json({
      success: true,
      message: "Category retrieved successfully",
      data: result
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.json({ success: false, message: "Input valid category id" });
    }
    const result = await adminServices.deleteCategory(categoryId);
    res.status(201).json({
      success: true,
      message: "Category deleted successfully",
      data: result
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var adminController = {
  createCategory: createCategory2,
  getAllUsers: getAllUsers2,
  getAllBookings: getAllBookings2,
  updateUserStatus: updateUserStatus2,
  getAllCategories: getAllCategories2,
  updateCategory: updateCategory2,
  getSingleCategory: getSingleCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/admin/admin.routes.ts
var router2 = Router2();
router2.get(
  "/admin/users",
  middleware_default("ADMIN" /* ADMIN */),
  adminController.getAllUsers
);
router2.get(
  "/admin/bookings",
  middleware_default("ADMIN" /* ADMIN */),
  adminController.getAllBookings
);
router2.get(
  "/admin/categories/:categoryId",
  middleware_default("ADMIN" /* ADMIN */),
  adminController.getSingleCategory
);
router2.get(
  "/categories",
  middleware_default(),
  adminController.getAllCategories
);
router2.post(
  "/admin/categories",
  middleware_default("ADMIN" /* ADMIN */),
  adminController.createCategory
);
router2.patch(
  "/admin/update-status/:userId",
  middleware_default("ADMIN" /* ADMIN */),
  adminController.updateUserStatus
);
router2.patch(
  "/admin/categories/:categoryId",
  middleware_default("ADMIN" /* ADMIN */),
  adminController.updateCategory
);
router2.delete(
  "/admin/categories/:categoryId",
  middleware_default("ADMIN" /* ADMIN */),
  adminController.deleteCategory
);
var adminRouter = router2;

// src/modules/student/student.routes.ts
import { Router as Router3 } from "express";

// src/modules/student/student.controller.ts
import "express";

// src/modules/student/student.service.ts
var syncTutorRating = async (tx, tutorProfileId) => {
  const aggregate = await tx.review.aggregate({
    where: { tutorProfileId },
    _avg: { rating: true },
    _count: { id: true }
  });
  await tx.tutorProfile.update({
    where: { id: tutorProfileId },
    data: {
      ratingAvg: aggregate._avg.rating ? Number(aggregate._avg.rating.toFixed(1)) : 0,
      ratingCount: aggregate._count.id
    }
  });
};
var bookSession = async (payload, studentId) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: payload.tutorProfileId }
  });
  if (!tutorProfile) throw new Error("Tutor profile not found");
  if (payload.availabilitySlotId) {
    return prisma.$transaction(async (tx) => {
      const slot = await tx.availabilitySlot.findUnique({
        where: { id: payload.availabilitySlotId }
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
          endTime: payload.endTime
        }
      });
      await tx.availabilitySlot.update({
        where: { id: payload.availabilitySlotId },
        data: { isBooked: true }
      });
      return booking;
    });
  }
};
var updateProfile3 = async (userId, payload) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      ...payload.name && { name: payload.name },
      ...payload.image && { image: payload.image }
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      image: true,
      createdAt: true,
      updatedAt: true
    }
  });
};
var getAllTutors = async () => {
  return await prisma.tutorProfile.findMany({
    where: {
      profileStatus: "PUBLISHED"
    },
    orderBy: [{ isFeatured: "desc" }, { ratingAvg: "desc" }, { createdAt: "desc" }],
    include: {
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      availabilitySlots: {
        orderBy: {
          startTime: "asc"
        }
      }
    }
  });
};
var createBooking = async (studentId, payload) => {
  const { tutorProfileId, availabilitySlotId, subject } = payload;
  if (!studentId) {
    throw new Error("Unauthorized");
  }
  if (!tutorProfileId || !availabilitySlotId || !subject) {
    throw new Error(
      "tutorProfileId, availabilitySlotId and subject are required"
    );
  }
  return await prisma.$transaction(async (tx) => {
    const slot = await tx.availabilitySlot.findFirst({
      where: {
        id: availabilitySlotId,
        tutorProfileId
      }
    });
    if (!slot) throw new Error("Slot not found for this tutor");
    if (slot.isBooked) throw new Error("This slot is already booked");
    const tutor = await tx.tutorProfile.findUnique({
      where: {
        id: tutorProfileId
      },
      select: { id: true, categoryId: true }
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
        status: "CONFIRMED"
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
                image: true
              }
            },
            category: { select: { id: true, name: true, description: true } }
          }
        },
        availabilitySlot: true
      }
    });
    await tx.availabilitySlot.update({
      where: { id: availabilitySlotId },
      data: { isBooked: true }
    });
    return booking;
  });
};
var getMyBookings = async (studentId) => {
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
              image: true
            }
          },
          category: { select: { id: true, name: true, description: true } }
        }
      },
      availabilitySlot: true
    }
  });
};
var cancelBooking = async (studentId, bookingId, reason) => {
  if (!studentId) throw new Error("Unauthorized");
  if (!bookingId) throw new Error("bookingId is required");
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findFirst({
      where: { id: bookingId, studentId },
      select: {
        id: true,
        status: true,
        availabilitySlotId: true,
        startTime: true
      }
    });
    if (!booking) throw new Error("Booking not found");
    if (booking.status === "CANCELLED")
      throw new Error("Booking already cancelled");
    if (new Date(booking.startTime).getTime() < Date.now()) {
      throw new Error("You can\u2019t cancel a booking that already started");
    }
    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
        cancelledBy: "STUDENT",
        cancelReason: reason || null
      }
    });
    if (booking.availabilitySlotId) {
      await tx.availabilitySlot.update({
        where: { id: booking.availabilitySlotId },
        data: { isBooked: false }
      });
    }
    return updated;
  });
};
var createReview = async (studentId, payload) => {
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
        tutorProfileId: true
      }
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
        comment: comment?.trim() || null
      }
    });
    await tx.booking.update({
      where: { id: bookingId },
      data: { isReviewed: true }
    });
    await syncTutorRating(tx, booking.tutorProfileId);
    return review;
  });
};
var studentServices = {
  bookSession,
  updateProfile: updateProfile3,
  getAllTutors,
  createBooking,
  getMyBookings,
  cancelBooking,
  createReview
};

// src/modules/student/student.controller.ts
var bookSession2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }
    const { tutorProfileId, subject, startTime, endTime } = req.body;
    if (!tutorProfileId || !subject || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "tutorProfileId, subject, startTime, endTime are required"
      });
    }
    const parsedStart = new Date(startTime);
    const parsedEnd = new Date(endTime);
    if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid startTime or endTime"
      });
    }
    if (parsedStart >= parsedEnd) {
      return res.status(400).json({
        success: false,
        message: "startTime must be before endTime"
      });
    }
    const result = await studentServices.bookSession(req.body, user.id);
    return res.status(201).json({
      success: true,
      message: "Session booked successfully",
      data: result
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var updateProfile4 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }
    const { name, image } = req.body;
    if (!name && !image) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update"
      });
    }
    const updatedUser = await studentServices.updateProfile(user.id, {
      name,
      image
    });
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};
var getAllTutors2 = async (req, res) => {
  try {
    const result = await studentServices.getAllTutors();
    res.status(200).json({
      success: true,
      message: "Tutors retrieved successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};
var getMyBookings2 = async (req, res) => {
  try {
    const studentId = req.user?.id;
    const result = await studentServices.getMyBookings(studentId);
    return res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to load bookings"
    });
  }
};
var createBooking2 = async (req, res) => {
  try {
    const studentId = req.user?.id;
    const payload = req.body;
    const result = await studentServices.createBooking(studentId, payload);
    return res.status(201).json({
      success: true,
      message: "Booking successfully created",
      data: result
    });
  } catch (err) {
    if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError && err.code === "P2002") {
      const target = err.meta?.target;
      if (Array.isArray(target) && target.includes("availabilitySlotId")) {
        return res.status(409).json({
          success: false,
          message: "This slot is already booked. Please choose another slot."
        });
      }
      return res.status(409).json({
        success: false,
        message: "Duplicate value. Please try again."
      });
    }
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to create booking"
    });
  }
};
var cancelBooking2 = async (req, res) => {
  try {
    const studentId = req.user?.id;
    const { bookingId } = req.params;
    const { reason } = req.body;
    const result = await studentServices.cancelBooking(
      studentId,
      bookingId,
      reason
    );
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to cancel booking"
    });
  }
};
var createReview2 = async (req, res) => {
  try {
    const studentId = req.user?.id;
    const result = await studentServices.createReview(studentId, req.body);
    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: result
    });
  } catch (err) {
    if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError && err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "You already reviewed this booking."
      });
    }
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to submit review"
    });
  }
};
var studentController = {
  bookSession: bookSession2,
  updateProfile: updateProfile4,
  getAllTutors: getAllTutors2,
  createBooking: createBooking2,
  getMyBookings: getMyBookings2,
  cancelBooking: cancelBooking2,
  createReview: createReview2
};

// src/modules/student/student.routes.ts
var router3 = Router3();
router3.post(
  "/student/book-session",
  middleware_default("STUDENT" /* STUDENT */),
  studentController.bookSession
);
router3.get(
  "/student/all-tutor",
  middleware_default("STUDENT" /* STUDENT */),
  studentController.getAllTutors
);
router3.get(
  "/student/my-bookings",
  middleware_default("STUDENT" /* STUDENT */),
  studentController.getMyBookings
);
router3.post(
  "/student/create-booking",
  middleware_default("STUDENT" /* STUDENT */),
  studentController.createBooking
);
router3.post(
  "/student/create-review",
  middleware_default("STUDENT" /* STUDENT */),
  studentController.createReview
);
router3.patch(
  "/student/cancel-booking/:bookingId",
  middleware_default("STUDENT" /* STUDENT */),
  studentController.cancelBooking
);
router3.patch(
  "/users/me",
  middleware_default(
    "ADMIN" /* ADMIN */,
    "STUDENT" /* STUDENT */,
    "TUTOR" /* TUTOR */,
    "USER" /* USER */
  ),
  studentController.updateProfile
);
var studentRouter = router3;

// src/modules/public/public.routes.ts
import { Router as Router4 } from "express";

// src/modules/public/public.controller.ts
import "express";

// src/modules/public/public.service.ts
var tutorCardSelect = {
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
      description: true
    }
  },
  user: {
    select: {
      id: true,
      name: true,
      image: true,
      email: true
    }
  }
};
var getAllTutors3 = async (query) => {
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(50, Math.max(1, Number(query.limit || 10)));
  const skip = (page - 1) * limit;
  const where = {
    profileStatus: "PUBLISHED"
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
        { subjects: { has: q } }
      ];
    }
  }
  const sortBy = query.sortBy || "latest";
  const sortOrder = query.sortOrder || "desc";
  const orderBy = sortBy === "price" ? { hourlyRate: sortOrder } : sortBy === "rating" ? { ratingAvg: sortOrder } : { createdAt: sortOrder };
  const [data, total] = await prisma.$transaction([
    prisma.tutorProfile.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: tutorCardSelect
    }),
    prisma.tutorProfile.count({ where })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data
  };
};
var getFeaturedTutor = async () => {
  return await prisma.tutorProfile.findMany({
    where: {
      isFeatured: true,
      profileStatus: "PUBLISHED"
    },
    select: tutorCardSelect,
    take: 6,
    orderBy: [{ ratingAvg: "desc" }, { createdAt: "desc" }]
  });
};
var getSingleTutor = async (id) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: {
      id
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true
        }
      },
      category: true,
      availabilitySlots: {
        orderBy: { startTime: "asc" }
      },
      reviews: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });
  if (!tutor) {
    return null;
  }
  const relatedTutors = await prisma.tutorProfile.findMany({
    where: {
      profileStatus: "PUBLISHED",
      categoryId: tutor.categoryId,
      id: { not: tutor.id }
    },
    select: tutorCardSelect,
    take: 4,
    orderBy: [{ ratingAvg: "desc" }, { createdAt: "desc" }]
  });
  return {
    ...tutor,
    relatedTutors
  };
};
var getPublicCategories = async () => {
  return prisma.category.findMany({
    where: {
      isActive: true
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      _count: {
        select: {
          tutorProfiles: true
        }
      }
    }
  });
};
var getHomeMetrics = async () => {
  const [tutors, categories, completedBookings, featuredTutors, rating] = await Promise.all([
    prisma.tutorProfile.count({
      where: {
        profileStatus: "PUBLISHED"
      }
    }),
    prisma.category.count({
      where: {
        isActive: true
      }
    }),
    prisma.booking.count({
      where: {
        status: "COMPLETED"
      }
    }),
    prisma.tutorProfile.count({
      where: {
        isFeatured: true,
        profileStatus: "PUBLISHED"
      }
    }),
    prisma.tutorProfile.aggregate({
      where: {
        profileStatus: "PUBLISHED"
      },
      _avg: {
        ratingAvg: true
      }
    })
  ]);
  return {
    tutors,
    categories,
    completedBookings,
    featuredTutors,
    averageRating: Number((rating._avg.ratingAvg || 0).toFixed(1))
  };
};
var publicServices = {
  getAllTutors: getAllTutors3,
  getFeaturedTutor,
  getSingleTutor,
  getPublicCategories,
  getHomeMetrics
};

// src/modules/public/public.controller.ts
var getAllTutors4 = async (req, res) => {
  try {
    const result = await publicServices.getAllTutors(req.query);
    res.status(200).json({
      success: true,
      message: "Tutors fetched successfully",
      meta: result.meta,
      data: result.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};
var getFeaturedTutor2 = async (req, res) => {
  try {
    const result = await publicServices.getFeaturedTutor();
    res.status(200).json({
      success: true,
      message: "Featured tutor fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};
var getSingleTutor2 = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const result = await publicServices.getSingleTutor(tutorId);
    res.status(200).json({
      success: true,
      message: "Tutor fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};
var getPublicCategories2 = async (req, res) => {
  try {
    const result = await publicServices.getPublicCategories();
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};
var getHomeMetrics2 = async (req, res) => {
  try {
    const result = await publicServices.getHomeMetrics();
    res.status(200).json({
      success: true,
      message: "Home metrics fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
};
var publicController = {
  getAllTutors: getAllTutors4,
  getFeaturedTutor: getFeaturedTutor2,
  getSingleTutor: getSingleTutor2,
  getPublicCategories: getPublicCategories2,
  getHomeMetrics: getHomeMetrics2
};

// src/modules/public/public.routes.ts
var router4 = Router4();
router4.get("/public/all-tutor", publicController.getAllTutors);
router4.get("/public/tutor/:tutorId", publicController.getSingleTutor);
router4.get("/public/categories", publicController.getPublicCategories);
router4.get("/public/home-metrics", publicController.getHomeMetrics);
router4.get("/public/featured-tutor", publicController.getFeaturedTutor);
var publicRouter = router4;

// src/modules/bookings/booking.schedule.ts
import cron from "node-cron";
function startBookingAutoCompleteJob() {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = /* @__PURE__ */ new Date();
      await prisma.booking.updateMany({
        where: {
          status: "CONFIRMED",
          endTime: { lte: now }
        },
        data: { status: "COMPLETED" }
      });
    } catch (e) {
      console.error("Auto-complete job failed:", e);
    }
  });
}

// src/app.ts
var app = express();
app.use(express.json());
var allowedOrigins = [
  process.env.APP_URL || "https://b6-a4-front-end.vercel.app",
  process.env.PROD_APP_URL
  // Production frontend URL
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api", tutorRouter);
app.use("/api", adminRouter);
app.use("/api", studentRouter);
app.use("/api", publicRouter);
startBookingAutoCompleteJob();
app.get("/", (req, res) => {
  res.send("Server working perfectly\u{1F642}");
});
var app_default = app;

// src/config/index.ts
import dotenv from "dotenv";
import path2 from "path";
dotenv.config({ path: path2.join(process.cwd(), ".env") });
var config2 = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  better_auth_secret: process.env.BETTER_AUTH_SECRET,
  better_auth_url: process.env.BETTER_AUTH_URL,
  app_url: process.env.APP_URL
};
var config_default = config2;

// src/server.ts
var main = async () => {
  try {
    await prisma.$connect();
    app_default.listen(config_default.port, () => {
      console.log(`Example app listening on port ${config_default.port}`);
    });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
  }
};
main();
