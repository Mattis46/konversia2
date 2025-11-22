import { Tenant } from "@prisma/client";

// Minimal tenant shape to expose in responses.
export const toPublicTenant = (tenant: Tenant) => ({
  id: tenant.id,
  name: tenant.name,
  createdAt: tenant.createdAt,
  updatedAt: tenant.updatedAt,
});
