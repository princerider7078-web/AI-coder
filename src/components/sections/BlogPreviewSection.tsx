"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { useBilingual } from "@/store/useBilingual";
import { BLOG_POSTS } from "@/data/homepageData";
import { formatDate } from "@/lib/utils";

/**
 * BlogPreviewSection — 1 featured + 2 side articles + newsletter mini-prompt.
 * Source: HOMEPAGE_AUDIT_REPORT.md §1.1 (BlogPreviewSection), PRD §8.2 (FR-HOME-008)
 *
 * Audit fixes:
 *   - C3: next/image (was native <img>)
 *   - C5: No hardcoded hex
 *   - §7.1.4: Blog heading hierarchy (featured h3, side h4 — acceptable)
 *   - §3.2.3: Mini newsletter prompt links to #newsletter (anchor exists
 *     on the NewsletterSection below)
 *   - Focus rings on all interactive elements
 */
export function BlogPreviewSection() {
  const { language } = useBilingual();
  const isHi = language === "hi";

  const featured = BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
  const sidePosts = BLOG_POSTS.filter((p) => p.id !== featured.id).slice(0, 2);

  return (
    <section className="section-py bg-background">
      <Container>
        <SectionHeading
          overline={isHi ? "ब्लॉग" : "From Our Blog"}
          title={isHi ? "बागवानी टिप्स और गाइड" : "Gardening Tips & Guides"}
          subtitle={
            isHi
              ? "अपने पौधों की देखभाल में माहिर बनें"
              : "Become a pro at caring for your plants"
          }
          action={{ label: isHi ? "सभी लेख" : "All Articles", href: "/blog" }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Featured post */}
          <article className="lg:col-span-2 lg:row-span-2">
            <Link
              href={featured.href}
              className="group block h-full rounded-xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                <Image
                  src={featured.image}
                  alt={isHi ? featured.title.hi : featured.title.en}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover transition-transform duration-500 ease-slow group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur text-caption font-medium text-foreground">
                  {isHi ? featured.category.hi : featured.category.en}
                </span>
              </div>
              <div className="p-5 md:p-6 space-y-3">
                <div className="flex items-center gap-3 text-caption text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" aria-hidden="true" />
                    {formatDate(featured.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {featured.readTime} min read
                  </span>
                </div>
                <h3 className="text-h3 font-semibold text-foreground group-hover:text-primary transition-colors">
                  {isHi ? featured.title.hi : featured.title.en}
                </h3>
                <p className="text-body text-muted-foreground line-clamp-2">
                  {isHi ? featured.excerpt.hi : featured.excerpt.en}
                </p>
                <span className="inline-flex items-center gap-1.5 text-body-sm font-medium text-primary">
                  {isHi ? "और पढ़ें" : "Read More"}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </article>

          {/* Side posts */}
          {sidePosts.map((post) => (
            <article key={post.id}>
              <Link
                href={post.href}
                className="group block h-full rounded-xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="flex gap-3 p-3">
                  <div className="relative size-20 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={post.image}
                      alt={isHi ? post.title.hi : post.title.en}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-500 ease-slow group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <span className="text-caption text-primary font-medium">
                      {isHi ? post.category.hi : post.category.en}
                    </span>
                    <h4 className="text-body-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {isHi ? post.title.hi : post.title.en}
                    </h4>
                    <p className="text-caption text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" aria-hidden="true" />
                      {post.readTime} min read
                    </p>
                  </div>
                </div>
              </Link>
            </article>
          ))}

          {/* Newsletter mini-prompt */}
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 flex flex-col justify-center gap-3">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Mail className="size-4" aria-hidden="true" />
              </div>
              <p className="text-body font-semibold text-foreground">
                {isHi ? "बागवानी टिप्स पाएं" : "Get Gardening Tips"}
              </p>
            </div>
            <p className="text-body-sm text-muted-foreground">
              {isHi
                ? "साप्ताहिक टिप्स और विशेष ऑफ़र सीधे अपने इनबॉक्स में"
                : "Weekly tips and exclusive offers in your inbox"}
            </p>
            <Button asChild size="sm" className="w-fit gap-1.5">
              <a href="#newsletter">
                {isHi ? "मुफ़्त सदस्यता" : "Subscribe Free"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
