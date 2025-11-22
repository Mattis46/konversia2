import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/env";
import { authRoutes } from "./modules/auth/auth.routes";
import { passwordResetRoutes } from "./modules/auth/passwordReset.routes";
import { emailVerificationRoutes } from "./modules/auth/emailVerification.routes";
import { errorHandler } from "./middleware/errorHandler";
import { healthRoutes } from "./routes/health.routes";
import { authGuard } from "./middleware/authGuard";
import { botRoutes } from "./modules/bot/bot.routes";
import { contactRoutes } from "./modules/contact/contact.routes";
import { conversationRoutes } from "./modules/conversation/conversation.routes";
import { webchatRoutes } from "./modules/webchat/webchat.routes";
import { botFaqRoutes } from "./modules/botFaq/botFaq.routes";
import { botProfileRoutes } from "./modules/botProfile/botProfile.routes";
import { authRateLimiter, webchatRateLimiter } from "./middleware/rateLimit";

// Create the Express application instance.
const app = express();

const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  process.env.DASHBOARD_ORIGIN,
  "http://localhost:3000",
].filter(Boolean) as string[];

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.use(healthRoutes);

// Auth routes include registration and login.
app.use("/api/auth", authRateLimiter, authRoutes);
app.use("/api/auth", authRateLimiter, emailVerificationRoutes);
app.use("/api/auth", authRateLimiter, passwordResetRoutes);
app.use("/api/bots", authGuard, botRoutes);
app.use("/api/contacts", authGuard, contactRoutes);
app.use("/api/conversations", authGuard, conversationRoutes);
app.use("/api/bots", authGuard, botFaqRoutes);
app.use("/api/bots", authGuard, botProfileRoutes);
app.use("/api/webchat", webchatRateLimiter, webchatRoutes);

// Centralized error handler should be registered last.
app.use(errorHandler);

const start = async () => {
  app.listen(config.port, () => {
    console.log(`API listening on port ${config.port}`);
  });
};

void start();
