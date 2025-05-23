import { useState } from "react";
export default function OPGGButton({ gameName, tagLine, style, region }) {
  const [isHovered, setIsHovered] = useState(false);
  // Functions to toggle hover state
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(
          `https://www.op.gg/summoners/${region}/${gameName}-${tagLine}`,
          "_blank"
        );
      }}
      style={{
        cursor: "pointer",
        borderRadius: "7px",
        padding: "5px",
        color: "#FAFAFA",
        backgroundColor: isHovered
          ? "#6c6c7a"
          : style?.backgroundColor || "#041c1f",
        ...style, // Apply alternating background color
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      OP.GG
    </button>
  );
}
