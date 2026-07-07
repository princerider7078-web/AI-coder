"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBilingual } from "@/store/useBilingual";

/**
 * AnnouncementBar — top promotional strip above the Header.
 * Source: 05_recreation_prompts.md Prompt 5
 *
 * Features:
 *   - Bilingual rotating messages (EN/HI from Zustand store)
 *   - Auto-rotates every 5 seconds through a small set of messages
 *   - User-dismissable (persists dismissal in sessionStorage so it doesn't
 *     nag on every page navigation within a session)
 *   - Respects prefers-reduced-motion (no rotation)
 *
 * Used at the very top of MainLayout, above the Header.
 */
const MESSAGES_EN = [
  "🚚 Free shipping on orders above ₹499 in Sonipat",
  "🌱 New arrivals: Fresh indoor plants just landed",
  " Gardner bookings now open in Sonipat — book today",
  " Use code GROW10 for 10% off your first order",
];

const MESSAGES_HI = [
  "🚚 सोनीपत में ₹499 से ऊपर के ऑर्डर पर मुफ़्त शिपिंग",
  "🌱 नई आवक: ताज़े इंडोर पौधे अभी आए",
  " सोनीपत में माली बुकिंग अब खुली — आज ही बुक करें",
  " अपने पहले ऑर्डर पर 10% छूट के लिए GROW10 का उपयोग करें",
];

const DISMISS_KEY = "growplants-announcement-dismissed";

export function AnnouncementBar() {
  const { language } = useBilingual();
  const messages = language === "hi" ? MESSAGES_HI : MESSAGES_EN;
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Check dismissal on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") {
      setDismissed(true);
    }
  }, []);

  // Auto-rotate messages (respect reduced motion)
  useEffect(() => {
    if (dismissed) return;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [dismissed, messages.length]);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(DISMISS_KEY, "1");
    }
  };

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "relative w-full bg-primary text-primary-foreground",
        "px-4 py-2 text-body-sm text-center",
        "flex items-center justify-center gap-2"
      )}
      role="region"
      aria-label="Announcement"
    >
      <Sparkles className="size-3.5 shrink-0 opacity-80" aria-hidden="true" />
      <p
        className="font-medium transition-opacity duration-300"
        key={index}
        aria-live="polite"
      >
        {messages[index]}
      </p>
      <button
        type="button"
        onClick={handleDismiss}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2",
          "size-6 inline-flex items-center justify-center rounded-sm",
          "hover:bg-primary-foreground/20 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-1 focus-visible:ring-offset-primary"
        )}
        aria-label="Dismiss announcement"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
