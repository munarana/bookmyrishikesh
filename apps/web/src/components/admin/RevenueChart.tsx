"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MonthlyRevenueData {
  month: string;
  gross: number;
  commission: number;
}

interface RevenueChartProps {
  data: MonthlyRevenueData[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [timeRange, setTimeRange] = useState<"6" | "12" | "all">("12");

  const displayData = data.slice(-12);
  const maxValue = Math.max(...displayData.map((d) => Math.max(d.gross, d.commission)));
  const chartHeight = 200;
  const barWidth = 40;
  const chartPadding = 20;

  return (
    <Card className="border-none shadow-sm rounded-xl bg-white col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">Revenue Trend</CardTitle>
        <div className="flex gap-2">
          <Button
            variant={timeRange === "6" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("6")}
            className="h-8 text-xs"
          >
            6 months
          </Button>
          <Button
            variant={timeRange === "12" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("12")}
            className="h-8 text-xs"
          >
            12 months
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${displayData.length * (barWidth + 20) + chartPadding * 2} ${chartHeight + 60}`}
            className="w-full min-h-72 mb-4"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = chartHeight - chartHeight * ratio + 40;
              return (
                <g key={`grid-${idx}`}>
                  <line
                    x1={chartPadding}
                    y1={y}
                    x2={displayData.length * (barWidth + 20) + chartPadding}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray="4"
                  />
                  <text
                    x={chartPadding - 10}
                    y={y + 4}
                    fontSize="12"
                    fill="#64748b"
                    textAnchor="end"
                  >
                    ${Math.round((maxValue * ratio) / 1000)}k
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {displayData.map((item, idx) => {
              const x = chartPadding + idx * (barWidth + 20);
              const grossHeight = (item.gross / maxValue) * chartHeight;
              const commissionHeight = (item.commission / maxValue) * chartHeight;

              return (
                <g key={`bar-${idx}`}>
                  {/* Gross Revenue Bar */}
                  <rect
                    x={x}
                    y={chartHeight - grossHeight + 40}
                    width={barWidth / 2 - 2}
                    height={grossHeight}
                    fill="#f97316"
                    rx="4"
                    className="hover:fill-orange-600 transition-colors"
                  />
                  {/* Commission Bar */}
                  <rect
                    x={x + barWidth / 2}
                    y={chartHeight - commissionHeight + 40}
                    width={barWidth / 2 - 2}
                    height={commissionHeight}
                    fill="#10b981"
                    rx="4"
                    className="hover:fill-emerald-600 transition-colors"
                  />
                  {/* Month Label */}
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + 60}
                    fontSize="12"
                    fill="#64748b"
                    textAnchor="middle"
                  >
                    {item.month}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex gap-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span className="text-sm text-slate-600">Gross Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <span className="text-sm text-slate-600">Platform Commission</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
