"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS } from "@/data/homepageData";

export function BlogPreviewSection() {
  const featured = BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
  const sidePosts = BLOG_POSTS.filter((p) => p.id !== featured.id).slice(0, 2);

  return (
    <section className="py-12 md:py-16 bg-surface-container-low">
      <Container>
        {/* Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div className="space-y-2">
            <p className="text-overline text-muted-foreground font-bold">GARDENING BLOG</p>
            <h2 className="text-h2 text-foreground">Tips, Guides &amp; Inspiration</h2>
          </div>
          <Link href="/blog" className="text-body-sm font-medium text-primary hover:text-primary-hover hover:underline underline-offset-4 flex items-center gap-1">
            Read All Articles
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Featured article */}
          <article className="lg:col-span-2 lg:row-span-2">
            <Link
              href={featured.href}
              className="group block h-full rounded-lg overflow-hidden bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute bottom-3 left-3 px-3 py-1.5 rounded-md bg-warning text-on-warning text-body-sm font-semibold">
                  {featured.category}
                </span>
              </div>
              <div className="p-5 md:p-6 space-y-2">
                <h3 className="text-h4 font-semibold text-foreground group-hover:text-primary transition-colors">
                  {featured.title}
                </h3>
                <p className="text-caption text-muted-foreground">
                  by {featured.author} | {featured.date} | {featured.readTime} min
                </p>
                <p className="text-body-sm text-muted-foreground line-clamp-2">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-body-sm font-medium text-primary">
                  Read More
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </article>

          {/* Side posts + newsletter box */}
          <div className="flex flex-col gap-4">
            {sidePosts.map((post) => (
              <article key={post.id}>
                <Link
                  href={post.href}
                  className="group block rounded-lg overflow-hidden bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex gap-3 p-3">
                    <div className="relative size-20 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-caption text-primary font-semibold">{post.category}</p>
                      <h4 className="text-body-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mt-0.5">
                        {post.title}
                      </h4>
                      <p className="text-caption text-muted-foreground line-clamp-1 mt-1">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              </article>
            ))}

            {/* Newsletter mini box */}
            <div className="rounded-lg bg-primary text-primary-foreground p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="size-9 rounded-full bg-primary-foreground/15 flex items-center justify-center">
                  <Mail className="size-4" aria-hidden="true" />
                </div>
                <p className="text-body font-semibold">Get articles in your inbox</p>
              </div>
              <p className="text-body-sm text-primary-foreground/80">Weekly gardening tips and care guides</p>
              <Button asChild size="sm" className="w-fit gap-1.5 bg-warning text-on-warning hover:bg-warning/90 mt-1">
                <a href="#newsletter">
                  Subscribe free
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
