import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import type { Bot } from "./BotsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

type Faq = { id: string; question: string; answer: string };
type Profile = { description?: string | null; openingHours?: string | null; location?: string | null } | null;

const BotDetail = () => {
  const { botId } = useParams();
  const { user } = useAuth();
  const canDelete = useMemo(() => user?.roleName === "OWNER" || user?.roleName === "ADMIN", [user]);

  const [bot, setBot] = useState<Bot | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [faqForm, setFaqForm] = useState({ question: "", answer: "" });
  const [profile, setProfile] = useState<Profile>(null);
  const [profileForm, setProfileForm] = useState({ description: "", openingHours: "", location: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!botId) return;
    api.get<Bot>(`/api/bots/${botId}`).then((res) => setBot(res.data));
    api.get<Faq[]>(`/api/bots/${botId}/faqs`).then((res) => setFaqs(res.data));
    api.get(`/api/bots/${botId}/profile`).then((res) => {
      setProfile(res.data);
      if (res.data) {
        setProfileForm({
          description: res.data.description ?? "",
          openingHours: res.data.openingHours ?? "",
          location: res.data.location ?? "",
        });
      }
    });
  }, [botId]);

  const saveFaq = async () => {
    if (!botId || !faqForm.question.trim() || !faqForm.answer.trim()) return;
    setLoading(true);
    await api.post(`/api/bots/${botId}/faqs`, faqForm);
    setFaqForm({ question: "", answer: "" });
    const res = await api.get<Faq[]>(`/api/bots/${botId}/faqs`);
    setFaqs(res.data);
    setLoading(false);
  };

  const updateFaq = async (faqId: string, data: Partial<Faq>) => {
    if (!botId) return;
    setLoading(true);
    await api.patch(`/api/bots/${botId}/faqs/${faqId}`, data);
    const res = await api.get<Faq[]>(`/api/bots/${botId}/faqs`);
    setFaqs(res.data);
    setLoading(false);
  };

  const deleteFaq = async (faqId: string) => {
    if (!botId || !canDelete) return;
    await api.delete(`/api/bots/${botId}/faqs/${faqId}`);
    setFaqs((prev) => prev.filter((f) => f.id !== faqId));
  };

  const saveProfile = async () => {
    if (!botId) return;
    setLoading(true);
    await api.put(`/api/bots/${botId}/profile`, profileForm);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{bot?.name ?? "Bot"}</h2>
        <span className="text-sm text-muted-foreground">Status: {bot?.isActive ? "Aktiv" : "Inaktiv"}</span>
      </div>

      <Tabs defaultValue="faqs">
        <TabsList>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
        </TabsList>

        <TabsContent value="faqs" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>FAQ-Liste</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="rounded-lg border p-3 space-y-2">
                  <div className="font-semibold">{faq.question}</div>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const question = prompt("Frage bearbeiten", faq.question) ?? faq.question;
                        const answer = prompt("Antwort bearbeiten", faq.answer) ?? faq.answer;
                        updateFaq(faq.id, { question, answer });
                      }}
                    >
                      Bearbeiten
                    </Button>
                    {canDelete && (
                      <Button variant="destructive" size="sm" onClick={() => deleteFaq(faq.id)}>
                        Löschen
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {!faqs.length && <p className="text-sm text-muted-foreground">Noch keine FAQs hinterlegt.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Neue FAQ</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Frage"
                value={faqForm.question}
                onChange={(e) => setFaqForm((prev) => ({ ...prev, question: e.target.value }))}
              />
              <textarea
                className="w-full rounded-md border p-2 text-sm"
                rows={4}
                placeholder="Antwort"
                value={faqForm.answer}
                onChange={(e) => setFaqForm((prev) => ({ ...prev, answer: e.target.value }))}
              />
              <Button onClick={saveFaq} disabled={loading}>FAQ speichern</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Bot-Profil</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Beschreibung</label>
                <textarea
                  className="w-full rounded-md border p-2 text-sm"
                  rows={3}
                  value={profileForm.description}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Öffnungszeiten</label>
                <Input
                  value={profileForm.openingHours}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, openingHours: e.target.value }))}
                  placeholder="Mo-Fr 09:00-18:00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Standort</label>
                <Input
                  value={profileForm.location}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Stadt / Adresse"
                />
              </div>
              <Button onClick={saveProfile} disabled={loading}>Profil speichern</Button>
              {profile && (
                <p className="text-sm text-muted-foreground">Profil ist hinterlegt.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BotDetail;
