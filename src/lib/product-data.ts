/**
 * GrowPlants — Product Detail Data Helper
 * Reads from plants-data.json and pots-data.json (uploaded by user)
 * Returns a unified ProductData interface matching the uploaded page.tsx structure.
 */
import plantsData from "@/data/plants-data.json";
import potsData from "@/data/pots-data.json";

export interface ProductImage { id: string; url: string; alt: string; }

export interface ProductReview {
  id: string; rating: number; title?: string; text: string;
  author: string; avatar?: string; date: string; verified: boolean; helpful: number; images: string[];
}

export interface CareInstructions {
  sunlight: string; watering: string; temperature: string;
  humidity: string; difficulty: string; height: string; toxicity: string;
  growthRate?: string; fertilizerSchedule?: string;
}

export interface RelatedProduct {
  id: string; name: string; slug: string; price: number; salePrice: number | null;
  image: string; rating: number; reviewCount: number; inStock: boolean; featured: boolean;
}

export interface ProductData {
  id: string; name: string; slug: string; sku: string;
  description: string; shortDescription: string; about: string | null;
  price: number; salePrice: number | null; discount: number | null; savings: number | null;
  rating: number; reviewCount: number; totalSold: number;
  images: ProductImage[];
  category: { id: string; name: string; slug: string };
  attributes: Array<{ name: string; value: string }>;
  variants: Array<{ id: string; name: string; price: number; stock: number; sku: string }>;
  inStock: boolean; stockQuantity: number;
  featured: boolean; isBestSeller: boolean; isNew: boolean; isTrending: boolean;
  brand: string | null; tags: string[]; suitableFor: string[];
  isPetSafe: boolean | null; isAirPurifying: boolean | null;
  difficultyLevel: string | null; weight: number | null;
  size: string | null; height: string | null;
  deliveryTime: string | null;
  prices: Record<string, number> | null;
  productType: "plant" | "pot" | "planter" | "other";
  reviews: ProductReview[];
  relatedProducts: RelatedProduct[];
  careInstructions: CareInstructions;
  specialFeatures: string[];
  seo: { title: string; description: string };
}

/** Mock reviews (user data files don't include reviews) */
const MOCK_REVIEWS: ProductReview[] = [
  { id: "r1", rating: 5, title: "Beautiful, healthy plant!", text: "Arrived in perfect condition. The packaging was excellent and the plant is thriving. Highly recommend!", author: "Priya S.", date: "2024-12-15", verified: true, helpful: 12, images: [] },
  { id: "r2", rating: 4, title: "Good quality", text: "Plant is healthy and as described. Delivery was a day late but the plant quality makes up for it.", author: "Rajesh K.", date: "2024-12-10", verified: true, helpful: 8, images: [] },
  { id: "r3", rating: 5, text: "Exactly what I wanted. The plant looks even better in person. Will order more!", author: "Anita M.", date: "2024-12-05", verified: true, helpful: 5, images: [] },
];

/** Map plant JSON to ProductData */
function mapPlant(slug: string, raw: any): ProductData {
  const price = raw.price ?? 0;
  const oldPrice = raw.oldPrice ?? price;
  const salePrice = oldPrice > price ? price : null;
  const discount = salePrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;
  const savings = salePrice ? oldPrice - price : null;
  const categories = raw.category ?? [];
  const categoryName = categories[0] ? categories[0].charAt(0).toUpperCase() + categories[0].slice(1) : "Plants";

  const care = raw.care ?? {};
  const careInstructions: CareInstructions = {
    sunlight: care.lightRequirements ?? "Bright, indirect light",
    watering: care.wateringInstructions ?? "Water when top inch of soil is dry",
    temperature: care.temperatureRange ?? "18°C to 28°C",
    humidity: care.humidityNeeds ?? "Moderate humidity",
    difficulty: "Easy",
    height: raw.height ?? "Varies",
    toxicity: raw.toxicityInfo ?? "Keep away from pets",
    growthRate: care.growthRate,
    fertilizerSchedule: care.fertilizerSchedule,
  };

  return {
    id: slug,
    name: raw.name ?? "Unknown Plant",
    slug,
    sku: `GP-PLANT-${slug.substring(0, 8).toUpperCase()}`,
    description: raw.description ?? "",
    shortDescription: raw.description ?? "",
    about: raw.about ?? null,
    price: oldPrice,
    salePrice,
    discount,
    savings,
    rating: raw.rating ?? 4.5,
    reviewCount: raw.reviewsCount ?? 0,
    totalSold: raw.totalSold ?? Math.floor((raw.reviewsCount ?? 0) * 2.5),
    images: (raw.images ?? []).map((url: string, i: number) => ({
      id: `img-${i}`, url, alt: `${raw.name} - Image ${i + 1}`,
    })),
    category: { id: categories[0] ?? "plants", name: categoryName, slug: categories[0] ?? "plants" },
    attributes: raw.attributes ?? [
      { name: "Size", value: raw.size ?? "Medium" },
      { name: "Height", value: raw.height ?? "25-40cm" },
      { name: "Category", value: categoryName },
    ],
    variants: raw.variants ?? [],
    inStock: (raw.stock ?? 0) > 0,
    stockQuantity: raw.stock ?? 0,
    featured: raw.badge === "Featured" || raw.badge === "Best Seller",
    isBestSeller: raw.badge === "Best Seller",
    isNew: raw.badge === "New Arrival",
    isTrending: raw.badge === "Trending",
    brand: "GrowPlants",
    tags: categories,
    suitableFor: raw.suitableFor ?? categories,
    isPetSafe: raw.isPetSafe ?? null,
    isAirPurifying: categories.includes("air-purifying"),
    difficultyLevel: raw.difficultyLevel ?? "Easy",
    weight: raw.weight ?? null,
    size: raw.size ?? null,
    height: raw.height ?? null,
    deliveryTime: raw.deliveryTime ?? "1-2 business days in Sonipat",
    prices: raw.prices ?? null,
    productType: "plant",
    reviews: MOCK_REVIEWS,
    relatedProducts: [],
    careInstructions,
    specialFeatures: raw.specialFeatures ?? [],
    seo: {
      title: `${raw.name} — Buy Online in Sonipat | GrowPlants`,
      description: raw.description ?? `Buy ${raw.name} online in Sonipat. Healthy plants delivered to your door with free shipping above ₹499.`,
    },
  };
}

/** Map pot JSON to ProductData */
function mapPot(slug: string, raw: any): ProductData {
  const prices = raw.prices ?? {};
  const priceEntries = Object.entries(prices);
  const price = priceEntries.length > 0 ? priceEntries[0][1] : raw.oldPrice ?? 0;
  const oldPrice = raw.oldPrice ?? price;
  const salePrice = oldPrice > price ? price : null;
  const discount = salePrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;
  const categories = raw.category ?? [];
  const categoryName = categories[0] ? categories[0].charAt(0).toUpperCase() + categories[0].slice(1) : "Planters";

  const variants = priceEntries.map(([size, p], i) => ({
    id: `var-${i}`, name: size, price: p as number, stock: 50, sku: `GP-POT-${slug.substring(0, 6).toUpperCase()}-${size}`,
  }));

  return {
    id: slug,
    name: raw.name ?? "Unknown Planter",
    slug,
    sku: `GP-POT-${slug.substring(0, 8).toUpperCase()}`,
    description: raw.desc ?? "",
    shortDescription: raw.desc ?? "",
    about: null,
    price: oldPrice,
    salePrice,
    discount,
    savings: salePrice ? oldPrice - price : null,
    rating: 4.5,
    reviewCount: 42,
    totalSold: 105,
    images: (raw.image ?? []).map((url: string, i: number) => ({
      id: `img-${i}`, url, alt: `${raw.name} - Image ${i + 1}`,
    })),
    category: { id: categories[0] ?? "planters", name: categoryName, slug: categories[0] ?? "planters" },
    attributes: [
      { name: "Material", value: "Premium Quality" },
      { name: "Sizes Available", value: priceEntries.map(([s]) => s).join(", ") },
      { name: "Category", value: categoryName },
    ],
    variants,
    inStock: true,
    stockQuantity: 50,
    featured: false,
    isBestSeller: false,
    isNew: false,
    isTrending: false,
    brand: "GrowPlants",
    tags: categories,
    suitableFor: categories,
    isPetSafe: true,
    isAirPurifying: false,
    difficultyLevel: null,
    weight: null,
    size: priceEntries.length > 0 ? priceEntries[0][0] : null,
    height: null,
    deliveryTime: "1-2 business days in Sonipat",
    prices: prices,
    productType: "pot",
    reviews: MOCK_REVIEWS,
    relatedProducts: [],
    careInstructions: {
      sunlight: "N/A", watering: "N/A", temperature: "N/A", humidity: "N/A",
      difficulty: "N/A", height: "N/A", toxicity: "Non-toxic",
    },
    specialFeatures: raw.potFeatures ?? [],
    seo: {
      title: `${raw.name} — Buy Online in Sonipat | GrowPlants`,
      description: raw.desc ?? `Buy ${raw.name} online in Sonipat. Premium planters delivered to your door.`,
    },
  };
}

/** Get related products (same category) */
function getRelatedProducts(slug: string, category: string, type: "plant" | "pot"): RelatedProduct[] {
  if (type === "plant") {
    return Object.entries(plantsData)
      .filter(([s, p]: [string, any]) => s !== slug && (p.category ?? []).includes(category))
      .slice(0, 4)
      .map(([s, p]: [string, any]) => ({
        id: s, name: p.name ?? s, slug: s,
        price: p.oldPrice ?? p.price ?? 0, salePrice: p.price ?? null,
        image: (p.images ?? [])[0] ?? "", rating: p.rating ?? 4.5,
        reviewCount: p.reviewsCount ?? 0, inStock: (p.stock ?? 0) > 0, featured: p.badge === "Best Seller",
      }));
  } else {
    return Object.entries(potsData)
      .filter(([s, p]: [string, any]) => s !== slug && (p.category ?? []).includes(category))
      .slice(0, 4)
      .map(([s, p]: [string, any]) => {
        const prices = p.prices ?? {};
        const firstPrice = Object.values(prices)[0] as number ?? p.oldPrice ?? 0;
        return {
          id: s, name: p.name ?? s, slug: s,
          price: p.oldPrice ?? firstPrice, salePrice: firstPrice,
          image: (p.image ?? [])[0] ?? "", rating: 4.5,
          reviewCount: 42, inStock: true, featured: false,
        };
      });
  }
}

/** Main fetch function — looks up by slug in both data files */
export function fetchProduct(slug: string): ProductData | null {
  // Try plants first
  const plantsAny = plantsData as any;
  if (plantsAny[slug]) {
    const data = mapPlant(slug, plantsAny[slug]);
    data.relatedProducts = getRelatedProducts(slug, data.category.slug, "plant");
    return data;
  }

  // Try pots
  const potsAny = potsData as any;
  if (potsAny[slug]) {
    const data = mapPot(slug, potsAny[slug]);
    data.relatedProducts = getRelatedProducts(slug, data.category.slug, "pot");
    return data;
  }

  return null;
}

/** Get all product slugs (for generateStaticParams) */
export function getAllProductSlugs(): string[] {
  return [...Object.keys(plantsData), ...Object.keys(potsData)];
}
