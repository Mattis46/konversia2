import { NextFunction, Request, Response } from "express";

export type RoleName = "OWNER" | "ADMIN" | "STAFF";

// Enforce that the authenticated user has one of the allowed roles.
export const requireRole =
  (...allowedRoles: RoleName[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !user.roleName) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!allowedRoles.includes(user.roleName as RoleName)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    return next();
  };
