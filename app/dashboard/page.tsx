"use client";

import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  DollarSign,
  Users2,
  Heart,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
  initialWeddingDetails,
  initialGuests,
  initialBudget,
  initialVendors,
} from "@/lib/wedding-data";
import { useSession } from "next-auth/react";

const StatCard = ({
  icon: Icon,
  label,
  value,
  subtext,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  subtext?: string;
}) => (
  <div className="wedding-card p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-serif font-semibold text-foreground">
          {value}
        </p>
        {subtext && (
          <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
        )}
      </div>
      <div className="rounded-lg bg-primary/10 p-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const wedding = initialWeddingDetails;
  const guests = initialGuests;
  const budgets = initialBudget;
  const vendors = initialVendors;

  const totalBudget = budgets.reduce((sum, b) => sum + b.budgeted, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const rsvpAccepted = guests.filter((g) => g.rsvpStatus === "accepted").length;
  const rsvpPending = guests.filter((g) => g.rsvpStatus === "pending").length;
  const vendorsBooked = vendors.filter((v) => v.status === "booked").length;

  const daysUntilWedding = Math.floor(
    (new Date(wedding.date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="heading-elegant">
            {wedding.brideName} & {wedding.groomName}&lsquo;s Wedding
          </h1>
          <p className="heading-sub">
            {wedding.location} •{" "}
            {new Date(wedding.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Countdown Section */}
        <div className="rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Days Until Wedding
              </p>
              <p className="mt-1 text-4xl font-serif font-bold text-primary">
                {daysUntilWedding}
              </p>
            </div>
            <Heart className="h-16 w-16 text-primary/20" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            label="Guests Invited"
            value={guests.length}
            subtext={`${rsvpAccepted} accepted, ${rsvpPending} pending`}
          />
          <StatCard
            icon={Calendar}
            label="Tasks Remaining"
            value="12"
            subtext="3 high priority"
          />
          <StatCard
            icon={DollarSign}
            label="Budget Status"
            value={`${Math.round((totalSpent / totalBudget) * 100)}%`}
            subtext={`$${totalSpent.toLocaleString()} of $${totalBudget.toLocaleString()}`}
          />
          <StatCard
            icon={Users2}
            label="Vendors"
            value={vendorsBooked}
            subtext={`${vendorsBooked} of ${vendors.length} booked`}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="wedding-card p-6">
            <h2 className="text-lg font-serif font-semibold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link href="/guests">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Guests
                </Button>
              </Link>
              <Link href="/timeline">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Timeline
                </Button>
              </Link>
              <Link href="/budget">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Manage Budget
                </Button>
              </Link>
            </div>
          </div>

          {/* Theme Info */}
          <div className="wedding-card p-6">
            <h2 className="text-lg font-serif font-semibold text-foreground mb-4">
              Wedding Theme
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Theme</p>
                <p className="mt-1 font-medium text-foreground">
                  {wedding.theme}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expected Guests</p>
                <p className="mt-1 font-medium text-foreground">
                  {wedding.guestCount} guests
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Budget</p>
                <p className="mt-1 font-medium text-primary">
                  ${wedding.budget.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks Preview */}
        <div className="wedding-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif font-semibold text-foreground">
              Recent Tasks
            </h2>
            <Link href="/timeline">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {[
              {
                title: "Send Save the Dates",
                status: "in-progress",
                priority: "high",
              },
              {
                title: "Book Photographer",
                status: "pending",
                priority: "medium",
              },
              { title: "Finalize Menu", status: "pending", priority: "high" },
            ].map((task, i) => (
              <div
                key={i}
                className="flex items-center gap-3 pb-3 border-b border-border/50 last:border-0">
                <div
                  className={`h-3 w-3 rounded-full ${
                    task.priority === "high" ? "bg-destructive" : "bg-accent"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {task.title}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    task.status === "in-progress"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted/50 text-muted-foreground"
                  }`}>
                  {task.status === "in-progress" ? "In Progress" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
