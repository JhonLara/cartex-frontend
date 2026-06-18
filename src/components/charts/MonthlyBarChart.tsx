"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { day: 1, value: 50000000 },
  { day: 2, value: 55000000 },
  { day: 3, value: 48000000 },
  { day: 4, value: 70000000 },
  { day: 5, value: 60000000 },
  { day: 6, value: 90000000 },
  { day: 7, value: 85000000 },
  { day: 8, value: 110000000 },
  { day: 9, value: 105000000 },
  { day: 10, value: 130000000 },
  { day: 11, value: 125000000 },
  { day: 12, value: 150000000 },
  { day: 13, value: 140000000 },
  { day: 14, value: 170000000 },
  { day: 15, value: 165000000 },
  { day: 16, value: 200000000 },
  { day: 17, value: 190000000 },
  { day: 18, value: 220000000 },
  { day: 19, value: 210000000 },
  { day: 20, value: 250000000 },
  { day: 21, value: 240000000 },
  { day: 22, value: 280000000 },
  { day: 23, value: 300000000 },
  { day: 24, value: 320000000 },
  { day: 25, value: 350000000 },
  { day: 26, value: 380000000 },
  { day: 27, value: 400000000 },
  { day: 28, value: 420000000 },
  { day: 29, value: 450000000 },
  { day: 30, value: 480000000 },
  { day: 31, value: 520000000 },
];

export default function MonthlyBarChart() {
  const formatY = (v: number) => {
    if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(0) + "M";
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(0) + "M";
    return v.toString();
  };

  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={data} barCategoryGap="20%" margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          interval={4}
        />
        <YAxis
          tickFormatter={formatY}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          width={70}
        />
        <Tooltip
          formatter={(value: any) => ["$" + Number(value).toLocaleString("es-CO"), "Recaudo"]}
          labelFormatter={(label: any) => `Día ${label}`}
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
