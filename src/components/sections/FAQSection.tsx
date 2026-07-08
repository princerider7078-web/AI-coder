"use client";

import { useState } from "react";
import { Plus, Minus, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { FAQ_ITEMS } from "@/data/homepageData";
import { SOCIAL_LINKS } from "@/lib/constants";

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  return (
    <section className="py-12 md:py-16 bg-background">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left column: intro + WhatsApp */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <h2 className="text-h2 text-foreground">Got Questions? We&apos;ve Got Answers</h2>
              <p className="text-body text-muted-foreground">
                Find answers to the most common questions about our plants, delivery, and services. Can&apos;t find yours? Contact us.
              </p>
            </div>

            {/* WhatsApp support card */}
            <div className="rounded-lg bg-card border border-border p-5 space-y-3">
              <h3 className="text-h6 font-semibold text-foreground">Still have questions?</h3>
              <p className="text-body-sm text-muted-foreground">
                Chat with us on WhatsApp — quick replies guaranteed.
              </p>
              <Button asChild className="w-full gap-2 bg-[#25D366] hover:bg-[#25D366]/90 text-white">
                <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4 fill-white" aria-hidden="true" />
                  WhatsApp Us
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
                  <li key={item.id} className="rounded-lg bg-card border border-border overflow-hidden">
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      className="w-full flex items-center justify-between gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                    >
                      <span className="text-body font-medium text-foreground">{item.question}</span>
                      <span className="shrink-0 size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        {isOpen ? <Minus className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
                      </span>
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={cn("overflow-hidden transition-all duration-300", isOpen ? "max-h-96" : "max-h-0")}
                    >
                      <p className="p-4 pt-0 text-body-sm text-muted-foreground leading-relaxed">{item.answer}</p>
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
