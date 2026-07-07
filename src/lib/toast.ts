/**
 * GrowPlants — Toast Helper
 *
 * Wraps the Sonner toast library with GrowPlants styling conventions.
 * Use this instead of importing sonner directly to keep toast UX consistent.
 */
import { toast } from "sonner";

export const appToast = {
  success(message: string, description?: string) {
    toast.success(message, description ? { description } : undefined);
  },
  error(message: string, description?: string) {
    toast.error(message, description ? { description } : undefined);
  },
  warning(message: string, description?: string) {
    toast.warning(message, description ? { description } : undefined);
  },
  info(message: string, description?: string) {
    toast.info(message, description ? { description } : undefined);
  },
  loading(message: string) {
    return toast.loading(message);
  },
  promise<T>(
    promise: Promise<T>,
    opts: { loading: string; success: string; error: string }
  ) {
    return toast.promise(promise, opts);
  },
  dismiss(id?: string | number) {
    toast.dismiss(id);
  },
};

export { toast };
