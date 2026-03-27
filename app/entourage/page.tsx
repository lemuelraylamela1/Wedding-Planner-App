"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Mail, Phone, Users } from "lucide-react";

type Entourage = {
  _id: string;
  name: string;
  role: string;
  side: "bride" | "groom";
  relation: "friend" | "relative";
  tier: "entourage" | "vip";
};

export default function EntouragePage() {
  const { data: session, status } = useSession();
  const [entourage, setEntourage] = useState<Entourage[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Omit<Entourage, "_id">>({
    name: "",
    role: "",
    side: "bride",
    relation: "friend",
    tier: "entourage",
  });

  const fetchEntourage = () => {
    fetch("/api/entourage")
      .then((res) => res.json())
      .then((data: Entourage[]) => {
        setEntourage(data.map((g) => ({ ...g, id: g._id })));
      })
      .catch((error) => {
        console.error("Failed to fetch entourage", error);
      });
  };

  useEffect(() => {
    fetchEntourage();
  }, []);

  const [errors, setErrors] = useState<{
    name?: string;
    role?: string;
    tier?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Guest Name required
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email required and valid format
    if (!form.role.trim()) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleAddGuest = async () => {
    // Simple validation
    if (!validateForm()) return;

    if (!session?.user?.id) {
      alert("You must be logged in to add a guest.");
      return;
    }

    setLoading(true);

    try {
      // Prepare payload matching your backend
      const payload = {
        userId: session.user.id,
        name: form.name,
        role: form.role,
        side: form.side,
        relation: form.relation,
        tier: form.tier,
      };

      const res = await fetch("/api/entourage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add entourage");
      }

      // const newGuest = await res.json();

      // Refresh guest list
      fetchEntourage();

      // Reset form and close modal
      setForm({
        name: "",
        role: "",
        side: "bride",
        relation: "friend",
        tier: "entourage",
      });
      setOpen(false);
    } catch (error: unknown) {
      console.error("Error adding guest:", error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const mainEntourage = entourage.filter((e) => e.tier === "entourage");
  const vipList = entourage.filter((e) => e.tier === "vip");

  return (
    <AppLayout>
      <div className="space-y-8">
        <h1 className="heading-elegant">Wedding Entourage</h1>

        {/* Add Member Form */}
        <div className="wedding-card p-6 space-y-4">
          <h2 className="text-lg font-serif font-semibold">Add Member</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <Input
              placeholder="Role (e.g. Best Man, Maid of Honor)"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />

            <Select
              value={form.side}
              onValueChange={(v: "bride" | "groom") =>
                setForm({ ...form, side: v })
              }>
              <SelectTrigger>
                <SelectValue placeholder="Side" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bride">Bride Side</SelectItem>
                <SelectItem value="groom">Groom Side</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={form.relation}
              onValueChange={(v: "friend" | "relative") =>
                setForm({ ...form, relation: v })
              }>
              <SelectTrigger>
                <SelectValue placeholder="Relation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="relative">Relative</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={form.tier}
              onValueChange={(v: "entourage" | "vip") =>
                setForm({ ...form, tier: v })
              }>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entourage">Entourage</SelectItem>
                <SelectItem value="vip">Sponsor / VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleAddGuest}>Add to List</Button>
        </div>

        {/* Entourage Members */}
        <div className="wedding-card p-6">
          <h2 className="font-serif text-xl mb-4">Entourage Members</h2>
          <div className="space-y-3">
            {mainEntourage.map((e) => {
              const sideStyle =
                e.side === "bride"
                  ? "bg-pink-100 text-pink-700 border-pink-200"
                  : "bg-blue-100 text-blue-700 border-blue-200";

              return (
                <div
                  key={e._id}
                  className="flex items-center justify-between border border-border/60 rounded-lg p-4">
                  <div>
                    <p className="font-medium">{e.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {e.role} • {e.relation}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${sideStyle}`}>
                    {e.side === "bride" ? "Bride Side" : "Groom Side"}
                  </span>
                </div>
              );
            })}

            {!mainEntourage.length && (
              <p className="text-sm text-muted-foreground">
                No entourage members yet
              </p>
            )}
          </div>
        </div>

        {/* Sponsors / VIP */}
        <div className="wedding-card p-6 mt-6">
          <h2 className="font-serif text-xl mb-4">Sponsors / VIP</h2>
          <div className="space-y-3">
            {vipList.map((e) => (
              <div
                key={e._id}
                className="flex items-center justify-between border border-amber-300 bg-amber-50 rounded-lg p-4">
                <div>
                  <p className="font-medium text-foreground">{e.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {e.role} • {e.relation}
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full border border-amber-400 text-amber-700 bg-amber-100">
                  VIP
                </span>
              </div>
            ))}

            {!vipList.length && (
              <p className="text-sm text-muted-foreground">No sponsors yet</p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
