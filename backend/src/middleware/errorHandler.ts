import { NextFunction, Request, Response } from "express";

type AppError = Error & {
  statusCode?: number;
  status?: number;
  details?: unknown;
};

// Centralized error handler to keep responses consistent.
export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";

  // Log minimal info to avoid leaking secrets while still aiding debugging.
  console.error(`[ERROR] ${message}`);

  return res.status(statusCode).json({
    message,
    ...(err.details ? { details: err.details } : {}),
  });
};
