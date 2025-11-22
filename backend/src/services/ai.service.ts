import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { openai } from "./openaiClient";

const MAX_FAQS = 10;
const MAX_USER_MESSAGE_LENGTH = 1000;

// Generates a reply for webchat using OpenAI, with tenant/bot context and safe fallbacks.
export const generateReplyForWebchat = async (params: {
  botName: string;
  userMessage: string;
  faqs: { question: string; answer: string }[];
  profile?: {
    description?: string | null;
    openingHours?: string | null;
    location?: string | null;
  };
}): Promise<string> => {
  const truncatedUserMessage =
    params.userMessage.length > MAX_USER_MESSAGE_LENGTH
      ? params.userMessage.slice(0, MAX_USER_MESSAGE_LENGTH)
      : params.userMessage;

  const trimmedFaqs = params.faqs.slice(0, MAX_FAQS);

  const profileParts: string[] = [];
  if (params.profile?.description) profileParts.push(params.profile.description);
  if (params.profile?.openingHours) profileParts.push(`Öffnungszeiten: ${params.profile.openingHours}`);
  if (params.profile?.location) profileParts.push(`Standort: ${params.profile.location}`);
  const profileContext = profileParts.length ? `Unternehmensinformationen:\n- ${profileParts.join("\n- ")}` : "";

  const faqContext = trimmedFaqs.length
    ? `FAQs:\n${trimmedFaqs
        .map((faq, idx) => `${idx + 1}. Frage: ${faq.question} | Antwort: ${faq.answer}`)
        .join("\n")}`
    : "Keine FAQs vorhanden.";

  // Avoid including any personal identifiers in the prompt (privacy by default).
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system" as const,
      content:
        "Du bist ein freundlicher, professioneller Kundenservice-Chatbot für ein kleines oder mittleres Unternehmen in Deutschland. Antworte kurz, klar und höflich auf Deutsch. Nutze 'Sie' als Anrede, außer der Benutzer duzt dich ausdrücklich. Nutze die bereitgestellten Unternehmensinfos und FAQs. Wenn du etwas nicht sicher weißt, gib das offen an und biete an, dass sich jemand aus dem Team meldet.",
    },
    ...(profileContext
      ? [
          {
            role: "system" as const,
            content: profileContext,
          },
        ]
      : []),
    { role: "system" as const, content: faqContext },
    {
      role: "user" as const,
      content: `Kundenanfrage: ${truncatedUserMessage}\nBot-Name: ${params.botName}`,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      temperature: 0.4,
      max_tokens: 256,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();
    return reply && reply.length
      ? reply
      : "Vielen Dank für Ihre Nachricht! Unser Assistent ist gerade nicht verfügbar. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per Telefon oder E-Mail.";
  } catch (error) {
    console.error("OpenAI completion error", error);
    return "Vielen Dank für Ihre Nachricht! Unser Assistent ist gerade nicht verfügbar. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per Telefon oder E-Mail.";
  }
};
