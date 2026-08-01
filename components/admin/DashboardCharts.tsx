"use client";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar,
} from "recharts";

const tooltipStyle = {
  background: "#111A38", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, color: "#e2e8f0",
};

export function TrendChart({ data, dataKey, color, title }: { data: any[]; dataKey: string; color: string; title: string }) {
  return (
    <div className="glass rounded-2xl p-5 shadow-card">
      <h3 className="mb-4 text-sm font-bold text-slate-300">{title}</h3>
      <div className="h-56" dir="ltr">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`g-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} width={40} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#g-${dataKey})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function FunnelChart({ data }: { data: { stage: string; value: number }[] }) {
  return (
    <div className="glass rounded-2xl p-5 shadow-card">
      <h3 className="mb-4 text-sm font-bold text-slate-300">قمع التحويل</h3>
      <div className="h-56" dir="ltr">
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical">
            <XAxis type="number" stroke="#64748b" fontSize={11} />
            <YAxis type="category" dataKey="stage" stroke="#94a3b8" fontSize={11} width={90} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" fill="#7C3AED" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
