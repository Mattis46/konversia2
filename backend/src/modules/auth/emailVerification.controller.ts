import { NextFunction, Request, Response } from "express";
import * as emailVerificationService from "./emailVerification.service";
import { ResendVerificationBody, VerifyEmailBody } from "./emailVerification.types";

export const resendVerification = async (
  req: Request<unknown, unknown, ResendVerificationBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await emailVerificationService.resendVerification(req.body);
    // For testing, return token if generated. In production, this would be emailed.
    return res.status(200).json({ message: "If the account exists, a verification email was sent.", token });
  } catch (error) {
    return next(error);
  }
};

export const verifyEmail = async (
  req: Request<unknown, unknown, VerifyEmailBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    await emailVerificationService.verifyEmail(req.body);
    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};
