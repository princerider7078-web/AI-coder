"use client";

/**
 * ============================================================================
 * GrowPlants — Phase 3 Layout Verification Page (TEMPORARY)
 * ============================================================================
 *
 * This page verifies that the Phase 3 Layout System is fully functional:
 *   - AnnouncementBar rotates bilingual promos
 *   - Header renders with logo image, search bar, mega menu, icon badges
 *   - CartDrawer opens when cart icon is clicked (try the "Add Demo Item"
 *     buttons below to populate the cart)
 *   - Footer renders all columns + trust badges + newsletter
 *   - MobileBottomNav shows on mobile (<768px)
 *   - MobileDrawerNav opens via hamburger
 *
 * This page will be REPLACED by the real GrowPlants Homepage in Phase 4.
 * ============================================================================
 */
import { Sprout, ShoppingCart, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { useCart } from "@/contexts/CartContext";
import { useBilingual } from "@/store/useBilingual";
import { formatINR } from "@/lib/utils";

// Demo products for "add to cart" testing
const DEMO_PRODUCTS = [
  {
    productId: "1",
    name: "Snake Plant (Sansevieria)",
    slug: "snake-plant",
    price: 299,
    image: "https://nurserylive.com/cdn/shop/products/nurserylive-snake-plant-sansevieria-trifasciata-plant_600x600.jpg",
  },
  {
    productId: "2",
    name: "Money Plant (Pothos)",
    slug: "money-plant",
    price: 249,
    image: "https://nurserylive.com/cdn/shop/products/nurserylive-money-plant-po-thos-plant_600x600.jpg",
  },
  {
    productId: "3",
    name: "Areca Palm",
    slug: "areca-palm",
    price: 499,
    image: "https://nurserylive.com/cdn/shop/products/nurserylive-areca-palm-plant_600x600.jpg",
  },
  {
    productId: "4",
    name: "ZZ Plant",
    slug: "zz-plant",
    price: 599,
    image: "https://nurserylive.com/cdn/shop/products/nurserylive-zz-plant_600x600.jpg",
  },
];

export default function Phase3LayoutVerificationPage() {
  const { addItem, openDrawer, items, itemCount, subtotal } = useCart();
  const { t } = useBilingual();

  const handleAddDemo = (product: (typeof DEMO_PRODUCTS)[number]) => {
    addItem({
      productId: product.productId,
      variantId: null,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      quantity: 1,
      inStock: true,
    });
    openDrawer();
  };

  return (
    <Container variant="default" className="section-py">
      {/* ---------- Hero ---------- */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-body-sm font-medium mb-4">
          <Sparkles className="size-4" aria-hidden="true" />
          Phase 3 — Layout System Complete
        </div>
        <h1 className="text-display mb-4">
          {t("hero.title")}
        </h1>
        <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          {t("hero.subtitle")}
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button size="lg" asChild>
            <a href="/shop">{t("hero.ctaPrimary")}</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="/services">{t("hero.ctaSecondary")}</a>
          </Button>
        </div>
      </section>

      {/* ---------- Status Banner ---------- */}
      <Card className="mb-12 border-primary/30 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-4">
          <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
          <div className="text-body-sm">
            <p className="font-semibold text-foreground">
              Layout shell ready for Phase 4 (Homepage)
            </p>
            <p className="text-muted-foreground mt-1">
              AnnouncementBar, Header (with your logo, search, mega menu, pincode
              checker, wishlist, notifications, cart, account), CartDrawer, Footer
              (trust badges, multi-column links, newsletter, social, payment
              methods), MobileBottomNav, and MobileDrawerNav are all wired and
              functional. Try clicking the cart icon in the header or adding demo
              items below.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ---------- Demo: Add to Cart ---------- */}
      <SectionHeader
        title="Test the Cart Drawer"
        subtitle="Click any button below to add an item to the cart — the CartDrawer slides in automatically"
        icon={ShoppingCart}
        className="mb-6"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {DEMO_PRODUCTS.map((product) => (
          <Card key={product.productId} className="overflow-hidden hover-lift">
            <CardContent className="p-4 space-y-3">
              <div className="aspect-square rounded-md bg-muted flex items-center justify-center">
                <Sprout className="size-12 text-muted-foreground" aria-hidden="true" />
              </div>
              <div>
                <p className="text-body-sm font-medium text-foreground line-clamp-2">
                  {product.name}
                </p>
                <p className="text-h4 font-bold text-foreground mt-1">
                  {formatINR(product.price)}
                </p>
              </div>
              <Button
                className="w-full gap-2"
                onClick={() => handleAddDemo(product)}
              >
                <ShoppingCart className="size-4" aria-hidden="true" />
                {t("common.btn.addToCart")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ---------- Cart State ---------- */}
      <Card className="mb-12">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-overline text-muted-foreground mb-1">Live cart state (from CartContext)</p>
              <p className="text-h3 font-bold text-foreground">
                {itemCount} {itemCount === 1 ? "item" : "items"} · {formatINR(subtotal)}
              </p>
            </div>
            <Button onClick={openDrawer} disabled={itemCount === 0} className="gap-2">
              <ShoppingCart className="size-4" aria-hidden="true" />
              Open Cart Drawer
            </Button>
          </div>
          {items.length > 0 && (
            <>
              <Separator className="my-4" />
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between text-body-sm">
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {item.quantity} × {formatINR(item.price)} = {formatINR(item.quantity * item.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>

      {/* ---------- What's Wired ---------- */}
      <SectionHeader
        title="What's Wired in Phase 3"
        subtitle="Every component below is functional — try them"
        className="mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        <FeatureCard
          icon={Sparkles}
          title="AnnouncementBar"
          desc="Rotating bilingual promos above the header. Dismissible (persists per session)."
        />
        <FeatureCard
          icon={ShoppingCart}
          title="Header + Search"
          desc="Logo image, search with autocomplete dropdown, pincode checker, icon badges."
        />
        <FeatureCard
          icon={Sprout}
          title="MegaMenu"
          desc="Desktop dropdown with 2-level category hierarchy (Plants/Planters/Products/Services)."
        />
        <FeatureCard
          icon={ShoppingCart}
          title="CartDrawer"
          desc="Slide-out cart with free-shipping progress, quantity selectors, checkout CTA."
        />
        <FeatureCard
          icon={CheckCircle2}
          title="Footer"
          desc="4 trust badges, 5 link columns, newsletter signup, social icons, payment methods."
        />
        <FeatureCard
          icon={Sprout}
          title="Mobile Nav"
          desc="Bottom tab bar (Home/Shop/Services/Cart/Account) + hamburger drawer with categories."
        />
      </div>

      {/* ---------- Note ---------- */}
      <Card className="bg-muted/30">
        <CardContent className="p-6 text-center">
          <p className="text-body-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> The links in the
            Header, MegaMenu, Footer, and MobileBottomNav point to routes
            (/shop, /services, /account, etc.) that will be built in Phases 4–13.
            For now they return 404 — that&apos;s expected. The layout shell itself
            is fully functional. The real Homepage replaces this page in Phase 4.
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Sprout;
  title: string;
  desc: string;
}) {
  return (
    <Card className="h-full">
      <CardContent className="p-4 flex items-start gap-3">
        <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-body font-semibold text-foreground">{title}</p>
          <p className="text-body-sm text-muted-foreground mt-0.5">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}
