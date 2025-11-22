import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../config/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export type Bot = {
  id: string;
  name: string;
  isActive: boolean;
};

const BotsList = () => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBots = async () => {
    setLoading(true);
    try {
      const res = await api.get<Bot[]>("/api/bots");
      setBots(res.data);
    } catch (err) {
      console.error(err);
      setError("Bots konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const createBot = async () => {
    if (!name.trim()) return;
    setError(null);
    try {
      await api.post("/api/bots", { name });
      setName("");
      fetchBots();
    } catch (err) {
      console.error(err);
      setError("Bot konnte nicht erstellt werden.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Bots</h2>
        <div className="flex items-center gap-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Neuer Bot-Name"
            className="w-56"
          />
          <Button onClick={createBot}>Bot erstellen</Button>
        </div>
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      {loading ? (
        <p className="text-muted-foreground text-sm">Lade Bots…</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => (
            <Card key={bot.id} className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{bot.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Status: {bot.isActive ? "Aktiv" : "Inaktiv"}
                </span>
                <Button variant="outline" asChild>
                  <Link to={`/app/bots/${bot.id}`}>Öffnen</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BotsList;
