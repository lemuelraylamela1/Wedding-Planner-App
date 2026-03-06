"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users, Trash2, Edit2, Download } from "lucide-react";
import { initialGuests } from "@/lib/wedding-data";

interface Table {
  id: string;
  number: number;
  capacity: number;
  guests: string[];
}

const DEFAULT_TABLES: Table[] = [
  { id: "1", number: 1, capacity: 8, guests: ["1", "3"] },
  { id: "2", number: 2, capacity: 8, guests: [] },
  { id: "3", number: 3, capacity: 8, guests: [] },
  { id: "4", number: 4, capacity: 8, guests: [] },
  { id: "5", number: 5, capacity: 8, guests: [] },
];

export default function SeatingPage() {
  const [tables, setTables] = useState<Table[]>(DEFAULT_TABLES);
  const [searchTerm, setSearchTerm] = useState("");
  const guests = initialGuests;

  const seatedGuests = new Set(tables.flatMap((t) => t.guests));
  const unseatedGuests = guests.filter((g) => !seatedGuests.has(g.id));

  const getGuestsByIds = (ids: string[]) => {
    return ids
      .map((id) => guests.find((g) => g.id === id))
      .filter((g) => g !== undefined);
  };

  const filteredUnseatedGuests = unseatedGuests.filter((guest) =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddTable = () => {
    const newTableNumber = Math.max(...tables.map((t) => t.number)) + 1;
    setTables([
      ...tables,
      {
        id: String(Date.now()),
        number: newTableNumber,
        capacity: 8,
        guests: [],
      },
    ]);
  };

  const handleRemoveTable = (id: string) => {
    if (tables.length > 1) {
      setTables(tables.filter((t) => t.id !== id));
    }
  };

  const handleAddGuestToTable = (tableId: string, guestId: string) => {
    setTables(
      tables.map((table) => {
        if (table.id === tableId && !table.guests.includes(guestId)) {
          return { ...table, guests: [...table.guests, guestId] };
        }
        return table;
      }),
    );
  };

  const handleRemoveGuestFromTable = (tableId: string, guestId: string) => {
    setTables(
      tables.map((table) => {
        if (table.id === tableId) {
          return {
            ...table,
            guests: table.guests.filter((id) => id !== guestId),
          };
        }
        return table;
      }),
    );
  };

  const stats = {
    total: guests.length,
    seated: seatedGuests.size,
    unseated: unseatedGuests.length,
    tables: tables.length,
    occupancy:
      tables.length > 0
        ? Math.round((seatedGuests.size / (tables.length * 8)) * 100)
        : 0,
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="heading-elegant">Seating Arrangements</h1>
          <p className="heading-sub">Organize your guests by table</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <div className="wedding-card p-4">
            <p className="text-xs text-muted-foreground">Total Guests</p>
            <p className="mt-2 text-2xl font-serif font-bold text-foreground">
              {stats.total}
            </p>
          </div>
          <div className="wedding-card p-4 border-green-200/50">
            <p className="text-xs text-green-700">Seated</p>
            <p className="mt-2 text-2xl font-serif font-bold text-green-700">
              {stats.seated}
            </p>
          </div>
          <div className="wedding-card p-4 border-yellow-200/50">
            <p className="text-xs text-yellow-700">Unseated</p>
            <p className="mt-2 text-2xl font-serif font-bold text-yellow-700">
              {stats.unseated}
            </p>
          </div>
          <div className="wedding-card p-4 border-primary/20">
            <p className="text-xs text-primary">Tables</p>
            <p className="mt-2 text-2xl font-serif font-bold text-primary">
              {stats.tables}
            </p>
          </div>
          <div className="wedding-card p-4">
            <p className="text-xs text-muted-foreground">Occupancy</p>
            <p className="mt-2 text-2xl font-serif font-bold text-foreground">
              {stats.occupancy}%
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Unseated Guests */}
          <div className="lg:col-span-1">
            <div className="wedding-card p-6 sticky top-24 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  Unseated Guests
                </h2>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100/50 text-yellow-700">
                  {stats.unseated}
                </span>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search guests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredUnseatedGuests.length > 0 ? (
                  filteredUnseatedGuests.map((guest) => (
                    <div
                      key={guest.id}
                      className="p-2 bg-muted/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors cursor-move"
                      draggable>
                      <p className="text-sm font-medium text-foreground">
                        {guest.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {guest.mealPreference}
                      </p>
                      {guest.dietaryRestrictions !== "None" && (
                        <p className="text-xs text-amber-600 mt-1">
                          {guest.dietaryRestrictions}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">
                      All guests are seated!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tables */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Tables
              </h2>
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Table
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {tables.map((table) => {
                const seatedAtTable = getGuestsByIds(table.guests);
                const remaining = table.capacity - table.guests.length;

                return (
                  <div key={table.id} className="wedding-card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-serif text-xl font-semibold text-foreground">
                          Table {table.number}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {table.guests.length} of {table.capacity} seats
                        </p>
                      </div>
                      {tables.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveTable(table.id)}
                          className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Capacity Bar */}
                    <div className="mb-4">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${Math.round((table.guests.length / table.capacity) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Seated Guests */}
                    <div className="space-y-2 mb-4">
                      {seatedAtTable.length > 0 ? (
                        seatedAtTable.map((guest) => (
                          <div
                            key={guest.id}
                            className="flex items-center justify-between p-2 bg-primary/5 rounded-lg border border-primary/20">
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {guest.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {guest.mealPreference}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleRemoveGuestFromTable(table.id, guest.id)
                              }
                              className="h-8 w-8 text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <Users className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No guests assigned
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Add Guest Button */}
                    {remaining > 0 && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          if (unseatedGuests.length > 0) {
                            handleAddGuestToTable(
                              table.id,
                              unseatedGuests[0].id,
                            );
                          }
                        }}
                        disabled={unseatedGuests.length === 0}>
                        Add Guest ({remaining} slots)
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="wedding-card p-6">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
              Seating Summary
            </h3>
            <div className="space-y-3">
              {[
                { label: "Total Guests", value: stats.total },
                { label: "Seated", value: stats.seated },
                { label: "Pending", value: stats.unseated },
                { label: "Table Capacity", value: stats.tables * 8 },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="wedding-card p-6">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export Seating Chart
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Print Place Cards
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
