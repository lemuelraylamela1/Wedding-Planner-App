"use client";

import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Heart, Users, Edit2 } from "lucide-react";
import { initialWeddingDetails } from "@/lib/wedding-data";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Wedding {
  brideName: string;
  groomName: string;
  date: string;
  location: string;
  theme: string;
  guestCount: number;
  budget: number;
}

export default function WeddingDetailsPage() {
  const [wedding, setWedding] = useState<Wedding>({
    brideName: "",
    groomName: "",
    date: "",
    location: "",
    theme: "",
    guestCount: 0,
    budget: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchWedding = async () => {
      const res = await fetch(`/api/wedding/${session.user.id}`);
      const data = await res.json();

      if (data) {
        setWedding(data);
      }
    };

    fetchWedding();
  }, [session]);

  const handleSave = async () => {
    if (!session?.user?.id) return;

    await fetch(`/api/wedding/${session.user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wedding),
    });

    setIsEditing(false);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="heading-elegant">Wedding Details</h1>
            <p className="heading-sub">
              Core information about your special day
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}>
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>

        {/* Main Details Card */}
        <div className="wedding-card p-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Bride & Groom */}
            <div className="space-y-4">
              <h2 className="text-lg font-serif font-semibold text-foreground">
                Couple
              </h2>
              <div className="space-y-4">
                <label className="text-sm text-muted-foreground">
                  Bride&apos;s Name
                </label>
                {isEditing ? (
                  <Input
                    value={wedding.brideName}
                    onChange={(e) =>
                      setWedding({ ...wedding, brideName: e.target.value })
                    }
                  />
                ) : (
                  <p className="mt-1 text-xl font-medium text-foreground">
                    {wedding.brideName}
                  </p>
                )}
                <div>
                  <label className="text-sm text-muted-foreground">
                    Groom&apos;s Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={wedding.groomName}
                      onChange={(e) =>
                        setWedding({ ...wedding, groomName: e.target.value })
                      }
                    />
                  ) : (
                    <p className="mt-1 text-xl font-medium text-foreground">
                      {wedding.groomName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Wedding Date & Location */}
            <div className="space-y-4">
              <h2 className="text-lg font-serif font-semibold text-foreground">
                Date & Location
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-1" />

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Wedding Date
                    </p>

                    {isEditing ? (
                      <Input
                        type="date"
                        className="mt-1"
                        value={wedding.date}
                        onChange={(e) =>
                          setWedding({ ...wedding, date: e.target.value })
                        }
                      />
                    ) : (
                      <p className="mt-1 text-lg font-medium text-foreground">
                        {wedding.date
                          ? new Date(wedding.date).toLocaleDateString("en-PH", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Not set"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Venue</p>
                    {isEditing ? (
                      <Input
                        value={wedding.location}
                        onChange={(e) =>
                          setWedding({ ...wedding, location: e.target.value })
                        }
                      />
                    ) : (
                      <p className="mt-1 text-xl font-medium text-foreground">
                        {wedding.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-border/50 pt-8">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Theme */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Theme</p>
                {isEditing ? (
                  <Input
                    value={wedding.theme}
                    onChange={(e) =>
                      setWedding({ ...wedding, theme: e.target.value })
                    }
                  />
                ) : (
                  <p className="mt-1 text-xl font-medium text-foreground">
                    {wedding.theme}
                  </p>
                )}
              </div>

              {/* Expected Guests */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Expected Guests
                  </p>
                </div>

                {isEditing ? (
                  <Input
                    type="number"
                    min={0}
                    className="mt-1"
                    value={wedding.guestCount}
                    onChange={(e) =>
                      setWedding({
                        ...wedding,
                        guestCount: Number(e.target.value),
                      })
                    }
                  />
                ) : (
                  <p className="text-lg font-medium text-foreground">
                    {wedding.guestCount}
                  </p>
                )}
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                </div>
                {isEditing ? (
                  <Input
                    type="number"
                    min={0}
                    className="mt-1"
                    value={wedding.budget}
                    onChange={(e) =>
                      setWedding({
                        ...wedding,
                        budget: Number(e.target.value),
                      })
                    }
                  />
                ) : (
                  <p className="text-lg font-medium text-foreground">
                    ₱{wedding.budget}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Engagement",
              status: "Completed",
              tasks: ["Buy Ring", "Plan Proposal"],
            },
            {
              title: "Planning Phase",
              status: "In Progress",
              tasks: ["Book Venue", "Guest List", "Budget Planning"],
            },
            {
              title: "Countdown",
              status: "Upcoming",
              tasks: [
                "Send Invitations",
                "Finalize Details",
                "Day-of Logistics",
              ],
            },
          ].map((phase, idx) => (
            <div key={idx} className="wedding-card p-6">
              <p className="text-xs text-accent font-semibold uppercase">
                {phase.status}
              </p>
              <h3 className="mt-2 font-serif text-lg font-semibold text-foreground">
                {phase.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {phase.tasks.map((task, taskIdx) => (
                  <li
                    key={taskIdx}
                    className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Wedding Vision */}
        <div className="wedding-card p-8">
          <h2 className="text-lg font-serif font-semibold text-foreground mb-4">
            Your Wedding Vision
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">
                Style & Atmosphere
              </h3>
              <p className="text-sm text-muted-foreground">
                {wedding.theme} wedding with romantic garden setting and elegant
                touches.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">Guest Experience</h3>
              <p className="text-sm text-muted-foreground">
                Creating an unforgettable celebration for {wedding.guestCount}{" "}
                loved ones.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Ceremony Time", value: "4:00 PM" },
            { label: "Reception Time", value: "5:30 PM" },
            { label: "Guest Arrival", value: "3:30 PM" },
            { label: "Last Dance", value: "11:00 PM" },
          ].map((item, idx) => (
            <div key={idx} className="wedding-card p-4 text-center">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="mt-2 font-serif text-lg font-semibold text-foreground">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
