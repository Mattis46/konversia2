import dotenv from "dotenv";

// Load environment variables as early as possible.
dotenv.config();

type AppConfig = {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  openAiApiKey: string;
  jwtExpiresIn: string | number;
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
  openAiApiKey:
    process.env.NODE_ENV === "test" ? process.env.OPENAI_API_KEY ?? "" : requireEnv("OPENAI_API_KEY"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
};
