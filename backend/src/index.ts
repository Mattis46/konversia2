import express from "express";
import cors from "cors";
import { config } from "./config/env";
import { authRoutes } from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import { healthRoutes } from "./routes/health.routes";

// Create the Express application instance.
const app = express();

app.use(cors());
app.use(express.json());

app.use(healthRoutes);

// Auth routes include registration and login.
app.use("/api/auth", authRoutes);

// Centralized error handler should be registered last.
app.use(errorHandler);

const start = async () => {
  app.listen(config.port, () => {
    console.log(`API listening on port ${config.port}`);
  });
};

void start();
