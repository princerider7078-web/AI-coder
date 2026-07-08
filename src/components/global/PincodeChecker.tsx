"use client";

import { useState } from "react";
import { MapPin, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidPincode } from "@/lib/utils";
import { DEFAULT_CITY } from "@/lib/constants";

/**
 * PincodeChecker — inline delivery validation widget.
 * Source: PRD §22.2 (Delivery Zones), §23 (Location & City Management)
 *
 * Phase 3 scope:
 *   - Input for 6-digit Indian pincode
 *   - Validates format, then checks against mock serviceable pincodes
 *   - Shows result: serviceable (✓ Sonipat) or not serviceable (✗)
 *   - Persists valid pincode in localStorage
 *
 * Phase 7+ will wire this to /api/pincode-check which queries the
 * serviceable_pincodes table.
 *
 * Used in: Header (compact variant), Checkout (full variant), PDP delivery info.
 */

// Phase 3 mock — Sonipat serviceable pincodes (subset)
const SERVICEABLE_PINCODES = new Set([
  "131001", "131002", "131003", "131004", "131005", "131006", "131007",
  "131008", "131009", "131010", "131011", "131012", "131013", "131014",
  "131015", "131016", "131017", "131018", "131019", "131020",
  "131021", "131022", "131023", "131024", "131025", "131026", "131027",
  "131028", "131029", "131030", "131039", "131038", "131037",
]);

const STORAGE_KEY = "growplants-pincode";

export interface PincodeCheckerProps {
  variant?: "compact" | "full";
  className?: string;
}

type Status = "idle" | "checking" | "serviceable" | "not-serviceable" | "invalid";

export function PincodeChecker({ variant = "compact", className }: PincodeCheckerProps) {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const check = () => {
    if (!isValidPincode(pincode)) {
      setStatus("invalid");
      return;
    }
    setStatus("checking");
    // Simulate API delay
    setTimeout(() => {
      if (SERVICEABLE_PINCODES.has(pincode)) {
        setStatus("serviceable");
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, pincode);
        }
      } else {
        setStatus("not-serviceable");
      }
    }, 600);
  };

  const reset = () => {
    setPincode("");
    setStatus("idle");
  };

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-1.5 text-body-sm", className)}>
        <MapPin className="size-4 text-primary shrink-0" aria-hidden="true" />
        {status === "serviceable" ? (
          <span className="flex items-center gap-1 text-success font-medium">
            {pincode} <Check className="size-3.5" aria-hidden="true" />
          </span>
        ) : status === "not-serviceable" ? (
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1 text-destructive font-medium hover:underline"
          >
            Not deliverable <X className="size-3.5" aria-hidden="true" />
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value.replace(/\D/g, ""));
                setStatus("idle");
              }}
              onKeyDown={(e) => e.key === "Enter" && check()}
              placeholder="Enter pincode"
              aria-label="Check delivery pincode"
              className="h-7 w-24 text-body-sm px-2 rounded-md border-border"
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={check}
              disabled={pincode.length !== 6 || status === "checking"}
              className="h-7 px-2 text-body-sm"
            >
              {status === "checking" ? (
                <Loader2 className="size-3 animate-spin" aria-hidden="true" />
              ) : (
                "Check"
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Full variant (for checkout / PDP)
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor="pincode-input" className="text-body-sm font-medium text-foreground flex items-center gap-1.5">
        <MapPin className="size-4 text-primary" aria-hidden="true" />
        Check delivery
      </label>
      <div className="flex gap-2">
        <Input
          id="pincode-input"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, ""));
            setStatus("idle");
          }}
          placeholder="Enter 6-digit pincode"
          aria-invalid={status === "invalid" || status === "not-serviceable"}
          className="w-40"
        />
        <Button
          type="button"
          onClick={check}
          disabled={pincode.length !== 6 || status === "checking"}
          className="gap-2"
        >
          {status === "checking" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Checking
            </>
          ) : (
            "Check"
          )}
        </Button>
      </div>
      {status === "invalid" && (
        <p className="text-body-sm text-destructive">Enter a valid 6-digit pincode</p>
      )}
      {status === "serviceable" && (
        <p className="text-body-sm text-success flex items-center gap-1.5 font-medium">
          <Check className="size-4" aria-hidden="true" />
          Deliverable to {DEFAULT_CITY} — {pincode}
        </p>
      )}
      {status === "not-serviceable" && (
        <p className="text-body-sm text-destructive flex items-center gap-1.5 font-medium">
          <X className="size-4" aria-hidden="true" />
          Sorry, we don&apos;t deliver to {pincode} yet
        </p>
      )}
    </div>
  );
}
