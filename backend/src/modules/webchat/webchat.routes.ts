import { Router } from "express";
import { validateBody } from "../../middleware/validate";
import { handleIncomingWebchatMessage } from "./webchat.controller";
import { WebchatMessageSchema } from "./webchat.types";

export const webchatRoutes = Router();

webchatRoutes.post(
  "/message",
  validateBody(WebchatMessageSchema),
  handleIncomingWebchatMessage
);
