"use client";

import { useState } from "react";
import { Plus, MapPin, Edit2, Trash2, Check, X } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/common/EmptyState";
import { appToast } from "@/lib/toast";
import { isValidPincode } from "@/lib/utils";

interface Address { id: string; label: string; fullName: string; phone: string; addressLine1: string; addressLine2: string; landmark: string; city: string; state: string; pincode: string; isDefault: boolean; }

const STORAGE_KEY = "growplants-addresses";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Address, "id">>({ label: "Home", fullName: "", phone: "", addressLine1: "", addressLine2: "", landmark: "", city: "Sonipat", state: "Haryana", pincode: "", isDefault: false });

  const save = (list: Address[]) => { setAddresses(list); localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); };

  const handleSave = () => {
    if (!form.fullName || !form.phone || !form.addressLine1 || !isValidPincode(form.pincode)) { appToast.error("Missing fields", "Please fill all required fields"); return; }
    if (editingId) {
      save(addresses.map((a) => a.id === editingId ? { ...form, id: editingId } : a));
      appToast.success("Address updated");
    } else {
      const newAddr = { ...form, id: `addr-${Date.now()}`, isDefault: addresses.length === 0 || form.isDefault };
      save([...addresses, newAddr]);
      appToast.success("Address added");
    }
    setShowForm(false); setEditingId(null);
    setForm({ label: "Home", fullName: "", phone: "", addressLine1: "", addressLine2: "", landmark: "", city: "Sonipat", state: "Haryana", pincode: "", isDefault: false });
  };

  const handleEdit = (a: Address) => { setEditingId(a.id); setForm(a); setShowForm(true); };
  const handleDelete = (id: string) => { save(addresses.filter((a) => a.id !== id)); appToast.info("Address deleted"); };
  const handleSetDefault = (id: string) => { save(addresses.map((a) => ({ ...a, isDefault: a.id === id }))); appToast.success("Default address set"); };

  if (addresses.length === 0 && !showForm) {
    return <Container className="py-16"><EmptyState icon={MapPin} title="No saved addresses" description="Add your first delivery address to get started with faster checkout." action={{ label: "Add Address", onClick: () => setShowForm(true) }} size="lg" /></Container>;
  }

  return (
    <Container className="py-6 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A6B3C]">My Addresses</h1>
        {!showForm && <Button onClick={() => { setShowForm(true); setEditingId(null); setForm({ label: "Home", fullName: "", phone: "", addressLine1: "", addressLine2: "", landmark: "", city: "Sonipat", state: "Haryana", pincode: "", isDefault: false }); }} className="bg-[#1A6B3C] hover:bg-[#16A34A] gap-2"><Plus className="size-4" />Add Address</Button>}
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4 space-y-3">
          <div className="flex items-center justify-between"><h2 className="text-base font-bold text-slate-800">{editingId ? "Edit Address" : "Add New Address"}</h2><button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-slate-400 hover:text-slate-600"><X className="size-5" /></button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-sm">Label</Label><Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="h-11" /></div>
            <div className="space-y-1.5"><Label className="text-sm">Full Name *</Label><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="h-11" /></div>
            <div className="space-y-1.5"><Label className="text-sm">Phone *</Label><Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11" /></div>
            <div className="space-y-1.5"><Label className="text-sm">Address Line 1 *</Label><Input value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} className="h-11" /></div>
            <div className="space-y-1.5"><Label className="text-sm">Address Line 2</Label><Input value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} className="h-11" /></div>
            <div className="space-y-1.5"><Label className="text-sm">Landmark</Label><Input value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} className="h-11" /></div>
            <div className="space-y-1.5"><Label className="text-sm">City *</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="h-11" /></div>
            <div className="space-y-1.5"><Label className="text-sm">State *</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="h-11" /></div>
            <div className="space-y-1.5"><Label className="text-sm">Pincode *</Label><Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "") })} maxLength={6} className="h-11" /></div>
          </div>
          <Button onClick={handleSave} className="bg-[#1A6B3C] hover:bg-[#16A34A]">{editingId ? "Update" : "Add"} Address</Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {addresses.map((a) => (
          <div key={a.id} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1A6B3C] bg-[#F0FAF4] px-2 py-0.5 rounded-full">{a.label}</span>
                {a.isDefault && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Default</span>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(a)} className="p-1.5 text-slate-400 hover:text-[#1A6B3C]"><Edit2 className="size-3.5" /></button>
                <button onClick={() => handleDelete(a.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-800">{a.fullName}</p>
            <p className="text-xs text-slate-600">{a.addressLine1}{a.addressLine2 ? `, ${a.addressLine2}` : ""}</p>
            <p className="text-xs text-slate-600">{a.city}, {a.state} - {a.pincode}</p>
            <p className="text-xs text-slate-500 mt-1">📞 {a.phone}</p>
            {!a.isDefault && <button onClick={() => handleSetDefault(a.id)} className="mt-2 text-xs font-medium text-[#1A6B3C] hover:underline flex items-center gap-1"><Check className="size-3" />Set as default</button>}
          </div>
        ))}
      </div>
    </Container>
  );
}
