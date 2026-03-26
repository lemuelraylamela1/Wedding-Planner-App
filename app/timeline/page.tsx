"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Circle, Plus, Trash, Check } from "lucide-react";

export interface Event {
  _id: string;
  time: string;
  title: string;
  description: string;
  person?: string;
  location?: string;
  notes?: string;
  status?: "pending" | "in-progress" | "done";
}

export default function WeddingDayPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState({
    time: "",
    title: "",
    description: "",
    person: "",
    location: "",
  });

  const fetchEvents = () => {
    fetch("/api/wedding-day")
      .then((res) => res.json())
      .then((data: Event[]) => {
        setEvents(data.map((e) => ({ ...e, id: e._id })));
      })
      .catch((error) => {
        console.error("Failed to fetch suppliers", error);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAdd = async () => {
    await fetch("/api/wedding-day", {
      method: "POST",
      body: JSON.stringify(form),
    });
    setForm({ time: "", title: "", description: "", person: "", location: "" });
    fetchEvents();
  };

  const markDone = async (id: string) => {
    await fetch(`/api/wedding-day/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "done" }),
    });
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/wedding-day/${id}`, {
      method: "DELETE",
    });
    fetchEvents();
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <h1 className="heading-elegant">Wedding Day Timeline</h1>

        {/* Add Event */}
        <div className="wedding-card p-6 space-y-3">
          <h2 className="font-semibold">Add Timeline Event</h2>
          <div className="grid md:grid-cols-5 gap-2">
            <Input
              placeholder="Time (09:30)"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <Input
              placeholder="Person in charge"
              value={form.person}
              onChange={(e) => setForm({ ...form, person: e.target.value })}
            />
            <Input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="wedding-card p-4 flex items-start justify-between">
              <div className="flex gap-3">
                {event.status === "done" ? (
                  <CheckCircle2 className="text-green-600" />
                ) : (
                  <Circle />
                )}
                <div>
                  <p className="font-semibold">
                    {event.time} — {event.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    📍 {event.location} • 👤 {event.person}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {event.status !== "done" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markDone(event._id)}>
                    <Check />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(event._id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
