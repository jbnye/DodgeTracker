import { useState } from "react";
import "./DropDown.css";
export default function TimePeriodDropDown({
  currentSeason,
  onSeasonChange,
  style,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleChange = (e) => {
    onSeasonChange(e.target.value);
  };

  return (
    <select
      value={currentSeason}
      onChange={handleChange}
      style={{
        fontSize: "16px",
        color: "#FAFAFA",
        borderRadius: "8px",
        padding: "5px",
        cursor: "pointer",
        height: "100%",
        backgroundColor: isHovered
          ? "#858484"
          : style?.backgroundColor || "rgba(0, 0, 0, 0.9)",
        ...style, // Apply alternating background color
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="custom-select"
    >
      <option value="season15">Season 15</option>
      <option value="season14">Season 14</option>
      <option value="all">All</option>
    </select>
  );
}
