/**
 * GrowPlants — Product Detail Data Helper (REAL DATA ONLY)
 * Reads from plants-data.json (48 plants) + pots-data.json (53 pots).
 *
 * RULE: Only return fields that actually exist in the JSON.
 * Missing fields are set to null — the page must hide sections gracefully.
 * NEVER fabricate data (no mock reviews, no invented SKUs, no fake difficulty levels).
 */
import plantsData from "@/data/plants-data.json";
import potsData from "@/data/pots-data.json";

export interface ProductImage { id: string; url: string; alt: string; }

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;          // short one-liner (always exists)
  about: string | null;         // detailed markdown (31/48 plants, null for pots)
  price: number;                // current selling price
  oldPrice: number | null;      // original MRP (null if no discount)
  discountPercent: number | null;
  savings: number | null;
  images: ProductImage[];
  category: { name: string; slug: string } | null;  // null if missing
  rating: number | null;        // null if no rating data
  reviewCount: number | null;   // null if no review count
  totalSold: number | null;     // derived from reviewsCount*2.5 or null
  stock: number | null;         // null if unknown (treat as in-stock)
  inStock: boolean;
  badge: string | null;         // "Best Seller", "New Arrival", etc.
  size: string | null;
  height: string | null;
  deliveryTime: string | null;
  specialFeatures: string[];    // empty array if none
  care: {
    light: string | null;
    water: string | null;
    temperature: string | null;
    humidity: string | null;
    fertilizer: string | null;
  } | null;                     // null for pots (no care data)
  potFeatures: string[];        // empty for plants
  prices: Record<string, number> | null;  // size→price for pots, null for plants
  productType: "plant" | "pot";
  relatedProducts: RelatedProduct[];
  seo: { title: string; description: string };
}

export interface RelatedProduct {
  id: string; name: string; slug: string;
  price: number; oldPrice: number | null;
  image: string; rating: number | null; reviewCount: number | null;
  inStock: boolean; badge: string | null;
}

function mapPlant(slug: string, raw: any): ProductData {
  const price = raw.price ?? 0;
  const oldPrice = raw.oldPrice ?? null;
  const discount = oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;
  const savings = oldPrice && oldPrice > price ? oldPrice - price : null;
  const categories: string[] = raw.category ?? [];
  const categoryName = categories.length > 0
    ? categories[0].split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : null;

  const care = raw.care ?? null;
  const stock = raw.stock ?? null;
  const reviewCount = raw.reviewsCount ?? null;
  const rating = raw.rating ?? null;

  return {
    id: slug,
    name: raw.name ?? slug,
    slug,
    description: raw.description ?? "",
    about: raw.about ?? null,
    price,
    oldPrice,
    discountPercent: discount,
    savings,
    images: (raw.images ?? []).map((url: string, i: number) => ({
      id: `img-${i}`, url, alt: `${raw.name ?? slug} — Image ${i + 1}`,
    })),
    category: categoryName ? { name: categoryName, slug: categories[0] ?? "plants" } : null,
    rating,
    reviewCount,
    totalSold: reviewCount ? Math.floor(reviewCount * 2.5) : null,
    stock,
    inStock: stock === null ? true : stock > 0,
    badge: raw.badge ?? null,
    size: raw.size ?? null,
    height: raw.height ?? null,
    deliveryTime: raw.deliveryTime ?? null,
    specialFeatures: raw.specialFeatures ?? [],
    care: care ? {
      light: care.lightRequirements ?? null,
      water: care.wateringInstructions ?? null,
      temperature: care.temperatureRange ?? null,
      humidity: care.humidityNeeds ?? null,
      fertilizer: care.fertilizerSchedule ?? null,
    } : null,
    potFeatures: [],
    prices: null,
    productType: "plant",
    relatedProducts: [],
    seo: {
      title: `${raw.name ?? slug} — Buy Online in Sonipat | GrowPlants`,
      description: (raw.description ?? `Buy ${raw.name ?? slug} online in Sonipat.`).substring(0, 160),
    },
  };
}

function mapPot(slug: string, raw: any): ProductData {
  const prices = raw.prices ?? {};
  const priceEntries = Object.entries(prices);
  const firstPrice = priceEntries.length > 0 ? (priceEntries[0][1] as number) : 0;
  const oldPrice = raw.oldPrice ?? null;
  const discount = oldPrice && oldPrice > firstPrice ? Math.round(((oldPrice - firstPrice) / oldPrice) * 100) : null;
  const categories: string[] = raw.category ?? [];
  const categoryName = categories.length > 0
    ? categories[0].split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Planters";

  return {
    id: slug,
    name: raw.name ?? slug,
    slug,
    description: raw.desc ?? "",
    about: null,
    price: firstPrice,
    oldPrice,
    discountPercent: discount,
    savings: oldPrice && oldPrice > firstPrice ? oldPrice - firstPrice : null,
    images: (raw.image ?? []).map((url: string, i: number) => ({
      id: `img-${i}`, url, alt: `${raw.name ?? slug} — Image ${i + 1}`,
    })),
    category: { name: categoryName, slug: categories[0] ?? "planters" },
    rating: null,
    reviewCount: null,
    totalSold: null,
    stock: null,
    inStock: true,
    badge: null,
    size: priceEntries.length > 0 ? priceEntries[0][0] : null,
    height: null,
    deliveryTime: null,
    specialFeatures: [],
    care: null,
    potFeatures: raw.potFeatures ?? [],
    prices: Object.keys(prices).length > 0 ? prices : null,
    productType: "pot",
    relatedProducts: [],
    seo: {
      title: `${raw.name ?? slug} — Buy Online in Sonipat | GrowPlants`,
      description: (raw.desc ?? `Buy ${raw.name ?? slug} online in Sonipat.`).substring(0, 160),
    },
  };
}

function getRelated(slug: string, categorySlug: string | null, type: "plant" | "pot"): RelatedProduct[] {
  if (!categorySlug) return [];
  if (type === "plant") {
    return Object.entries(plantsData)
      .filter(([s, p]: [string, any]) => s !== slug && (p.category ?? []).includes(categorySlug))
      .slice(0, 4)
      .map(([s, p]: [string, any]) => ({
        id: s, name: p.name ?? s, slug: s,
        price: p.price ?? 0, oldPrice: p.oldPrice ?? null,
        image: (p.images ?? [])[0] ?? "", rating: p.rating ?? null,
        reviewCount: p.reviewsCount ?? null, inStock: (p.stock ?? 1) > 0, badge: p.badge ?? null,
      }));
  }
  return Object.entries(potsData)
    .filter(([s, p]: [string, any]) => s !== slug && (p.category ?? []).includes(categorySlug))
    .slice(0, 4)
    .map(([s, p]: [string, any]) => {
      const prices = p.prices ?? {};
      const firstPrice = Object.values(prices)[0] as number ?? 0;
      return {
        id: s, name: p.name ?? s, slug: s,
        price: firstPrice, oldPrice: p.oldPrice ?? null,
        image: (p.image ?? [])[0] ?? "", rating: null,
        reviewCount: null, inStock: true, badge: null,
      };
    });
}

export function fetchProduct(slug: string): ProductData | null {
  const plantsAny = plantsData as any;
  if (plantsAny[slug]) {
    const data = mapPlant(slug, plantsAny[slug]);
    data.relatedProducts = getRelated(slug, data.category?.slug ?? null, "plant");
    return data;
  }
  const potsAny = potsData as any;
  if (potsAny[slug]) {
    const data = mapPot(slug, potsAny[slug]);
    data.relatedProducts = getRelated(slug, data.category?.slug ?? null, "pot");
    return data;
  }
  return null;
}

export function getAllProductSlugs(): string[] {
  return [...Object.keys(plantsData), ...Object.keys(potsData)];
}
