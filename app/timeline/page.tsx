"use client";

import { useState } from "react";
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
import { CheckCircle2, Circle, AlertCircle, Plus, Search } from "lucide-react";
import { initialTimeline } from "@/lib/wedding-data";

const priorityColors: Record<string, string> = {
  high: "bg-red-100/50 text-red-700 border-red-200",
  medium: "bg-amber-100/50 text-amber-700 border-amber-200",
  low: "bg-blue-100/50 text-blue-700 border-blue-200",
};

const statusIcons: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  "in-progress": <AlertCircle className="h-5 w-5 text-primary" />,
  pending: <Circle className="h-5 w-5 text-muted-foreground" />,
};

export default function TimelinePage() {
  const [tasks, setTasks] = useState(initialTimeline);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const categories = [...new Set(tasks.map((t) => t.category))];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || task.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    pending: tasks.filter((t) => t.status === "pending").length,
  };

  const months = ["", "January", "February", "March", "April", "May", "June"];
  const timelineByMonth = months.map((month) => ({
    month,
    tasks: filteredTasks.filter((task) => {
      if (!month) return false;
      const monthNum = months.indexOf(month);
      const taskMonth = new Date(task.dueDate).getMonth() + 1;
      return taskMonth === monthNum;
    }),
  }));

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="heading-elegant">Wedding Timeline</h1>
          <p className="heading-sub">Plan and track all your wedding tasks</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="wedding-card p-4">
            <p className="text-xs text-muted-foreground">Total Tasks</p>
            <p className="mt-2 text-2xl font-serif font-bold text-foreground">
              {stats.total}
            </p>
          </div>
          <div className="wedding-card p-4 border-green-200/50">
            <p className="text-xs text-green-700">Completed</p>
            <p className="mt-2 text-2xl font-serif font-bold text-green-700">
              {stats.completed}
            </p>
          </div>
          <div className="wedding-card p-4 border-primary/20">
            <p className="text-xs text-primary">In Progress</p>
            <p className="mt-2 text-2xl font-serif font-bold text-primary">
              {stats.inProgress}
            </p>
          </div>
          <div className="wedding-card p-4 border-yellow-200/50">
            <p className="text-xs text-yellow-700">Pending</p>
            <p className="mt-2 text-2xl font-serif font-bold text-yellow-700">
              {stats.pending}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 flex-1 md:flex-row md:gap-2">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter by Category */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter by Status */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        {/* Timeline View */}
        <div className="space-y-6">
          {timelineByMonth
            .filter((t) => t.month)
            .map((monthData) =>
              monthData.tasks.length > 0 ? (
                <div key={monthData.month} className="space-y-4">
                  <h2 className="font-serif text-lg font-semibold text-foreground">
                    {monthData.month}
                  </h2>

                  <div className="space-y-3">
                    {monthData.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="wedding-card p-4 flex gap-4 items-start hover:shadow-md transition-shadow">
                        <div className="mt-1">{statusIcons[task.status]}</div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3
                                className={`font-medium ${
                                  task.status === "completed"
                                    ? "text-muted-foreground line-through"
                                    : "text-foreground"
                                }`}>
                                {task.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {task.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(task.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {task.category}
                            </span>
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full border ${
                                priorityColors[task.priority]
                              }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>

                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null,
            )}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No tasks match your filters
              </p>
            </div>
          )}
        </div>

        {/* Progress Overview */}
        <div className="wedding-card p-6">
          <h2 className="font-serif text-lg font-semibold text-foreground mb-6">
            Completion Progress
          </h2>
          <div className="space-y-4">
            {[
              {
                label: "Overall",
                completed: stats.completed,
                total: stats.total,
              },
              {
                label: "High Priority",
                completed: tasks.filter(
                  (t) => t.priority === "high" && t.status === "completed",
                ).length,
                total: tasks.filter((t) => t.priority === "high").length,
              },
              {
                label: "This Month",
                completed: tasks.filter(
                  (t) =>
                    new Date(t.dueDate).getMonth() === new Date().getMonth() &&
                    t.status === "completed",
                ).length,
                total: tasks.filter(
                  (t) =>
                    new Date(t.dueDate).getMonth() === new Date().getMonth(),
                ).length,
              },
            ].map((item) => {
              const percentage =
                item.total > 0
                  ? Math.round((item.completed / item.total) * 100)
                  : 0;
              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.completed}/{item.total}
                    </p>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
