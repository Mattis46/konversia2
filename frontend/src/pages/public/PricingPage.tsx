import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const tiers = [
  { name: "Starter", price: "29€/Monat", features: ["1 Bot", "Website-Chat", "E-Mail-Support"] },
  { name: "Pro", price: "79€/Monat", features: ["3 Bots", "WhatsApp/Social", "Priorisierter Support"] },
  { name: "Business", price: "129€/Monat", features: ["Unlimitiert", "Team-Rollen", "SLA & Onboarding"] },
];

const PricingPage = () => (
  <div className="container mx-auto py-12 space-y-6">
    <h1 className="text-3xl font-bold">Preise</h1>
    <div className="grid gap-4 md:grid-cols-3">
      {tiers.map((tier) => (
        <Card key={tier.name}>
          <CardHeader>
            <CardTitle>{tier.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-semibold">{tier.price}</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              {tier.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <Button asChild className="w-full">
              <a href="/app/register">Jetzt starten</a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default PricingPage;
