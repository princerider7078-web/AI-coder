"use client";

import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PasswordStrengthMeter — real-time password strength indicator.
 * Shows a 4-segment bar + checklist of requirements.
 *
 * Used in: RegisterForm, future Change Password form.
 */
export interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

interface Requirement {
  label: string;
  test: (pw: string) => boolean;
}

const REQUIREMENTS: Requirement[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter (A-Z)", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter (a-z)", test: (pw) => /[a-z]/.test(pw) },
  { label: "One number (0-9)", test: (pw) => /[0-9]/.test(pw) },
];

function calculateStrength(password: string): {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
  barColor: string;
} {
  if (!password) return { score: 0, label: "", color: "", barColor: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "text-error", barColor: "bg-error" };
  if (score === 2) return { score: 2, label: "Fair", color: "text-warning", barColor: "bg-warning" };
  if (score === 3) return { score: 3, label: "Good", color: "text-leaf-green", barColor: "bg-leaf-green" };
  return { score: 4, label: "Strong", color: "text-success", barColor: "bg-success" };
}

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const strength = useMemo(() => calculateStrength(password), [password]);

  if (!password) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1">
          {[1, 2, 3, 4].map((segment) => (
            <div
              key={segment}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-200",
                segment <= strength.score ? strength.barColor : "bg-muted"
              )}
            />
          ))}
        </div>
        <span className={cn("text-caption font-medium tabular-nums", strength.color)}>
          {strength.label}
        </span>
      </div>

      {/* Requirements checklist */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {REQUIREMENTS.map((req) => {
          const met = req.test(password);
          return (
            <li
              key={req.label}
              className={cn(
                "flex items-center gap-1.5 text-caption transition-colors",
                met ? "text-success" : "text-muted-foreground"
              )}
            >
              {met ? (
                <Check className="size-3 shrink-0" aria-hidden="true" />
              ) : (
                <X className="size-3 shrink-0" aria-hidden="true" />
              )}
              {req.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
