'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  Globe,
  ChevronDown,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { MegaMenu } from './MegaMenu';
import { MiniCartPreview } from './MiniCartPreview';
import { MiniWishlistPreview } from './MiniWishlistPreview';
import { SearchSuggestionsOverlay } from './SearchSuggestionsOverlay';

const SEARCH_CATEGORIES = [
  'All Categories',
  'Indoor Plants',
  'Outdoor Plants',
  'Planters',
  'Services'
];

export const Header: React.FC = () => {
  const { firebaseUser } = useAuth();
  const { userData } = useUser();
  const { items, openCart } = useCart();
  const { items: wishlistItems } = useWishlist();

  // Dialog & Dropdown States
  const [cartHovered, setCartHovered] = useState(false);
  const [wishlistHovered, setWishlistHovered] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  // Mobile search state
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search logic states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showSearchCategoryDropdown, setShowSearchCategoryDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Suggestions states
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [suggestionsCount, setSuggestionsCount] = useState(0);

  // Sticky header scrolled state
  const [scrolled, setScrolled] = useState(false);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // References for clicking outside
  const categorySelectRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Scroll detection
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Click outside listener
    const handleClickOutside = (event: MouseEvent) => {
      if (categorySelectRef.current && !categorySelectRef.current.contains(event.target as Node)) {
        setShowSearchCategoryDropdown(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const executeSearch = (queryStr: string = searchQuery) => {
    const term = queryStr.trim();
    if (term) {
      // Add to recent searches
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('growplants_recent_searches');
        let searches: string[] = saved ? JSON.parse(saved) : [];
        searches = [term, ...searches.filter(s => s !== term)].slice(0, 5);
        localStorage.setItem('growplants_recent_searches', JSON.stringify(searches));
      }

      const catParam = selectedCategory !== 'All Categories' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
      window.location.href = `/shop?q=${encodeURIComponent(term)}${catParam}`;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  // Keyboard navigation inside search suggestions dropdown
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchFocused || suggestionsCount === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev + 1) % suggestionsCount);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev - 1 + suggestionsCount) % suggestionsCount);
    } else if (e.key === 'Enter') {
      if (activeSuggestionIndex >= 0) {
        e.preventDefault();
        // Trigger action based on focused item in suggestions overlay
        // overlay component click handler handles search execution, so we trigger selection
        const suggestionsBox = document.querySelectorAll('[onMouseDown]');
        if (suggestionsBox.length > 0) {
          const activeEl = suggestionsBox[activeSuggestionIndex] as HTMLElement;
          if (activeEl) {
            activeEl.click();
          }
        }
      }
    } else if (e.key === 'Escape') {
      setSearchFocused(false);
    }
  };

  return (
    <>

      {/* Sticky Container for Tier 2 and Tier 3 */}
      <div className={`sticky top-0 z-40 w-full bg-white transition-all duration-300 ${scrolled ? 'shadow-md border-b border-slate-100' : 'border-b border-slate-200'
        }`}>

        {/* ==================== TIER 2: MAIN MARKETPLACE HEADER ==================== */}
        <div className="h-[52px] lg:h-[56px] flex items-center px-4 md:px-6">
          <div className="max-w-[1400px] mx-auto w-full flex items-center gap-4 lg:gap-6">

            {/* Hamburger (Mobile) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-700 hover:text-[#1A6B3C]"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                <img
                  src="https://res.cloudinary.com/dszy67wp5/image/upload/v1753527438/ChatGPT_Image_Jul_26_2025_04_13_53_PM_rwtuqx.png"
                  alt="GrowPlants Logo"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-base lg:text-lg text-[#1A6B3C] tracking-tight leading-none">
                  GROWPLANTS
                </span>
                <span className="text-[9px] text-slate-400 font-semibold tracking-wide mt-0 uppercase hidden sm:inline-block">
                  Plants & Services
                </span>
              </div>
            </Link>

            {/* Center Search Bar Container */}
            <div className="hidden lg:flex flex-1 justify-center px-2">
              {/* Search-First Dominant Marketplace Search */}
              <form
                onSubmit={handleSearchSubmit}
                ref={searchContainerRef}
                className="flex max-w-2xl items-center relative w-full"
              >
                <div className="w-full flex h-[36px] border border-slate-300 rounded-md overflow-hidden bg-slate-50 focus-within:ring-2 focus-within:ring-[#1A6B3C]/10 focus-within:border-[#1A6B3C] transition-all">
                  {/* Category Dropdown Selector */}
                  <div className="relative border-r border-slate-200 flex items-center" ref={categorySelectRef}>
                    <button
                      type="button"
                      onClick={() => setShowSearchCategoryDropdown(!showSearchCategoryDropdown)}
                      className="h-full px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="hidden sm:inline">{selectedCategory}</span>
                      <ChevronDown className="h-3 w-3 text-slate-400" />
                    </button>
                    {showSearchCategoryDropdown && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-md py-1.5 min-w-[160px] z-50">
                        {SEARCH_CATEGORIES.map((cat, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => { setSelectedCategory(cat); setShowSearchCategoryDropdown(false); }}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1A6B3C] transition-colors"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Input Text Box */}
                  <div className="flex-1 relative flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setActiveSuggestionIndex(-1); }}
                      onFocus={() => setSearchFocused(true)}
                      onKeyDown={handleSearchKeyDown}
                      placeholder='Search plants, planters, fertilizers, services...'
                      className="w-full h-full bg-transparent px-3 text-xs font-semibold text-slate-800 outline-hidden"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Submit Search Button */}
                  <button
                    type="submit"
                    className="bg-[#1A6B3C] hover:bg-[#16A34A] text-white px-4 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <Search className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Real-time search suggestions overlay */}
                <SearchSuggestionsOverlay
                  isOpen={searchFocused}
                  query={searchQuery}
                  onClose={() => setSearchFocused(false)}
                  onSelectSuggestion={(val) => { setSearchQuery(val); executeSearch(val); }}
                  activeItemIndex={activeSuggestionIndex}
                  setActiveItemIndex={setActiveSuggestionIndex}
                  setSuggestionsCount={setSuggestionsCount}
                />
              </form>
            </div>

            {/* Right Icons: Wishlist, Cart, Sign In */}
            <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 shrink-0">

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="lg:hidden p-2 text-slate-700 hover:text-[#1A6B3C]"
              >
                <Search className="h-5.5 w-5.5" />
              </button>

              {/* Wishlist Module with Mini Wishlist Preview */}
              <div
                className="relative"
                onMouseEnter={() => setWishlistHovered(true)}
                onMouseLeave={() => setWishlistHovered(false)}
              >
                <Link
                  href="/account/wishlist"
                  className="relative flex flex-col items-center justify-center p-1.5 rounded-lg text-slate-600 hover:text-[#1A6B3C] hover:bg-slate-50 transition-colors"
                >
                  <Heart className="h-4.5 w-4.5 md:h-5 md:w-5" />
                  <span className="text-[9px] font-bold mt-0 hidden md:inline-block">
                    Wishlist
                  </span>
                  {wishlistItems.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[7px] font-extrabold h-3 w-3 flex items-center justify-center rounded-full">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>

                {/* Mini Wishlist Hover Dropdown (only on Desktop hover) */}
                <div className="hidden lg:block">
                  <MiniWishlistPreview
                    isOpen={wishlistHovered}
                    onClose={() => setWishlistHovered(false)}
                  />
                </div>
              </div>

              {/* Cart Module with Mini-Cart Preview */}
              <div
                className="relative"
                onMouseEnter={() => setCartHovered(true)}
                onMouseLeave={() => setCartHovered(false)}
              >
                <button
                  onClick={openCart}
                  className="relative flex flex-col items-center justify-center p-1.5 rounded-lg text-slate-600 hover:text-[#1A6B3C] hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ShoppingCart className="h-4.5 w-4.5 md:h-5 md:w-5" />
                  <span className="text-[9px] font-bold mt-0 hidden md:inline-block">
                    Cart
                  </span>
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-amber-500 text-white text-[7px] font-extrabold h-3 w-3 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Mini Cart Hover Dropdown (only on Desktop hover) */}
                <div className="hidden lg:block">
                  <MiniCartPreview
                    isOpen={cartHovered}
                    onClose={() => setCartHovered(false)}
                    onOpenDrawer={() => { openCart(); setCartHovered(false); }}
                  />
                </div>
              </div>

              {/* Mobile Profile Icon */}
              {firebaseUser ? (
                <Link
                  href="/account/dashboard"
                  className="lg:hidden"
                >
                  {userData?.profileImage || firebaseUser.photoURL ? (
                    <img
                      src={userData?.profileImage || firebaseUser.photoURL!}
                      alt="Profile"
                      className="w-7 h-7 rounded-full object-cover border-2 border-[#1A6B3C]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#1A6B3C]/10 text-[#1A6B3C] flex items-center justify-center text-xs font-bold">
                      {userData?.firstName?.[0]?.toUpperCase() || firebaseUser.email?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="lg:hidden p-2 text-slate-700 hover:text-[#1A6B3C]"
                >
                  <User className="h-5.5 w-5.5" />
                </Link>
              )}

              {/* Profile / Sign In - Desktop Only */}
              {firebaseUser ? (
                <Link
                  href="/account/dashboard"
                  className="hidden lg:flex items-center gap-2 ml-1"
                >
                  {userData?.profileImage || firebaseUser.photoURL ? (
                    <img
                      src={userData?.profileImage || firebaseUser.photoURL!}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#1A6B3C]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#1A6B3C] text-white flex items-center justify-center text-xs font-bold">
                      {userData?.firstName?.[0]?.toUpperCase() || firebaseUser.email?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden lg:flex items-center px-4 py-1.5 bg-[#1A6B3C] hover:bg-[#16A34A] text-white font-semibold text-xs rounded-md shadow-sm hover:shadow-md transition-all active:scale-95 ml-1"
                >
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Expanded Search Bar (toggled by search icon on mobile) */}
        {mobileSearchOpen && (
          <div className="lg:hidden px-4 pb-3 border-b border-slate-100 bg-white">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="flex-1 flex items-center border border-slate-300 rounded-md bg-slate-50 px-2.5 py-1.5">
                <Search className="h-4 w-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder='Search plants, services...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 bg-transparent outline-hidden"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="text-slate-400">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-4 bg-[#1A6B3C] hover:bg-[#16A34A] text-white text-xs font-bold rounded-md"
              >
                Go
              </button>
            </form>
          </div>
        )}

        {/* ==================== TIER 3: CATEGORY NAVIGATION ==================== */}
        <div className="hidden lg:block h-11 border-t border-slate-100">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-6 h-full flex justify-between items-center gap-4">

            {/* Mega Menu Toggle */}
            <div className="relative h-full flex items-center">
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className="h-full flex items-center gap-1.5 font-bold text-xs text-slate-800 hover:text-[#1A6B3C] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Menu className="h-4 w-4" />
                <span className="hidden sm:inline">Categories</span>
                <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
            </div>

            {/* Center Navigation Links */}
            <nav className="flex items-center gap-5 lg:gap-6 h-full">
              <Link href="/shop" className="text-[11px] font-bold uppercase tracking-wide text-slate-700 hover:text-[#1A6B3C] transition-colors py-3 whitespace-nowrap">
                Shop
              </Link>
              <Link href="/services" className="text-[11px] font-bold uppercase tracking-wide text-slate-700 hover:text-[#1A6B3C] transition-colors py-3 whitespace-nowrap">
                Services
              </Link>
              <Link href="/shop?filter=new" className="text-[11px] font-bold uppercase tracking-wide text-slate-700 hover:text-[#1A6B3C] transition-colors py-3 whitespace-nowrap hidden lg:block">
                New
              </Link>
              <Link href="/shop?filter=bestseller" className="text-[11px] font-bold uppercase tracking-wide text-slate-700 hover:text-[#1A6B3C] transition-colors py-3 whitespace-nowrap hidden xl:block">
                Best Sellers
              </Link>
              <Link href="/shop?filter=trending" className="text-[11px] font-bold uppercase tracking-wide text-slate-700 hover:text-[#1A6B3C] transition-colors py-3 whitespace-nowrap hidden xl:block">
                Trending
              </Link>
              <Link href="/offers" className="text-[11px] font-bold uppercase tracking-wide text-[#1A6B3C] hover:text-[#16A34A] transition-colors py-3 whitespace-nowrap">
                Offers
              </Link>
              <Link href="/blog" className="text-[11px] font-bold uppercase tracking-wide text-slate-700 hover:text-[#1A6B3C] transition-colors py-3 whitespace-nowrap">
                Blog
              </Link>
            </nav>

            {/* Right Side highlighted CTAs */}
            <div className="flex items-center gap-3 ml-auto">
              <Link
                href="/shop?filter=deals"
                className="text-[11px] font-bold text-red-600 hover:text-red-700 uppercase tracking-wide flex items-center gap-0.5 whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                <span className="hidden lg:inline">Deals</span>
              </Link>
              <div className="h-3 w-px bg-slate-300" />
              <Link
                href="/shop?filter=seasonal"
                className="text-[11px] font-bold text-amber-600 hover:text-amber-700 uppercase tracking-wide whitespace-nowrap"
              >
                Seasonal
              </Link>
            </div>

          </div>
        </div>

      </div>

      {/* MOBILE DRAWER MENU OVERLAY */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-full max-w-xs z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <span className="font-display font-extrabold text-sm text-[#1A6B3C]">GROWPLANTS Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-md">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 min-w-0 overflow-y-auto p-4 flex flex-col gap-1">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#1A6B3C] rounded-md"
              >
                Shop All Plants
              </Link>
              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#1A6B3C] rounded-md"
              >
                Gardening Services
              </Link>
              <Link
                href="/shop?filter=new"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#1A6B3C] rounded-md"
              >
                New Arrivals
              </Link>
              <Link
                href="/shop?filter=bestseller"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#1A6B3C] rounded-md"
              >
                Best Sellers
              </Link>
              <Link
                href="/offers"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#1A6B3C] rounded-md"
              >
                Special Offers
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#1A6B3C] rounded-md"
              >
                Read Blog
              </Link>

              <div className="h-px bg-slate-100 my-4" />

              {/* Mobile login / account */}
              {firebaseUser ? (
                <>
                  <Link
                    href="/account/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1A6B3C] rounded-md"
                  >
                    {userData?.profileImage || firebaseUser.photoURL ? (
                      <img
                        src={userData?.profileImage || firebaseUser.photoURL!}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#1A6B3C] text-white flex items-center justify-center text-xs font-bold">
                        {userData?.firstName?.[0]?.toUpperCase() || firebaseUser.email?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <span>My Account</span>
                  </Link>
                  <button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      const { firebaseSignOut } = await import('@/lib/firebase/auth');
                      await firebaseSignOut();
                    }}
                    className="w-full py-3 px-4 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-md text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-md"
                >
                  Sign In / Account
                </Link>
              )}
            </div>

            {!firebaseUser && (
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block py-2.5 bg-[#1A6B3C] hover:bg-[#16A34A] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </>
      )}

    </>
  );
};
