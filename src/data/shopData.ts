/**
 * GrowPlants — Shop Data (REAL DATA — no more mock)
 * Re-exports from shop-products.ts which reads from plants-data.json + pots-data.json.
 */
export {
  getAllProducts,
  getShopCategories,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  SUNLIGHT_OPTIONS,
  DIFFICULTY_OPTIONS,
  SUITABLE_FOR_OPTIONS,
  SORT_OPTIONS,
} from "@/lib/shop-products";

export type { ShopProduct, SortValue } from "@/lib/shop-products";

import { getAllProducts, getShopCategories } from "@/lib/shop-products";
import type { ShopProduct, SortValue } from "@/lib/shop-products";

/** Eager-loaded arrays for components that need static data at module level */
export const SHOP_PRODUCTS: ShopProduct[] = getAllProducts();
export const SHOP_CATEGORIES = getShopCategories();
