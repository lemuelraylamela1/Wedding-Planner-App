"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Mail,
  Phone,
  Check,
  X,
  Clock,
  Edit2,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const rsvpStatusColors: Record<
  string,
  { bg: string; text: string; icon: React.ReactNode }
> = {
  accepted: {
    bg: "bg-green-100/50",
    text: "text-green-700",
    icon: <Check className="h-4 w-4" />,
  },
  declined: {
    bg: "bg-red-100/50",
    text: "text-red-700",
    icon: <X className="h-4 w-4" />,
  },
  pending: {
    bg: "bg-yellow-100/50",
    text: "text-yellow-700",
    icon: <Clock className="h-4 w-4" />,
  },
  maybe: {
    bg: "bg-blue-100/50",
    text: "text-blue-700",
    icon: <Clock className="h-4 w-4" />,
  },
};

export interface Guests {
  _id: string;
  guestName: string;
  contact: { email: string; number: string };
  meal?: string;
  rsvpStatus?: "accepted" | "declined" | "pending" | "maybe" | "";
  table?: number;
  dietaryRestrictions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function GuestsPage() {
  const { data: session, status } = useSession();
  const [guest, setGuest] = useState<Guests[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [editingGuestId, setEditingGuestId] = useState("");
  const [deleteGuestId, setDeleteGuestId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState({
    guestName: "",
    email: "",
    number: "",
    meal: "",
    rsvpStatus: "pending",
    table: "",
    dietaryRestrictions: "",
  });

  const [errors, setErrors] = useState<{
    guestName?: string;
    email?: string;
    table?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Guest Name required
    if (!form.guestName.trim()) {
      newErrors.guestName = "Guest Name is required";
    }

    // Email required and valid format
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const filteredGuests = guest.filter((g) => {
    const name = g.guestName || "";
    const email = g.contact?.email || "";
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || g.rsvpStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: guest.length,
    accepted: guest.filter((g) => g.rsvpStatus === "accepted").length,
    declined: guest.filter((g) => g.rsvpStatus === "declined").length,
    pending: guest.filter((g) => g.rsvpStatus === "pending").length,
  };
  //Get data
  const fetchGuests = () => {
    fetch("/api/guests")
      .then((res) => res.json())
      .then((data: Guests[]) => {
        setGuest(data.map((g) => ({ ...g, id: g._id })));
      })
      .catch((error) => {
        console.error("Failed to fetch guests", error);
      });
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  useEffect(() => {
    if (!editingGuestId) {
      // Reset form when Edit Guest modal is closed
      setForm({
        guestName: "",
        email: "",
        number: "",
        meal: "",
        rsvpStatus: "pending",
        table: "",
        dietaryRestrictions: "",
      });
      setErrors({});
    }
  }, [editingGuestId]);

  useEffect(() => {
    if (!open) {
      setForm({
        guestName: "",
        email: "",
        number: "",
        meal: "",
        rsvpStatus: "pending",
        table: "",
        dietaryRestrictions: "",
      });
      setErrors({}); // Clear all errors
    }
  }, [open]);

  //Add Guests
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
        guestName: form.guestName,
        contact: { email: form.email, number: form.number },
        meal: form.meal,
        rsvpStatus: form.rsvpStatus,
        table: form.table ? Number(form.table) : undefined,
        dietaryRestrictions: form.dietaryRestrictions,
      };

      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add guest");
      }

      // const newGuest = await res.json();

      // Refresh guest list
      fetchGuests();

      // Reset form and close modal
      setForm({
        guestName: "",
        email: "",
        number: "",
        meal: "",
        rsvpStatus: "pending",
        table: "",
        dietaryRestrictions: "",
      });
      setOpen(false);
    } catch (error: unknown) {
      console.error("Error adding guest:", error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditGuest = (guest: Guests) => {
    setForm({
      guestName: guest.guestName,
      email: guest.contact.email,
      number: guest.contact.number,
      meal: guest.meal || "",
      rsvpStatus: guest.rsvpStatus || "",
      table: guest.table?.toString() || "",
      dietaryRestrictions: guest.dietaryRestrictions || "",
    });
    setEditingGuestId(guest._id);
  };

  // Call this when submitting the edit modal
  const handleUpdateGuest = async () => {
    if (!editingGuestId) {
      alert("No guest selected for editing.");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        guestName: form.guestName,
        contact: { email: form.email, number: form.number },
        meal: form.meal,
        rsvpStatus: form.rsvpStatus,
        table: form.table ? Number(form.table) : undefined,
        dietaryRestrictions: form.dietaryRestrictions,
      };

      const res = await fetch(`/api/guests/${editingGuestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update guest");
      }

      // Refresh guest list
      fetchGuests();

      // Reset form and close modal
      setForm({
        guestName: "",
        email: "",
        number: "",
        meal: "",
        rsvpStatus: "pending",
        table: "",
        dietaryRestrictions: "",
      });
      setEditingGuestId("");
      setOpen(false);
    } catch (error: unknown) {
      console.error("Error updating guest:", error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const dietaryCounts: Record<string, number> = {};
  const mealCounts: Record<string, number> = {};

  guest.forEach((g) => {
    // Dietary restrictions
    const diet = g.dietaryRestrictions || "None";
    dietaryCounts[diet] = (dietaryCounts[diet] || 0) + 1;

    // Meal preferences
    const meal = g.meal || "None";
    mealCounts[meal] = (mealCounts[meal] || 0) + 1;
  });

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="heading-elegant">Guest Management</h1>
          <p className="heading-sub">Manage RSVPs and guest information</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {["total", "accepted", "pending", "declined"].map((stat) => (
            <div
              key={stat}
              className={`wedding-card p-4 ${stat === "accepted" ? "border-green-200/50" : stat === "pending" ? "border-yellow-200/50" : stat === "declined" ? "border-red-200/50" : ""}`}>
              <p className="text-xs text-muted-foreground">
                {stat.charAt(0).toUpperCase() + stat.slice(1)} Guests
              </p>
              <p className="mt-2 text-2xl font-serif font-bold text-foreground">
                {stats[stat as keyof typeof stats]}
              </p>
            </div>
          ))}
        </div>

        {/* Filters & Add Guest */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 flex-1 md:flex-row md:gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {["all", "accepted", "pending", "declined", "maybe"].map(
                  (status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Add Guest Modal */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Guest
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Guest</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Guest Name"
                  value={form.guestName}
                  onChange={(e) => {
                    setForm({ ...form, guestName: e.target.value });
                    setErrors({ ...errors, guestName: undefined });
                  }}
                />
                {errors.guestName && (
                  <p className="text-red-500 text-sm">{errors.guestName}</p>
                )}
                <Input
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setErrors({ ...errors, email: undefined });
                  }}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
                <Input
                  placeholder="Phone Number"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                />
                <Input
                  placeholder="Meal Preference"
                  value={form.meal}
                  onChange={(e) => setForm({ ...form, meal: e.target.value })}
                />
                <Select
                  value={
                    form.rsvpStatus as
                      | "accepted"
                      | "declined"
                      | "pending"
                      | "maybe"
                  }
                  onValueChange={(
                    value: "accepted" | "declined" | "pending" | "maybe",
                  ) => setForm({ ...form, rsvpStatus: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="RSVP Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {["accepted", "declined", "pending", "maybe"].map(
                      (status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Table Number"
                  type="number"
                  value={form.table}
                  onChange={(e) => setForm({ ...form, table: e.target.value })}
                />
                {errors.table && (
                  <p className="text-red-500 text-sm">{errors.table}</p>
                )}
                <Input
                  placeholder="Dietary Restrictions"
                  value={form.dietaryRestrictions}
                  onChange={(e) =>
                    setForm({ ...form, dietaryRestrictions: e.target.value })
                  }
                />
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddGuest} disabled={loading}>
                  {loading ? "Saving..." : "Add Guest"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Guests Table */}
        <div className="wedding-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/50">
                  {[
                    "Guest Name",
                    "Contact",
                    "Meal Preference",
                    "RSVP Status",
                    "Table",
                    "Actions",
                  ].map((th, idx) => (
                    <th
                      key={idx}
                      className={`px-6 py-3 text-sm font-semibold text-foreground ${
                        th === "Actions" ? "text-right" : "text-left"
                      }`}>
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredGuests.map((g) => (
                  <tr
                    key={g._id}
                    className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">{g.guestName}</td>
                    <td className="px-6 py-4">
                      {g.contact.email && (
                        <div
                          key={`${g._id}-email`}
                          className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {g.contact.email}
                        </div>
                      )}
                      {g.contact.number && (
                        <div
                          key={`${g._id}-number`}
                          className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {g.contact.number}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">{g.meal}</td>
                    <td className="px-6 py-4">
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium w-fit ${rsvpStatusColors[g.rsvpStatus || "pending"].bg} ${rsvpStatusColors[g.rsvpStatus || "pending"].text}`}>
                        {rsvpStatusColors[g.rsvpStatus || "pending"].icon}
                        <span className="capitalize">{g.rsvpStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{g.table || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditGuest(g)}>
                        <Edit2 />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => {
                          setDeleteGuestId(g._id);
                          setDeleteOpen(true);
                        }}>
                        <Trash2 />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dietary Summary */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Meal Summary */}
          <div className="wedding-card p-6">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
              Meal Summary
            </h3>
            {Object.entries(mealCounts).map(([meal, count]) => (
              <div
                key={meal}
                className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{meal}</p>
                <p className="font-medium text-foreground">{count}</p>
              </div>
            ))}
          </div>

          {/* Dietary Summary */}
          <div className="wedding-card p-6">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
              Dietary Restrictions Summary
            </h3>
            {Object.entries(dietaryCounts).map(([diet, count]) => (
              <div
                key={diet}
                className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{diet}</p>
                <p className="font-medium text-foreground">{count}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Edit Guest Modal */}
        <Dialog
          open={!!editingGuestId}
          onOpenChange={() => setEditingGuestId("")}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Guest</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Guest Name"
                value={form.guestName}
                onChange={(e) => {
                  setForm({ ...form, guestName: e.target.value });
                  setErrors({ ...errors, guestName: undefined });
                }}
              />
              {errors.guestName && (
                <p className="text-red-500 text-sm">{errors.guestName}</p>
              )}

              <Input
                placeholder="Email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setErrors({ ...errors, email: undefined });
                }}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}

              <Input
                placeholder="Phone Number"
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
              />

              <Input
                placeholder="Meal Preference"
                value={form.meal}
                onChange={(e) => setForm({ ...form, meal: e.target.value })}
              />

              <Select
                value={
                  form.rsvpStatus as
                    | "accepted"
                    | "declined"
                    | "pending"
                    | "maybe"
                }
                onValueChange={(
                  value: "accepted" | "declined" | "pending" | "maybe",
                ) => setForm({ ...form, rsvpStatus: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="RSVP Status" />
                </SelectTrigger>
                <SelectContent>
                  {["accepted", "declined", "pending", "maybe"].map(
                    (status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>

              <Input
                placeholder="Table Number"
                type="number"
                value={form.table}
                onChange={(e) => setForm({ ...form, table: e.target.value })}
              />
              <Input
                placeholder="Dietary Restrictions"
                value={form.dietaryRestrictions}
                onChange={(e) =>
                  setForm({ ...form, dietaryRestrictions: e.target.value })
                }
              />
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setEditingGuestId("")}>
                Cancel
              </Button>
              <Button onClick={handleUpdateGuest} disabled={loading}>
                {loading ? "Saving..." : "Update Guest"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteOpen} onOpenChange={() => setDeleteOpen(false)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Guest</DialogTitle>
            </DialogHeader>
            <p className="py-4 text-sm text-muted-foreground">
              Are you sure you want to delete this guest? This action cannot be
              undone.
            </p>
            <DialogFooter className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setDeleteOpen(false)}
                disabled={deleteLoading}>
                Cancel
              </Button>
              <Button
                className="bg-primary"
                onClick={async () => {
                  if (!deleteGuestId) return;
                  setDeleteLoading(true);
                  try {
                    const res = await fetch(`/api/guests/${deleteGuestId}`, {
                      method: "DELETE",
                    });
                    if (!res.ok) {
                      const errorData = await res.json();
                      throw new Error(
                        errorData.error || "Failed to delete guest",
                      );
                    }
                    fetchGuests(); // Refresh guest list
                    setDeleteGuestId(null);
                    setDeleteOpen(false);
                  } catch (error: unknown) {
                    console.error("Error deleting guest:", error);
                    alert((error as Error).message);
                  } finally {
                    setDeleteLoading(false);
                  }
                }}
                disabled={deleteLoading}>
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
