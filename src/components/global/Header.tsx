"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Heart, User, Search as SearchIcon, X, ShoppingCart, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/Logo";
import { IconBadge } from "@/components/common/IconBadge";
import { SearchBar } from "@/components/global/SearchBar";
import { PincodeChecker } from "@/components/global/PincodeChecker";
import { NotificationBell } from "@/components/global/NotificationBell";
import { MobileDrawerNav } from "@/components/global/MobileDrawerNav";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useBilingual } from "@/store/useBilingual";
import { appToast } from "@/lib/toast";

const NAV_LINKS = [
  { label: "SHOP", href: "/shop" },
  { label: "SERVICES", href: "/services" },
  { label: "NEW", href: "/shop?filter=new" },
  { label: "BEST SELLERS", href: "/shop?filter=bestseller" },
  { label: "TRENDING", href: "/shop?filter=trending" },
  { label: "OFFERS", href: "/offers" },
  { label: "BLOG", href: "/blog" },
];

const ACCENT_LINKS = [
  { label: "DEALS", href: "/deals", color: "text-error" },
  { label: "SEASONAL", href: "/shop?category=seasonal-plants", color: "text-warning" },
];

export function Header() {
  const { t } = useBilingual();
  const { itemCount, openDrawer } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const pathname = usePathname();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setAccountMenuOpen(false);
    }
    if (accountMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [accountMenuOpen]);

  const handleLogout = () => {
    logout();
    setAccountMenuOpen(false);
    appToast.success("Logged out", "You've been signed out of GrowPlants.");
  };

  const isActive = (href: string) => {
    if (href === "/shop") return pathname === "/shop" || pathname.startsWith("/product");
    if (href === "/services") return pathname === "/services" || pathname.startsWith("/services");
    if (href === "/blog") return pathname.startsWith("/blog");
    return pathname === href;
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full bg-background border-b border-border"
        role="banner"
      >
        {/* ---------- Top row ---------- */}
        <div className="container-mw container-px">
          <div className="flex items-center gap-3 h-16 lg:h-18">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
              <Menu className="size-5" aria-hidden="true" />
            </Button>

            <Logo size="md" className="shrink-0" />

            <div className="hidden md:block flex-1 max-w-xl mx-4">
              <SearchBar variant="header" />
            </div>

            <div className="hidden xl:block">
              <PincodeChecker variant="compact" />
            </div>

            <Button variant="ghost" size="icon" className="md:hidden ml-auto" onClick={() => setMobileSearchOpen((v) => !v)} aria-label="Search" aria-expanded={mobileSearchOpen}>
              {mobileSearchOpen ? <X className="size-5" aria-hidden="true" /> : <SearchIcon className="size-5" aria-hidden="true" />}
            </Button>

            <IconBadge icon={Heart} count={wishlistCount} label={t("nav.wishlist")} href={isAuthenticated ? "/account/wishlist" : "/login"} className="hidden sm:inline-flex" />
            {isAuthenticated && <NotificationBell className="hidden sm:block" />}
            <IconBadge icon={ShoppingCart} count={itemCount} label={t("nav.cart")} onClick={openDrawer} className="cursor-pointer" />

            {isAuthenticated && user ? (
              <div ref={accountRef} className="relative">
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((v) => !v)}
                  className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-body-sm hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={`${t("nav.account")} — ${user.fullName}`}
                  aria-expanded={accountMenuOpen}
                  aria-haspopup="true"
                >
                  {user.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt={user.fullName} className="size-10 rounded-full object-cover" />
                  ) : (
                    user.fullName.charAt(0).toUpperCase()
                  )}
                </button>
                {accountMenuOpen && (
                  <div role="menu" aria-label="Account menu" className="absolute top-full right-0 mt-2 w-64 rounded-xl border border-border bg-popover shadow-lg overflow-hidden z-50">
                    <div className="p-4 border-b border-border bg-muted/30">
                      <p className="text-body font-semibold text-foreground truncate">{user.fullName}</p>
                      <p className="text-caption text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link href="/account" onClick={() => setAccountMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-body-sm text-foreground" role="menuitem">
                        <User className="size-4 text-primary" aria-hidden="true" />
                        {t("nav.account")}
                      </Link>
                      <Link href="/account/settings" onClick={() => setAccountMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-body-sm text-foreground" role="menuitem">
                        <Settings className="size-4 text-primary" aria-hidden="true" />
                        {t("nav.settings")}
                      </Link>
                    </div>
                    <div className="p-2 border-t border-border">
                      <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-destructive/10 text-body-sm text-destructive" role="menuitem">
                        <LogOut className="size-4" aria-hidden="true" />
                        {t("nav.logout")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="ghost" size="icon" asChild className="rounded-full" aria-label={t("nav.login")}>
                <Link href="/login"><User className="size-5" aria-hidden="true" /></Link>
              </Button>
            )}
          </div>

          {mobileSearchOpen && (
            <div className="md:hidden pb-3">
              <SearchBar variant="mobile" />
            </div>
          )}
        </div>

        {/* ---------- Bottom nav row (desktop) ---------- */}
        <div className="hidden lg:block border-t border-border bg-background">
          <div className="container-mw container-px">
            <nav className="flex items-center justify-between h-11" aria-label="Main navigation">
              <ul className="flex items-center gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-overline font-semibold tracking-wide transition-colors",
                        isActive(link.href)
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:text-primary hover:bg-muted"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="flex items-center gap-1">
                {ACCENT_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-overline font-bold tracking-wide hover:bg-muted transition-colors",
                        link.color
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <MobileDrawerNav open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
}
