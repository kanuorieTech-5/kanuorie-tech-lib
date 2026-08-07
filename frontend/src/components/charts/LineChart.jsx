import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  YAxis,
  CartesianGrid,
} from "recharts";

import ChartCard from "./ChartCard";

export default function CustomLineChart({
  title,
  subtitle,
  data,
  dataKey,
  xKey,
}) {
  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
    >
      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey={xKey} />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey={dataKey}
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}