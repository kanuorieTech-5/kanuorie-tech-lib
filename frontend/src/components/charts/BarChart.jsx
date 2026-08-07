import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

import ChartCard from "./ChartCard";

export default function CustomBarChart({
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
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey={xKey} />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey={dataKey}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}