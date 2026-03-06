"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Users2,
  Armchair,
  Settings,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/guests", label: "Guests", icon: Users },
  { href: "/wedding-details", label: "Wedding Details", icon: Heart },
  { href: "/timeline", label: "Timeline", icon: Calendar },
  { href: "/budget", label: "Budget", icon: DollarSign },
  { href: "/vendors", label: "Vendors", icon: Users2 },
  { href: "/seating", label: "Seating", icon: Armchair },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 border-r border-border/50 bg-sidebar md:flex md:flex-col">
      {/* Logo section */}
      <div className="border-b border-border/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Heart className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-sidebar-foreground">
              Wedding
            </p>
            <p className="text-xs text-muted-foreground">Planner</p>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}>
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Footer section */}
      <div className="border-t border-border/50 p-4">
        <p className="text-xs text-muted-foreground text-center">
          Your Perfect Day Awaits ✦
        </p>
      </div>
    </aside>
  );
}
