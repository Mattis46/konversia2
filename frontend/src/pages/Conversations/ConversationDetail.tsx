import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../config/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

type Message = {
  id: string;
  senderType: "CUSTOMER" | "BOT" | string;
  content: string;
  createdAt: string;
};

type Conversation = {
  id: string;
  contact?: { name?: string | null };
  status: string;
  messages: Message[];
};

const ConversationDetail = () => {
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) return;
    api
      .get<Conversation>(`/api/conversations/${conversationId}`)
      .then((res) => setConversation(res.data))
      .catch((err) => {
        console.error(err);
        setError("Konversation konnte nicht geladen werden.");
      });
  }, [conversationId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Konversation</h2>
          <p className="text-muted-foreground text-sm">Kontakt: {conversation?.contact?.name ?? "Unbekannt"}</p>
        </div>
        <div className="text-xs rounded-full bg-muted px-3 py-1 text-muted-foreground">{conversation?.status}</div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-lg">Nachrichten</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {conversation?.messages?.map((m) => (
            <div
              key={m.id}
              className={`rounded-lg border p-3 ${m.senderType === "BOT" ? "bg-sky-50 border-sky-100 text-right" : "bg-white"}`}
            >
              <div className="text-xs text-muted-foreground mb-1">
                {m.senderType === "BOT" ? "Bot" : "Kunde"} – {new Date(m.createdAt).toLocaleString()}
              </div>
              <div className="text-sm">{m.content}</div>
            </div>
          ))}
          {!conversation?.messages?.length && (
            <p className="text-sm text-muted-foreground">Keine Nachrichten vorhanden.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationDetail;
