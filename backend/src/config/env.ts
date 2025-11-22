import dotenv from "dotenv";

// Load environment variables as early as possible.
dotenv.config();

type AppConfig = {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
};

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
};

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
if (Number.isNaN(port)) {
  throw new Error("PORT must be a number");
}

export const config: AppConfig = {
  port,
  databaseUrl: requireEnv("DATABASE_URL"),
  jwtSecret: requireEnv("JWT_SECRET"),
};
