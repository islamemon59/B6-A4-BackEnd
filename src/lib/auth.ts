import "dotenv/config";
import { betterAuth } from "better-auth";
import { getOAuthState } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const signupRoles = new Set(["STUDENT", "TUTOR"]);
const isProduction = process.env.NODE_ENV === "production";
const localBackendURL = `http://localhost:${process.env.PORT || "5000"}`;
const productionFrontendURL =
  process.env.APP_URL ||
  process.env.PROD_APP_URL ||
  "https://b6-a4-front-end.vercel.app";
const authBaseURL = isProduction ? productionFrontendURL : localBackendURL;
const useSecureCookies = isProduction;

type SocialSignupState = {
  role?: string;
};

function normalizeSignupRole(role?: string | null) {
  if (typeof role !== "string") {
    return null;
  }

  const normalizedRole = role.toUpperCase();
  return signupRoles.has(normalizedRole) ? normalizedRole : null;
}

const trustedOrigins = [
  process.env.APP_URL,
  process.env.PROD_APP_URL,
  process.env.BETTER_AUTH_URL,
  "https://b6-a4-front-end.vercel.app",
  "http://localhost:*",
  "http://localhost:3000",
  "http://localhost:3001",
].filter(Boolean) as string[];

const socialProviders: Record<string, any> = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    accessType: "offline",
    disableImplicitSignUp: true,
    prompt: "select_account consent",
  };
}

export const auth = betterAuth({
  baseURL: authBaseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies,
    crossSubDomainCookies: {
      enabled: false,
    },
    disableCSRFCheck: true, // Allow requests without Origin header (Postman, mobile apps, etc.)
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const oAuthState = await getOAuthState();
          const roleFromOAuth = normalizeSignupRole(
            (oAuthState as SocialSignupState | null)?.role,
          );

          return {
            data: {
              ...user,
              role: roleFromOAuth ?? user.role ?? "USER",
              status: typeof user.status === "string" ? user.status : "UNBAN",
            },
          };
        },
      },
    },
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
