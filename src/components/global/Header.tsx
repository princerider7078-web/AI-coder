"use client";

import { useState } from "react";
import { Menu, Heart, User, Search as SearchIcon, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/Logo";
import { IconBadge } from "@/components/common/IconBadge";
import { MegaMenu } from "@/components/global/MegaMenu";
import { SearchBar } from "@/components/global/SearchBar";
import { PincodeChecker } from "@/components/global/PincodeChecker";
import { NotificationBell } from "@/components/global/NotificationBell";
import { MobileDrawerNav } from "@/components/global/MobileDrawerNav";
import { useCart } from "@/contexts/CartContext";
import { useBilingual } from "@/store/useBilingual";
import { ShoppingCart } from "lucide-react";

/**
 * Header — the main desktop + mobile header.
 * Source: PRD §8.3 (Navigation Structure), 05_recreation_prompts.md Prompt 5
 *
 * Layout (desktop ≥1024px):
 *   [Logo] [SearchBar...........] [PincodeChecker] [Wishlist] [Notifications] [Cart] [Account]
 *   [MegaMenu: Plants | Planters | Gardening Products | Services | About]
 *
 * Layout (mobile <1024px):
 *   [Hamburger] [Logo] [Cart]
 *   [SearchBar (collapsible, full-width when open)]
 *
 * NOTE: Language toggle is intentionally omitted per user request.
 * The bilingual Zustand store remains active internally for all labels.
 */
export function Header() {
  const { t } = useBilingual();
  const { itemCount, openDrawer } = useCart();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border"
        role="banner"
      >
        {/* ---------- Top row ---------- */}
        <div className="container-mw container-px">
          <div className="flex items-center gap-3 h-16 lg:h-18">
            {/* Mobile: hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>

            {/* Logo */}
            <Logo size="md" className="shrink-0" />

            {/* Desktop search */}
            <div className="hidden md:block flex-1 max-w-xl mx-4">
              <SearchBar variant="header" />
            </div>

            {/* Desktop: pincode checker */}
            <div className="hidden xl:block">
              <PincodeChecker variant="compact" />
            </div>

            {/* Mobile: search toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden ml-auto"
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="Search"
              aria-expanded={mobileSearchOpen}
            >
              {mobileSearchOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <SearchIcon className="size-5" aria-hidden="true" />
              )}
            </Button>

            {/* Wishlist */}
            <IconBadge
              icon={Heart}
              count={3} // Phase 5+ replaces with real wishlist count
              label={t("nav.wishlist")}
              href="/account/wishlist"
              className="hidden sm:inline-flex"
            />

            {/* Notifications */}
            <NotificationBell className="hidden sm:block" />

            {/* Cart */}
            <IconBadge
              icon={ShoppingCart}
              count={itemCount}
              label={t("nav.cart")}
              onClick={openDrawer}
              className="cursor-pointer"
            />

            {/* Account */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full"
              aria-label={t("nav.account")}
            >
              <Link href="/account">
                <User className="size-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {/* ---------- Mobile search (collapsible) ---------- */}
          {mobileSearchOpen && (
            <div className="md:hidden pb-3">
              <SearchBar variant="mobile" />
            </div>
          )}
        </div>

        {/* ---------- Bottom row: MegaMenu (desktop only) ---------- */}
        <div className="hidden lg:block border-t border-border bg-background">
          <div className="container-mw container-px">
            <nav className="flex items-center h-12" aria-label="Main navigation">
              <MegaMenu />
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile drawer nav */}
      <MobileDrawerNav open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
}
