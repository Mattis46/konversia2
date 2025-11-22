import { Router } from "express";
import { validateBody } from "../../middleware/validate";
import { requireRole } from "../../middleware/requireRole";
import * as botProfileController from "./botProfile.controller";
import { UpsertBotProfileSchema } from "./botProfile.types";

// Routes for managing bot profile per tenant.
const router = Router({ mergeParams: true });

router.get("/:botId/profile", botProfileController.getProfile);
router.put(
  "/:botId/profile",
  requireRole("OWNER", "ADMIN"),
  validateBody(UpsertBotProfileSchema),
  botProfileController.upsertProfile
);

export const botProfileRoutes = router;
