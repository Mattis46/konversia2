import { Router } from "express";
import { validateBody } from "../../middleware/validate";
import { requireRole } from "../../middleware/requireRole";
import * as botController from "./bot.controller";
import { CreateBotSchema, UpdateBotSchema } from "./bot.types";

// Routes for managing bots within a tenant.
const router = Router();

router.get("/", botController.listBots);
router.post("/", requireRole("OWNER", "ADMIN"), validateBody(CreateBotSchema), botController.createBot);
router.get("/:id", botController.getBot);
router.patch("/:id", requireRole("OWNER", "ADMIN"), validateBody(UpdateBotSchema), botController.updateBot);
router.delete("/:id", requireRole("OWNER", "ADMIN"), botController.deleteBot);

export const botRoutes = router;
