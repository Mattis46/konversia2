import { Router } from "express";
import { authGuard } from "../../middleware/authGuard";
import { validateBody } from "../../middleware/validate";
import * as authController from "./auth.controller";
import { LoginSchema, RegisterSchema } from "./auth.validation";

const router = Router();

// Registration: creates tenant + first user.
router.post("/register", validateBody(RegisterSchema), authController.register);

// Login existing user.
router.post("/login", validateBody(LoginSchema), authController.login);

// Simple authenticated check.
router.get("/me", authGuard, authController.me);

export const authRoutes = router;
