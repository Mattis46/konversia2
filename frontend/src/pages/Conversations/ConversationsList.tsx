import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../config/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

type Conversation = {
  id: string;
  status: string;
  createdAt: string;
  contact?: { id: string; name?: string | null };
};

const badgeColor = (status: string) => {
  if (status === "OPEN") return "bg-emerald-100 text-emerald-700";
  if (status === "ESCALATED") return "bg-amber-100 text-amber-800";
  return "bg-slate-100 text-slate-700";
};

const ConversationsList = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Conversation[]>("/api/conversations")
      .then((res) => setConversations(res.data))
      .catch((err) => {
        console.error(err);
        setError("Konversationen konnten nicht geladen werden.");
      });
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Konversationen</h2>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="grid gap-3 md:grid-cols-2">
        {conversations.map((c) => (
          <Card key={c.id} className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{c.contact?.name ?? "Unbekannter Kontakt"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${badgeColor(c.status)}`}>
                {c.status}
              </div>
              <div>{new Date(c.createdAt).toLocaleString()}</div>
              <Link to={`/app/conversations/${c.id}`} className="text-primary hover:underline">
                Öffnen
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConversationsList;
