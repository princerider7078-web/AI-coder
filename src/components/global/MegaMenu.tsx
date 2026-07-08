"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sprout, Flower, Wrench, BellRing } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBilingual } from "@/store/useBilingual";
import type { LucideIcon } from "lucide-react";

/**
 * MegaMenu — desktop dropdown navigation for the 3 main product pillars.
 * Source: PRD §8.3 (Navigation Structure), §9.1 (Category Management — 2-level hierarchy)
 *
 * Structure:
 *   Plants → [Indoor, Outdoor, Flowering, Succulents, Bonsai, Medicinal, Air-Purifying, Seasonal]
 *   Planters → [Ceramic, Plastic, Metal, Hanging, Decorative, Terracotta, Fiber]
 *   Gardening Products → [Pots & Containers, Seeds & Bulbs, Fertilizers, Soil & Cocopeat, Tools, Accessories, Pest Control, Plant Food]
 *   Services → [Gardener Hiring, Balcony Setup, Terrace Setup, Garden Maintenance, Lawn Care, Landscape Design, Plant Health Check]
 */

interface SubCategory {
  name: string;
  slug: string;
  nameHi?: string;
}

interface MegaCategory {
  label: string;
  labelHi: string;
  icon: LucideIcon;
  href: string;
  subtitle: string;
  subtitleHi: string;
  children: SubCategory[];
}

const CATEGORIES: MegaCategory[] = [
  {
    label: "Plants",
    labelHi: "पौधे",
    icon: Sprout,
    href: "/shop?category=plants",
    subtitle: "Healthy plants for every space",
    subtitleHi: "हर जगह के लिए स्वस्थ पौधे",
    children: [
      { name: "Indoor Plants", slug: "indoor-plants", nameHi: "इंडोर पौधे" },
      { name: "Outdoor Plants", slug: "outdoor-plants", nameHi: "आउटडोर पौधे" },
      { name: "Flowering Plants", slug: "flowering-plants", nameHi: "फूलों के पौधे" },
      { name: "Succulents", slug: "succulents", nameHi: "रसीले पौधे" },
      { name: "Bonsai", slug: "bonsai", nameHi: "बोंसाई" },
      { name: "Medicinal Plants", slug: "medicinal-plants", nameHi: "औषधीय पौधे" },
      { name: "Air Purifying Plants", slug: "air-purifying-plants", nameHi: "वायु शुद्धिकारक पौधे" },
      { name: "Seasonal Plants", slug: "seasonal-plants", nameHi: "मौसमी पौधे" },
    ],
  },
  {
    label: "Planters",
    labelHi: "प्लांटर",
    icon: Flower,
    href: "/shop?category=planters",
    subtitle: "Premium pots & planters",
    subtitleHi: "प्रीमियम गमले और प्लांटर",
    children: [
      { name: "Ceramic Planters", slug: "ceramic-planters", nameHi: "सिरामिक प्लांटर" },
      { name: "Plastic Planters", slug: "plastic-planters", nameHi: "प्लास्टिक प्लांटर" },
      { name: "Metal Planters", slug: "metal-planters", nameHi: "धातु प्लांटर" },
      { name: "Hanging Planters", slug: "hanging-planters", nameHi: "लटकते प्लांटर" },
      { name: "Decorative Planters", slug: "decorative-planters", nameHi: "सजावटी प्लांटर" },
      { name: "Terracotta Planters", slug: "terracotta-planters", nameHi: "मिट्टी के प्लांटर" },
      { name: "Fiber Planters", slug: "fiber-planters", nameHi: "फाइबर प्लांटर" },
    ],
  },
  {
    label: "Gardening Products",
    labelHi: "बागवानी उत्पाद",
    icon: Wrench,
    href: "/shop?category=gardening-products",
    subtitle: "Everything for your garden",
    subtitleHi: "आपके बगीचे के लिए सब कुछ",
    children: [
      { name: "Pots & Containers", slug: "pots-containers", nameHi: "गमले और कंटेनर" },
      { name: "Seeds & Bulbs", slug: "seeds-bulbs", nameHi: "बीज और बल्ब" },
      { name: "Fertilizers & Manure", slug: "fertilizers-manure", nameHi: "खाद और उर्वरक" },
      { name: "Soil & Cocopeat", slug: "soil-cocopeat", nameHi: "मिट्टी और कोकोपीट" },
      { name: "Tools & Equipment", slug: "tools-equipment", nameHi: "उपकरण" },
      { name: "Accessories & Decor", slug: "accessories-decor", nameHi: "सामान और सजावट" },
      { name: "Pest Control", slug: "pest-control", nameHi: "कीट नियंत्रण" },
      { name: "Plant Food & Growth", slug: "plant-food-growth", nameHi: "पौधा भोजन" },
    ],
  },
  {
    label: "Services",
    labelHi: "सेवाएं",
    icon: BellRing,
    href: "/services",
    subtitle: "Book verified local gardeners",
    subtitleHi: "सत्यापित स्थानीय माली बुक करें",
    children: [
      { name: "Gardener Hiring", slug: "gardener-hiring", nameHi: "माली किराये पर" },
      { name: "Plant Installation", slug: "plant-installation", nameHi: "पौधा स्थापना" },
      { name: "Balcony Garden Setup", slug: "balcony-setup", nameHi: "बालकनी गार्डन" },
      { name: "Terrace Garden Setup", slug: "terrace-setup", nameHi: "छत गार्डन" },
      { name: "Garden Maintenance", slug: "garden-maintenance", nameHi: "बगीचा रखरखाव" },
      { name: "Lawn Maintenance", slug: "lawn-maintenance", nameHi: "लॉन रखरखाव" },
      { name: "Landscape Design", slug: "landscape-design", nameHi: "लैंडस्केप डिज़ाइन" },
      { name: "Plant Health Inspection", slug: "plant-health", nameHi: "पौधा स्वास्थ्य जांच" },
    ],
  },
];

export function MegaMenu() {
  const { language } = useBilingual();
  const isHi = language === "hi";

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {CATEGORIES.map((cat) => (
          <NavigationMenuItem key={cat.href}>
            <NavigationMenuTrigger className="text-body font-medium">
              {isHi ? cat.labelHi : cat.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div key={cat.href} className="w-[480px] p-4">
                {/* Header row */}
                <div className="flex items-start gap-3 p-3 mb-2 rounded-lg bg-muted/50">
                  <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <cat.icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-body font-semibold text-foreground">
                      {isHi ? cat.labelHi : cat.label}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {isHi ? cat.subtitleHi : cat.subtitle}
                    </p>
                  </div>
                </div>

                {/* Subcategory grid (2 columns) */}
                <ul className="grid grid-cols-2 gap-1">
                  {cat.children.map((sub) => (
                    <li key={sub.slug}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/shop?category=${sub.slug}`}
                          className={cn(
                            "block p-2 rounded-md hover:bg-muted transition-colors",
                            "text-body-sm text-foreground"
                          )}
                        >
                          {isHi ? sub.nameHi ?? sub.name : sub.name}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>

                {/* View all footer */}
                <div className="mt-3 pt-3 border-t border-border">
                  <NavigationMenuLink asChild>
                    <Link
                      href={cat.href}
                      className={cn(
                        "block p-2 rounded-md hover:bg-muted transition-colors text-center",
                        "text-body-sm font-semibold text-primary"
                      )}
                    >
                      View all {isHi ? cat.labelHi : cat.label} →
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}

        {/* About link (simple, no dropdown) */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/about" className={navigationMenuTriggerStyle()}>
              {isHi ? "हमारे बारे में" : "About"}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
