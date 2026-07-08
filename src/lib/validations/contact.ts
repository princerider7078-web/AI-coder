/**
 * GrowPlants — Contact Form Validation
 * Source: directory map §2 /contact form
 */
import { z } from "zod";
import { isValidIndianPhone } from "@/lib/utils";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required")
    .max(100, "Name is too long"),
  email: z
    .string()
    .email("Enter a valid email")
    .max(150),
  phone: z
    .string()
    .refine(isValidIndianPhone, "Enter a valid Indian phone number"),
  subject: z
    .string()
    .min(3, "Subject is required")
    .max(150, "Subject is too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email").max(150),
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;
