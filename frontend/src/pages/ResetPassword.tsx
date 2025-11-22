import { FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../config/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwörter stimmen nicht überein");
      return;
    }
    try {
      await api.post("/api/auth/reset-password", { token, password });
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Reset fehlgeschlagen. Bitte erneut versuchen.");
    }
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h2>Neues Passwort setzen</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Neues Passwort</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Passwort bestätigen</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button className="primary" type="submit">Passwort speichern</button>
      </form>
    </div>
  );
};

export default ResetPassword;
