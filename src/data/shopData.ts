/**
 * GrowPlants — Shop Mock Data
 * 16 products with full filterable attributes for the Shop PLP.
 * Image URLs use Unsplash (configured in next.config.ts).
 */

export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  discountPercent: number;
  sunInfo: "Full Sun" | "Partial Shade" | "Shade" | "Indirect";
  waterInfo: "Daily" | "Alternate Day" | "Weekly" | "Monthly";
  difficulty: "Easy" | "Moderate" | "Expert";
  isPetSafe: boolean;
  isAirPurifying: boolean;
  inStock: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  suitableFor: string[];
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  { id: "p1", name: "Snake Plant (Sansevieria)", slug: "snake-plant", category: "Indoor Plants", categorySlug: "indoor-plants", image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=400&q=80", rating: 4.7, reviewCount: 234, price: 349, originalPrice: 499, discountPercent: 30, sunInfo: "Indirect", waterInfo: "Weekly", difficulty: "Easy", isPetSafe: false, isAirPurifying: true, inStock: true, isBestseller: true, isNewArrival: false, suitableFor: ["Indoor", "Office"] },
  { id: "p2", name: "Money Plant (Pothos Golden)", slug: "money-plant", category: "Indoor Plants", categorySlug: "indoor-plants", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80", rating: 4.8, reviewCount: 412, price: 249, originalPrice: 399, discountPercent: 38, sunInfo: "Indirect", waterInfo: "Weekly", difficulty: "Easy", isPetSafe: false, isAirPurifying: true, inStock: true, isBestseller: true, isNewArrival: false, suitableFor: ["Indoor", "Balcony"] },
  { id: "p3", name: "Areca Palm", slug: "areca-palm", category: "Outdoor Plants", categorySlug: "outdoor-plants", image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&q=80", rating: 4.6, reviewCount: 156, price: 599, originalPrice: 799, discountPercent: 25, sunInfo: "Partial Shade", waterInfo: "Alternate Day", difficulty: "Moderate", isPetSafe: true, isAirPurifying: true, inStock: true, isBestseller: true, isNewArrival: false, suitableFor: ["Outdoor", "Balcony"] },
  { id: "p4", name: "ZZ Plant", slug: "zz-plant", category: "Indoor Plants", categorySlug: "indoor-plants", image: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=400&q=80", rating: 4.9, reviewCount: 89, price: 649, originalPrice: 899, discountPercent: 28, sunInfo: "Shade", waterInfo: "Weekly", difficulty: "Easy", isPetSafe: false, isAirPurifying: true, inStock: true, isBestseller: false, isNewArrival: true, suitableFor: ["Indoor", "Office"] },
  { id: "p5", name: "Peace Lily", slug: "peace-lily", category: "Indoor Plants", categorySlug: "indoor-plants", image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=80", rating: 4.5, reviewCount: 178, price: 449, originalPrice: 599, discountPercent: 25, sunInfo: "Partial Shade", waterInfo: "Alternate Day", difficulty: "Moderate", isPetSafe: false, isAirPurifying: true, inStock: true, isBestseller: true, isNewArrival: false, suitableFor: ["Indoor"] },
  { id: "p6", name: "Rubber Plant", slug: "rubber-plant", category: "Indoor Plants", categorySlug: "indoor-plants", image: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&q=80", rating: 4.7, reviewCount: 134, price: 599, originalPrice: 749, discountPercent: 20, sunInfo: "Indirect", waterInfo: "Weekly", difficulty: "Moderate", isPetSafe: false, isAirPurifying: true, inStock: true, isBestseller: false, isNewArrival: true, suitableFor: ["Indoor", "Office"] },
  { id: "p7", name: "Jade Plant", slug: "jade-plant", category: "Succulents", categorySlug: "succulents", image: "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=400&q=80", rating: 4.6, reviewCount: 198, price: 249, originalPrice: 349, discountPercent: 29, sunInfo: "Full Sun", waterInfo: "Weekly", difficulty: "Easy", isPetSafe: true, isAirPurifying: false, inStock: true, isBestseller: true, isNewArrival: false, suitableFor: ["Indoor", "Balcony"] },
  { id: "p8", name: "Spider Plant", slug: "spider-plant", category: "Indoor Plants", categorySlug: "indoor-plants", image: "https://images.unsplash.com/photo-1599598425947-5202edd56fde?w=400&q=80", rating: 4.5, reviewCount: 167, price: 199, originalPrice: 299, discountPercent: 33, sunInfo: "Indirect", waterInfo: "Weekly", difficulty: "Easy", isPetSafe: true, isAirPurifying: true, inStock: false, isBestseller: false, isNewArrival: false, suitableFor: ["Indoor", "Balcony"] },
  { id: "p9", name: "Anthurium Red", slug: "anthurium-red", category: "Flowering Plants", categorySlug: "flowering-plants", image: "https://images.unsplash.com/photo-1524598171347-abf62dfd6694?w=400&q=80", rating: 4.4, reviewCount: 78, price: 399, originalPrice: 599, discountPercent: 33, sunInfo: "Partial Shade", waterInfo: "Alternate Day", difficulty: "Moderate", isPetSafe: false, isAirPurifying: false, inStock: true, isBestseller: false, isNewArrival: false, suitableFor: ["Indoor"] },
  { id: "p10", name: "Bonsai Ficus", slug: "bonsai-ficus", category: "Bonsai", categorySlug: "bonsai", image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&q=80", rating: 4.8, reviewCount: 56, price: 1299, originalPrice: 1999, discountPercent: 35, sunInfo: "Full Sun", waterInfo: "Alternate Day", difficulty: "Expert", isPetSafe: false, isAirPurifying: false, inStock: true, isBestseller: false, isNewArrival: true, suitableFor: ["Outdoor", "Balcony"] },
  { id: "p11", name: "Aloe Vera", slug: "aloe-vera", category: "Succulents", categorySlug: "succulents", image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&q=80", rating: 4.7, reviewCount: 312, price: 149, originalPrice: 249, discountPercent: 40, sunInfo: "Full Sun", waterInfo: "Weekly", difficulty: "Easy", isPetSafe: true, isAirPurifying: true, inStock: true, isBestseller: true, isNewArrival: false, suitableFor: ["Indoor", "Balcony"] },
  { id: "p12", name: "Tulsi (Holy Basil)", slug: "tulsi", category: "Outdoor Plants", categorySlug: "outdoor-plants", image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&q=80", rating: 4.9, reviewCount: 445, price: 99, originalPrice: 149, discountPercent: 34, sunInfo: "Full Sun", waterInfo: "Daily", difficulty: "Easy", isPetSafe: true, isAirPurifying: true, inStock: true, isBestseller: true, isNewArrival: false, suitableFor: ["Outdoor", "Balcony"] },
  { id: "p13", name: "Monstera Deliciosa", slug: "monstera", category: "Indoor Plants", categorySlug: "indoor-plants", image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80", rating: 4.8, reviewCount: 203, price: 799, originalPrice: 1099, discountPercent: 27, sunInfo: "Indirect", waterInfo: "Weekly", difficulty: "Moderate", isPetSafe: false, isAirPurifying: true, inStock: true, isBestseller: false, isNewArrival: true, suitableFor: ["Indoor", "Office"] },
  { id: "p14", name: "Lavender Plant", slug: "lavender", category: "Flowering Plants", categorySlug: "flowering-plants", image: "https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?w=400&q=80", rating: 4.3, reviewCount: 67, price: 349, originalPrice: 499, discountPercent: 30, sunInfo: "Full Sun", waterInfo: "Weekly", difficulty: "Moderate", isPetSafe: true, isAirPurifying: false, inStock: true, isBestseller: false, isNewArrival: false, suitableFor: ["Outdoor", "Balcony"] },
  { id: "p15", name: "Ceramic Planter (White)", slug: "ceramic-planter-white", category: "Planters", categorySlug: "ceramic-planters", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80", rating: 4.5, reviewCount: 89, price: 299, originalPrice: 499, discountPercent: 40, sunInfo: "Full Sun", waterInfo: "Daily", difficulty: "Easy", isPetSafe: true, isAirPurifying: false, inStock: true, isBestseller: false, isNewArrival: false, suitableFor: ["Indoor", "Outdoor"] },
  { id: "p16", name: "Hanging Planter Set", slug: "hanging-planter-set", category: "Planters", categorySlug: "ceramic-planters", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80", rating: 4.6, reviewCount: 124, price: 499, originalPrice: 799, discountPercent: 38, sunInfo: "Full Sun", waterInfo: "Daily", difficulty: "Easy", isPetSafe: true, isAirPurifying: false, inStock: true, isBestseller: true, isNewArrival: false, suitableFor: ["Balcony", "Outdoor"] },
];

export const SHOP_CATEGORIES = [
  { name: "Indoor Plants", slug: "indoor-plants", count: 7 },
  { name: "Outdoor Plants", slug: "outdoor-plants", count: 3 },
  { name: "Flowering Plants", slug: "flowering-plants", count: 2 },
  { name: "Succulents", slug: "succulents", count: 2 },
  { name: "Bonsai", slug: "bonsai", count: 1 },
  { name: "Planters", slug: "ceramic-planters", count: 2 },
];

export const SUNLIGHT_OPTIONS = ["Full Sun", "Partial Shade", "Shade", "Indirect"] as const;
export const DIFFICULTY_OPTIONS = ["Easy", "Moderate", "Expert"] as const;
export const SUITABLE_FOR_OPTIONS = ["Indoor", "Outdoor", "Balcony", "Office"] as const;

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rated" },
  { value: "newest", label: "Newest First" },
  { value: "bestseller", label: "Best Sellers" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];
