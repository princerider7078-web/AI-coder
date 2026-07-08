"use client";

/**
 * GrowPlants ThemeProvider
 * Wraps next-themes for light/dark mode support.
 *
 * Phase 1 ships light-mode only (per design system plan), but tokens are
 * already defined for dark mode — flipping the toggle in Phase 12 Settings
 * will require zero refactor.
 */
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
