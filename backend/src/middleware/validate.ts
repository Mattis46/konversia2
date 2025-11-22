import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

// Generic body validator using Zod schemas.
export const validateBody =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: result.error.flatten(),
      });
    }
    req.body = result.data;
    return next();
  };
