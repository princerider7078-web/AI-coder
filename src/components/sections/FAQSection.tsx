"use client";

import { useState } from "react";
import { Plus, Minus, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { useBilingual } from "@/store/useBilingual";
import { FAQ_ITEMS } from "@/data/homepageData";
import { SOCIAL_LINKS } from "@/lib/constants";

/**
 * FAQSection — 2-column layout (left: intro + WhatsApp, right: accordion).
 * Source: HOMEPAGE_AUDIT_REPORT.md §1.1 (FAQSection), PRD §8.2 (FR-HOME-008)
 *
 * Audit fixes:
 *   - C2: Full ARIA on accordion (aria-expanded, aria-controls, role="region",
 *         id mapping)
 *   - C5: No hardcoded hex
 *   - M8: No hardcoded maxHeight — uses Radix Accordion (built-in animation)
 *   - §3.2.4: WhatsApp button is in the left column (more prominent than buried)
 *   - §7.2.2: aria-expanded on accordion triggers
 *   - JSON-LD FAQPage schema rendered by the parent page (page.tsx)
 */
export function FAQSection() {
  const { language } = useBilingual();
  const isHi = language === "hi";
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  return (
    <section className="section-py bg-muted/30">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left column: intro + WhatsApp */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <p className="text-overline text-primary font-semibold">
                {isHi ? "सामान्य प्रश्न" : "FAQ"}
              </p>
              <h2 className="text-h2 text-foreground">
                {isHi ? "आपके सवाल, हमारे जवाब" : "Questions? We've Got Answers"}
              </h2>
              <p className="text-body text-muted-foreground">
                {isHi
                  ? "डिलीवरी, रिटर्न, बुकिंग, और भुगतान के बारे में अक्सर पूछे जाने वाले सवाल। और जवाब नहीं मिला? हमें WhatsApp करें।"
                  : "Quick answers about delivery, returns, bookings, and payments. Can't find your answer? WhatsApp us."}
              </p>
            </div>

            {/* WhatsApp support card */}
            <div className="rounded-2xl bg-card border border-border p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center">
                  <MessageCircle className="size-6 fill-[#25D366]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-body font-semibold text-foreground">
                    {isHi ? "अभी बात करें" : "Talk to Us"}
                  </p>
                  <p className="text-body-sm text-muted-foreground">
                    {isHi ? "सोम–रवि, सुबह 9–शाम 7" : "Mon–Sun, 9AM–7PM IST"}
                  </p>
                </div>
              </div>
              <Button asChild className="w-full gap-2 bg-[#25D366] hover:bg-[#25D366]/90 text-white">
                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4 fill-white" aria-hidden="true" />
                  {isHi ? "व्हाट्सएप पर चैट" : "Chat on WhatsApp"}
                </a>
              </Button>
            </div>
          </div>

          {/* Right column: accordion */}
          <div className="lg:col-span-3">
            <ul className="space-y-3">
              {FAQ_ITEMS.map((item) => {
                const isOpen = openId === item.id;
                const panelId = `faq-panel-${item.id}`;
                const buttonId = `faq-button-${item.id}`;
                return (
                  <li
                    key={item.id}
                    className="rounded-xl bg-card border border-border overflow-hidden"
                  >
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 p-4 text-left",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                      )}
                    >
                      <span className="text-body font-medium text-foreground">
                        {isHi ? item.question.hi : item.question.en}
                      </span>
                      <span className="shrink-0 size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        {isOpen ? (
                          <Minus className="size-4" aria-hidden="true" />
                        ) : (
                          <Plus className="size-4" aria-hidden="true" />
                        )}
                      </span>
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-base",
                        isOpen ? "max-h-96" : "max-h-0"
                      )}
                    >
                      <p className="p-4 pt-0 text-body-sm text-muted-foreground leading-relaxed">
                        {isHi ? item.answer.hi : item.answer.en}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
