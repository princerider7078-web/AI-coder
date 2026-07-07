"use client";

import { useState } from "react";
import { Mail, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appToast } from "@/lib/toast";
import { useBilingual } from "@/store/useBilingual";

/**
 * NewsletterSection — dark section with email capture form.
 * Source: HOMEPAGE_AUDIT_REPORT.md §1.1 (NewsletterSection), PRD §8.2 (FR-HOME-008)
 *
 * Audit fixes:
 *   - C5: No hardcoded hex — uses foreground/background tokens (dark on light)
 *   - M20: Real validation + toast feedback (was fake 1.6s setTimeout)
 *   - id="newsletter" anchor (for /#newsletter links from BlogPreviewSection)
 *   - Email validation via Zod schema (newsletterSchema)
 *   - Success/error states with accessible feedback
 */
import { newsletterSchema } from "@/lib/validations/contact";

export function NewsletterSection() {
  const { language } = useBilingual();
  const isHi = language === "hi";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const result = newsletterSchema.safeParse({ email });
    if (!result.success) {
      setStatus("error");
      setErrorMessage(result.error.issues[0]?.message ?? "Invalid email");
      return;
    }

    // Phase 4: simulate API call. Phase 5+ will POST to /api/newsletter
    await new Promise((resolve) => setTimeout(resolve, 600));

    setStatus("success");
    appToast.success(
      isHi ? "सदस्यता सफल!" : "Subscribed successfully!",
      isHi
        ? "आपको बागवानी टिप्स और विशेष ऑफ़र मिलेंगे"
        : "You'll receive gardening tips and exclusive offers"
    );
    setEmail("");
  };

  return (
    <section
      id="newsletter"
      className="section-py bg-foreground text-background scroll-mt-20"
    >
      <Container>
        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          {/* Decorative leaves */}
          <div className="absolute -left-8 -top-8 opacity-10 pointer-events-none" aria-hidden="true">
            <Sparkles className="size-24" />
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none" aria-hidden="true">
            <Sparkles className="size-24" />
          </div>

          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/10 text-background text-body-sm font-medium">
              <Mail className="size-4" aria-hidden="true" />
              {isHi ? "न्यूज़लेटर" : "Newsletter"}
            </div>

            <h2 className="text-h1 md:text-display text-background">
              {isHi ? "हरियाली की कहानी पाएं" : "Get Green in Your Inbox"}
            </h2>

            <p className="text-body-lg text-background/80 max-w-xl mx-auto">
              {isHi
                ? "साप्ताहिक बागवानी टिप्स, नए पौधों की जानकारी, और विशेष ऑफ़र — सीधे अपने इनबॉक्स में। कोई स्पैम नहीं।"
                : "Weekly gardening tips, new plant alerts, and exclusive offers — straight to your inbox. No spam."}
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4"
              noValidate
            >
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  {isHi ? "ईमेल पता" : "Email address"}
                </label>
                <Input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder={isHi ? "आपका ईमेल पता" : "your@email.com"}
                  aria-invalid={status === "error"}
                  aria-describedby={status === "error" ? "newsletter-error" : undefined}
                  required
                  className="bg-background text-foreground border-background/20 placeholder:text-muted-foreground"
                />
              </div>
              <Button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="gap-2 bg-primary hover:bg-primary-hover text-primary-foreground shrink-0"
              >
                {status === "loading" ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
                    {isHi ? "भेज रहे..." : "Sending..."}
                  </>
                ) : status === "success" ? (
                  <>
                    <Check className="size-4" aria-hidden="true" />
                    {isHi ? "सफल" : "Done"}
                  </>
                ) : (
                  <>
                    <Mail className="size-4" aria-hidden="true" />
                    {isHi ? "सदस्यता लें" : "Subscribe"}
                  </>
                )}
              </Button>
            </form>

            {/* Error message */}
            {status === "error" && (
              <p
                id="newsletter-error"
                role="alert"
                className="text-body-sm text-error"
              >
                {errorMessage}
              </p>
            )}

            {/* Trust line */}
            <p className="text-caption text-background/60">
              {isHi
                ? "सदस्यता द्वारा आप हमारी गोपनीयता नीति से सहमत हैं"
                : "By subscribing, you agree to our Privacy Policy"}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
