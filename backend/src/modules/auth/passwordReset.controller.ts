import { NextFunction, Request, Response } from "express";
import * as passwordResetService from "./passwordReset.service";
import { ForgotPasswordBody, ResetPasswordBody } from "./passwordReset.types";

export const forgotPassword = async (
  req: Request<unknown, unknown, ForgotPasswordBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await passwordResetService.createResetToken(req.body);
    // For now, return token to allow manual testing (would be emailed in production)
    return res.status(200).json({ message: "If an account exists, a reset link has been sent.", token });
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (
  req: Request<unknown, unknown, ResetPasswordBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    await passwordResetService.resetPassword(req.body);
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return next(error);
  }
};
