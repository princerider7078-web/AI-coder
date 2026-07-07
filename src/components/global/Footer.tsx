"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sprout,
  Flower,
  Wrench,
  BellRing,
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/common/Logo";
import { useBilingual } from "@/store/useBilingual";
import { CONTACT_PHONE, CONTACT_EMAIL, CONTACT_ADDRESS, BUSINESS_HOURS, SOCIAL_LINKS } from "@/lib/constants";
import { appToast } from "@/lib/toast";

/**
 * Footer — multi-column footer with shop/services/support/company links,
 * trust badges, payment method icons, social media, newsletter signup,
 * and contact info.
 * Source: 05_recreation_prompts.md Prompt 5
 *
 * Layout:
 *   Row 1: 4 trust badges (Free shipping, Verified gardeners, Easy returns, Support)
 *   Row 2: 5 columns (Shop, Services, Support, Company, Newsletter)
 *   Row 3: Contact info + Social icons
 *   Row 4: Payment methods + Copyright + Sitemap
 */

interface FooterLink {
  label: string;
  labelHi: string;
  href: string;
}

const SHOP_LINKS: FooterLink[] = [
  { label: "Indoor Plants", labelHi: "इंडोर पौधे", href: "/shop?category=indoor-plants" },
  { label: "Outdoor Plants", labelHi: "आउटडोर पौधे", href: "/shop?category=outdoor-plants" },
  { label: "Succulents", labelHi: "रसीले पौधे", href: "/shop?category=succulents" },
  { label: "Ceramic Planters", labelHi: "सिरामिक प्लांटर", href: "/shop?category=ceramic-planters" },
  { label: "Seeds & Bulbs", labelHi: "बीज और बल्ब", href: "/shop?category=seeds-bulbs" },
  { label: "Gardening Tools", labelHi: "बागवानी उपकरण", href: "/shop?category=tools-equipment" },
];

const SERVICE_LINKS: FooterLink[] = [
  { label: "Gardener Hiring", labelHi: "माली किराये पर", href: "/services/gardener-hiring" },
  { label: "Balcony Garden Setup", labelHi: "बालकनी गार्डन", href: "/services/balcony-setup" },
  { label: "Terrace Garden Setup", labelHi: "छत गार्डन", href: "/services/terrace-setup" },
  { label: "Garden Maintenance", labelHi: "बगीचा रखरखाव", href: "/services/garden-maintenance" },
  { label: "Lawn Care", labelHi: "लॉन देखभाल", href: "/services/lawn-maintenance" },
  { label: "Become a Provider", labelHi: "प्रदाता बनें", href: "/become-provider" },
];

const SUPPORT_LINKS: FooterLink[] = [
  { label: "Help & FAQ", labelHi: "सहायता और सामान्य प्रश्न", href: "/faq" },
  { label: "Contact Us", labelHi: "संपर्क करें", href: "/contact" },
  { label: "Track Order", labelHi: "ऑर्डर ट्रैक करें", href: "/account/orders" },
  { label: "Returns & Refunds", labelHi: "रिटर्न और रिफंड", href: "/refund-policy" },
  { label: "Shipping Info", labelHi: "शिपिंग जानकारी", href: "/faq#shipping" },
];

const COMPANY_LINKS: FooterLink[] = [
  { label: "About Us", labelHi: "हमारे बारे में", href: "/about" },
  { label: "Privacy Policy", labelHi: "गोपनीयता नीति", href: "/privacy-policy" },
  { label: "Terms & Conditions", labelHi: "नियम और शर्तें", href: "/terms" },
  { label: "Refund Policy", labelHi: "रिफंड नीति", href: "/refund-policy" },
];

const TRUST_BADGES = [
  { icon: Truck, title: "Fast Delivery", titleHi: "तेज़ डिलीवरी", desc: "Free above ₹499", descHi: "₹499 से मुफ़्त" },
  { icon: ShieldCheck, title: "Verified Gardeners", titleHi: "सत्यापित माली", desc: "Background-checked", descHi: "जांचे हुए" },
  { icon: RefreshCw, title: "Easy Returns", titleHi: "आसान रिटर्न", desc: "24h for plants", descHi: "पौधों के लिए 24 घंटे" },
  { icon: Headphones, title: "Customer Support", titleHi: "ग्राहक सहायता", desc: "Mon–Sun, 9AM–7PM", descHi: "सोम–रवि, 9AM–7PM" },
];

export function Footer() {
  const { t, language } = useBilingual();
  const isHi = language === "hi";
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    appToast.success("Subscribed!", "You'll receive gardening tips and exclusive offers.");
    setEmail("");
  };

  const renderLink = (link: FooterLink) => (
    <li key={link.href}>
      <Link
        href={link.href}
        className="text-body-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors"
      >
        {isHi ? link.labelHi : link.label}
      </Link>
    </li>
  );

  return (
    <footer
      className="bg-card border-t border-border mt-auto"
      role="contentinfo"
    >
      {/* ---------- Trust badges ---------- */}
      <div className="border-b border-border">
        <div className="container-mw container-px">
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
            {TRUST_BADGES.map((badge) => (
              <li key={badge.title} className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <badge.icon className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-body-sm font-semibold text-foreground">
                    {isHi ? badge.titleHi : badge.title}
                  </p>
                  <p className="text-caption text-muted-foreground">
                    {isHi ? badge.descHi : badge.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---------- Main columns ---------- */}
      <div className="container-mw container-px py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand + Newsletter (spans 2 on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-body-sm text-muted-foreground max-w-xs">
              {t("brand.tagline")}
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-body-sm font-semibold text-foreground mb-2">
                {t("footer.newsletter")}
              </p>
              <form onSubmit={handleNewsletter} className="flex gap-2 max-w-sm">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("footer.newsletter.placeholder")}
                  aria-label="Email for newsletter"
                  required
                  className="rounded-md"
                />
                <Button type="submit" className="shrink-0">
                  {t("footer.newsletter.cta")}
                </Button>
              </form>
            </div>

            {/* Contact info */}
            <div className="pt-4 space-y-1.5 text-body-sm text-muted-foreground">
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Phone className="size-4 text-primary" aria-hidden="true" />
                {CONTACT_PHONE}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail className="size-4 text-primary" aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                {CONTACT_ADDRESS}
              </p>
              <p className="text-caption pl-6">{BUSINESS_HOURS}</p>
            </div>
          </div>

          {/* Shop column */}
          <div>
            <h3 className="text-body font-semibold text-foreground mb-3 flex items-center gap-2">
              <Sprout className="size-4 text-primary" aria-hidden="true" />
              {t("footer.shop")}
            </h3>
            <ul className="space-y-2">
              {SHOP_LINKS.map(renderLink)}
              <li>
                <Link href="/shop" className="text-body-sm font-semibold text-primary hover:underline underline-offset-4">
                  {isHi ? "सभी देखें" : "View all"} →
                </Link>
              </li>
            </ul>
          </div>

          {/* Services column */}
          <div>
            <h3 className="text-body font-semibold text-foreground mb-3 flex items-center gap-2">
              <BellRing className="size-4 text-primary" aria-hidden="true" />
              {t("footer.services")}
            </h3>
            <ul className="space-y-2">
              {SERVICE_LINKS.map(renderLink)}
            </ul>
          </div>

          {/* Support + Company combined */}
          <div>
            <h3 className="text-body font-semibold text-foreground mb-3 flex items-center gap-2">
              <Headphones className="size-4 text-primary" aria-hidden="true" />
              {t("footer.support")}
            </h3>
            <ul className="space-y-2 mb-6">
              {SUPPORT_LINKS.map(renderLink)}
            </ul>
            <h3 className="text-body font-semibold text-foreground mb-3">
              {isHi ? "कंपनी" : "Company"}
            </h3>
            <ul className="space-y-2">
              {COMPANY_LINKS.map(renderLink)}
            </ul>
          </div>
        </div>
      </div>

      <Separator />

      {/* ---------- Bottom row: social + payment + copyright ---------- */}
      <div className="container-mw container-px py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Social */}
          <div className="flex items-center gap-2">
            <span className="text-body-sm text-muted-foreground mr-2">
              {t("footer.followUs")}:
            </span>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="size-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
            >
              <Instagram className="size-4" aria-hidden="true" />
            </a>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="size-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
            >
              <Facebook className="size-4" aria-hidden="true" />
            </a>
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="size-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
            >
              <Youtube className="size-4" aria-hidden="true" />
            </a>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="size-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
            </a>
          </div>

          {/* Payment methods (text badges — Phase 14 will add real icons) */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-body-sm text-muted-foreground mr-1">
              {t("footer.paymentMethods")}:
            </span>
            {["UPI", "Visa", "Mastercard", "RuPay", "COD"].map((method) => (
              <span
                key={method}
                className="text-caption font-semibold px-2 py-1 rounded border border-border bg-background"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-caption text-muted-foreground">
          <p>{t("footer.rights", { year: new Date().getFullYear() })}</p>
          <p>Crafted with 🌱 in Sonipat, Haryana</p>
        </div>
      </div>
    </footer>
  );
}
