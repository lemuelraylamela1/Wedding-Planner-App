"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Mail,
  Phone,
  Facebook,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const categories = [
  "Catering",
  "Photography",
  "Flowers",
  "Music/DJ",
  "Venue",
  "Decorations",
  "Invitations",
  "Transportation",
];
const statusColors: Record<
  string,
  { bg: string; text: string; icon: React.ReactNode }
> = {
  inquiry: {
    bg: "bg-blue-100/50",
    text: "text-blue-700",
    icon: <Clock className="h-4 w-4" />,
  },
  quoted: {
    bg: "bg-yellow-100/50",
    text: "text-yellow-700",
    icon: <Clock className="h-4 w-4" />,
  },
  booked: {
    bg: "bg-green-100/50",
    text: "text-green-700",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  paid: {
    bg: "bg-primary/10",
    text: "text-primary",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
};

export interface Supplier {
  _id: string;
  name: string;
  category: string;
  status: "inquiry" | "quoted" | "booked" | "paid";
  contact?: string;
  email?: string;
  phone?: string;
  facebook?: string;
  cost?: number;
  notes?: string;
  userId?: string; // optional if you want to track the owner
  headCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function SuppliersPage() {
  const { data: session, status } = useSession();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editingSupplierId, setEditingSupplierId] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSupplierId, setDeleteSupplierId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Catering",
    status: "inquiry",
    contact: "",
    email: "",
    phone: "",
    facebook: "",
    cost: 0,
    headCount: 0,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    category?: string;
    status?: string;
  }>({});

  const fetchSuppliers = () => {
    fetch("/api/suppliers")
      .then((res) => res.json())
      .then((data: Supplier[]) => {
        setSuppliers(data.map((s) => ({ ...s, id: s._id })));
      })
      .catch((error) => {
        console.error("Failed to fetch suppliers", error);
      });
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || supplier.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || supplier.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: suppliers.length,
    booked: suppliers.filter((s) => s.status === "booked").length,
    pending: suppliers.filter(
      (s) => s.status === "inquiry" || s.status === "quoted",
    ).length,
    paid: suppliers.filter((s) => s.status === "paid").length,
    totalCost: suppliers
      .filter((s) => s.status === "booked" || s.status === "paid")
      .reduce((sum, s) => sum + (s.cost ?? 0), 0),
  };

  useEffect(() => {
    if (!editingSupplierId) {
      // Reset form when Edit Guest modal is closed
      setForm({
        name: "",
        category: "Catering",
        status: "inquiry",
        contact: "",
        email: "",
        phone: "",
        facebook: "",
        cost: 0,
        headCount: 0,
        notes: "",
      });
      setErrors({});
    }
  }, [editingSupplierId]);

  useEffect(() => {
    if (!open) {
      setForm({
        name: "",
        category: "Catering",
        status: "inquiry",
        contact: "",
        email: "",
        phone: "",
        facebook: "",
        cost: 0,
        headCount: 0,
        notes: "",
      });
      setErrors({}); // Clear all errors
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Guest Name required
    if (!form.name.trim()) {
      newErrors.name = "Supplier Name is required";
    }

    if (!form.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!form.status.trim()) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSupplier = async () => {
    // Simple validation
    if (!form.name || !form.category) {
      alert("Please fill in the supplier name and category.");
      return;
    }

    if (!session?.user?.id) {
      alert("You must be logged in to add a supplier.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userId: session.user.id,
        name: form.name,
        category: form.category,
        status: form.status,
        contact: form.contact,
        email: form.email,
        phone: form.phone,
        facebook: form.facebook,
        cost: form.cost ? Number(form.cost) : 0,
        headCount: form.headCount,
        notes: form.notes,
      };

      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add supplier");
      }

      const newSupplier = await res.json();

      // Update frontend state
      setSuppliers((prev) => [...prev, newSupplier]);

      // Reset form and close modal
      setForm({
        name: "",
        category: "Catering",
        status: "inquiry",
        contact: "",
        email: "",
        phone: "",
        facebook: "",
        cost: 0,
        headCount: 0,
        notes: "",
      });
      setOpen(false);
    } catch (error: unknown) {
      console.error("Error adding supplier:", error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setForm({
      name: supplier.name,
      category: supplier.category,
      status: supplier.status,
      contact: supplier.contact?.toString() || "",
      email: supplier.email?.toString() || "",
      phone: supplier.phone?.toString() || "",
      facebook: supplier.facebook?.toString() || "",
      cost: supplier.cost || 0,
      headCount: supplier.headCount || 0,
      notes: supplier.notes || "",
    });
    setEditingSupplierId(supplier._id);
  };

  // Call this when submitting the edit modal
  const handleUpdateSupplier = async () => {
    if (!editingSupplierId) {
      alert("No guest selected for editing.");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        name: form.name,
        category: form.category,
        status: form.status,
        contact: form.contact,
        email: form.email,
        phone: form.phone,
        facebook: form.facebook,
        cost: form.cost,
        headCount: form.headCount,
        notes: form.notes,
      };

      const res = await fetch(`/api/suppliers/${editingSupplierId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update supplier");
      }

      // Refresh guest list
      fetchSuppliers();

      // Reset form and close modal
      setForm({
        name: "",
        category: "Catering",
        status: "inquiry",
        contact: "",
        email: "",
        phone: "",
        facebook: "",
        cost: 0,
        headCount: 0,
        notes: "",
      });
      setEditingSupplierId("");
      setOpen(false);
    } catch (error: unknown) {
      console.error("Error updating supplier:", error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="heading-elegant">Suppliers</h1>
          <p className="heading-sub">Manage and track your wedding suppliers</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="wedding-card p-4">
            <p className="text-xs text-muted-foreground">Total Suppliers</p>
            <p className="mt-2 text-2xl font-serif font-bold text-foreground">
              {stats.total}
            </p>
          </div>
          <div className="wedding-card p-4 border-green-200/50">
            <p className="text-xs text-green-700">Booked</p>
            <p className="mt-2 text-2xl font-serif font-bold text-green-700">
              {stats.booked}
            </p>
          </div>
          <div className="wedding-card p-4 border-yellow-200/50">
            <p className="text-xs text-yellow-700">Pending</p>
            <p className="mt-2 text-2xl font-serif font-bold text-yellow-700">
              {stats.pending}
            </p>
          </div>
          <div className="wedding-card p-4 border-primary/20">
            <p className="text-xs text-primary">Total Booked Cost</p>
            <p className="mt-2 text-2xl font-serif font-bold text-primary">
              ₱{stats.totalCost.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters & Add */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 flex-1 md:flex-row md:gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="inquiry">Inquiry</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Supplier
          </Button>
        </div>

        {/* Suppliers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSuppliers.length ? (
            filteredSuppliers.map((supplier) => {
              const statusColor = statusColors[supplier.status];

              return (
                <div
                  key={supplier._id}
                  className="wedding-card group p-6 flex flex-col hover:shadow-xl transition-all duration-300 border border-border/60">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="space-y-1">
                      <h3 className="font-serif text-xl font-semibold text-foreground leading-none">
                        {supplier.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {supplier.category}
                      </p>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${statusColor.bg} ${statusColor.text}`}>
                      {statusColor.icon}
                      <span className="capitalize">{supplier.status}</span>
                    </div>
                  </div>

                  {/* Highlight Row (Cost + Headcount) */}
                  <div className="flex items-center justify-between bg-muted/40 rounded-lg p-3 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Headcount</p>
                      <p className="text-lg font-semibold text-foreground">
                        {supplier.headCount || "--"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Cost</p>
                      <p className="text-lg font-semibold text-primary">
                        ₱{supplier.cost?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 flex-1 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Contact Person
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {supplier.contact}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`mailto:${supplier.email}`}
                        className="text-primary hover:underline truncate">
                        {supplier.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${supplier.phone}`}
                        className="text-primary hover:underline">
                        {supplier.phone}
                      </a>
                    </div>

                    {supplier.facebook && (
                      <div className="flex items-center gap-3 text-sm">
                        <Facebook className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={
                            supplier.facebook.startsWith("http")
                              ? supplier.facebook
                              : `https://facebook.com/${supplier.facebook}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate">
                          {supplier.facebook}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {supplier.notes && (
                    <div className="bg-primary/5 border border-primary/20 rounded-md p-3 mb-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        Notes
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">
                        {supplier.notes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      className="flex-1 group-hover:border-primary group-hover:text-primary transition"
                      onClick={() => handleEditSupplier(supplier)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 text-destructive hover:text-destructive"
                      onClick={() => {
                        setDeleteSupplierId(supplier._id);
                        setDeleteOpen(true);
                      }}>
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-muted-foreground text-sm">
                No suppliers match your search
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Add Supplier */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Supplier Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <Select
              value={form.category}
              onValueChange={(val) => setForm({ ...form, category: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Catering",
                  "Photography",
                  "Flowers",
                  "Music/DJ",
                  "Venue",
                  "Decorations",
                  "Invitations",
                  "Transportation",
                ].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={form.status}
              onValueChange={(val) => setForm({ ...form, status: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inquiry">Inquiry</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Contact Person"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              placeholder="Facebook"
              value={form.facebook}
              onChange={(e) => setForm({ ...form, facebook: e.target.value })}
            />
            <Input
              placeholder="Cost"
              type="number"
              value={form.cost}
              onChange={(e) =>
                setForm({ ...form, cost: Number(e.target.value) })
              }
            />
            <Input
              placeholder="Head Count"
              type="number"
              value={form.headCount}
              onChange={(e) =>
                setForm({ ...form, headCount: Number(e.target.value) })
              }
            />
            <Input
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button
              onClick={handleAddSupplier}
              className="bg-primary text-white w-full"
              disabled={loading}>
              {loading ? "Adding..." : "Add Supplier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier */}
      <Dialog
        open={!!editingSupplierId}
        onOpenChange={() => setEditingSupplierId("")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Supplier Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <Select
              value={form.category}
              onValueChange={(val) => setForm({ ...form, category: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Catering",
                  "Photography",
                  "Flowers",
                  "Music/DJ",
                  "Venue",
                  "Decorations",
                  "Invitations",
                  "Transportation",
                ].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={form.status}
              onValueChange={(val) => setForm({ ...form, status: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inquiry">Inquiry</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Contact Person"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              placeholder="Facebook"
              value={form.facebook}
              onChange={(e) => setForm({ ...form, facebook: e.target.value })}
            />
            <Input
              placeholder="Cost"
              type="number"
              value={form.cost}
              onChange={(e) =>
                setForm({ ...form, cost: Number(e.target.value) })
              }
            />
            <Input
              placeholder="Head Count"
              type="number"
              value={form.headCount}
              onChange={(e) =>
                setForm({ ...form, headCount: Number(e.target.value) })
              }
            />
            <Input
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button
              onClick={handleUpdateSupplier}
              className="bg-primary text-white w-full"
              disabled={loading}>
              {loading ? "Updating..." : "Update Supplier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Supplier */}
      <Dialog open={deleteOpen} onOpenChange={() => setDeleteOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Supplier</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-sm text-muted-foreground">
            Are you sure you want to delete this supplier? This action cannot be
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
                if (!deleteSupplierId) return;
                setDeleteLoading(true);
                try {
                  const res = await fetch(
                    `/api/suppliers/${deleteSupplierId}`,
                    {
                      method: "DELETE",
                    },
                  );
                  if (!res.ok) {
                    const errorData = await res.json();
                    toast("Failed to delete supplier");
                    throw new Error(
                      errorData.error || "Failed to delete supplier",
                    );
                  } else {
                    toast("Supplier deleted successfully!");
                  }
                  fetchSuppliers(); // Refresh guest list
                  setDeleteSupplierId(null);
                  setDeleteOpen(false);
                } catch (error: unknown) {
                  console.error("Error deleting suoplier:", error);
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
    </AppLayout>
  );
}
