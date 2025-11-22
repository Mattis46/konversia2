import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate, Link } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-12 space-y-16">
      <section className="grid gap-8 lg:grid-cols-2 items-center">
        <div className="space-y-5">
          <p className="text-sm font-medium text-primary">Konversia für KMU</p>
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Die einfachste KI-Kommunikationslösung für kleine Unternehmen.
          </h1>
          <p className="text-lg text-muted-foreground">
            Antworten Sie automatisch, sammeln Sie Leads und bündeln Sie alle Kanäle – ohne technische Vorkenntnisse.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/app/register")}>Kostenlos starten</Button>
            <Button variant="outline" onClick={() => navigate("/features")}>Mehr erfahren</Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Schnell eingerichtet. Sicher. Mandantenfähig.
          </div>
        </div>
        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-lg font-semibold">So funktioniert es</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>1. Kanäle anbinden (Website, WhatsApp, E-Mail)</li>
              <li>2. Wissen eintragen (FAQ, Profil)</li>
              <li>3. Kunden automatisch beantworten</li>
            </ul>
            <Link to="/features" className="text-sm text-primary">Alle Features ansehen →</Link>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Was Konversia für Sie tut</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Kanäle verbinden", desc: "Website-Chat, WhatsApp, Social Media und E-Mail an einem Ort." },
            { title: "Wissen eintragen", desc: "FAQs und Profil ergänzen – Ihr Bot antwortet klar und korrekt." },
            { title: "Automatisch antworten", desc: "Leads sammeln, Termine anstoßen, Antworten rund um die Uhr." },
          ].map((item) => (
            <Card key={item.title} className="h-full">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Alle Kanäle</h2>
        <div className="grid gap-3 md:grid-cols-4 text-sm text-muted-foreground">
          {["Website", "WhatsApp", "Instagram/Facebook", "E-Mail"].map((c) => (
            <div key={c} className="rounded-lg border bg-white p-4 text-center">{c}</div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Branchenlösungen</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {["Dienstleister & Coaching", "Gesundheit & Beauty", "Handwerk & lokale Services"].map((b) => (
            <Card key={b}><CardContent className="p-4 space-y-2"><h4 className="font-semibold">{b}</h4><p className="text-sm text-muted-foreground">Vorlagen und Dialoge für typische Kundenfragen.</p></CardContent></Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
