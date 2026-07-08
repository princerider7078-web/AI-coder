/**
 * GrowPlants — Form Input Types
 * Re-exported from Zod validation schemas for ergonomic form typing.
 */
export type {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  OtpInput,
  ChangePasswordInput,
  ProfileInput,
} from "@/lib/validations/auth";

export type {
  AddressInput,
  PincodeCheckInput,
} from "@/lib/validations/address";

export type {
  ReviewInput,
  ReviewFilter,
} from "@/lib/validations/review";

export type {
  ContactInput,
  NewsletterInput,
} from "@/lib/validations/contact";

/* ---------- Provider Onboarding Form (multi-step) ---------- */

export interface ProviderOnboardingStep1 {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "prefer_not";
}

export interface ProviderOnboardingStep2 {
  businessName: string;
  businessType: "individual" | "partnership" | "company";
  gstNumber?: string;
  experienceYears: number;
  specializations: string[];
}

export interface ProviderOnboardingStep3 {
  city: string;
  state: string;
  serviceRadiusKm: number;
  addressLine1: string;
  addressLine2?: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
}

export interface ProviderOnboardingStep4 {
  aadharNumber: string;
  aadharFrontImage: File | null;
  aadharBackImage: File | null;
  panNumber: string;
  panImage: File | null;
}

export interface ProviderOnboardingStep5 {
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  upiId?: string;
  availabilityHours: Record<
    string,
    { start: string; end: string; isAvailable: boolean }
  >;
  agreedToTerms: boolean;
}

export interface ProviderOnboardingForm
  extends ProviderOnboardingStep1,
    ProviderOnboardingStep2,
    ProviderOnboardingStep3,
    ProviderOnboardingStep4,
    ProviderOnboardingStep5 {}

/* ---------- Filter Form (Shop / Services) ---------- */

export interface ShopFilterForm {
  categoryIds: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  suitableFor: string[];
  sunlight: string[];
  difficulty: string[];
  inStock: boolean;
  petSafe: boolean;
  sort: string;
  page: number;
}

export interface ServiceFilterForm {
  categoryIds: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  city: string;
  sort: string;
  page: number;
}
