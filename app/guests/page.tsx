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
import { Search, Plus, Mail, Phone, Check, X, Clock } from "lucide-react";
import { initialGuests } from "@/lib/wedding-data";

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

export default function GuestsPage() {
  const [guests, setGuests] = useState(initialGuests);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || guest.rsvpStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: guests.length,
    accepted: guests.filter((g) => g.rsvpStatus === "accepted").length,
    declined: guests.filter((g) => g.rsvpStatus === "declined").length,
    pending: guests.filter((g) => g.rsvpStatus === "pending").length,
  };

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
          <div className="wedding-card p-4">
            <p className="text-xs text-muted-foreground">Total Guests</p>
            <p className="mt-2 text-2xl font-serif font-bold text-foreground">
              {stats.total}
            </p>
          </div>
          <div className="wedding-card p-4 border-green-200/50">
            <p className="text-xs text-green-700">Accepted</p>
            <p className="mt-2 text-2xl font-serif font-bold text-green-700">
              {stats.accepted}
            </p>
          </div>
          <div className="wedding-card p-4 border-yellow-200/50">
            <p className="text-xs text-yellow-700">Pending</p>
            <p className="mt-2 text-2xl font-serif font-bold text-yellow-700">
              {stats.pending}
            </p>
          </div>
          <div className="wedding-card p-4 border-red-200/50">
            <p className="text-xs text-red-700">Declined</p>
            <p className="mt-2 text-2xl font-serif font-bold text-red-700">
              {stats.declined}
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
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter by RSVP Status */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="maybe">Maybe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Guest
          </Button>
        </div>

        {/* Guests Table */}
        <div className="wedding-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Guest Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Meal Preference
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    RSVP Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Table
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredGuests.length > 0 ? (
                  filteredGuests.map((guest) => {
                    const statusColor = rsvpStatusColors[guest.rsvpStatus];
                    return (
                      <tr
                        key={guest.id}
                        className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-foreground">
                            {guest.name}
                          </p>
                          {guest.plusOne && (
                            <p className="text-xs text-muted-foreground">
                              +1 Guest
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              {guest.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              {guest.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-foreground">
                            {guest.mealPreference}
                          </p>
                          {guest.dietaryRestrictions !== "None" && (
                            <p className="text-xs text-muted-foreground">
                              {guest.dietaryRestrictions}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium w-fit ${statusColor.bg} ${statusColor.text}`}>
                            {statusColor.icon}
                            <span className="capitalize">
                              {guest.rsvpStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-muted-foreground">
                            {guest.tableAssignment || "-"}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <p className="text-muted-foreground">
                        No guests match your search
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="wedding-card p-6">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
              Dietary Restrictions Summary
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Vegetarian</p>
                <p className="font-medium text-foreground">
                  {
                    guests.filter((g) =>
                      g.dietaryRestrictions.includes("Vegetarian"),
                    ).length
                  }
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">No Restrictions</p>
                <p className="font-medium text-foreground">
                  {
                    guests.filter((g) => g.dietaryRestrictions === "None")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="wedding-card p-6">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
              Plus One Count
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">With Plus One</p>
                <p className="font-medium text-foreground">
                  {guests.filter((g) => g.plusOne).length}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Expected</p>
                <p className="font-medium text-primary text-lg">
                  {guests.length + guests.filter((g) => g.plusOne).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
