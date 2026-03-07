"use client";

import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Lock, User, Download, Trash2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Settings {
  id: string;
  groomsName: string;
  bridesName: string;
  weddingDate: Date;
  weddingVenue: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<Settings>();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <AppLayout>
      <div className="space-y-8 max-w-3xl">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="heading-elegant">Settings</h1>
          <p className="heading-sub">Manage your wedding planner preferences</p>
        </div>

        {/* Account Settings */}
        <div className="wedding-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h2 className="font-serif text-lg font-semibold text-foreground">
              Account Settings
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Groom&apos;s Name
              </label>
              <Input placeholder="Groom" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Bride&apos;s Name
              </label>
              <Input placeholder="Bride" className="mt-2" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Wedding Date
              </label>
              <Input type="date" defaultValue="2024-06-15" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Wedding Venue
              </label>
              <Input defaultValue="Riverside Manor" className="mt-2" />
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white mt-4">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Notifications */}
        <div className="wedding-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h2 className="font-serif text-lg font-semibold text-foreground">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">
                  Push Notifications
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive reminders for upcoming tasks and events
                </p>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationsEnabled ? "bg-primary" : "bg-muted"
                }`}>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationsEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">
                  Email Notifications
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Send email updates about important dates
                </p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? "bg-primary" : "bg-muted"
                }`}>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Guest RSVP Alerts</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Be notified when guests respond to invitations
                </p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Theme & Preferences */}
        <div className="wedding-card p-6">
          <h2 className="font-serif text-lg font-semibold text-foreground mb-6">
            Theme & Preferences
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Color Theme
              </label>
              <Select defaultValue="rose-gold">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rose-gold">Rose Gold (Default)</SelectItem>
                  <SelectItem value="blush-pink">Blush Pink</SelectItem>
                  <SelectItem value="champagne">Champagne</SelectItem>
                  <SelectItem value="navy">Navy & Gold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Display Mode
              </label>
              <Select defaultValue="auto">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Mode</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                  <SelectItem value="auto">Auto (System)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Date Format
              </label>
              <Select defaultValue="us">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">MM/DD/YYYY</SelectItem>
                  <SelectItem value="eu">DD/MM/YYYY</SelectItem>
                  <SelectItem value="iso">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="bg-primary hover:bg-primary/90 text-white mt-4">
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="wedding-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h2 className="font-serif text-lg font-semibold text-foreground">
              Privacy & Security
            </h2>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Lock className="mr-2 h-4 w-4" />
              Two-Factor Authentication
            </Button>
          </div>
        </div>

        {/* Data Management */}
        <div className="wedding-card p-6">
          <h2 className="font-serif text-lg font-semibold text-foreground mb-6">
            Data Management
          </h2>

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Export All Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Download Guest List CSV
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Download Budget Report
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="wedding-card p-6 border-red-200/50">
          <h2 className="font-serif text-lg font-semibold text-red-700 mb-6">
            Danger Zone
          </h2>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All Data
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
