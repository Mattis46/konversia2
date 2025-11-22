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
  const isServerError = statusCode >= 500;
  const message = isServerError
    ? "An unexpected error occurred. Please try again later."
    : err.message || "Bad request";

  // Log minimal info to avoid leaking secrets while still aiding debugging.
  console.error(`[ERROR]`, err);

  return res.status(statusCode).json({
    message,
    ...(err.details && !isServerError ? { details: err.details } : {}),
  });
};
