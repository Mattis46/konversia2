import { FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../config/api";
import { Card, Text, Title } from "@tremor/react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const ResendVerification = ({ email }: { email: string }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleResend = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post("/api/auth/resend-verification", { email });
      setMessage("Bestätigungsmail gesendet (falls Konto existiert).");
    } catch (error) {
      console.error(error);
      setMessage("Senden fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleResend} className="space-y-2">
      <Button type="submit" disabled={loading}>
        Bestätigungsmail erneut senden
      </Button>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </form>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      {!user?.emailVerified && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm text-amber-900">Bitte bestätigen Sie Ihre E-Mail-Adresse. Wenn Sie keine E-Mail sehen, fordern Sie sie erneut an.</p>
          <ResendVerification email={user?.email ?? ""} />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Willkommen{user ? `, ${user.email}` : ""}</h2>
          <p className="text-muted-foreground">Ihr Assistent beantwortet Kundenanfragen automatisch.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild><Link to="/app/bots">Bots öffnen</Link></Button>
          <Button variant="outline" asChild><Link to="/app/conversations">Konversationen</Link></Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Aktive Bots", value: "—", hint: "Später mit echten Zahlen" },
          { title: "Konversationen heute", value: "—", hint: "Platzhalter" },
          { title: "Antwort-Qualität", value: "—", hint: "Platzhalter" },
        ].map((item) => (
          <Card key={item.title} className="shadow-sm">
            <div className="p-4 space-y-1">
              <Title>{item.title}</Title>
              <p className="text-3xl font-semibold text-primary">{item.value}</p>
              <Text className="text-sm text-muted-foreground">{item.hint}</Text>
            </div>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <div className="p-4 space-y-2">
          <Title>Konversationen (Platzhalter)</Title>
          <Text>Hier werden später Ihre Kennzahlen angezeigt.</Text>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
