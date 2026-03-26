"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users, Trash2, Edit2, Download } from "lucide-react";
import { Guests } from "@/app/guests/page";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Guest {
  _id: string;
  guestName: string;
  table?: number | ""; // matches your DB
  meal?: string;
  rsvpStatus?: "accepted" | "declined" | "pending" | "maybe" | "";
}

interface TableFromDB {
  _id: string;
  number: number;
  capacity: number;
  guests: string[];
}

interface Table {
  id: string;
  number: number;
  capacity: number;
  guests: string[];
}

export default function SeatingPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [newTable, setNewTable] = useState({ number: "", capacity: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedGuestId, setDraggedGuestId] = useState<string | null>(null);
  const [guests, setGuests] = useState<Guests[]>([]);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [tableToRemove, setTableToRemove] = useState<Table | null>(null);
  const [rsvpFilter, setRsvpFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [guestRes, tableRes] = await Promise.all([
          fetch("/api/guests"),
          fetch("/api/tables"),
        ]);

        const guestData = await guestRes.json();
        const tableData = await tableRes.json();

        setGuests(guestData);

        const mappedTables = tableData.map((table: TableFromDB) => ({
          id: table._id, // ✅ map here
          number: table.number,
          capacity: table.capacity,
          guests: guestData
            .filter((g: Guest) => g.table === table.number)
            .map((g: Guest) => g._id),
        }));

        setTables(mappedTables);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const seatedGuests = new Set(tables.flatMap((t) => t.guests));
  const unseatedGuests = guests.filter((g) => !seatedGuests.has(g._id));

  const getGuestsByIds = (ids: string[]) => {
    return ids
      .map((id) => guests.find((g) => g._id === id))
      .filter((g): g is Guests => g !== undefined);
  };

  const filteredUnseatedGuests = unseatedGuests.filter((guest) => {
    const matchesSearch = guest.guestName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      rsvpFilter === "all" ? true : guest.rsvpStatus === rsvpFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: guests.length,
    seated: seatedGuests.size,
    unseated: unseatedGuests.length,
    tables: tables.length,
    occupancy:
      tables.length > 0
        ? Math.round(
            (seatedGuests.size /
              tables.reduce((sum, t) => sum + t.capacity, 0)) *
              100,
          )
        : 0,
  };

  // const seatedGuests = new Set(tables.flatMap((t) => t.guests));
  // const unseatedGuests = guests.filter((g) => !seatedGuests.has(g.id));

  // const getGuestsByIds = (ids: string[]) => {
  //   return ids
  //     .map((id) => guests.find((g) => g.id === id))
  //     .filter((g) => g !== undefined);
  // };

  // const filteredUnseatedGuests = unseatedGuests.filter((guest) =>
  //   guest.name.toLowerCase().includes(searchTerm.toLowerCase()),
  // );
  const handleAddTable = async (
    tableNumber: string | number,
    capacity: string | number,
  ) => {
    const number = Number(tableNumber);
    const cap = Number(capacity);

    if (!number || !cap) {
      alert("Please enter valid table number and capacity.");
      return;
    }

    // Prevent duplicate table numbers
    if (tables.find((t) => t.number === number)) {
      alert("This table number already exists.");
      return;
    }

    const newTable = {
      id: String(Date.now()), // optional, backend can generate id
      number,
      capacity: cap,
      guests: [],
    };

    // 1️⃣ Add to local state
    setTables((prev) =>
      [...prev, newTable].sort((a, b) => a.number - b.number),
    );

    // 2️⃣ Send to backend to persist
    try {
      const res = await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number, capacity: cap }),
      });

      if (!res.ok) throw new Error("Failed to create table on server");
      toast.success("Table added!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save table. Try again.");
    }
  };

  const handleMoveGuest = async (guestId: string, targetTableId: string) => {
    const targetTable = tables.find((t) => t.id === targetTableId);
    if (!targetTable) return;

    // ✅ Prevent adding if table is full
    if (targetTable.guests.length >= targetTable.capacity) {
      alert(`Table ${targetTable.number} is already at full capacity!`);
      return;
    }

    // 1️⃣ Update local state
    setTables((prevTables) =>
      prevTables
        .map((table) => ({
          ...table,
          guests: table.guests.filter((id) => id !== guestId),
        }))
        .map((table) => {
          if (table.id === targetTableId) {
            return { ...table, guests: [...table.guests, guestId] };
          }
          return table;
        }),
    );

    // 2️⃣ Update the guest table in DB
    try {
      const res = await fetch(`/api/guests/${guestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: targetTable.number }),
      });
      if (!res.ok) throw new Error("Failed to update guest table in DB");

      // 3️⃣ Update local guest state
      setGuests((prev) =>
        prev.map((g) =>
          g._id === guestId ? { ...g, table: targetTable.number } : g,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to save guest table. Try again.");
    }
  };

  const rsvpColors: Record<string, { bg: string; text: string }> = {
    accepted: { bg: "bg-green-100/50", text: "text-green-700" },
    declined: { bg: "bg-red-100/50", text: "text-red-700" },
    pending: { bg: "bg-yellow-100/50", text: "text-yellow-700" },
    maybe: { bg: "bg-blue-100/50", text: "text-blue-700" },
  };

  // const handleRemoveTable = (id: string) => {
  //   if (tables.length > 1) {
  //     setTables(tables.filter((t) => t.id !== id));
  //   }
  // };

  // const handleAddGuestToTable = (tableId: string, guestId: string) => {
  //   setTables(
  //     tables.map((table) => {
  //       if (table.id === tableId && !table.guests.includes(guestId)) {
  //         return { ...table, guests: [...table.guests, guestId] };
  //       }
  //       return table;
  //     }),
  //   );
  // };

  const handleRemoveGuestFromTable = async (
    tableId: string,
    guestId: string,
  ) => {
    // Update the state first
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

    // Update the guest in the database
    try {
      await fetch(`/api/guests/${guestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "" }), // set table to empty string
      });
    } catch (error) {
      console.error("Failed to remove guest from table:", error);
    }
  };

  // const stats = {
  //   total: guests.length,
  //   seated: seatedGuests.size,
  //   unseated: unseatedGuests.length,
  //   tables: tables.length,
  //   occupancy:
  //     tables.length > 0
  //       ? Math.round((seatedGuests.size / (tables.length * 8)) * 100)
  //       : 0,
  // };

  const handleUpdateTable = (id: string, number: number, capacity: number) => {
    // Check for duplicate table number
    if (tables.some((t) => t.id !== id && t.number === number)) {
      alert("This table number already exists.");
      return;
    }

    setTables((prevTables) =>
      prevTables
        .map((t) =>
          t.id === id
            ? {
                ...t,
                number,
                capacity:
                  capacity >= t.guests.length ? capacity : t.guests.length,
              }
            : t,
        )
        .sort((a, b) => a.number - b.number),
    );
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
              {/* RSVP Filter */}
              <div className="flex items-center space-x-2 text-xs mb-2">
                <div
                  className={`px-2 py-1 rounded cursor-pointer ${
                    rsvpFilter === "all"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setRsvpFilter("all")}>
                  All
                </div>
                {Object.entries(rsvpColors).map(([status, colors]) => (
                  <div
                    key={status}
                    className={`px-2 py-1 rounded cursor-pointer ${colors.bg} ${colors.text} ${
                      rsvpFilter === status
                        ? "ring-2 ring-offset-1 ring-primary"
                        : ""
                    }`}
                    onClick={() => setRsvpFilter(status)}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                ))}
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

              {/* Unseated Guests */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredUnseatedGuests.length > 0 ? (
                  filteredUnseatedGuests.map((guest) => (
                    <div
                      key={guest._id}
                      className={`p-2 rounded-lg border cursor-move transition-colors ${
                        rsvpColors[guest.rsvpStatus || "pending"].bg
                      }`}
                      draggable
                      onDragStart={(e) => {
                        setDraggedGuestId(guest._id);
                        e.dataTransfer.effectAllowed = "move";
                      }}>
                      <p
                        className={`text-sm font-medium ${
                          rsvpColors[guest.rsvpStatus || "pending"].text
                        }`}>
                        {guest.guestName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {guest.meal}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-6 text-sm text-muted-foreground">
                    All guests are seated!
                  </p>
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
              <Dialog open={tableModalOpen} onOpenChange={setTableModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-white"
                    size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Table
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Add New Table</DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-4 py-2">
                    <Input
                      type="number"
                      placeholder="Table Number"
                      value={newTable.number}
                      onChange={(e) =>
                        setNewTable({ ...newTable, number: e.target.value })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Capacity"
                      value={newTable.capacity}
                      onChange={(e) =>
                        setNewTable({ ...newTable, capacity: e.target.value })
                      }
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setTableModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        handleAddTable(newTable.number, newTable.capacity);
                        setNewTable({ number: "", capacity: "" });
                        setTableModalOpen(false);
                      }}>
                      Add Table
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 ">
              {tables.length > 0 ? (
                <div
                  className="grid gap-4 md:grid-cols-2"
                  style={{ transition: "all 0.2s" }}>
                  {tables.map((table) => {
                    const seatedAtTable = getGuestsByIds(table.guests);
                    const remaining = table.capacity - table.guests.length;

                    return (
                      <div
                        key={table.id}
                        className={`wedding-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-all ${
                          draggedGuestId
                            ? "border-dashed border-2 border-primary/50"
                            : ""
                        }`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (draggedGuestId) {
                            handleMoveGuest(draggedGuestId, table.id);
                            setDraggedGuestId(null);
                          }
                        }}>
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-xl font-semibold text-foreground">
                            Table {table.number}
                          </h3>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingTable(table)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setTableToRemove(table)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Occupancy Bar */}
                        <div className="w-full h-2 bg-gray-200 rounded-full mt-1 mb-2">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{
                              width: `${((table.capacity - remaining) / table.capacity) * 100}%`,
                            }}
                          />
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {table.guests.length} of {table.capacity} seats
                        </p>

                        {/* Guests */}
                        <div className="space-y-2 mt-2">
                          {seatedAtTable.map((guest) => (
                            <div
                              key={guest._id}
                              className={`flex items-center justify-between p-2 rounded-lg border cursor-move transition-transform transform hover:scale-105 
              ${rsvpColors[guest.rsvpStatus || "pending"].bg} border-primary/20`}
                              draggable
                              onDragStart={(e) => {
                                setDraggedGuestId(guest._id);
                                e.dataTransfer.effectAllowed = "move";
                              }}>
                              <div>
                                <p
                                  className={`text-sm font-medium ${rsvpColors[guest.rsvpStatus || "pending"].text}`}>
                                  {guest.guestName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {guest.meal}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveGuestFromTable(
                                    table.id,
                                    guest._id,
                                  )
                                }
                                className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        {/* Remaining seats info */}
                        {remaining > 0 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {remaining} seat(s) available
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-6">
                  No tables assigned yet.
                </p>
              )}
            </div>
          </div>
        </div>
        <Dialog
          open={!!editingTable}
          onOpenChange={() => setEditingTable(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit Table</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <Input
                type="number"
                placeholder="Table Number"
                value={editingTable?.number || ""}
                onChange={(e) =>
                  setEditingTable(
                    editingTable
                      ? { ...editingTable, number: Number(e.target.value) }
                      : null,
                  )
                }
              />
              <Input
                type="number"
                placeholder="Capacity"
                value={editingTable?.capacity || ""}
                onChange={(e) =>
                  setEditingTable(
                    editingTable
                      ? { ...editingTable, capacity: Number(e.target.value) }
                      : null,
                  )
                }
              />
              {editingTable &&
                editingTable.guests.length > editingTable.capacity && (
                  <p className="text-xs text-red-600">
                    Capacity cannot be less than seated guests (
                    {editingTable.guests.length})
                  </p>
                )}
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setEditingTable(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (editingTable) {
                    handleUpdateTable(
                      editingTable.id,
                      editingTable.number,
                      editingTable.capacity,
                    );
                  }
                  setEditingTable(null);
                }}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!tableToRemove}
          onOpenChange={() => setTableToRemove(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Remove Table</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground py-2">
              Are you sure you want to remove Table {tableToRemove?.number}?{" "}
              <br />
              All guests assigned to this table will be unseated.
            </p>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setTableToRemove(null)}>
                Cancel
              </Button>
              <Button
                className="bg-primary"
                onClick={async () => {
                  if (!tableToRemove) return;

                  const guestIds = tableToRemove.guests;

                  setGuests((prev) =>
                    prev.map((g) =>
                      guestIds.includes(g._id) ? { ...g, table: null } : g,
                    ),
                  );

                  // 2️⃣ Update DB for each guest (optional: you can batch in backend)
                  for (const guestId of guestIds) {
                    try {
                      await fetch(`/api/guests/${guestId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ table: "" }),
                      });
                    } catch (err) {
                      console.error("Failed to reset guest table:", err);
                    }
                  }

                  // 3️⃣ Remove the table locally
                  setTables((prev) =>
                    prev.filter((t) => t.id !== tableToRemove.id),
                  );

                  // Close modal
                  setTableToRemove(null);
                }}>
                Remove Table
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
