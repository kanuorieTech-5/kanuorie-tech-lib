import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import ChartCard from "./ChartCard";

export default function CustomAreaChart({
  title,
  subtitle,
  data,
  dataKey,
  xKey,
}) {
  return (
    <ChartCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey={xKey} />

          <YAxis />

          <Tooltip />

          <Area type="monotone" dataKey={dataKey} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
