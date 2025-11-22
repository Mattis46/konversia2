import { Router } from "express";
import { validateBody } from "../../middleware/validate";
import { requireRole } from "../../middleware/requireRole";
import * as contactController from "./contact.controller";
import { CreateContactSchema, UpdateContactSchema } from "./contact.types";

// Routes for managing contacts within a tenant.
const router = Router();

router.get("/", contactController.listContacts);
router.post("/", requireRole("OWNER", "ADMIN"), validateBody(CreateContactSchema), contactController.createContact);
router.get("/:id", contactController.getContact);
router.patch(
  "/:id",
  requireRole("OWNER", "ADMIN"),
  validateBody(UpdateContactSchema),
  contactController.updateContact
);
router.delete("/:id", requireRole("OWNER", "ADMIN"), contactController.deleteContact);

export const contactRoutes = router;
