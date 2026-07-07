"use client";

import Link from "next/link";
import {
  Home,
  ShoppingBag,
  BellRing,
  Heart,
  ShoppingCart,
  User,
  Settings,
  Bell,
  HelpCircle,
  MapPin,
  X,
  Sprout,
  Flower,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PincodeChecker } from "@/components/global/PincodeChecker";
import { useBilingual } from "@/store/useBilingual";
import type { LucideIcon } from "lucide-react";

/**
 * MobileDrawerNav — slide-out left navigation drawer for mobile.
 * Source: PRD §8.3 (Mobile Hamburger/Drawer: Categories, My Orders, My Bookings,
 *          Wishlist, Notifications, Settings, Help)
 *
 * Opens via hamburger button in mobile Header.
 * Contains: Logo + Pincode checker + Category accordion + Account links + Support.
 */

interface CategoryGroup {
  label: string;
  labelHi: string;
  icon: LucideIcon;
  href: string;
  children: { name: string; slug: string }[];
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    label: "Plants",
    labelHi: "पौधे",
    icon: Sprout,
    href: "/shop?category=plants",
    children: [
      { name: "Indoor Plants", slug: "indoor-plants" },
      { name: "Outdoor Plants", slug: "outdoor-plants" },
      { name: "Flowering Plants", slug: "flowering-plants" },
      { name: "Succulents", slug: "succulents" },
      { name: "Bonsai", slug: "bonsai" },
      { name: "Medicinal Plants", slug: "medicinal-plants" },
      { name: "Air Purifying Plants", slug: "air-purifying-plants" },
      { name: "Seasonal Plants", slug: "seasonal-plants" },
    ],
  },
  {
    label: "Planters",
    labelHi: "प्लांटर",
    icon: Flower,
    href: "/shop?category=planters",
    children: [
      { name: "Ceramic Planters", slug: "ceramic-planters" },
      { name: "Plastic Planters", slug: "plastic-planters" },
      { name: "Metal Planters", slug: "metal-planters" },
      { name: "Hanging Planters", slug: "hanging-planters" },
      { name: "Decorative Planters", slug: "decorative-planters" },
      { name: "Terracotta Planters", slug: "terracotta-planters" },
      { name: "Fiber Planters", slug: "fiber-planters" },
    ],
  },
  {
    label: "Gardening Products",
    labelHi: "बागवानी उत्पाद",
    icon: Wrench,
    href: "/shop?category=gardening-products",
    children: [
      { name: "Pots & Containers", slug: "pots-containers" },
      { name: "Seeds & Bulbs", slug: "seeds-bulbs" },
      { name: "Fertilizers & Manure", slug: "fertilizers-manure" },
      { name: "Soil & Cocopeat", slug: "soil-cocopeat" },
      { name: "Tools & Equipment", slug: "tools-equipment" },
      { name: "Accessories & Decor", slug: "accessories-decor" },
      { name: "Pest Control", slug: "pest-control" },
      { name: "Plant Food & Growth", slug: "plant-food-growth" },
    ],
  },
];

interface NavLinkItem {
  href: string;
  label: string;
  labelHi: string;
  icon: LucideIcon;
}

const ACCOUNT_LINKS: NavLinkItem[] = [
  { href: "/account/orders", label: "My Orders", labelHi: "मेरे ऑर्डर", icon: ShoppingCart },
  { href: "/account/bookings", label: "My Bookings", labelHi: "मेरी बुकिंग", icon: BellRing },
  { href: "/account/wishlist", label: "Wishlist", labelHi: "विशलिस्ट", icon: Heart },
  { href: "/account/notifications", label: "Notifications", labelHi: "सूचनाएं", icon: Bell },
  { href: "/account/settings", label: "Settings", labelHi: "सेटिंग्स", icon: Settings },
];

const SUPPORT_LINKS: NavLinkItem[] = [
  { href: "/faq", label: "Help & FAQ", labelHi: "सहायता और सामान्य प्रश्न", icon: HelpCircle },
  { href: "/contact", label: "Contact Us", labelHi: "संपर्क करें", icon: Bell },
  { href: "/become-provider", label: "Become a Provider", labelHi: "प्रदाता बनें", icon: Sprout },
];

export interface MobileDrawerNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileDrawerNav({ open, onOpenChange }: MobileDrawerNavProps) {
  const { t, language } = useBilingual();
  const isHi = language === "hi";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className={cn(
          "w-full sm:max-w-xs p-0 flex flex-col",
          "[&>button]:hidden"
        )}
      >
        {/* ---------- Header ---------- */}
        <SheetHeader className="p-4 border-b border-border space-y-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-h4">{t("nav.shop")}</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label="Close menu"
              className="rounded-full"
            >
              <X className="size-5" aria-hidden="true" />
            </Button>
          </div>
          <SheetDescription className="sr-only">
            Navigation menu with categories and account links
          </SheetDescription>
        </SheetHeader>

        {/* ---------- Scrollable content ---------- */}
        <div className="flex-1 overflow-y-auto scrollbar-pretty">
          {/* Home link */}
          <Link
            href="/"
            className="flex items-center gap-3 p-4 hover:bg-muted transition-colors border-b border-border"
            onClick={() => onOpenChange(false)}
          >
            <Home className="size-5 text-primary" aria-hidden="true" />
            <span className="text-body font-medium">
              {isHi ? "होम" : "Home"}
            </span>
          </Link>

          {/* Services link */}
          <Link
            href="/services"
            className="flex items-center gap-3 p-4 hover:bg-muted transition-colors border-b border-border"
            onClick={() => onOpenChange(false)}
          >
            <BellRing className="size-5 text-primary" aria-hidden="true" />
            <span className="text-body font-medium">
              {isHi ? "सेवाएं" : "Services"}
            </span>
          </Link>

          {/* Pincode checker */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-2 text-body-sm text-muted-foreground">
              <MapPin className="size-4" aria-hidden="true" />
              Delivery location
            </div>
            <PincodeChecker variant="compact" />
          </div>

          {/* Categories accordion */}
          <div className="p-2">
            <p className="text-overline text-muted-foreground px-2 py-2">
              {isHi ? "श्रेणियाँ" : "Categories"}
            </p>
            <Accordion type="multiple" className="w-full">
              {CATEGORY_GROUPS.map((cat) => (
                <AccordionItem key={cat.slug} value={cat.label} className="border-0">
                  <AccordionTrigger className="px-2 py-2.5 hover:bg-muted rounded-md text-body font-medium hover:no-underline">
                    <span className="flex items-center gap-3">
                      <cat.icon className="size-4 text-primary" aria-hidden="true" />
                      {isHi ? cat.labelHi : cat.label}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1">
                    <ul className="space-y-0.5 pl-7">
                      {cat.children.map((sub) => (
                        <li key={sub.slug}>
                          <Link
                            href={`/shop?category=${sub.slug}`}
                            onClick={() => onOpenChange(false)}
                            className="block px-2 py-1.5 rounded-md hover:bg-muted text-body-sm text-foreground"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href={cat.href}
                          onClick={() => onOpenChange(false)}
                          className="block px-2 py-1.5 rounded-md hover:bg-muted text-body-sm font-semibold text-primary"
                        >
                          View all →
                        </Link>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <Separator />

          {/* Account links */}
          <div className="p-2">
            <p className="text-overline text-muted-foreground px-2 py-2">
              {isHi ? "मेरा खाता" : "My Account"}
            </p>
            <ul className="space-y-0.5">
              <li>
                <Link
                  href="/account"
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted text-body text-foreground"
                >
                  <User className="size-4 text-primary" aria-hidden="true" />
                  {isHi ? "खाता" : "Account"}
                </Link>
              </li>
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted text-body text-foreground"
                  >
                    <link.icon className="size-4 text-primary" aria-hidden="true" />
                    {isHi ? link.labelHi : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Support links */}
          <div className="p-2 pb-4">
            <p className="text-overline text-muted-foreground px-2 py-2">
              {isHi ? "सहायता" : "Support"}
            </p>
            <ul className="space-y-0.5">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted text-body text-foreground"
                  >
                    <link.icon className="size-4 text-primary" aria-hidden="true" />
                    {isHi ? link.labelHi : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
