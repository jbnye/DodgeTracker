import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import React from "react";

export default function DodgeHistoryGraph({ dodgeData }) {
  const data = [
    {
      time: "Last 30 Days",
      value: dodgeData?.time_periods?.this_month?.length || 0,
    },
    {
      time: "Last 7 Days",
      value: dodgeData?.time_periods?.this_week?.length || 0,
    },
    {
      time: "Last 24 Hours",
      value: dodgeData?.time_periods?.today?.length || 0,
    },
  ];
  console.log(dodgeData?.time_periods?.this_month);
  return (
    <ResponsiveContainer width="100%" height="300px">
      <BarChart data={data}>
        <XAxis dataKey="time" tick={{ fontSize: 14 }} />
        <YAxis hide />
        <Tooltip />
        <Bar
          dataKey="value"
          fill="#8884d8"
          barSize={50}
          label={{ position: "top", fill: "black" }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
