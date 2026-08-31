import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";

import ChartCard from "./ChartCard";

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#ef4444", "#8b5cf6"];

export default function CustomPieChart({ title, subtitle, data }) {
  return (
    <ChartCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={120}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
