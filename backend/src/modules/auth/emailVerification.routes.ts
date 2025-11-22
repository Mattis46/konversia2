import { Router } from "express";
import { validateBody } from "../../middleware/validate";
import { ResendVerificationSchema, VerifyEmailSchema } from "./auth.validation";
import * as emailVerificationController from "./emailVerification.controller";

const router = Router();

router.post(
  "/resend-verification",
  validateBody(ResendVerificationSchema),
  emailVerificationController.resendVerification
);

router.post(
  "/verify-email",
  validateBody(VerifyEmailSchema),
  emailVerificationController.verifyEmail
);

export const emailVerificationRoutes = router;
