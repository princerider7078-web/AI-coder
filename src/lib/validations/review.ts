/**
 * GrowPlants — Review Validation
 * Source: PRD §17.1 Review Rules
 *  - Rating 1-5 required
 *  - Text review optional, min 10 chars if provided
 *  - Image upload optional, max 5 images, max 5MB each
 *  - One review per purchase/booking
 *  - Reviewable for 30 days after delivery/completion
 */
import { z } from "zod";
import { REVIEW_IMAGE_MAX_MB, REVIEW_MAX_IMAGES } from "@/lib/constants";

export const reviewSchema = z.object({
  reviewableType: z.enum(["product", "service", "provider"]),
  reviewableId: z.string().min(1),
  referenceType: z.enum(["order_item", "booking"]),
  referenceId: z.string().min(1),
  rating: z
    .number({ message: "Please select a rating" })
    .int()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  title: z
    .string()
    .max(120, "Title is too long")
    .optional()
    .or(z.literal("")),
  body: z
    .string()
    .max(2000, "Review is too long")
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || v.length >= 10, "Review must be at least 10 characters"),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        size: z.number().max(REVIEW_IMAGE_MAX_MB * 1024 * 1024),
      })
    )
    .max(REVIEW_MAX_IMAGES, `Max ${REVIEW_MAX_IMAGES} images per review`)
    .default([]),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const reviewFilterSchema = z.object({
  stars: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
  sort: z.enum(["recent", "oldest", "highest", "lowest"]).default("recent"),
  page: z.coerce.number().int().min(1).default(1),
});
export type ReviewFilter = z.infer<typeof reviewFilterSchema>;
