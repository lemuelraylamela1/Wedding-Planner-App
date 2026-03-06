"use client";

import { useMemo } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, TrendingUp, AlertCircle } from "lucide-react";
import { initialBudget } from "@/lib/wedding-data";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function BudgetPage() {
  const budgets = initialBudget;
  const [searchTerm, setSearchTerm] = useMemo(() => ["", (s: string) => s], []);

  const totalBudget = budgets.reduce((sum, b) => sum + b.budgeted, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remaining = totalBudget - totalSpent;
  const percentageSpent = Math.round((totalSpent / totalBudget) * 100);

  const chartData = budgets.map((b) => ({
    category: b.category,
    budgeted: b.budgeted,
    spent: b.spent,
  }));

  const pieData = budgets.map((b) => ({
    name: b.category,
    value: b.spent,
  }));

  const colors = [
    "#d4776e",
    "#e8b4a8",
    "#d4a574",
    "#c9a570",
    "#b8956a",
    "#a68b6d",
    "#9a8370",
  ];

  const filteredBudgets = budgets.filter((budget) =>
    budget.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const overBudgetCategories = budgets.filter((b) => b.spent > b.budgeted);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="heading-elegant">Wedding Budget</h1>
          <p className="heading-sub">
            Track expenses and manage your wedding budget
          </p>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="wedding-card p-6">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="mt-2 text-3xl font-serif font-bold text-foreground">
              ${totalBudget.toLocaleString()}
            </p>
          </div>
          <div className="wedding-card p-6 border-primary/20">
            <p className="text-sm text-primary">Amount Spent</p>
            <p className="mt-2 text-3xl font-serif font-bold text-primary">
              ${totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="wedding-card p-6 border-green-200/50">
            <p className="text-sm text-green-700">Remaining</p>
            <p className="mt-2 text-3xl font-serif font-bold text-green-700">
              ${remaining.toLocaleString()}
            </p>
          </div>
          <div className="wedding-card p-6">
            <p className="text-sm text-muted-foreground">Spent (%)</p>
            <p className="mt-2 text-3xl font-serif font-bold text-foreground">
              {percentageSpent}%
            </p>
          </div>
        </div>

        {/* Warnings */}
        {overBudgetCategories.length > 0 && (
          <div className="rounded-lg border border-red-200/50 bg-red-50/50 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Over Budget Alert</p>
              <p className="text-sm text-red-700 mt-1">
                {overBudgetCategories.map((c) => c.category).join(", ")} have
                exceeded their budgets.
              </p>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Budgeted vs Spent Bar Chart */}
          <div className="wedding-card p-6">
            <h2 className="font-serif text-lg font-semibold text-foreground mb-4">
              Budget Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="category"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="budgeted"
                  fill="var(--accent)"
                  name="Budgeted"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="spent"
                  fill="var(--primary)"
                  name="Spent"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Spent by Category Pie Chart */}
          <div className="wedding-card p-6">
            <h2 className="font-serif text-lg font-semibold text-foreground mb-4">
              Spending Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#d4776e"
                  dataKey="value">
                  {pieData.map((_, index) => (
                    <g key={`cell-${index}`}></g>
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Categories Table */}
        <div className="wedding-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold text-foreground">
              Budget Categories
            </h2>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                    Budgeted
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                    Spent
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                    Remaining
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredBudgets.map((budget) => {
                  const isOverBudget = budget.spent > budget.budgeted;
                  const remaining = budget.budgeted - budget.spent;
                  const percentageSpent = Math.round(
                    (budget.spent / budget.budgeted) * 100,
                  );

                  return (
                    <tr
                      key={budget.id}
                      className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground">
                          {budget.category}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm font-medium text-foreground">
                          ${budget.budgeted.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p
                          className={`text-sm font-medium ${
                            isOverBudget ? "text-red-600" : "text-foreground"
                          }`}>
                          ${budget.spent.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p
                          className={`text-sm font-medium ${
                            isOverBudget ? "text-red-600" : "text-green-600"
                          }`}>
                          ${remaining.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                isOverBudget ? "bg-red-500" : "bg-primary"
                              }`}
                              style={{
                                width: `${Math.min(percentageSpent, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {percentageSpent}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Tips */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="wedding-card p-6">
            <div className="flex gap-3">
              <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-foreground">Largest Expense</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Catering represents {Math.round((15000 / totalSpent) * 100)}%
                  of your spending
                </p>
              </div>
            </div>
          </div>

          <div className="wedding-card p-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-foreground">
                  Savings Opportunity
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You have ${remaining.toLocaleString()} flexibility in your
                  remaining budget
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
