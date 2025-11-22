import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const features = [
  { title: "Bots", desc: "Mehrere Bots pro Mandant. Rollen, Status, klare Rechte." },
  { title: "Kanäle", desc: "Website-Chat, WhatsApp, Social, E-Mail – zentral gesteuert." },
  { title: "Dashboard", desc: "Kennzahlen mit Tremor. Klar, ruhig, ohne Datenchaos." },
  { title: "Wissensbasis", desc: "FAQs + Profil: Antworten bleiben konsistent und hilfreich." },
  { title: "Sicherheit", desc: "Mandantenfähig, JWT-basiert, klare Rollen, DSGVO-bewusst." },
  { title: "Onboarding", desc: "Geführte Schritte, wenig Klicks, sofort einsatzbereit." },
];

const FeaturesPage = () => (
  <div className="container mx-auto py-12 space-y-6">
    <h1 className="text-3xl font-bold">Features</h1>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {features.map((f) => (
        <Card key={f.title}>
          <CardHeader><CardTitle className="text-lg">{f.title}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default FeaturesPage;
