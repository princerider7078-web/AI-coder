"use client";

import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { appToast } from "@/lib/toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    gender: "prefer_not" as string,
    dateOfBirth: "",
    preferredLanguage: "en" as string,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    appToast.success("Profile updated", "Your changes have been saved");
  };

  return (
    <Container className="py-6 md:py-8">
      <h1 className="text-2xl font-bold text-[#1A6B3C] mb-6">My Profile</h1>
      <div className="max-w-2xl">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="size-20 rounded-full bg-[#1A6B3C] text-white flex items-center justify-center text-2xl font-bold">
            {form.fullName.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <Button variant="outline" size="sm" className="border-[#1A6B3C] text-[#1A6B3C]">Upload Photo</Button>
            <p className="text-xs text-slate-400 mt-1">JPG, PNG max 2MB</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-sm">Full Name</Label><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="h-11" /></div>
            <div className="space-y-1.5"><Label className="text-sm">Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11" /></div>
            <div className="space-y-1.5"><Label className="text-sm">Phone</Label><Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11" /></div>
            <div className="space-y-1.5"><Label className="text-sm">Date of Birth</Label><Input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="h-11" /></div>
            <div className="space-y-1.5"><Label className="text-sm">Gender</Label><select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full h-11 border border-slate-200 rounded-md px-3 text-sm"><option value="prefer_not">Prefer not to say</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
            <div className="space-y-1.5"><Label className="text-sm">Preferred Language</Label><select value={form.preferredLanguage} onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })} className="w-full h-11 border border-slate-200 rounded-md px-3 text-sm"><option value="en">English</option><option value="hi">हिन्दी</option></select></div>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="bg-[#1A6B3C] hover:bg-[#16A34A] gap-2">{isSaving ? <><Loader2 className="size-4 animate-spin" />Saving...</> : "Save Changes"}</Button>
        </div>
      </div>
    </Container>
  );
}
