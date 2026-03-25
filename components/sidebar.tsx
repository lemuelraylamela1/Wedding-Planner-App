"use client";

import { useState } from "react";
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
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/guests", label: "Guests", icon: Users },
  { href: "/wedding-details", label: "Wedding Details", icon: Heart },
  { href: "/timeline", label: "Timeline", icon: Calendar },
  { href: "/budget", label: "Budget", icon: DollarSign },
  { href: "/vendors", label: "Vendors", icon: Users2 },
  { href: "/seating", label: "Seating", icon: Armchair },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // mobile toggle
  const pathname = usePathname();

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground shadow-lg"
        onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full border-r border-border/50 bg-sidebar transition-transform duration-300",
          "md:relative md:flex md:flex-col",
          "w-64 md:w-20 lg:w-64", // collapsed width for tablet
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
        )}>
        {/* Logo section */}
        <div className="border-b border-border/50 p-6 flex items-center justify-center md:justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Heart className="h-5 w-5" />
          </div>
          {/* Hide logo text on smaller screens */}
          <div className="hidden lg:flex flex-col">
            <p className="text-sm font-semibold text-sidebar-foreground">
              Wedding
            </p>
            <p className="text-xs text-muted-foreground">Planner</p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}>
                <button
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  )}>
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {/* Hide nav text on smaller screens */}
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>

        {/* Footer section */}
        <div className="border-t border-border/50 p-4 space-y-3 flex flex-col items-center">
          {/* Always show icon, hide text on smaller screens */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition">
            <LogOut className="h-4 w-4" />
            <span className="hidden lg:inline">Sign Out</span>
          </button>

          {/* Footer text only on desktop */}
          <p className="text-xs text-muted-foreground text-center hidden lg:block">
            Your Perfect Day Awaits ✦
          </p>
        </div>
      </aside>
    </>
  );
}
