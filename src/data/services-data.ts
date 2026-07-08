/**
 * GrowPlants — Services & Providers Data
 * Real service categories from BRD §12 + mock service listings and providers.
 */

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  pricingType: "fixed" | "hourly" | "quote_based";
  priceFrom: number;
  priceUnit: string;
  duration: string;
  serviceType: "one_time" | "recurring";
  rating: number;
  reviewCount: number;
  bookingCount: number;
  whatsIncluded: string[];
  whatsExcluded: string[];
  faqs: { q: string; a: string }[];
  features: string[];
}

export const SERVICES: Service[] = [
  {
    id: "svc-1",
    name: "Balcony Garden Setup",
    slug: "balcony-garden-setup",
    category: "Balcony Setup",
    categorySlug: "balcony-setup",
    shortDescription: "Complete transformation of your balcony into a lush green garden.",
    description: "Complete transformation of your balcony into a lush green garden. Includes plant selection, arrangement, soil preparation, and maintenance tips. Our expert gardeners will visit your home, assess your balcony space, and create a customized garden that suits your style and sunlight conditions.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&q=80",
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80",
    ],
    pricingType: "fixed",
    priceFrom: 1499,
    priceUnit: "per session",
    duration: "3-4 hours",
    serviceType: "one_time",
    rating: 4.8,
    reviewCount: 64,
    bookingCount: 125,
    whatsIncluded: ["5-8 plants included", "Premium planters", "Soil preparation", "Plant arrangement", "Care guide", "Free follow-up visit"],
    whatsExcluded: ["Additional plants beyond package", "Structural modifications", "Waterproofing work"],
    faqs: [
      { q: "How long does the setup take?", a: "Typically 3-4 hours depending on balcony size and complexity." },
      { q: "Do I need to provide anything?", a: "No, our gardener brings all plants, planters, soil, and tools." },
      { q: "What if a plant dies after setup?", a: "We offer free replacement within 30 days of setup." },
    ],
    features: ["Custom design", "Expert gardener", "All materials included", "30-day guarantee"],
  },
  {
    id: "svc-2",
    name: "Garden Maintenance (Monthly)",
    slug: "garden-maintenance",
    category: "Garden Maintenance",
    categorySlug: "garden-maintenance",
    shortDescription: "Monthly garden maintenance — watering, pruning, fertilizing, and pest control.",
    description: "Keep your garden healthy and beautiful with our monthly maintenance service. A dedicated gardener visits your home regularly to handle watering, pruning, fertilizing, pest control, and general plant health check-ups. Perfect for busy plant parents who want thriving plants without the hassle.",
    image: "https://images.unsplash.com/photo-1599598425947-5202edd56fde?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1599598425947-5202edd56fde?w=800&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
    ],
    pricingType: "fixed",
    priceFrom: 799,
    priceUnit: "per month",
    duration: "1-2 hours per visit",
    serviceType: "recurring",
    rating: 4.9,
    reviewCount: 112,
    bookingCount: 289,
    whatsIncluded: ["2 visits per month", "Watering & pruning", "Fertilizing", "Pest control", "Plant health check", "WhatsApp support"],
    whatsExcluded: ["New plants or planters", "Major redesign work", "Soil replacement"],
    faqs: [
      { q: "How many visits are included?", a: "2 visits per month, scheduled at your convenience." },
      { q: "Can I change visit frequency?", a: "Yes, you can upgrade to weekly visits for an additional charge." },
      { q: "What if I'm not home during the visit?", a: "Access can be arranged with building security or a family member." },
    ],
    features: ["Dedicated gardener", "Flexible scheduling", "Pest control included", "Cancel anytime"],
  },
  {
    id: "svc-3",
    name: "Terrace Garden Design & Setup",
    slug: "terrace-garden-setup",
    category: "Terrace Setup",
    categorySlug: "terrace-setup",
    shortDescription: "Transform your terrace into a stunning rooftop garden with raised beds and vertical gardens.",
    description: "Transform your terrace into a stunning rooftop garden with raised beds, vertical gardens, and proper drainage. Our landscape experts will design a custom terrace garden that maximizes your space, provides proper sunlight exposure, and creates a beautiful outdoor retreat.",
    image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80",
    ],
    pricingType: "quote_based",
    priceFrom: 0,
    priceUnit: "custom quote",
    duration: "1-3 days",
    serviceType: "one_time",
    rating: 4.7,
    reviewCount: 38,
    bookingCount: 56,
    whatsIncluded: ["Site visit & consultation", "3D design plan", "Plant selection", "Installation", "Drainage setup", "3-month maintenance"],
    whatsExcluded: ["Structural modifications", "Waterproofing", "Electrical work"],
    faqs: [
      { q: "Do you provide a free consultation?", a: "Yes, the first site visit and consultation are free." },
      { q: "How long does installation take?", a: "Typically 1-3 days depending on the size and complexity." },
      { q: "Can you work with existing structures?", a: "Yes, we design around your existing terrace layout." },
    ],
    features: ["3D design plan", "Expert installation", "Drainage solutions", "3-month aftercare"],
  },
  {
    id: "svc-4",
    name: "Gardener Hiring (Hourly)",
    slug: "gardener-hiring",
    category: "Gardener Hiring",
    categorySlug: "gardener-hiring",
    shortDescription: "Hire a verified gardener by the hour for any gardening task.",
    description: "Need a gardener for a specific task? Hire our verified gardeners by the hour for pruning, repotting, lawn mowing, or any gardening work. Flexible, affordable, and perfect for one-off tasks or regular maintenance.",
    image: "https://images.unsplash.com/photo-1599598425947-5202edd56fde?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1599598425947-5202edd56fde?w=800&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    ],
    pricingType: "hourly",
    priceFrom: 199,
    priceUnit: "per hour",
    duration: "Minimum 1 hour",
    serviceType: "one_time",
    rating: 4.6,
    reviewCount: 89,
    bookingCount: 312,
    whatsIncluded: ["Verified gardener", "Basic tools", "1-hour minimum", "Any gardening task", "Same-day available"],
    whatsExcluded: ["Plants or materials", "Specialized equipment", "Cleanup beyond work area"],
    faqs: [
      { q: "What's the minimum booking?", a: "1 hour minimum. Most tasks take 1-2 hours." },
      { q: "Can I book same-day?", a: "Yes, same-day bookings are available if gardeners are free." },
      { q: "Do I need to provide tools?", a: "Basic tools are included. Specialized equipment can be requested." },
    ],
    features: ["Pay by the hour", "Verified gardeners", "Same-day booking", "Any gardening task"],
  },
  {
    id: "svc-5",
    name: "Lawn Care & Maintenance",
    slug: "lawn-care",
    category: "Lawn Care",
    categorySlug: "lawn-care",
    shortDescription: "Professional lawn mowing, edging, and fertilization for a perfect lawn.",
    description: "Keep your lawn lush, green, and perfectly manicured with our professional lawn care service. Includes mowing, edging, fertilization, weed control, and aeration. Our gardeners use professional-grade equipment for a clean, even cut every time.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&q=80",
    ],
    pricingType: "fixed",
    priceFrom: 499,
    priceUnit: "per session",
    duration: "1-2 hours",
    serviceType: "recurring",
    rating: 4.7,
    reviewCount: 56,
    bookingCount: 198,
    whatsIncluded: ["Lawn mowing", "Edging", "Weed removal", "Fertilization", "Cleanup"],
    whatsExcluded: ["New lawn installation", "Sod replacement", "Irrigation system repair"],
    faqs: [
      { q: "How often should I book?", a: "Every 2-4 weeks during growing season, monthly otherwise." },
      { q: "Do you bring your own mower?", a: "Yes, all equipment is included." },
    ],
    features: ["Professional equipment", "Even, clean cut", "Fertilization included", "Flexible schedule"],
  },
  {
    id: "svc-6",
    name: "Plant Health Inspection",
    slug: "plant-health-inspection",
    category: "Plant Inspection",
    categorySlug: "plant-inspection",
    shortDescription: "Expert diagnosis of plant health issues with treatment recommendations.",
    description: "Worried about your plant's health? Our plant health experts will visit your home, diagnose any issues (pests, diseases, nutrient deficiencies), and provide a detailed treatment plan. Includes soil pH check, pest inspection, and personalized care recommendations.",
    image: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=800&q=80",
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
    ],
    pricingType: "fixed",
    priceFrom: 399,
    priceUnit: "per visit",
    duration: "45-60 minutes",
    serviceType: "one_time",
    rating: 4.8,
    reviewCount: 34,
    bookingCount: 87,
    whatsIncluded: ["Plant health diagnosis", "Pest inspection", "Soil pH check", "Treatment plan", "Care recommendations", "Follow-up WhatsApp support"],
    whatsExcluded: ["Treatment products", "Repotting service", "Plant replacement"],
    faqs: [
      { q: "Can you diagnose all plant problems?", a: "Yes, our experts can diagnose most common plant health issues." },
      { q: "Do you provide treatment products?", a: "We recommend products but don't include them. You can purchase from our shop." },
    ],
    features: ["Expert diagnosis", "Soil testing", "Treatment plan", "Free follow-up"],
  },
  {
    id: "svc-7",
    name: "Landscape Design",
    slug: "landscape-design",
    category: "Landscape Design",
    categorySlug: "landscape-design",
    shortDescription: "Custom garden design with site visit, 3D plan, and installation support.",
    description: "Transform your outdoor space with a custom landscape design. Our experts will visit your site, understand your vision, and create a detailed 3D design plan. Perfect for home gardens, office landscapes, and commercial properties.",
    image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    ],
    pricingType: "quote_based",
    priceFrom: 0,
    priceUnit: "custom quote",
    duration: "2-4 weeks",
    serviceType: "one_time",
    rating: 4.9,
    reviewCount: 22,
    bookingCount: 31,
    whatsIncluded: ["Site visit", "3D design plan", "Plant selection", "Material list", "Installation guidance"],
    whatsExcluded: ["Actual installation", "Materials", "Maintenance"],
    faqs: [
      { q: "Do you handle installation?", a: "Installation is available as a separate service or add-on." },
      { q: "How long does design take?", a: "Typically 2-4 weeks from site visit to final plan." },
    ],
    features: ["3D design plan", "Expert consultation", "Custom plant selection", "Installation support"],
  },
  {
    id: "svc-8",
    name: "Plant Installation",
    slug: "plant-installation",
    category: "Plant Installation",
    categorySlug: "plant-installation",
    shortDescription: "Expert placement and setup of plants at your home or office.",
    description: "Just bought plants and need help setting them up? Our gardeners will visit your home, place your plants in the perfect spots, repot if needed, and provide care instructions. Perfect for new plant parents or bulk purchases.",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    ],
    pricingType: "fixed",
    priceFrom: 299,
    priceUnit: "per visit",
    duration: "30-60 minutes",
    serviceType: "one_time",
    rating: 4.5,
    reviewCount: 45,
    bookingCount: 156,
    whatsIncluded: ["Plant placement", "Repotting (if needed)", "Watering setup", "Care instructions", "Up to 5 plants"],
    whatsExcluded: ["Additional plants beyond 5", "Planter purchase", "Soil purchase"],
    faqs: [
      { q: "How many plants can you install?", a: "Up to 5 plants per visit. Additional plants cost ₹50 each." },
      { q: "Do you bring soil and planters?", a: "We bring basic soil. Planters can be purchased from our shop." },
    ],
    features: ["Up to 5 plants", "Expert placement", "Repotting included", "Care guide"],
  },
];

export interface ServiceCategory {
  name: string;
  slug: string;
  count: number;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { name: "All Services", slug: "all", count: SERVICES.length },
  { name: "Balcony Setup", slug: "balcony-setup", count: 1 },
  { name: "Garden Maintenance", slug: "garden-maintenance", count: 1 },
  { name: "Terrace Setup", slug: "terrace-setup", count: 1 },
  { name: "Gardener Hiring", slug: "gardener-hiring", count: 1 },
  { name: "Lawn Care", slug: "lawn-care", count: 1 },
  { name: "Plant Inspection", slug: "plant-inspection", count: 1 },
  { name: "Landscape Design", slug: "landscape-design", count: 1 },
  { name: "Plant Installation", slug: "plant-installation", count: 1 },
];

export function getServiceBySlug(slug: string): Service | null {
  return SERVICES.find((s) => s.slug === slug) ?? null;
}

/* ---------- Providers ---------- */
export interface Provider {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  city: string;
  bio: string;
  services: string[];
  bookingCount: number;
  avatarImage: string;
  verified: boolean;
}

export const PROVIDERS: Provider[] = [
  { id: "prov-1", name: "Ramesh Kumar", rating: 4.9, reviewCount: 137, experienceYears: 8, city: "Sonipat", bio: "Experienced landscape gardener with 8+ years specializing in balcony and indoor gardens in Sonipat.", services: ["Balcony Garden Setup", "Plant Installation", "Garden Maintenance"], bookingCount: 274, avatarImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80", verified: true },
  { id: "prov-2", name: "Sunita Devi", rating: 4.8, reviewCount: 143, experienceYears: 5, city: "Sonipat", bio: "Passionate plant expert and home garden designer. Specializes in medicinal and flowering plant gardens.", services: ["Garden Maintenance", "Plant Health Inspection", "Plant Installation"], bookingCount: 142, avatarImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80", verified: true },
  { id: "prov-3", name: "Vikram Sharma", rating: 4.7, reviewCount: 124, experienceYears: 12, city: "Sonipat", bio: "Terrace garden specialist and vertical garden designer with expertise in urban farming solutions.", services: ["Terrace Garden Setup", "Landscape Design", "Garden Maintenance"], bookingCount: 310, avatarImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80", verified: true },
  { id: "prov-4", name: "Priya Gupta", rating: 4.9, reviewCount: 89, experienceYears: 7, city: "Sonipat", bio: "Expert in indoor plant styling and office green spaces. Certified in plant health and care.", services: ["Plant Installation", "Plant Health Inspection", "Balcony Garden Setup"], bookingCount: 188, avatarImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80", verified: true },
  { id: "prov-5", name: "Amit Singh", rating: 4.6, reviewCount: 67, experienceYears: 4, city: "Sonipat", bio: "Lawn care specialist with professional equipment and 4+ years of experience maintaining residential lawns.", services: ["Lawn Care", "Garden Maintenance"], bookingCount: 95, avatarImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80", verified: true },
  { id: "prov-6", name: "Deepa Verma", rating: 4.8, reviewCount: 78, experienceYears: 6, city: "Sonipat", bio: "Landscape designer with a passion for sustainable gardens. Creates beautiful, low-maintenance outdoor spaces.", services: ["Landscape Design", "Terrace Garden Setup", "Balcony Garden Setup"], bookingCount: 112, avatarImage: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80", verified: true },
];
