import "dotenv/config";
import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/middleware";

const API_URL = "http://localhost:5000";
const FRONTEND_ORIGIN = "http://localhost:3000";

const seedAdmin = async () => {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      role: UserRole.ADMIN,
      password: process.env.ADMIN_PASS,
    };

    if (!adminData.name || !adminData.email || !adminData.password) {
      throw new Error("Missing ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASS in .env");
    }

    const existUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existUser) {
      console.log("✅ Admin already exists:", adminData.email);
      return;
    }

    const res = await fetch(`${API_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: FRONTEND_ORIGIN,
        Referer: `${FRONTEND_ORIGIN}/`,
      },
      credentials: "include",
      body: JSON.stringify(adminData),
    });

    const body = await res.json().catch(() => null);

    console.log("Signup status:", res.status, res.statusText);
    console.log("Signup response:", body);

    if (!res.ok) {
      throw new Error(
        body?.message ||
          body?.error?.message ||
          "Signup failed (403 Forbidden)",
      );
    }

    await prisma.user.update({
      where: { email: adminData.email },
      data: { emailVerified: true },
    });

    console.log("Admin created and verified:", adminData.email);
  } catch (error: any) {
    console.error("Seed admin failed:", error?.message || error);
  } finally {
    await prisma.$disconnect();
  }
};

seedAdmin();
