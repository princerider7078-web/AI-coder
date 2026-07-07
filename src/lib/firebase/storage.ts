/**
 * GrowPlants — Firebase Storage Helpers
 * Source: 04_environment_and_configs.md §3 storage.rules, 05_recreation_prompts.md Prompt 3
 *
 * Profile images: users can upload only their own (storage rules enforce).
 * Product images & invoices: admin-write, public-read.
 */
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  type UploadResult,
} from "firebase/storage";
import { firebaseStorage, isFirebaseConfigured } from "@/lib/firebase/client";
import { STORAGE_PATHS } from "@/lib/constants";

/**
 * Upload a profile image for a user.
 * @returns public download URL, or null if Firebase isn't configured.
 */
export async function uploadProfileImage(
  uid: string,
  file: File | Blob
): Promise<string | null> {
  if (!isFirebaseConfigured || !firebaseStorage) return null;
  const path = `${STORAGE_PATHS.profileImages}/${uid}/${Date.now()}-${(file as File).name ?? "avatar"}`;
  const storageRef = ref(firebaseStorage, path);
  const result: UploadResult = await uploadBytes(storageRef, file, {
    contentType: file.type,
  });
  return getDownloadURL(result.ref);
}

/**
 * Delete a profile image by URL.
 */
export async function deleteProfileImage(url: string): Promise<void> {
  if (!isFirebaseConfigured || !firebaseStorage) return;
  const storageRef = ref(firebaseStorage, url);
  await deleteObject(storageRef);
}
