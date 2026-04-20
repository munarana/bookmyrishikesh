"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  changePercent?: number;
  color: "emerald" | "amber" | "blue" | "purple" | "orange" | "red";
  format?: "currency" | "number" | "text";
  isLoading?: boolean;
}

export function KPICard({
  title,
  value,
  icon,
  changePercent,
  color,
  format = "number",
  isLoading = false,
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(() =>
    typeof value === "number" ? value : 0
  );

  useEffect(() => {
    if (typeof value === "string") {
      return;
    }

    if (isLoading) return;

    const target = value;
    const duration = 1200;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(target * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(target);
      }
    };

    requestAnimationFrame(animate);
  }, [value, isLoading]);

  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  };

  const textClasses = {
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    red: "text-red-600",
  };

  const formatValue = (val: number | string) => {
    if (typeof val === "string") return val;
    if (format === "currency") {
      return `₹${Math.floor(val).toLocaleString()}`;
    }
    if (format === "number") {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card className="bg-white shadow-sm border-none rounded-xl hover:shadow-md transition-all duration-300 hover:scale-105 overflow-hidden group">
      <div className={`h-1 bg-gradient-to-r from-${color}-400 to-${color}-600`} />
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500 mb-2">{title}</p>
            <div className="flex items-baseline gap-2">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 w-32 bg-slate-200 rounded" />
                </div>
              ) : (
                <h3 className="text-4xl font-bold text-slate-900">
                  {typeof value === "string" ? value : formatValue(displayValue)}
                </h3>
              )}
            </div>
          </div>
          <div className={`p-3 ${colorClasses[color]} rounded-lg group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
        </div>

        {changePercent !== undefined && changePercent !== null && (
          <div
            className={`text-xs font-medium mt-4 flex items-center gap-1 ${
              changePercent >= 0 ? `${textClasses[color]}` : "text-red-600"
            }`}
          >
            {changePercent >= 0 ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            {Math.abs(changePercent)}% vs last month
          </div>
        )}
      </CardContent>
    </Card>
  );
}
