"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, MapPin, Edit2, Trash2, Check, X, Navigation, Loader2, ShieldCheck, AlertCircle, Locate } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { appToast } from "@/lib/toast";
import { isValidPincode } from "@/lib/utils";

/* ---------- Types ---------- */
interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  houseNo: string;
  locality: string;
  pincode: string;
  city: string;
  state: string;
  isDefault: boolean;
  latitude?: number | null;
  longitude?: number | null;
  accuracy?: number | null;
  gpsVerified: boolean;
}

type GpsState = "idle" | "detecting" | "fetching" | "verified" | "failed";

/* ---------- Storage ---------- */
const STORAGE_KEY = "growplants-addresses";

function loadAddresses(): Address[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function saveAddresses(list: Address[]) {
  if (typeof window !== "undefined") try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

/* ---------- GPS + Reverse Geocoding ---------- */
async function getGPSLocation(): Promise<{ lat: number; lng: number; accuracy: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error("GPS not supported on this device")); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
      (err) => {
        if (err.code === 1) reject(new Error("Location permission denied. Please allow location access."));
        else if (err.code === 2) reject(new Error("Location unavailable. Check your GPS settings."));
        else if (err.code === 3) reject(new Error("Location request timed out. Try again."));
        else reject(new Error("Failed to get location."));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  });
}

async function reverseGeocode(lat: number, lng: number): Promise<{ city: string; state: string; pincode: string }> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  if (!res.ok) throw new Error("Failed to fetch address from location");
  const data = await res.json();
  const addr = data.address || {};
  return {
    city: addr.city || addr.town || addr.village || addr.county || "",
    state: addr.state || "",
    pincode: addr.postcode || "",
  };
}

/* ---------- Address Form Component ---------- */
interface AddressFormProps {
  initial: Partial<Address> | null;
  onSave: (addr: Omit<Address, "id">) => void;
  onCancel: () => void;
}

function AddressForm({ initial, onSave, onCancel }: AddressFormProps) {
  const [form, setForm] = useState({
    label: initial?.label ?? "Home",
    fullName: initial?.fullName ?? "",
    phone: initial?.phone ?? "",
    houseNo: initial?.houseNo ?? "",
    locality: initial?.locality ?? "",
    pincode: initial?.pincode ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "",
    isDefault: initial?.isDefault ?? false,
  });
  const [gpsState, setGpsState] = useState<GpsState>("idle");
  const [gpsError, setGpsError] = useState("");
  const [gpsData, setGpsData] = useState<{ lat: number; lng: number; accuracy: number } | null>(
    initial?.gpsVerified && initial?.latitude ? { lat: initial.latitude, lng: initial.longitude, accuracy: initial.accuracy ?? 0 } : null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGPS = async () => {
    setGpsState("detecting"); setGpsError("");
    try {
      const loc = await getGPSLocation();
      if (loc.accuracy > 100) {
        setGpsState("failed");
        setGpsError(`GPS accuracy too low (${Math.round(loc.accuracy)}m). Need accuracy within 100m. Try moving to an open area.`);
        return;
      }
      setGpsState("fetching");
      const geo = await reverseGeocode(loc.lat, loc.lng);
      setGpsData(loc);
      setForm((f) => ({
        ...f,
        city: geo.city || f.city,
        state: geo.state || f.state,
        pincode: geo.pincode || f.pincode,
      }));
      setGpsState("verified");
      appToast.success("Location verified!", `Accuracy: ${Math.round(loc.accuracy)}m`);
    } catch (err: any) {
      setGpsState("failed"); setGpsError(err.message || "Failed to get location");
    }
  };

  const gpsVerified = gpsState === "verified" && gpsData !== null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ""))) e.phone = "Enter a valid 10-digit Indian phone";
    if (!form.houseNo.trim()) e.houseNo = "House / Flat number is required";
    if (!form.locality.trim()) e.locality = "Locality is required";
    if (!isValidPincode(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!gpsVerified) e.gps = "GPS verification is required to save address";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      latitude: gpsData?.lat ?? null,
      longitude: gpsData?.lng ?? null,
      accuracy: gpsData?.accuracy ?? null,
      gpsVerified: true,
    });
  };

  const gpsButtonContent = () => {
    switch (gpsState) {
      case "detecting": return <><Loader2 className="size-4 animate-spin" />Detecting location...</>;
      case "fetching": return <><Loader2 className="size-4 animate-spin" />Fetching address...</>;
      case "verified": return <><ShieldCheck className="size-4" />GPS Verified ({gpsData ? Math.round(gpsData.accuracy) : 0}m)</>;
      case "failed": return <><Locate className="size-4" />Retry GPS Verification</>;
      default: return <><Navigation className="size-4" />Verify Location via GPS</>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">{initial?.id ? "Edit Address" : "Add New Address"}</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><X className="size-5" /></button>
      </div>

      {/* GPS Verification */}
      <div className={cn("rounded-lg border-2 p-4 transition-all", gpsVerified ? "border-green-300 bg-green-50" : gpsState === "failed" ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50")}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              {gpsVerified ? <ShieldCheck className="size-4 text-green-600" /> : <Navigation className="size-4 text-[#1A6B3C]" />}
              GPS Location Verification
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {gpsVerified ? "Your location has been verified. You can now save this address." :
               gpsState === "detecting" ? "Detecting your GPS coordinates..." :
               gpsState === "fetching" ? "Fetching your address from GPS coordinates..." :
               gpsState === "failed" ? "GPS verification failed. Please retry." :
               "Click below to verify your location. Required to save address."}
            </p>
          </div>
          <Button type="button" onClick={handleGPS} disabled={gpsState === "detecting" || gpsState === "fetching"}
            className={cn("gap-2 shrink-0", gpsVerified ? "bg-green-600 hover:bg-green-700" : "bg-[#1A6B3C] hover:bg-[#16A34A]")}>
            {gpsButtonContent()}
          </Button>
        </div>
        {gpsError && <p className="text-xs text-red-500 mt-2 flex items-start gap-1"><AlertCircle className="size-3.5 shrink-0 mt-0.5" />{gpsError}</p>}
        {errors.gps && !gpsVerified && <p className="text-xs text-red-500 mt-2 flex items-start gap-1"><AlertCircle className="size-3.5 shrink-0 mt-0.5" />{errors.gps}</p>}
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label className="text-sm">Label</Label><Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="h-11" placeholder="Home, Office..." /></div>
        <div className="space-y-1.5"><Label className="text-sm">Full Name *</Label><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="h-11" />{errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}</div>
        <div className="space-y-1.5"><Label className="text-sm">Phone Number *</Label><Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className="h-11" placeholder="9876543210" />{errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}</div>
        <div className="space-y-1.5"><Label className="text-sm">House No / Flat No / Floor No *</Label><Input value={form.houseNo} onChange={(e) => setForm({ ...form, houseNo: e.target.value })} className="h-11" placeholder="123, 2nd Floor" />{errors.houseNo && <p className="text-xs text-red-500">{errors.houseNo}</p>}</div>
        <div className="space-y-1.5 sm:col-span-2"><Label className="text-sm">Area / Street / Locality *</Label><Input value={form.locality} onChange={(e) => setForm({ ...form, locality: e.target.value })} className="h-11" placeholder="Green Street, Sector 12" />{errors.locality && <p className="text-xs text-red-500">{errors.locality}</p>}</div>
        <div className="space-y-1.5"><Label className="text-sm">Pincode *</Label><Input inputMode="numeric" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} className="h-11" placeholder="131001" />{errors.pincode && <p className="text-xs text-red-500">{errors.pincode}</p>}</div>
        <div className="space-y-1.5"><Label className="text-sm">City *</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="h-11" placeholder="Sonipat" />{errors.city && <p className="text-xs text-red-500">{errors.city}</p>}</div>
        <div className="space-y-1.5"><Label className="text-sm">State *</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="h-11" placeholder="Haryana" />{errors.state && <p className="text-xs text-red-500">{errors.state}</p>}</div>
        <div className="flex items-center gap-2 pt-2"><input type="checkbox" id="isDefault" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="size-4 accent-[#1A6B3C]" /><Label htmlFor="isDefault" className="text-sm cursor-pointer">Set as default address</Label></div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} disabled={!gpsVerified} className="bg-[#1A6B3C] hover:bg-[#16A34A] gap-2 flex-1">
          <Check className="size-4" />{initial?.id ? "Update" : "Save"} Address
        </Button>
        <Button variant="outline" onClick={onCancel} className="border-slate-300 text-slate-600">Cancel</Button>
      </div>
      {!gpsVerified && <p className="text-xs text-slate-400 text-center">🔒 Address save is blocked until GPS is verified</p>}
    </div>
  );
}

/* ---------- Address Card Skeleton ---------- */
function AddressCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2"><Skeleton className="h-5 w-16 rounded-full" /><Skeleton className="h-5 w-16 rounded-full" /></div>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="pt-2"><Skeleton className="h-7 w-28 rounded-lg" /></div>
    </div>
  );
}

/* ---------- Main Page ---------- */
export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  useEffect(() => {
    const t = setTimeout(() => { setAddresses(loadAddresses()); setLoading(false); }, 400);
    return () => clearTimeout(t);
  }, []);

  const persist = (list: Address[]) => { setAddresses(list); saveAddresses(list); };

  const handleSave = (data: Omit<Address, "id">) => {
    if (editing) {
      persist(addresses.map((a) => a.id === editing.id ? { ...data, id: editing.id } : (data.isDefault ? { ...a, isDefault: false } : a)));
      appToast.success("Address updated", "Your address has been saved");
    } else {
      const newAddr: Address = { ...data, id: `addr-${Date.now()}`, isDefault: addresses.length === 0 || data.isDefault };
      persist(data.isDefault ? [newAddr, ...addresses.map((a) => ({ ...a, isDefault: false }))] : [...addresses, newAddr]);
      appToast.success("Address added", "New address saved with GPS verification");
    }
    setShowForm(false); setEditing(null);
  };

  const handleDelete = (id: string) => { persist(addresses.filter((a) => a.id !== id)); appToast.info("Address deleted"); };
  const handleSetDefault = (id: string) => { persist(addresses.map((a) => ({ ...a, isDefault: a.id === id }))); appToast.success("Default address set"); };
  const handleEdit = (a: Address) => { setEditing(a); setShowForm(true); };
  const handleAdd = () => { setEditing(null); setShowForm(true); };

  return (
    <Container className="py-6 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A6B3C]">My Addresses</h1>
          <p className="text-sm text-slate-500 mt-1">{addresses.length} saved {addresses.length === 1 ? "address" : "addresses"}</p>
        </div>
        {!showForm && <Button onClick={handleAdd} className="bg-[#1A6B3C] hover:bg-[#16A34A] gap-2"><Plus className="size-4" />Add Address</Button>}
      </div>

      {/* Form */}
      {showForm && <div className="mb-4"><AddressForm initial={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} /></div>}

      {/* Loading skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 3 }).map((_, i) => <AddressCardSkeleton key={i} />)}
        </div>
      ) : /* Empty state */ addresses.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="size-16 rounded-full bg-[#F3F8F1] flex items-center justify-center"><MapPin className="size-8 text-[#1A6B3C]" /></div>
          <div><h3 className="text-lg font-semibold text-slate-800">No saved addresses</h3><p className="text-sm text-slate-500 mt-1 max-w-md">Add your first delivery address. GPS verification is required to ensure accurate deliveries in Sonipat.</p></div>
          <Button onClick={handleAdd} className="bg-[#1A6B3C] hover:bg-[#16A34A] gap-2"><Plus className="size-4" />Add First Address</Button>
        </div>
      ) : /* Address grid */ (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addresses.map((a) => (
            <div key={a.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#1A6B3C] bg-[#F0FAF4] px-2 py-0.5 rounded-full">{a.label}</span>
                  {a.isDefault && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Default</span>}
                  {a.gpsVerified && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-0.5"><ShieldCheck className="size-3" />GPS Verified</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(a)} className="p-1.5 text-slate-400 hover:text-[#1A6B3C]"><Edit2 className="size-3.5" /></button>
                  <button onClick={() => handleDelete(a.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="size-3.5" /></button>
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-800">{a.fullName}</p>
              <p className="text-xs text-slate-600">{a.houseNo}, {a.locality}</p>
              <p className="text-xs text-slate-600">{a.city}, {a.state} - {a.pincode}</p>
              <p className="text-xs text-slate-500 mt-1">📞 {a.phone}</p>
              {!a.isDefault && <button onClick={() => handleSetDefault(a.id)} className="mt-2 text-xs font-medium text-[#1A6B3C] hover:underline flex items-center gap-1"><Check className="size-3" />Set as default</button>}
            </div>
          ))}
        </div>
      )}

      {/* Info note */}
      {!loading && addresses.length > 0 && !showForm && (
        <div className="mt-6 p-3 bg-blue-50 rounded-lg flex items-start gap-2 text-xs text-blue-700">
          <ShieldCheck className="size-4 shrink-0 mt-0.5" />
          <span>All addresses are GPS-verified for accurate delivery. To add a new address, GPS verification is required.</span>
        </div>
      )}
    </Container>
  );
}
