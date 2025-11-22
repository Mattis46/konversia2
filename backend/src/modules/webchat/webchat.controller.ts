import { NextFunction, Request, Response } from "express";
import { WebchatMessageRequest } from "./webchat.types";
import * as webchatService from "./webchat.service";

// Handle public webchat incoming messages.
export const handleIncomingWebchatMessage = async (
  req: Request<unknown, unknown, WebchatMessageRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const response = await webchatService.processIncomingMessage(payload);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};
