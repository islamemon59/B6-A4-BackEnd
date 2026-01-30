import { NextFunction, Request, Response } from "express";
import { UserRole } from "../types";
import { auth } from "../lib/auth";
import { success } from "better-auth/*";

const authMiddleware = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = session.user;

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role!,
      emailVerified: user.emailVerified,
    };

    if (roles.length && !roles.includes(req.user.role as UserRole)) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden access" });
    }
    next()
  };
};

export default authMiddleware;