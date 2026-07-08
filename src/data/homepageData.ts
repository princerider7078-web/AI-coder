/**
 * GrowPlants — Homepage Mock Data
 * Source: HOMEPAGE_AUDIT_REPORT.md §1.1 (section list), PRD §8.2 (Home Screen Requirements)
 *
 * Phase 4 uses mock data (per audit, mock data is acceptable for homepage).
 * Phase 7+ will replace with real API calls via TanStack React Query.
 *
 * All data is bilingual (EN/HI) to leverage the Zustand store.
 * Image URLs use nurserylive.com (already in next.config.ts remotePatterns)
 * — avoiding Amazon-hosted images per audit M10 (licensing risk).
 */

export interface HeroSlide {
  id: string;
  badge: { en: string; hi: string };
  headline: { en: string; hi: string };
  subtitle: { en: string; hi: string };
  primaryCta: { label: { en: string; hi: string }; href: string };
  secondaryCta?: { label: { en: string; hi: string }; href: string };
  image: string;
  imageAlt: { en: string; hi: string };
  tone: "green" | "amber" | "sage" | "neutral";
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    badge: { en: "🌿 New Season Arrivals", hi: "🌿 नया मौसम आया" },
    headline: {
      en: "Bring Home a Little Green",
      hi: "घर लाएं थोड़ी हरियाली",
    },
    subtitle: {
      en: "Healthy indoor plants delivered to your door in Sonipat. Free shipping above ₹499.",
      hi: "सोनीपत में आपके दरवाज़े तक स्वस्थ इंडोर पौधे। ₹499 से ऊपर मुफ़्त शिपिंग।",
    },
    primaryCta: { label: { en: "Shop Plants", hi: "पौधे खरीदें" }, href: "/shop?category=indoor-plants" },
    secondaryCta: { label: { en: "Explore Collection", hi: "संग्रह देखें" }, href: "/shop" },
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBsZc39PTv7nBgZzHrCxzLOlLBq1C0tnYDkHSytQ0g-ko4wI-xydAAd33yQiIw40vAzWZKqSQshPetOqOp-4DVHEMT33qy427oWHXUAqje9T0ia1770zLwVsH5aMJumReTVVzHZHgaDk70CejheTVg6gKfTP2hdcuGrM2SeSfpNPj5HnYBdtyHHzRcH1kSd2fgnC4g8_RXY6DeFCl5B2jQBnOSf0JTxPijZZJ9Koc8b748kxr6e3k6mBjSeq8BpULGSUhzQ2FYXs7d",
    imageAlt: { en: "Indoor plants collection in a bright home", hi: "एक उज्ज्वल घर में इंडोर पौधों का संग्रह" },
    tone: "green",
  },
  {
    id: "slide-2",
    badge: { en: "🔨 Gardening Services", hi: "🔨 बागवानी सेवाएं" },
    headline: {
      en: "Book a Verified Gardener",
      hi: "सत्यापित माली बुक करें",
    },
    subtitle: {
      en: "Balcony setup, garden maintenance, landscaping — by background-checked local experts.",
      hi: "बालकनी सेटअप, बगीचा रखरखाव, लैंडस्केपिंग — जांचे हुए स्थानीय विशेषज्ञों द्वारा।",
    },
    primaryCta: { label: { en: "Book a Service", hi: "सेवा बुक करें" }, href: "/services" },
    secondaryCta: { label: { en: "Become a Provider", hi: "प्रदाता बनें" }, href: "/become-provider" },
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn4SZmoYC-TWOHlrDkProVO06IKAPpW8vTIf7U2d85ePzno9HUqPZGimAq54AL8bZ56YN_RG1PAqXUoAMOFJIVC2YLouJDsP_J_127xAyUNC-fN8RnerhQOQ3Zb4gyei1vXR2agsRHxuAHPS2-Cr-vHFwgi3ZX9eePSOMxUegwnVVv6v-IQZ0tIEqe_YEAxWskhebzvf4y91uF8N5LJHrWLhJ6YLDf2_lyqMFPpMszR6LSUJ5lQMnTOc0tdJFhsUd9HHvjOCeupgPF",
    imageAlt: { en: "Gardener tending to plants in a home garden", hi: "घर के बगीचे में पौधों की देखभाल करता हुआ माली" },
    tone: "sage",
  },
  {
    id: "slide-3",
    badge: { en: "🎉 Monsoon Sale — 40% Off", hi: "🎉 मानसून सेल — 40% छूट" },
    headline: {
      en: "Rainy Season Plants",
      hi: "बरसात के पौधे",
    },
    subtitle: {
      en: "Air-purifying, pet-safe, and easy-care picks for the monsoon. Limited time only.",
      hi: "मानसून के लिए वायु-शुद्धिकारक, पालतू-सुरक्षित, और आसान-देखभाल वाले पौधे। सीमित समय।",
    },
    primaryCta: { label: { en: "Shop Seasonal", hi: "मौसमी खरीदें" }, href: "/shop?category=seasonal-plants" },
    secondaryCta: { label: { en: "See Reviews", hi: "समीक्षाएं देखें" }, href: "/#testimonials" },
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXDyeLZVK9QbLFNwqQgWzO439Qws7uIWWfoYtwtdjMmPIimZ1NamCCSRI8_EbcZfpj42zoX_NkYWY2LTQPNgEgSL0Yz15ClKj8PRwzazHnyg38SvtQz6mW0FYhQjdar01002qHzml90jp2sgN5YFg6nN25zXKWYQdNTuiA5g",
    imageAlt: { en: "Lush green plants thriving in monsoon rain", hi: "मानसून बारिश में फलते-फूलते हरित पौधे" },
    tone: "amber",
  },
  {
    id: "slide-4",
    badge: { en: "🪴 Premium Planters", hi: "🪴 प्रीमियम प्लांटर" },
    headline: {
      en: "Style Your Space",
      hi: "अपनी जगह सजाएं",
    },
    subtitle: {
      en: "Handcrafted ceramic, terracotta, and decorative planters — designed to complement every plant.",
      hi: "हस्तनिर्मित सिरामिक, मिट्टी, और सजावटी प्लांटर — हर पौधे के अनुरूप डिज़ाइन किए गए।",
    },
    primaryCta: { label: { en: "Shop Planters", hi: "प्लांटर खरीदें" }, href: "/shop?category=ceramic-planters" },
    secondaryCta: { label: { en: "View Collection", hi: "संग्रह देखें" }, href: "/shop?category=planters" },
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVpptpcEz4r7LnHtzvTelMWxMjjDfiYA9z4yjhCwbIOQuZXxaer-oZGPY6CcMzI5-Z8k0dKQIjJMiwl8_NZfyj3nlK08qw9QDw8x_KQ0--cbf8PqkQ6TTztknN0J9tmKiultJ-gZ14Y-LUMvOAipRTizzoX_emoH69nWo5e-97oPaHxQSDnXqhwzJjLQKp70Xy2edY9LWrveDcD268jN1nFB3PbEyTuc80vay449tV7qgHihHciK-TloKypRR09t3VJIvsOArVf2Yp",
    imageAlt: { en: "Premium ceramic and terracotta planters display", hi: "प्रीमियम सिरामिक और मिट्टी के प्लांटर प्रदर्शन" },
    tone: "neutral",
  },
];

/* ---------- Quick Category Grid (8 categories) ---------- */

export interface QuickCategory {
  id: string;
  name: { en: string; hi: string };
  slug: string;
  itemCount: number;
  image: string;
  href: string;
}

export const QUICK_CATEGORIES: QuickCategory[] = [
  {
    id: "cat-1",
    name: { en: "Indoor Plants", hi: "इंडोर पौधे" },
    slug: "indoor-plants",
    itemCount: 48,
    image: "https://nurserylive.com/cdn/shop/collections/nurserylive-indoor-plants_400x.jpg",
    href: "/shop?category=indoor-plants",
  },
  {
    id: "cat-2",
    name: { en: "Outdoor Plants", hi: "आउटडोर पौधे" },
    slug: "outdoor-plants",
    itemCount: 36,
    image: "https://nurserylive.com/cdn/shop/collections/nurserylive-outdoor-plants_400x.jpg",
    href: "/shop?category=outdoor-plants",
  },
  {
    id: "cat-3",
    name: { en: "Flowering Plants", hi: "फूलों के पौधे" },
    slug: "flowering-plants",
    itemCount: 24,
    image: "https://nurserylive.com/cdn/shop/collections/nurserylive-flowering-plants_400x.jpg",
    href: "/shop?category=flowering-plants",
  },
  {
    id: "cat-4",
    name: { en: "Succulents", hi: "रसीले पौधे" },
    slug: "succulents",
    itemCount: 32,
    image: "https://nurserylive.com/cdn/shop/collections/nurserylive-succulents_400x.jpg",
    href: "/shop?category=succulents",
  },
  {
    id: "cat-5",
    name: { en: "Bonsai", hi: "बोंसाई" },
    slug: "bonsai",
    itemCount: 18,
    image: "https://nurserylive.com/cdn/shop/collections/nurserylive-bonsai-plants_400x.jpg",
    href: "/shop?category=bonsai",
  },
  {
    id: "cat-6",
    name: { en: "Ceramic Planters", hi: "सिरामिक प्लांटर" },
    slug: "ceramic-planters",
    itemCount: 42,
    image: "https://nurserylive.com/cdn/shop/collections/nurserylive-ceramic-pots_400x.jpg",
    href: "/shop?category=ceramic-planters",
  },
  {
    id: "cat-7",
    name: { en: "Seeds & Bulbs", hi: "बीज और बल्ब" },
    slug: "seeds-bulbs",
    itemCount: 56,
    image: "https://nurserylive.com/cdn/shop/collections/nurserylive-seeds_400x.jpg",
    href: "/shop?category=seeds-bulbs",
  },
  {
    id: "cat-8",
    name: { en: "Tools & Care", hi: "उपकरण और देखभाल" },
    slug: "tools-equipment",
    itemCount: 28,
    image: "https://nurserylive.com/cdn/shop/collections/nurserylive-gardening-tools_400x.jpg",
    href: "/shop?category=tools-equipment",
  },
];

/* ---------- Best Sellers Products ---------- */

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  image: string;
  basePrice: number;
  sellingPrice: number;
  rating: number;
  reviewCount: number;
  availableStock: number;
  isBestseller: boolean;
  isNewArrival: boolean;
  isAirPurifying: boolean;
  difficultyLevel: "easy" | "moderate" | "expert";
  sunlightReq: "full_sun" | "partial_shade" | "shade" | "indirect";
  isPetSafe: boolean;
  tags: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Snake Plant (Sansevieria Trifasciata)",
    slug: "snake-plant",
    shortDescription: "Air-purifying, low-maintenance, pet-safe indoor plant",
    image: "https://nurserylive.com/cdn/shop/products/nurserylive-snake-plant-sansevieria-trifasciata-plant_600x600.jpg",
    basePrice: 499,
    sellingPrice: 349,
    rating: 4.7,
    reviewCount: 234,
    availableStock: 15,
    isBestseller: true,
    isNewArrival: false,
    isAirPurifying: true,
    difficultyLevel: "easy",
    sunlightReq: "indirect",
    isPetSafe: false,
    tags: ["bestseller", "air-purifying"],
  },
  {
    id: "prod-2",
    name: "Money Plant (Pothos Golden)",
    slug: "money-plant",
    shortDescription: "Easy-care trailing vine, perfect for hanging pots",
    image: "https://nurserylive.com/cdn/shop/products/nurserylive-money-plant-epipremnum-aureum_600x600.jpg",
    basePrice: 399,
    sellingPrice: 249,
    rating: 4.8,
    reviewCount: 412,
    availableStock: 22,
    isBestseller: true,
    isNewArrival: false,
    isAirPurifying: true,
    difficultyLevel: "easy",
    sunlightReq: "indirect",
    isPetSafe: false,
    tags: ["bestseller", "air-purifying", "trending"],
  },
  {
    id: "prod-3",
    name: "Areca Palm (Dypsis Lutescens)",
    slug: "areca-palm",
    shortDescription: "Elegant air-purifying palm for bright indoor spaces",
    image: "https://nurserylive.com/cdn/shop/products/nurserylive-areca-palm-plant_600x600.jpg",
    basePrice: 799,
    sellingPrice: 599,
    rating: 4.6,
    reviewCount: 156,
    availableStock: 8,
    isBestseller: true,
    isNewArrival: false,
    isAirPurifying: true,
    difficultyLevel: "moderate",
    sunlightReq: "partial_shade",
    isPetSafe: true,
    tags: ["bestseller", "air-purifying", "pet-safe"],
  },
  {
    id: "prod-4",
    name: "ZZ Plant (Zamioculcas Zamiifolia)",
    slug: "zz-plant",
    shortDescription: "Drought-tolerant, low-light champion for offices",
    image: "https://nurserylive.com/cdn/shop/products/nurserylive-zz-plant-zamioculcas-zamiifolia_600x600.jpg",
    basePrice: 899,
    sellingPrice: 649,
    rating: 4.9,
    reviewCount: 89,
    availableStock: 12,
    isBestseller: false,
    isNewArrival: true,
    isAirPurifying: true,
    difficultyLevel: "easy",
    sunlightReq: "shade",
    isPetSafe: false,
    tags: ["new", "air-purifying", "trending"],
  },
  {
    id: "prod-5",
    name: "Peace Lily (Spathiphyllum)",
    slug: "peace-lily",
    shortDescription: "Flowering air-purifier with elegant white blooms",
    image: "https://nurserylive.com/cdn/shop/products/nurserylive-peace-lily-plant_600x600.jpg",
    basePrice: 599,
    sellingPrice: 449,
    rating: 4.5,
    reviewCount: 178,
    availableStock: 18,
    isBestseller: true,
    isNewArrival: false,
    isAirPurifying: true,
    difficultyLevel: "moderate",
    sunlightReq: "partial_shade",
    isPetSafe: false,
    tags: ["bestseller", "air-purifying"],
  },
  {
    id: "prod-6",
    name: "Rubber Plant (Ficus Elastica)",
    slug: "rubber-plant",
    shortDescription: "Bold glossy leaves, statement indoor tree",
    image: "https://nurserylive.com/cdn/shop/products/nurserylive-rubber-plant_600x600.jpg",
    basePrice: 749,
    sellingPrice: 599,
    rating: 4.7,
    reviewCount: 134,
    availableStock: 10,
    isBestseller: false,
    isNewArrival: true,
    isAirPurifying: true,
    difficultyLevel: "moderate",
    sunlightReq: "indirect",
    isPetSafe: false,
    tags: ["new", "trending"],
  },
  {
    id: "prod-7",
    name: "Jade Plant (Crassula Ovata)",
    slug: "jade-plant",
    shortDescription: "Lucky succulent, easy care, pet-safe",
    image: "https://nurserylive.com/cdn/shop/products/nurserylive-jade-plant_600x600.jpg",
    basePrice: 349,
    sellingPrice: 249,
    rating: 4.6,
    reviewCount: 198,
    availableStock: 25,
    isBestseller: true,
    isNewArrival: false,
    isAirPurifying: false,
    difficultyLevel: "easy",
    sunlightReq: "full_sun",
    isPetSafe: true,
    tags: ["bestseller", "pet-safe", "succulent"],
  },
  {
    id: "prod-8",
    name: "Spider Plant (Chlorophytum Comosum)",
    slug: "spider-plant",
    shortDescription: "Fast-growing air-purifier, pet-safe, easy",
    image: "https://nurserylive.com/cdn/shop/products/nurserylive-spider-plant_600x600.jpg",
    basePrice: 299,
    sellingPrice: 199,
    rating: 4.5,
    reviewCount: 167,
    availableStock: 0,
    isBestseller: false,
    isNewArrival: false,
    isAirPurifying: true,
    difficultyLevel: "easy",
    sunlightReq: "indirect",
    isPetSafe: true,
    tags: ["air-purifying", "pet-safe", "trending"],
  },
];

/* ---------- Best Sellers Filter Tabs ---------- */

export interface FilterTab {
  id: string;
  label: { en: string; hi: string };
  filter: (p: Product) => boolean;
}

export const FILTER_TABS: FilterTab[] = [
  { id: "all", label: { en: "All", hi: "सभी" }, filter: () => true },
  { id: "bestseller", label: { en: "Best Sellers", hi: "बेस्ट सेलर" }, filter: (p) => p.isBestseller },
  { id: "new", label: { en: "New Arrivals", hi: "नई आवक" }, filter: (p) => p.isNewArrival },
  { id: "trending", label: { en: "Trending", hi: "ट्रेंडिंग" }, filter: (p) => p.tags.includes("trending") },
  { id: "air-purifying", label: { en: "Air Purifying", hi: "वायु शुद्धिकारक" }, filter: (p) => p.isAirPurifying },
];

/* ---------- Services ---------- */

export interface Service {
  id: string;
  name: { en: string; hi: string };
  description: { en: string; hi: string };
  priceFrom: number;
  pricingType: "fixed" | "hourly" | "quote_based";
  duration: { en: string; hi: string };
  image: string;
  features: { en: string[]; hi: string[] };
  href: string;
}

export const SERVICES: Service[] = [
  {
    id: "svc-1",
    name: { en: "Balcony Garden Setup", hi: "बालकनी गार्डन सेटअप" },
    description: {
      en: "Complete balcony transformation with plants, planters, and care plan.",
      hi: "पौधों, प्लांटर और देखभाल योजना के साथ पूर्ण बालकनी रूपांतरण।",
    },
    priceFrom: 2499,
    pricingType: "fixed",
    duration: { en: "3–4 hours", hi: "3–4 घंटे" },
    image: "https://nurserylive.com/cdn/shop/articles/nurserylive-balcony-garden_600x.jpg",
    features: {
      en: ["5–8 plants included", "Premium planters", "Care guide", "Free follow-up"],
      hi: ["5–8 पौधे शामिल", "प्रीमियम प्लांटर", "देखभाल गाइड", "मुफ़्त फॉलो-अप"],
    },
    href: "/services/balcony-setup",
  },
  {
    id: "svc-2",
    name: { en: "Garden Maintenance", hi: "बगीचा रखरखाव" },
    description: {
      en: "Regular pruning, fertilizing, pest control, and plant health check.",
      hi: "नियमित छंटाई, खाद, कीट नियंत्रण, और पौधा स्वास्थ्य जांच।",
    },
    priceFrom: 499,
    pricingType: "hourly",
    duration: { en: "1–2 hours", hi: "1–2 घंटे" },
    image: "https://nurserylive.com/cdn/shop/articles/nurserylive-garden-maintenance_600x.jpg",
    features: {
      en: ["Per-hour pricing", "Verified gardener", "Tools included", "Flexible schedule"],
      hi: ["प्रति-घंटा मूल्य", "सत्यापित माली", "उपकरण शामिल", "लचीली समय-सूची"],
    },
    href: "/services/garden-maintenance",
  },
  {
    id: "svc-3",
    name: { en: "Landscape Design", hi: "लैंडस्केप डिज़ाइन" },
    description: {
      en: "Custom garden design with site visit, 3D plan, and installation.",
      hi: "साइट विज़िट, 3D योजना, और स्थापना के साथ कस्टम बगीचा डिज़ाइन।",
    },
    priceFrom: 9999,
    pricingType: "quote_based",
    duration: { en: "Custom quote", hi: "कस्टम कोटेशन" },
    image: "https://nurserylive.com/cdn/shop/articles/nurserylive-landscape-design_600x.jpg",
    features: {
      en: ["Site visit included", "3D design plan", "Plant selection", "Installation support"],
      hi: ["साइट विज़िट शामिल", "3D डिज़ाइन योजना", "पौधा चयन", "स्थापना समर्थन"],
    },
    href: "/services/landscape-design",
  },
];

/* ---------- Service Booking Steps ---------- */

export interface BookingStep {
  id: string;
  step: number;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
}

export const BOOKING_STEPS: BookingStep[] = [
  {
    id: "step-1",
    step: 1,
    title: { en: "Choose a Service", hi: "सेवा चुनें" },
    description: { en: "Browse and pick from balcony setup, maintenance, or landscape.", hi: "बालकनी सेटअप, रखरखाव, या लैंडस्केप से चुनें।" },
  },
  {
    id: "step-2",
    step: 2,
    title: { en: "Pick a Slot", hi: "स्लॉट चुनें" },
    description: { en: "Select a date and time slot that works for you.", hi: "अपने लिए उपयुक्त तारीख और समय स्लॉट चुनें।" },
  },
  {
    id: "step-3",
    step: 3,
    title: { en: "Confirm Booking", hi: "बुकिंग की पुष्टि करें" },
    description: { en: "Pay a small advance and get instant confirmation.", hi: "थोड़ा अग्रिम भुगतान करें और तुरंत पुष्टि पाएं।" },
  },
  {
    id: "step-4",
    step: 4,
    title: { en: "Gardener Arrives", hi: "माली आता है" },
    description: { en: "A verified gardener arrives at your scheduled time.", hi: "एक सत्यापित माली आपके निर्धारित समय पर आता है।" },
  },
];

/* ---------- Why Choose Us (8 trust cards) ---------- */

export interface TrustCard {
  id: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  icon: "leaf" | "truck" | "shield" | "refresh" | "headphones" | "sprout" | "clock" | "heart";
}

export const WHY_CHOOSE_US: TrustCard[] = [
  {
    id: "trust-1",
    title: { en: "Handpicked Plants", hi: "चुने हुए पौधे" },
    description: { en: "Every plant is quality-checked before dispatch.", hi: "हर पौधा भेजने से पहले जांचा जाता है।" },
    icon: "leaf",
  },
  {
    id: "trust-2",
    title: { en: "Same-Day Sonipat Delivery", hi: "सोनीपत समान-दिवस डिलीवरी" },
    description: { en: "Order before 2PM for same-day delivery in Sonipat.", hi: "सोनीपत में समान-दिवस डिलीवरी के लिए दोपहर 2 बजे से पहले ऑर्डर करें।" },
    icon: "truck",
  },
  {
    id: "trust-3",
    title: { en: "24-Hour Damage Guarantee", hi: "24 घंटे क्षति गारंटी" },
    description: { en: "Plant arrived damaged? Get a free replacement within 24 hours.", hi: "पौधा क्षतिग्रस्त आया? 24 घंटे में मुफ़्त प्रतिस्थापन पाएं।" },
    icon: "shield",
  },
  {
    id: "trust-4",
    title: { en: "Easy 7-Day Returns", hi: "आसान 7-दिन रिटर्न" },
    description: { en: "Return planters and accessories within 7 days for defects.", hi: "दोषों के लिए 7 दिनों में प्लांटर और सामान लौटाएं।" },
    icon: "refresh",
  },
  {
    id: "trust-5",
    title: { en: "Verified Gardeners", hi: "सत्यापित माली" },
    description: { en: "Background-checked, trained, and rated by customers.", hi: "पृष्ठभूमि-जांच, प्रशिक्षित, और ग्राहकों द्वारा रेटेड।" },
    icon: "sprout",
  },
  {
    id: "trust-6",
    title: { en: "Free Expert Support", hi: "मुफ़्त विशेषज्ञ सहायता" },
    description: { en: "Call or WhatsApp our plant experts, 7 days a week.", hi: "हफ़्ते में 7 दिन हमारे पौधा विशेषज्ञों को कॉल या व्हाट्सएप करें।" },
    icon: "headphones",
  },
  {
    id: "trust-7",
    title: { en: "On-Time Service", hi: "समय पर सेवा" },
    description: { en: "Gardeners arrive within your booked slot — guaranteed.", hi: "माली आपके बुक किए गए स्लॉट के भीतर आते हैं — गारंटी।" },
    icon: "clock",
  },
  {
    id: "trust-8",
    title: { en: "Loved by 1,200+ Customers", hi: "1,200+ ग्राहकों द्वारा पसंद" },
    description: { en: "4.8-star average rating from happy Sonipat gardeners.", hi: "खुशहाल सोनीपत उद्यानकर्ताओं से 4.8-स्टार औसत रेटिंग।" },
    icon: "heart",
  },
];

/* ---------- Providers (4 gardener profiles) ---------- */

export interface Provider {
  id: string;
  displayName: string;
  specialty: { en: string; hi: string };
  experienceYears: number;
  rating: number;
  reviewCount: number;
  jobsCompleted: number;
  avatarImage: string;
  verified: boolean;
  city: string;
}

export const PROVIDERS: Provider[] = [
  {
    id: "prov-1",
    displayName: "Ramesh Kumar",
    specialty: { en: "Balcony Gardens & Maintenance", hi: "बालकनी गार्डन और रखरखाव" },
    experienceYears: 8,
    rating: 4.9,
    reviewCount: 127,
    jobsCompleted: 215,
    avatarImage: "https://nurserylive.com/cdn/shop/articles/nurserylive-gardener-1_200x200.jpg",
    verified: true,
    city: "Sonipat",
  },
  {
    id: "prov-2",
    displayName: "Suresh Sharma",
    specialty: { en: "Landscape Design", hi: "लैंडस्केप डिज़ाइन" },
    experienceYears: 12,
    rating: 4.8,
    reviewCount: 89,
    jobsCompleted: 156,
    avatarImage: "https://nurserylive.com/cdn/shop/articles/nurserylive-gardener-2_200x200.jpg",
    verified: true,
    city: "Sonipat",
  },
  {
    id: "prov-3",
    displayName: "Anil Verma",
    specialty: { en: "Plant Health & Pest Control", hi: "पौधा स्वास्थ्य और कीट नियंत्रण" },
    experienceYears: 6,
    rating: 4.7,
    reviewCount: 64,
    jobsCompleted: 102,
    avatarImage: "https://nurserylive.com/cdn/shop/articles/nurserylive-gardener-3_200x200.jpg",
    verified: true,
    city: "Sonipat",
  },
  {
    id: "prov-4",
    displayName: "Mahesh Yadav",
    specialty: { en: "Lawn Care & Maintenance", hi: "लॉन देखभाल और रखरखाव" },
    experienceYears: 10,
    rating: 4.9,
    reviewCount: 142,
    jobsCompleted: 268,
    avatarImage: "https://nurserylive.com/cdn/shop/articles/nurserylive-gardener-4_200x200.jpg",
    verified: true,
    city: "Sonipat",
  },
];

/* ---------- Testimonials ---------- */

export interface Testimonial {
  id: string;
  customerName: string;
  customerCity: string;
  rating: number;
  text: { en: string; hi: string };
  plantName: string;
  date: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    customerName: "Priya Singh",
    customerCity: "Sonipat",
    rating: 5,
    text: {
      en: "The Snake Plant I ordered arrived in perfect condition. The packaging was excellent and delivery was next-day. Highly recommend GrowPlants!",
      hi: "मैंने जो स्नेक प्लांट ऑर्डर किया था वह बेकार स्थिति में आया। पैकेजिंग उत्कृष्ट थी और डिलीवरी अगले दिन हुई। ग्रोप्लांट्स की सिफारिश करती हूं!",
    },
    plantName: "Snake Plant",
    date: "2025-06-15",
  },
  {
    id: "test-2",
    customerName: "Rajesh Kumar",
    customerCity: "Sonipat",
    rating: 5,
    text: {
      en: "Booked Ramesh for balcony garden setup. He was punctual, knowledgeable, and transformed my empty balcony into a green paradise. Worth every rupee.",
      hi: "बालकनी गार्डन सेटअप के लिए रमेश को बुक किया। वह समय पर, जानकार, और मेरी खाली बालकनी को हरित स्वर्ग में बदल दिया। हर रुपये लायक।",
    },
    plantName: "Balcony Setup Service",
    date: "2025-06-10",
  },
  {
    id: "test-3",
    customerName: "Anita Sharma",
    customerCity: "Sonipat",
    rating: 4,
    text: {
      en: "Great collection of indoor plants. The Money Plant I bought is thriving. Only wish there were more planter options to choose from.",
      hi: "इंडोर पौधों का बढ़िया संग्रह। मैंने जो मनी प्लांट खरीदा वह फल-फूल रहा है। बस प्लांटर विकल्प और होते तो अच्छा लगता।",
    },
    plantName: "Money Plant",
    date: "2025-06-08",
  },
  {
    id: "test-4",
    customerName: "Vikram Gupta",
    customerCity: "Sonipat",
    rating: 5,
    text: {
      en: "The 24-hour damage guarantee is real — my ceramic planter arrived cracked, and they replaced it within 18 hours. Excellent customer service!",
      hi: "24 घंटे क्षति गारंटी सच है — मेरा सिरामिक प्लांटर टूटा आया, और उन्होंने 18 घंटे में बदल दिया। उत्कृष्ट ग्राहक सेवा!",
    },
    plantName: "Ceramic Planter",
    date: "2025-06-05",
  },
];

export const TESTIMONIAL_STATS = {
  happyCustomers: 1200,
  averageRating: 4.8,
  totalReviews: 348,
  citiesServed: 1,
};

/* ---------- Blog Preview ---------- */

export interface BlogPost {
  id: string;
  title: { en: string; hi: string };
  excerpt: { en: string; hi: string };
  image: string;
  category: { en: string; hi: string };
  date: string;
  readTime: number;
  href: string;
  featured?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: { en: "10 Easy Indoor Plants for Beginners", hi: "शुरुआती लोगों के लिए 10 आसान इंडोर पौधे" },
    excerpt: {
      en: "New to plants? Start with these low-maintenance champions that thrive in Indian homes.",
      hi: "पौधों में नए? इन कम-देखभाल वाले चैंपियन से शुरू करें जो भारतीय घरों में फलते हैं।",
    },
    image: "https://nurserylive.com/cdn/shop/articles/nurserylive-indoor-plants-guide_600x.jpg",
    category: { en: "Plant Care", hi: "पौधा देखभाल" },
    date: "2025-06-12",
    readTime: 5,
    href: "/blog/easy-indoor-plants",
    featured: true,
  },
  {
    id: "blog-2",
    title: { en: "Monsoon Plant Care Tips", hi: "मानसून पौधा देखभाल टिप्स" },
    excerpt: {
      en: "How to keep your plants healthy during the rainy season.",
      hi: "बरसात के मौसम में अपने पौधों को स्वस्थ कैसे रखें।",
    },
    image: "https://nurserylive.com/cdn/shop/articles/nurserylive-monsoon-care_400x.jpg",
    category: { en: "Seasonal", hi: "मौसमी" },
    date: "2025-06-08",
    readTime: 3,
    href: "/blog/monsoon-care",
  },
  {
    id: "blog-3",
    title: { en: "Balcony Garden Design Ideas", hi: "बालकनी गार्डन डिज़ाइन विचार" },
    excerpt: {
      en: "Transform your small balcony into a lush green space.",
      hi: "अपनी छोटी बालकनी को हरिभरा स्थान में बदलें।",
    },
    image: "https://nurserylive.com/cdn/shop/articles/nurserylive-balcony-ideas_400x.jpg",
    category: { en: "Design", hi: "डिज़ाइन" },
    date: "2025-06-03",
    readTime: 4,
    href: "/blog/balcony-design",
  },
];

/* ---------- FAQ ---------- */

export interface FAQItem {
  id: string;
  question: { en: string; hi: string };
  answer: { en: string; hi: string };
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-1",
    question: { en: "What areas do you deliver to?", hi: "आप किन क्षेत्रों में डिलीवरी करते हैं?" },
    answer: {
      en: "We currently deliver to all serviceable pincodes in Sonipat, Haryana. Enter your pincode in the delivery checker at the top of the page to confirm. We're expanding to more Haryana cities soon.",
      hi: "हम वर्तमान में सोनीपत, हरियाणा के सभी सेवा-योग्य पिनकोड पर डिलीवरी करते हैं। पुष्टि के लिए पेज के शीर्ष पर डिलीवरी चेकर में अपना पिनकोड दर्ज करें। हम जल्द ही और हरियाणा शहरों में विस्तार कर रहे हैं।",
    },
  },
  {
    id: "faq-2",
    question: { en: "What is your return policy?", hi: "आपकी रिटर्न नीति क्या है?" },
    answer: {
      en: "For plants: if your plant arrives damaged, raise a return within 24 hours with a photo — we'll send a free replacement. For planters and accessories: 7-day return window for manufacturing defects or shipping damage.",
      hi: "पौधों के लिए: यदि आपका पौधा क्षतिग्रस्त आता है, तो फोटो के साथ 24 घंटे के भीतर रिटर्न उठाएं — हम मुफ़्त प्रतिस्थापन भेजेंगे। प्लांटर और सामान के लिए: निर्माण दोष या शिपिंग क्षति के लिए 7-दिन रिटर्न विंडो।",
    },
  },
  {
    id: "faq-3",
    question: { en: "How fast is delivery?", hi: "डिलीवरी कितनी तेज़ है?" },
    answer: {
      en: "Orders placed before 2PM qualify for same-day delivery within Sonipat. Standard delivery takes 1–2 business days. Free shipping on orders above ₹499; otherwise a flat ₹49 delivery charge applies.",
      hi: "दोपहर 2 बजे से पहले दिए गए ऑर्डर सोनीपत के भीतर समान-दिवस डिलीवरी के लिए योग्य हैं। मानक डिलीवरी में 1–2 कार्य दिवस लगते हैं। ₹499 से ऊपर के ऑर्डर पर मुफ़्त शिपिंग; अन्यथा ₹49 का फ्लैट डिलीवरी शुल्क लगता है।",
    },
  },
  {
    id: "faq-4",
    question: { en: "How are gardeners verified?", hi: "माली कैसे सत्यापित होते हैं?" },
    answer: {
      en: "Every gardener on GrowPlants undergoes identity verification (Aadhar + PAN), background check, and a skills assessment. They're rated by customers after every booking — only 4-star-and-above providers stay on the platform.",
      hi: "ग्रोप्लांट्स पर हर माली पहचान सत्यापन (आधार + पैन), पृष्ठभूमि जांच, और कौशल मूल्यांकन से गुजरता है। वे हर बुकिंग के बाद ग्राहकों द्वारा रेट किए जाते हैं — केवल 4-स्टार-और-ऊपर के प्रदाता प्लेटफ़ॉर्म पर रहते हैं।",
    },
  },
  {
    id: "faq-5",
    question: { en: "Can I cancel or reschedule a booking?", hi: "क्या मैं बुकिंग रद्द या पुनर्निर्धारित कर सकता हूं?" },
    answer: {
      en: "Yes — you can cancel or reschedule any booking for free up to 24 hours before the scheduled time. Within 24 hours, a partial charge may apply. Visit My Bookings in your account to manage bookings.",
      hi: "हां — आप निर्धारित समय से 24 घंटे पहले तक किसी भी बुकिंग को मुफ़्त में रद्द या पुनर्निर्धारित कर सकते हैं। 24 घंटे के भीतर, आंशिक शुल्क लग सकता है। बुकिंग प्रबंधित करने के लिए अपने खाते में मेरी बुकिंग पर जाएं।",
    },
  },
  {
    id: "faq-6",
    question: { en: "Do you offer Cash on Delivery (COD)?", hi: "क्या आप कैश ऑन डिलीवरी (COD) देते हैं?" },
    answer: {
      en: "Yes, COD is available for orders up to ₹5,000 in most serviceable pincodes. You can also pay online via UPI, cards, net banking, or wallets through our secure Razorpay checkout.",
      hi: "हां, अधिकांश सेवा-योग्य पिनकोड में ₹5,000 तक के ऑर्डर के लिए COD उपलब्ध है। आप हमारे सुरक्षित रेज़रपे चेकआउट के माध्यम से यूपीआई, कार्ड, नेट बैंकिंग, या वॉलेट के माध्यम से ऑनलाइन भी भुगतान कर सकते हैं।",
    },
  },
];
