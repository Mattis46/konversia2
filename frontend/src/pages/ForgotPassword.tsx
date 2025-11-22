import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../config/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await api.post("/api/auth/forgot-password", { email });
    setToken(res.data.token ?? null);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold">Passwort zurücksetzen</CardTitle>
          <p className="text-sm text-muted-foreground">
            Geben Sie Ihre E-Mail ein. Falls ein Konto existiert, senden wir einen Reset-Link.
          </p>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Wenn ein Account existiert, wurde ein Reset-Link gesendet.</p>
              {token && (
                <p className="text-xs">
                  Test-Token (nur vorübergehend sichtbar): <code>{token}</code>
                </p>
              )}
              <Link to="/app/login" className="text-primary hover:underline text-sm">
                Zurück zum Login
              </Link>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium">E-Mail</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@firma.de"
                />
              </div>
              <Button type="submit" className="w-full">
                Reset anfordern
              </Button>
              <div className="text-sm text-muted-foreground">
                <Link to="/app/login" className="text-primary hover:underline">
                  Login
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
