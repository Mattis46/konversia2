import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../config/api";

type User = {
  email: string;
  roleName?: string;
  tenantId?: string;
  emailVerified?: boolean;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    tenantName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  });

  const persist = (jwt: string, u: User) => {
    setToken(jwt);
    setUser(u);
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    persist(data.token, {
      email: data.user.email,
      roleName: data.user.roleName,
      tenantId: data.user.tenantId,
      emailVerified: data.user.emailVerified,
    });
    navigate("/app/dashboard");
  };

  const register = async (payload: {
    tenantName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const { data } = await api.post("/api/auth/register", payload);
    persist(data.token, {
      email: data.user.email,
      roleName: data.user.roleName,
      tenantId: data.user.tenantId,
      emailVerified: data.user.emailVerified,
    });
    navigate("/app/dashboard");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/app/login");
  };

  const value = useMemo(
    () => ({ token, user, login, register, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
