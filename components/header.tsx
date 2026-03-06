"use client";

import { Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

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
            <>
              <span className="text-sm font-medium">{session.user?.name}</span>
              <Button
                variant="destructive"
                onClick={() => signOut({ callbackUrl: "/" })}>
                Sign Out
              </Button>
            </>
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
