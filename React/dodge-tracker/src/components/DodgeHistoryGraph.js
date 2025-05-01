import { BarChart, Bar, XAxis, LabelList, ResponsiveContainer } from "recharts";
import React from "react";

export default function DodgeHistoryGraph({ dodgeData }) {
  const data = [
    {
      time: "Last 30 Days",
      value: dodgeData?.time_periods?.this_month?.length || 0,
      //displayValue: (dodgeData?.time_periods?.this_month || 0) + 0.5,
    },
    {
      time: "Last 7 Days",
      value: dodgeData?.time_periods?.this_week?.length || 0,
      // displayValue: (dodgeData?.time_periods?.this_week || 0) + 0.5,
    },
    {
      time: "Last 24 Hours",
      value: dodgeData?.time_periods?.today?.length || 0,
      //displayValue: (dodgeData?.time_periods?.today || 0) + 0.5,
    },
  ];
  const CustomLabel = ({ x, y, width, height, value }) => {
    const isZero = value === 0;
    return (
      <text
        x={x + width / 2}
        y={isZero ? y - 5 : y + height / 2}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={14}
      >
        {value}
      </text>
    );
  };
  //console.log("Chart Data:", JSON.stringify(data, null, 2));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis
          dataKey="time"
          tick={{
            fill: "white", // Tick text color
            fontSize: 12,
          }}
          axisLine={{
            stroke: "#27272A", // Axis line color
          }}
          tickLine={{
            stroke: "#27272A", // Tick line color
          }}
        />
        {/* <Tooltip /> */}
        <Bar dataKey="value" fill="#27272A">
          <LabelList content={<CustomLabel />} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
