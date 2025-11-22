import OpenAI from "openai";
import { config } from "../config/env";

// Reusable OpenAI client configured with the API key.
export const openai = new OpenAI({
  apiKey: config.openAiApiKey,
});
