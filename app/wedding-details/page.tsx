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
  ceremonyTime: string;
  receptionTime: string;
  guestArrival: string;
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
    ceremonyTime: "",
    receptionTime: "",
    guestArrival: "",
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
        <div className="wedding-card p-8 shadow-lg rounded-2xl bg-white dark:bg-gray-800 transition-colors">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Bride & Groom */}
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-bold text-foreground border-b border-border pb-2">
                Couple
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Bride&apos;s Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={wedding.brideName}
                      onChange={(e) =>
                        setWedding({ ...wedding, brideName: e.target.value })
                      }
                      className="mt-1 bg-gray-50 dark:bg-gray-700"
                    />
                  ) : (
                    <p className="mt-1 text-xl font-semibold text-foreground">
                      {wedding.brideName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Groom&apos;s Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={wedding.groomName}
                      onChange={(e) =>
                        setWedding({ ...wedding, groomName: e.target.value })
                      }
                      className="mt-1 bg-gray-50 dark:bg-gray-700"
                    />
                  ) : (
                    <p className="mt-1 text-xl font-semibold text-foreground">
                      {wedding.groomName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Wedding Date & Location */}
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-bold text-foreground border-b border-border pb-2">
                Date & Location
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Wedding Date
                    </p>
                    {isEditing ? (
                      <Input
                        type="date"
                        className="mt-1 bg-gray-50 dark:bg-gray-700"
                        value={wedding.date}
                        onChange={(e) =>
                          setWedding({ ...wedding, date: e.target.value })
                        }
                      />
                    ) : (
                      <p className="mt-1 text-lg font-semibold text-foreground">
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
                  <MapPin className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Venue
                    </p>
                    {isEditing ? (
                      <Input
                        value={wedding.location}
                        onChange={(e) =>
                          setWedding({ ...wedding, location: e.target.value })
                        }
                        className="mt-1 bg-gray-50 dark:bg-gray-700"
                      />
                    ) : (
                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {wedding.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats: Theme, Guests, Budget */}
          <div className="mt-10 border-t border-border/50 pt-6 grid gap-6 md:grid-cols-3">
            {/* Theme */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Theme</p>
              {isEditing ? (
                <Input
                  value={wedding.theme}
                  onChange={(e) =>
                    setWedding({ ...wedding, theme: e.target.value })
                  }
                  className="bg-gray-50 dark:bg-gray-700"
                />
              ) : (
                <p className="text-lg font-semibold text-foreground">
                  {wedding.theme}
                </p>
              )}
            </div>

            {/* Expected Guests */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">
                  Expected Guests
                </p>
              </div>
              {isEditing ? (
                <Input
                  type="number"
                  min={0}
                  className="mt-1 bg-gray-50 dark:bg-gray-700"
                  value={wedding.guestCount}
                  onChange={(e) =>
                    setWedding({
                      ...wedding,
                      guestCount: Number(e.target.value),
                    })
                  }
                />
              ) : (
                <p className="text-lg font-semibold text-foreground">
                  {wedding.guestCount}
                </p>
              )}
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">
                  Total Budget
                </p>
              </div>
              {isEditing ? (
                <Input
                  type="number"
                  min={0}
                  className="mt-1 bg-gray-50 dark:bg-gray-700"
                  value={wedding.budget}
                  onChange={(e) =>
                    setWedding({ ...wedding, budget: Number(e.target.value) })
                  }
                />
              ) : (
                <p className="text-lg font-semibold text-primary">
                  ₱{wedding.budget.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Ceremony Time */}
          <div className="wedding-card p-4 text-center">
            <p className="text-xs text-muted-foreground">Ceremony Time</p>
            {isEditing ? (
              <Input
                type="time"
                value={wedding.ceremonyTime || ""}
                onChange={(e) =>
                  setWedding({ ...wedding, ceremonyTime: e.target.value })
                }
                className="mt-2 font-serif text-lg font-semibold text-foreground"
              />
            ) : (
              <p className="mt-2 font-serif text-lg font-semibold text-foreground">
                {wedding.ceremonyTime
                  ? new Date(
                      `1970-01-01T${wedding.ceremonyTime}:00`,
                    ).toLocaleTimeString("en-PH", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "--:--"}
              </p>
            )}
          </div>

          {/* Reception Time */}
          <div className="wedding-card p-4 text-center">
            <p className="text-xs text-muted-foreground">Reception Time</p>
            {isEditing ? (
              <Input
                type="time"
                value={wedding.receptionTime || ""}
                onChange={(e) =>
                  setWedding({ ...wedding, receptionTime: e.target.value })
                }
                className="mt-2 font-serif text-lg font-semibold text-foreground"
              />
            ) : (
              <p className="mt-2 font-serif text-lg font-semibold text-foreground">
                {wedding.receptionTime
                  ? new Date(
                      `1970-01-01T${wedding.receptionTime}:00`,
                    ).toLocaleTimeString("en-PH", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "--:--"}
              </p>
            )}
          </div>

          {/* Guest Arrival */}
          <div className="wedding-card p-4 text-center">
            <p className="text-xs text-muted-foreground">Guest Arrival</p>
            {isEditing ? (
              <Input
                type="time"
                value={wedding.guestArrival || ""}
                onChange={(e) =>
                  setWedding({ ...wedding, guestArrival: e.target.value })
                }
                className="mt-2 font-serif text-lg font-semibold text-foreground"
              />
            ) : (
              <p className="mt-2 font-serif text-lg font-semibold text-foreground">
                {wedding.guestArrival
                  ? new Date(
                      `1970-01-01T${wedding.guestArrival}:00`,
                    ).toLocaleTimeString("en-PH", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "--:--"}
              </p>
            )}
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
      </div>
    </AppLayout>
  );
}
