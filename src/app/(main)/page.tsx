import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustBadges } from "@/components/common/TrustBadges";
import { QuickCategoryGrid } from "@/components/sections/QuickCategoryGrid";
import { BestSellersSection } from "@/components/sections/BestSellersSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { ProvidersSection } from "@/components/sections/ProvidersSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { BlogPreviewSection } from "@/components/sections/BlogPreviewSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { Container } from "@/components/common/Container";
import { FAQ_ITEMS, PRODUCTS, TESTIMONIALS, TESTIMONIAL_STATS } from "@/data/homepageData";
import { APP_URL, CONTACT_PHONE, CONTACT_EMAIL } from "@/lib/constants";

/**
 * ============================================================================
 * GrowPlants — Homepage (Phase 4)
 * ============================================================================
 *
 * Built per HOMEPAGE_AUDIT_REPORT.md. 10 sections in the exact order
 * specified by §1.1:
 *   1. HeroSection (with PincodeChecker integrated)
 *   1a. TrustBadges (persistent trust bar below hero — audit §9.1.5)
 *   2. QuickCategoryGrid
 *   3. BestSellersSection
 *   4. ServicesSection
 *   5. WhyChooseUsSection
 *   6. ProvidersSection
 *   7. TestimonialsSection (id="testimonials")
 *   8. BlogPreviewSection
 *   9. FAQSection
 *   10. NewsletterSection (id="newsletter")
 *
 * Plus floating WhatsAppButton (audit §11.1).
 *
 * JSON-LD structured data (audit C7 fix):
 *   - LocalBusiness (GrowPlants as Sonipat business)
 *   - ItemList (featured products)
 *   - FAQPage (FAQ accordion)
 *   - Review/Testimonial aggregate rating
 *
 * Page-specific metadata (audit M17 fix).
 * ============================================================================
 */

export const metadata: Metadata = {
  title: "GrowPlants — Plants, Planters & Gardening Services in Sonipat",
  description:
    "Shop healthy indoor & outdoor plants, premium planters, and gardening supplies. Book verified local gardeners for balcony setup, maintenance, and landscaping in Sonipat, Haryana. Free delivery above ₹499.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GrowPlants — Plants, Planters & Gardening Services in Sonipat",
    description:
      "Sonipat's trusted botanical marketplace. Shop plants, planters, and gardening supplies, or book verified local gardeners. Free delivery above ₹499.",
    url: "/",
    type: "website",
  },
};

/* ---------- JSON-LD Structured Data (audit C7 fix) ---------- */

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "GrowPlants",
  description:
    "Location-based botanical e-commerce and gardening service marketplace in Sonipat, Haryana.",
  url: APP_URL,
  telephone: CONTACT_PHONE,
  email: CONTACT_EMAIL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sonipat",
    addressRegion: "Haryana",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.9949,
    longitude: 77.0246,
  },
  openingHours: "Mo-Su 09:00-19:00",
  priceRange: "₹₹",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: TESTIMONIAL_STATS.averageRating,
    reviewCount: TESTIMONIAL_STATS.totalReviews,
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Featured Plants",
  itemListElement: PRODUCTS.slice(0, 8).map((product, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    item: {
      "@type": "Product",
      name: product.name,
      image: product.image,
      description: product.shortDescription,
      sku: product.id,
      offers: {
        "@type": "Offer",
        price: product.sellingPrice,
        priceCurrency: "INR",
        availability:
          product.availableStock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    },
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question.en,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer.en,
    },
  })),
};

/* ---------- Page ---------- */

export default function HomePage() {
  return (
    <>
      {/* JSON-LD structured data (audit C7 fix) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ---------- 1. Hero ---------- */}
      <HeroSection />

      {/* ---------- 1a. Trust badges bar (audit §9.1.5 fix) ---------- */}
      <Container className="py-6">
        <TrustBadges />
      </Container>

      {/* ---------- 2. Quick Category Grid ---------- */}
      <QuickCategoryGrid />

      {/* ---------- 3. Best Sellers ---------- */}
      <BestSellersSection />

      {/* ---------- 4. Services ---------- */}
      <ServicesSection />

      {/* ---------- 5. Why Choose Us ---------- */}
      <WhyChooseUsSection />

      {/* ---------- 6. Providers ---------- */}
      <ProvidersSection />

      {/* ---------- 7. Testimonials (id="testimonials") ---------- */}
      <TestimonialsSection />

      {/* ---------- 8. Blog Preview ---------- */}
      <BlogPreviewSection />

      {/* ---------- 9. FAQ ---------- */}
      <FAQSection />

      {/* ---------- 10. Newsletter (id="newsletter") ---------- */}
      <NewsletterSection />

      {/* ---------- Floating WhatsApp (audit §11.1) ---------- */}
      <WhatsAppButton />
    </>
  );
}
