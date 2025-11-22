import { Router } from "express";
import { authGuard } from "../../middleware/authGuard";
import * as authController from "./auth.controller";

const router = Router();

// Registration: creates tenant + first user.
router.post("/register", authController.register);

// Login existing user.
router.post("/login", authController.login);

// Simple authenticated check.
router.get("/me", authGuard, authController.me);

export const authRoutes = router;
