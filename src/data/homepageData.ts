/**
 * GrowPlants — Homepage Mock Data
 * Source: User-provided screenshot (screencapture-localhost-3000-2026-07-08)
 *
 * All content matches the screenshot exactly.
 */

/* ---------- Hero ---------- */
export interface HeroSlide {
  id: string;
  badge: string;
  headline: string;
  subtitle: string;
  trustBadge?: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: string;
  imageAlt: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    badge: "VERIFIED GARDENING EXPERTS",
    headline: "Expert Gardening Services At Your Doorstep",
    subtitle: "Hire verified gardening helpers for maintenance and setup in Sonipat.",
    trustBadge: "Background Verified Pros",
    primaryCta: { label: "Book A Gardener", href: "/services" },
    secondaryCta: { label: "View Services", href: "/services" },
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn4SZmoYC-TWOHlrDkProVO06IKAPpW8vTIf7U2d85ePzno9HUqPZGimAq54AL8bZ56YN_RG1PAqXUoAMOFJIVC2YLouJDsP_J_127xAyUNC-fN8RnerhQOQ3Zb4gyei1vXR2agsRHxuAHPS2-Cr-vHFwgi3ZX9eePSOMxUegwnVVv6v-IQZ0tIEqe_YEAxWskhebzvf4y91uF8N5LJHrWLhJ6YLDf2_lyqMFPpMszR6LSUJ5lQMnTOc0tdJFhsUd9HHvjOCeupgPF",
    imageAlt: "Gardener tending to plants in a garden",
  },
];

/* ---------- Quick Categories ---------- */
export interface QuickCategory {
  id: string;
  name: string;
  itemCount: number;
  image: string;
  href: string;
}

export const QUICK_CATEGORIES: QuickCategory[] = [
  { id: "cat-1", name: "Indoor Plants", itemCount: 45, image: "https://nurserylive.com/cdn/shop/collections/nurserylive-indoor-plants_400x.jpg", href: "/shop?category=indoor-plants" },
  { id: "cat-2", name: "Outdoor Plants", itemCount: 32, image: "https://nurserylive.com/cdn/shop/collections/nurserylive-outdoor-plants_400x.jpg", href: "/shop?category=outdoor-plants" },
  { id: "cat-3", name: "Flowering Plants", itemCount: 27, image: "https://nurserylive.com/cdn/shop/collections/nurserylive-flowering-plants_400x.jpg", href: "/shop?category=flowering-plants" },
  { id: "cat-4", name: "Air Purifying", itemCount: 19, image: "https://nurserylive.com/cdn/shop/collections/nurserylive-air-purifying-plants_400x.jpg", href: "/shop?category=air-purifying-plants" },
  { id: "cat-5", name: "Succulents", itemCount: 15, image: "https://nurserylive.com/cdn/shop/collections/nurserylive-succulents_400x.jpg", href: "/shop?category=succulents" },
  { id: "cat-6", name: "Bonsai", itemCount: 12, image: "https://nurserylive.com/cdn/shop/collections/nurserylive-bonsai-plants_400x.jpg", href: "/shop?category=bonsai" },
  { id: "cat-7", name: "Planters", itemCount: 10, image: "https://nurserylive.com/cdn/shop/collections/nurserylive-ceramic-pots_400x.jpg", href: "/shop?category=ceramic-planters" },
  { id: "cat-8", name: "Seeds & Tools", itemCount: 8, image: "https://nurserylive.com/cdn/shop/collections/nurserylive-seeds_400x.jpg", href: "/shop?category=seeds-bulbs" },
];

/* ---------- Products ---------- */
export interface Product {
  id: string;
  categoryBadge: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  sunInfo: string;
  waterInfo: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  isBestseller?: boolean;
  slug: string;
  availableStock: number;
  isBestseller_bool: boolean;
  isNewArrival: boolean;
  isAirPurifying: boolean;
  tags: string[];
}

export const PRODUCTS: Product[] = [
  { id: "p1", categoryBadge: "INDOOR PLANTS", name: "Poinsettia Pink Plant", image: "https://nurserylive.com/cdn/shop/products/nurserylive-poinsettia-pink_600x600.jpg", rating: 4.3, reviewCount: 34, sunInfo: "Full Sun", waterInfo: "Weekly", price: 179, originalPrice: 299, discountPercent: 40, isBestseller: true, slug: "poinsettia-pink", availableStock: 15, isBestseller_bool: true, isNewArrival: false, isAirPurifying: false, tags: ["bestseller"] },
  { id: "p2", categoryBadge: "OUTDOOR PLANTS", name: "'First Love' plant (Xanthostemon chrysanthus)", image: "https://nurserylive.com/cdn/shop/products/nurserylive-first-love-plant_600x600.jpg", rating: 4.6, reviewCount: 61, sunInfo: "Full Sun", waterInfo: "Weekly", price: 80, originalPrice: 149, discountPercent: 46, slug: "first-love-plant", availableStock: 22, isBestseller_bool: false, isNewArrival: true, isAirPurifying: false, tags: ["new"] },
  { id: "p3", categoryBadge: "INDOOR PLANTS", name: "Anthurium Red Plant", image: "https://nurserylive.com/cdn/shop/products/nurserylive-anthurium-red_600x600.jpg", rating: 4.5, reviewCount: 28, sunInfo: "Full Sun", waterInfo: "Weekly", price: 399, originalPrice: 599, discountPercent: 33, slug: "anthurium-red", availableStock: 8, isBestseller_bool: false, isNewArrival: false, isAirPurifying: true, tags: ["air-purifying"] },
  { id: "p4", categoryBadge: "INDOOR PLANTS", name: "Peace Lily Plant", image: "https://nurserylive.com/cdn/shop/products/nurserylive-peace-lily-plant_600x600.jpg", rating: 4.6, reviewCount: 72, sunInfo: "Full Sun", waterInfo: "Weekly", price: 109, originalPrice: 199, discountPercent: 45, isBestseller: true, slug: "peace-lily", availableStock: 18, isBestseller_bool: true, isNewArrival: false, isAirPurifying: true, tags: ["bestseller", "air-purifying"] },
  { id: "p5", categoryBadge: "SUMMER PLANTS", name: "Money Plant Golden", image: "https://nurserylive.com/cdn/shop/products/nurserylive-money-plant-golden_600x600.jpg", rating: 4.5, reviewCount: 19, sunInfo: "Full Sun", waterInfo: "Weekly", price: 99, originalPrice: 179, discountPercent: 45, slug: "money-plant-golden", availableStock: 25, isBestseller_bool: false, isNewArrival: true, isAirPurifying: true, tags: ["new", "trending", "air-purifying"] },
  { id: "p6", categoryBadge: "INDOOR PLANTS", name: "Spider Plant (Small)", image: "https://nurserylive.com/cdn/shop/products/nurserylive-spider-plant_600x600.jpg", rating: 4.6, reviewCount: 15, sunInfo: "Full Sun", waterInfo: "Weekly", price: 59, originalPrice: 99, discountPercent: 40, slug: "spider-plant", availableStock: 30, isBestseller_bool: false, isNewArrival: false, isAirPurifying: true, tags: ["air-purifying", "trending"] },
  { id: "p7", categoryBadge: "OUTDOOR PLANTS", name: "All Spice Plant", image: "https://nurserylive.com/cdn/shop/products/nurserylive-all-spice-plant_600x600.jpg", rating: 0, reviewCount: 0, sunInfo: "Full Sun", waterInfo: "Weekly", price: 89, originalPrice: 149, discountPercent: 40, slug: "all-spice-plant", availableStock: 12, isBestseller_bool: false, isNewArrival: false, isAirPurifying: false, tags: [] },
  { id: "p8", categoryBadge: "OUTDOOR PLANTS", name: "Stand Kamini Plant", image: "https://nurserylive.com/cdn/shop/products/nurserylive-kamini-plant_600x600.jpg", rating: 4.4, reviewCount: 8, sunInfo: "Full Sun", waterInfo: "Weekly", price: 99, originalPrice: 179, discountPercent: 45, slug: "stand-kamini-plant", availableStock: 14, isBestseller_bool: false, isNewArrival: false, isAirPurifying: false, tags: [] },
];

export interface FilterTab {
  id: string;
  label: string;
  filter: (p: Product) => boolean;
}

export const FILTER_TABS: FilterTab[] = [
  { id: "all", label: "All Plants", filter: () => true },
  { id: "bestseller", label: "Best Sellers", filter: (p) => p.isBestseller_bool },
  { id: "new", label: "New Arrivals", filter: (p) => p.isNewArrival },
  { id: "trending", label: "Trending", filter: (p) => p.tags.includes("trending") },
  { id: "air-purifying", label: "Air Purifying", filter: (p) => p.isAirPurifying },
];

/* ---------- Services ---------- */
export interface Service {
  id: string;
  categoryBadge: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  bookingCount: number;
  priceFrom: number;
  priceUnit: string;
  pricingType: "fixed" | "quote_based";
  image: string;
  href: string;
}

export const SERVICES: Service[] = [
  {
    id: "svc-1",
    categoryBadge: "BALCONY SETUP",
    name: "Balcony Garden Setup",
    description: "Complete transformation of your balcony into a lush green garden. Includes plant selection, arrangement, soil preparation, and maintenance tips.",
    rating: 4.8,
    reviewCount: 64,
    bookingCount: 125,
    priceFrom: 1499,
    priceUnit: "per session",
    pricingType: "fixed",
    image: "https://nurserylive.com/cdn/shop/articles/nurserylive-balcony-garden_600x.jpg",
    href: "/services/balcony-setup",
  },
  {
    id: "svc-2",
    categoryBadge: "GARDEN MAINTENANCE",
    name: "Garden Maintenance (Monthly)",
    description: "Monthly garden maintenance – watering, pruning, fertilizing, and pest control handled by a dedicated gardener.",
    rating: 4.9,
    reviewCount: 72,
    bookingCount: 200,
    priceFrom: 799,
    priceUnit: "per month",
    pricingType: "fixed",
    image: "https://nurserylive.com/cdn/shop/articles/nurserylive-garden-maintenance_600x.jpg",
    href: "/services/garden-maintenance",
  },
  {
    id: "svc-3",
    categoryBadge: "TERRACE SETUP",
    name: "Terrace Garden Design & Setup",
    description: "Transform your terrace into a stunning rooftop garden with raised beds, vertical gardens, and proper drainage.",
    rating: 4.7,
    reviewCount: 38,
    bookingCount: 56,
    priceFrom: 0,
    priceUnit: "",
    pricingType: "quote_based",
    image: "https://nurserylive.com/cdn/shop/articles/nurserylive-terrace-garden_600x.jpg",
    href: "/services/terrace-setup",
  },
];

/* ---------- Booking Steps ---------- */
export interface BookingStep {
  step: string;
  title: string;
  description: string;
}

export const BOOKING_STEPS: BookingStep[] = [
  { step: "01", title: "Choose a Service", description: "Browse our range of professional gardening services." },
  { step: "02", title: "Pick a Time Slot", description: "Select your preferred date and available time slot." },
  { step: "03", title: "We Match a Gardener", description: "Our system assigns the nearest verified professional." },
  { step: "04", title: "Garden Transformed!", description: "Sit back and enjoy your beautiful green space." },
];

export const SERVICE_TRUST_BADGES = [
  "Background Verified",
  "4.8+ Average Rating",
  "2-Hour Confirmation",
  "500+ Bookings Done",
];

/* ---------- Service Categories Strip ---------- */
export const SERVICE_CATEGORIES_STRIP = [
  "Gardener Hiring",
  "Plant Installation",
  "Balcony Garden",
  "Terrace Garden",
  "Landscape Design",
  "Maintenance",
  "Lawn Care",
  "Plant Inspection",
];

/* ---------- Why GrowPlants ---------- */
export interface WhyChooseCard {
  id: string;
  icon: "heart" | "clock" | "calendar" | "leaf";
  title: string;
  body: string;
}

export const WHY_CHOOSE_CARDS: WhyChooseCard[] = [
  { id: "wc-1", icon: "heart", title: "Lifetime Plant Care Support", body: "Our plant experts are available on WhatsApp for free post-purchase care guidance." },
  { id: "wc-2", icon: "clock", title: "Sonipat-First, Then Haryana", body: "We are rooted in Sonipat. Neighbourhood-first approach means faster service and local trust." },
  { id: "wc-3", icon: "calendar", title: "Flexible Time Slot Booking", body: "Book services for morning, afternoon, or evening slots — 7 days a week." },
  { id: "wc-4", icon: "leaf", title: "Eco-Friendly Packaging", body: "Plants are shipped in biodegradable packaging. We care about your garden and the planet." },
];

/* ---------- Providers ---------- */
export interface Provider {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  city: string;
  bio: string;
  services: string;
  bookingCount: number;
  avatarImage: string;
}

export const PROVIDERS: Provider[] = [
  { id: "prov-1", name: "Ramesh Kumar", rating: 4.9, reviewCount: 137, experienceYears: 6, city: "Sonipat", bio: "Experienced landscape gardener with 8+ years in horticulture and indoor gardening.", services: "Balcony Garden, Plant Installation", bookingCount: 274, avatarImage: "https://nurserylive.com/cdn/shop/articles/nurserylive-gardener-1_200x200.jpg" },
  { id: "prov-2", name: "Sunita Devi", rating: 4.8, reviewCount: 143, experienceYears: 5, city: "Sonipat", bio: "Dedicated plant expert and home garden designer with 5+ years of experience.", services: "Indoor Plants, Flowering Garden", bookingCount: 142, avatarImage: "https://nurserylive.com/cdn/shop/articles/nurserylive-gardener-2_200x200.jpg" },
  { id: "prov-3", name: "Vikram Sharma", rating: 4.7, reviewCount: 104, experienceYears: 12, city: "Sonipat", bio: "Terrace garden specialist and vertical garden expert with 12+ years of experience.", services: "Terrace Garden, Vertical Garden", bookingCount: 370, avatarImage: "https://nurserylive.com/cdn/shop/articles/nurserylive-gardener-3_200x200.jpg" },
  { id: "prov-4", name: "Priya Gupta", rating: 4.9, reviewCount: 89, experienceYears: 7, city: "Sonipat", bio: "Indoor plant specialist and balcony garden designer with 7+ years of experience.", services: "Indoor Plants, Balcony Garden", bookingCount: 198, avatarImage: "https://nurserylive.com/cdn/shop/articles/nurserylive-gardener-4_200x200.jpg" },
];

/* ---------- Testimonials ---------- */
export interface Testimonial {
  id: string;
  customerName: string;
  text: string;
  attribution: string;
  avatarImage: string;
}

export const TESTIMONIALS: Testimonial[] = [
  { id: "t1", customerName: "Anjali Mehta", text: "Absolutely love the Peace Lily I ordered! It arrived in perfect condition, well-packaged. The plant is healthy and already started to bloom. Delivery was on time. Highly recommended for anyone looking for an elegant indoor plant!", attribution: "— Verified Product Buyer", avatarImage: "https://nurserylive.com/cdn/shop/articles/nurserylive-customer-1_200x200.jpg" },
];

export const TESTIMONIAL_STATS = [
  { value: "1,200+", label: "Happy Customers" },
  { value: "4.8★", label: "Average Rating" },
  { value: "500+", label: "Services Completed" },
  { value: "3,400+", label: "Plants Delivered" },
];

/* ---------- Blog ---------- */
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: number;
  href: string;
  featured?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  { id: "b1", title: "10 Best Indoor Plants for Indian Homes in 2024", excerpt: "Discover the perfect low-maintenance plants that thrive in India's climate while beautifying your home.", image: "https://nurserylive.com/cdn/shop/articles/nurserylive-indoor-plants-guide_600x.jpg", category: "10 Best Indoor Plants for Indian Homes in 2024", author: "GreenThumb Team", date: "1 April 2024", readTime: 5, href: "/blog/best-indoor-plants", featured: true },
  { id: "b2", title: "How to Set Up a Balcony Garden in a Small Space", excerpt: "Transform your tiny balcony into a lush oasis with smart plant choices...", image: "https://nurserylive.com/cdn/shop/articles/nurserylive-balcony-ideas_400x.jpg", category: "Balcony Garden", author: "GreenThumb Team", date: "25 March 2024", readTime: 4, href: "/blog/balcony-garden-small-space" },
  { id: "b3", title: "Summer Plant Care Guide — Protecting Plants in Indian Heat", excerpt: "Keep your plants healthy through the scorching Indian summer with these...", image: "https://nurserylive.com/cdn/shop/articles/nurserylive-summer-care_400x.jpg", category: "Plant Care", author: "GreenThumb Team", date: "18 March 2024", readTime: 6, href: "/blog/summer-plant-care" },
];

/* ---------- FAQ ---------- */
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  { id: "f1", question: "Do you deliver plants in Sonipat?", answer: "Yes! We currently deliver across all major areas in Sonipat, including urban sectors, residential areas, and commercial zones. Enter your pincode to confirm coverage." },
  { id: "f2", question: "What if my plant arrives damaged?", answer: "We offer a 24-hour damage guarantee. If your plant arrives damaged, contact us within 24 hours with a photo and we'll send a free replacement or full refund — no questions asked." },
  { id: "f3", question: "How are gardening service providers verified?", answer: "Every gardener undergoes identity verification (Aadhar + PAN), background check, skills assessment, and an in-person interview. They're rated by customers after every booking — only 4-star-and-above providers stay on the platform." },
  { id: "f4", question: "Is Cash on Delivery (COD) available?", answer: "Yes, COD is available for orders up to ₹5,000 in most serviceable pincodes. You can also pay online via UPI, cards, net banking, or wallets through our secure Razorpay checkout." },
  { id: "f5", question: "Can I book a service for a specific date and time?", answer: "Yes! You can choose from 4 time slots (9-11 AM, 11 AM-1 PM, 2-4 PM, 4-6 PM) for any date at least 1 day in advance. Bookings can be rescheduled or cancelled up to 24 hours before the scheduled time." },
];
