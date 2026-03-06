import { Header } from "@/components/header";
import { CalendarCheck, Wallet, Users } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-40 overflow-hidden">
        {/* background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

        <div className="relative max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Plan Your <span className="text-primary">Perfect Wedding</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-10">
            Organize tasks, manage vendors, track your budget, and plan your
            dream wedding — all in one beautiful place.
          </p>

          <div className="flex justify-center gap-4">
            <button className="bg-primary text-primary-foreground px-7 py-3 rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition">
              Get Started
            </button>

            <button className="border border-border px-7 py-3 rounded-lg hover:bg-muted transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Everything You Need To Plan
          </h2>
          <p className="text-muted-foreground">
            Our tools make wedding planning simple and stress-free.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <div className="p-8 rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-1 transition">
            <div className="flex justify-center mb-4">
              <CalendarCheck className="w-8 h-8 text-primary" />
            </div>

            <h3 className="text-xl font-semibold mb-3 text-center">
              Task Planner
            </h3>

            <p className="text-muted-foreground text-center">
              Stay organized with a complete checklist of everything needed for
              your big day.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-1 transition">
            <div className="flex justify-center mb-4">
              <Wallet className="w-8 h-8 text-primary" />
            </div>

            <h3 className="text-xl font-semibold mb-3 text-center">
              Budget Tracker
            </h3>

            <p className="text-muted-foreground text-center">
              Keep your wedding finances under control and track every expense
              easily.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-1 transition">
            <div className="flex justify-center mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>

            <h3 className="text-xl font-semibold mb-3 text-center">
              Vendor Manager
            </h3>

            <p className="text-muted-foreground text-center">
              Manage photographers, caterers, and venues all in one beautiful
              dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Start Planning Your Dream Wedding Today
          </h2>

          <p className="text-muted-foreground mb-10">
            Join couples who are organizing their wedding stress-free with our
            simple planning tools.
          </p>

          <button className="bg-primary text-primary-foreground px-10 py-4 rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition">
            <Link href="/auth/signup">Create Free Account</Link>
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Wedding Planner App
      </footer>
    </main>
  );
}
