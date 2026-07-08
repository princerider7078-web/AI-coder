import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/common/Container";
import { ProviderCard } from "@/components/services/ProviderCard";
import { Button } from "@/components/ui/button";
import { PROVIDERS } from "@/data/homepageData";

export function ProvidersSection() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <Container>
        {/* Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div className="space-y-2 max-w-2xl">
            <p className="text-overline text-primary font-bold">MEET OUR EXPERTS</p>
            <h2 className="text-h2 text-foreground">Sonipat's Top Gardeners</h2>
            <p className="text-body text-muted-foreground">
              Every gardener is personally interviewed, background-checked, and approved by our team.
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2 shrink-0">
            <Link href="/providers">
              View All Gardeners
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {/* Provider cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {PROVIDERS.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </Container>
    </section>
  );
}
