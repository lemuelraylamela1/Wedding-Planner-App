"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
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
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { initialVendors } from "@/lib/wedding-data";

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

export default function VendorsPage() {
  const [vendors, setVendors] = useState(initialVendors);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || vendor.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || vendor.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: vendors.length,
    booked: vendors.filter((v) => v.status === "booked").length,
    pending: vendors.filter(
      (v) => v.status === "inquiry" || v.status === "quoted",
    ).length,
    paid: vendors.filter((v) => v.status === "paid").length,
    totalCost: vendors
      .filter((v) => v.status === "booked" || v.status === "paid")
      .reduce((sum, v) => sum + v.cost, 0),
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="heading-elegant">Vendors</h1>
          <p className="heading-sub">Manage and track your wedding vendors</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="wedding-card p-4">
            <p className="text-xs text-muted-foreground">Total Vendors</p>
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
              ${stats.totalCost.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 flex-1 md:flex-row md:gap-2">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter by Category */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter by Status */}
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

          <Button className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </div>

        {/* Vendors Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVendors.length > 0 ? (
            filteredVendors.map((vendor) => {
              const statusColor = statusColors[vendor.status];
              return (
                <div key={vendor.id} className="wedding-card p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-semibold text-foreground">
                        {vendor.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {vendor.category}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                      {statusColor.icon}
                      <span className="capitalize">{vendor.status}</span>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 mb-4 pb-4 border-b border-border/50">
                    {/* Contact Info */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Contact Person
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {vendor.contact}
                      </p>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`mailto:${vendor.email}`}
                        className="text-sm text-primary hover:underline">
                        {vendor.email}
                      </a>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${vendor.phone}`}
                        className="text-sm text-primary hover:underline">
                        {vendor.phone}
                      </a>
                    </div>

                    {/* Cost */}
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium text-foreground">
                        ${vendor.cost.toLocaleString()}
                      </p>
                    </div>

                    {/* Notes */}
                    {vendor.notes && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Notes
                        </p>
                        <p className="text-sm text-foreground">
                          {vendor.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="ghost" className="flex-1">
                      Contact
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                No vendors match your search
              </p>
            </div>
          )}
        </div>

        {/* Vendor Categories Overview */}
        <div className="wedding-card p-6">
          <h2 className="font-serif text-lg font-semibold text-foreground mb-6">
            Coverage by Category
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const categoryVendors = vendors.filter(
                (v) => v.category === category,
              );
              const booked = categoryVendors.filter(
                (v) => v.status === "booked" || v.status === "paid",
              );
              return (
                <div
                  key={category}
                  className="p-4 rounded-lg border border-border/50 bg-muted/30">
                  <p className="text-sm font-medium text-foreground">
                    {category}
                  </p>
                  <p className="text-2xl font-serif font-bold text-primary mt-2">
                    {booked.length}/{categoryVendors.length || "-"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {booked.length > 0 ? "Booked" : "Not booked"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
