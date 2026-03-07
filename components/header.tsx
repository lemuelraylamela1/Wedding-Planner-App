"use client";

import { Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="w-full flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Heart className="w-6 h-6 fill-primary text-primary" />
            <span className="text-xl font-serif font-bold text-foreground">
              Wedding Planner
            </span>
          </Link>

          {/* Right side buttons */}
          {!session && (
            <>
              <div className="flex items-center gap-3 ml-auto">
                <Button variant="outline" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>

                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            </>
          )}
          {session && (
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/40 px-4 py-3">
              {/* User info */}

              {/* Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition">
                    {session.user?.email?.charAt(0).toUpperCase()}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{session.user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Desktop Navigation would go here */}
        <nav className="hidden items-center gap-1 md:flex">
          {/* Navigation items will be added */}
        </nav>
      </div>
    </header>
  );
}
