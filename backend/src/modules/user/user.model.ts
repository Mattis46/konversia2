import { Role, Tenant, User } from "@prisma/client";
import { AuthenticatedUser } from "../auth/auth.types";

// Strip sensitive fields when sending user data back to clients.
export const toAuthenticatedUser = (
  user: User & { tenant: Tenant; role: Role }
): AuthenticatedUser => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  tenantId: user.tenantId,
  tenantName: user.tenant.name,
  roleName: user.role.name,
});
