import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

import ChartCard from "./ChartCard";

export default function CustomRadarChart({ title, subtitle, data }) {
  return (
    <ChartCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data}>
          <PolarGrid />

          <PolarAngleAxis dataKey="subject" />

          <PolarRadiusAxis />

          <Radar dataKey="value" fillOpacity={0.5} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
