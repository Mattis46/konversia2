import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    tenantName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(form);
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please check your data.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-xl shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold">Konto erstellen</CardTitle>
          <p className="text-sm text-muted-foreground">
            Legen Sie Ihren Mandanten an und starten Sie mit Ihrem ersten Bot.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Firmenname / Mandant</label>
              <Input value={form.tenantName} onChange={(e) => handleChange("tenantName", e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Vorname</label>
                <Input value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nachname</label>
                <Input value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">E-Mail</label>
              <Input value={form.email} onChange={(e) => handleChange("email", e.target.value)} type="email" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Passwort</label>
              <Input value={form.password} onChange={(e) => handleChange("password", e.target.value)} type="password" required placeholder="Mind. 8 Zeichen, Buchstaben + Zahl" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Konto anlegen
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              Bereits Kunde?{" "}
              <Link to="/app/login" className="text-primary hover:underline">
                Zum Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
