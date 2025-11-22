import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const ContactPage = () => (
  <div className="container mx-auto py-12 space-y-6">
    <h1 className="text-3xl font-bold">Kontakt</h1>
    <p className="text-muted-foreground">Schreiben Sie uns bei Fragen zu Konversia.</p>
    <form className="max-w-lg space-y-3">
      <Input placeholder="Ihre E-Mail" type="email" required />
      <Input placeholder="Betreff" required />
      <textarea className="w-full rounded-md border p-2 text-sm" rows={4} placeholder="Ihre Nachricht"></textarea>
      <Button type="submit">Abschicken</Button>
    </form>
    <p className="text-sm text-muted-foreground">Oder schreiben Sie uns direkt: hello@konversia.dev</p>
  </div>
);

export default ContactPage;
