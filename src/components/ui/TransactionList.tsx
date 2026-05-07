"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Home,
  ShoppingCart,
  Utensils,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/motion/motion-primitives";

const transactions = [
  { id: 1, name: "Apple Store", category: "Technology", amount: -1999, date: "Today", icon: ShoppingCart, color: "bg-blue-500" },
  { id: 2, name: "Salary", category: "Income", amount: 8500, date: "Yesterday", icon: DollarSign, color: "bg-emerald-500" },
  { id: 3, name: "Uber Eats", category: "Food", amount: -65.4, date: "2 days ago", icon: Utensils, color: "bg-orange-500" },
  { id: 4, name: "Monthly Rent", category: "Housing", amount: -1200, date: "3 days ago", icon: Home, color: "bg-indigo-500" },
];

export default function TransactionList() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
        <Button variant="link" size="sm" className="h-auto p-0">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <Stagger className="flex flex-col gap-2">
          {transactions.map((t) => (
            <StaggerItem
              key={t.id}
              className="group flex cursor-pointer items-center justify-between rounded-xl border border-transparent p-3 transition-colors hover:border-border hover:bg-muted/40"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex size-11 items-center justify-center rounded-xl text-white shadow-sm",
                    t.color
                  )}
                >
                  <t.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.category} · {t.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "font-semibold tabular-nums",
                    t.amount > 0 ? "text-emerald-500" : "text-foreground"
                  )}
                >
                  {t.amount > 0 ? "+" : ""}
                  {t.amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
                <div className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                  {t.amount > 0 ? (
                    <ArrowUpRight size={12} className="text-emerald-500" />
                  ) : (
                    <ArrowDownLeft size={12} className="text-rose-500" />
                  )}
                  Success
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </CardContent>
    </Card>
  );
}
