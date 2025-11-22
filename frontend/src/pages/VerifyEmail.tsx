import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../config/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    api
      .post("/api/auth/verify-email", { token })
      .then(() => {
        setStatus("success");
        setTimeout(() => navigate("/login"), 1500);
      })
      .catch(() => setStatus("error"));
  }, [token, navigate]);

  if (!token) return <p>Kein Token angegeben.</p>;
  if (status === "pending") return <p>Bitte warten… Ihre E-Mail wird bestätigt…</p>;
  if (status === "success") return <p>E-Mail erfolgreich bestätigt. Weiterleitung…</p>;
  return <p>Der Bestätigungslink ist ungültig oder abgelaufen.</p>;
};

export default VerifyEmail;
