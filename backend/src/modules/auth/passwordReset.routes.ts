import { Router } from "express";
import { validateBody } from "../../middleware/validate";
import { ForgotPasswordSchema, ResetPasswordSchema } from "./auth.validation";
import * as passwordResetController from "./passwordReset.controller";

const router = Router();

router.post(
  "/forgot-password",
  validateBody(ForgotPasswordSchema),
  passwordResetController.forgotPassword
);

router.post(
  "/reset-password",
  validateBody(ResetPasswordSchema),
  passwordResetController.resetPassword
);

export const passwordResetRoutes = router;
