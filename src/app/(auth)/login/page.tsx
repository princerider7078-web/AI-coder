import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Login or Register",
  description:
    "Sign in to your GrowPlants account or create a new one to shop plants, planters, and book gardening services in Sonipat.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <AuthCard />;
}
