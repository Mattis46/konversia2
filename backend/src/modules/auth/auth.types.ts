// Shared DTOs and payload types for the auth module.
export type RegisterRequestBody = {
  tenantName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginRequestBody = {
  email: string;
  password: string;
};

export type AuthTokenPayload = {
  userId: string;
  tenantId: string;
  roleName: string;
  emailVerified: boolean;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  tenantName: string;
  roleName: string;
  emailVerified: boolean;
};

export type AuthResponse = {
  token: string;
  user: AuthenticatedUser;
  tenant: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
  emailVerificationToken?: string;
};
