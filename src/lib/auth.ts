import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const trustedOrigins = [
  process.env.APP_URL,
  process.env.PROD_APP_URL,
  "https://b6-a4-front-end.vercel.app",
  "http://localhost:3000",
].filter(Boolean) as string[];

const socialProviders: Record<string, any> = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    accessType: "offline",
    prompt: "select_account consent",
  };
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins,
  cookies: {
    sessionToken: {
      sameSite: "none",
      secure: true,
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    disableCSRFCheck: true, // Allow requests without Origin header (Postman, mobile apps, etc.)
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "UNBAN",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
  },
  socialProviders,
});
