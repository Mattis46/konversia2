import { NextFunction, Request, Response } from "express";
import {
  LoginRequestBody,
  RegisterRequestBody,
} from "./auth.types";
import * as authService from "./auth.service";

// HTTP controller layer keeps request/response handling thin.
export const register = async (
  req: Request<unknown, unknown, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const authResult = await authService.register(req.body);
    return res.status(201).json(authResult);
  } catch (error) {
    return next(error);
  }
};

export const login = async (
  req: Request<unknown, unknown, LoginRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const authResult = await authService.login(req.body);
    return res.status(200).json(authResult);
  } catch (error) {
    return next(error);
  }
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(200).json({ user: req.user });
};
