import React, { useState } from "react";

const rankIcons = {
  challenger:
    "https://leagueoflegends.fandom.com/wiki/Rank_(League_of_Legends)?file=Season_2023_-_Challenger.png",
  grandmaster:
    "https://leagueoflegends.fandom.com/wiki/Rank_(League_of_Legends)?file=Season_2023_-_Grandmaster.png",
  master:
    "https://leagueoflegends.fandom.com/wiki/Rank_(League_of_Legends)?file=Season_2023_-_Master.png",
};

const DodgeItem = ({
  image,
  name,
  rankImage,
  lp,
  dodgeAmount,
  timeDifference,
  style, // Accept style prop for alternating backgrounds
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Functions to toggle hover state
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <li
      className="di"
      style={{
        display: "flex", // Flexbox for horizontal layout
        alignItems: "center", // Center align items vertically
        padding: "16px", // Padding around the item
        borderBottom: "2px solid black", // Notable bottom border
        backgroundColor: isHovered
          ? "#737373"
          : style?.backgroundColor || "#858484",
        cursor: "pointer", // Add pointer cursor for hover effect
        ...style, // Apply alternating background color
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left: Summoner Icon and Name */}
      <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
        <img
          src={image}
          alt={name}
          style={{
            width: "50px",
            height: "50px",
            marginRight: "10px",
          }}
        />
        <span style={{ fontWeight: "bold" }}>{name}</span>
      </div>

      {/* Middle: Rank Image and LP */}
      <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
        <img
          src={rankImage}
          alt="Rank"
          style={{ width: "40px", height: "40px", marginRight: "10px" }}
        />
        <span>{lp} LP</span>
      </div>

      {/* Middle: LP Lost */}
      <div style={{ flex: "1", textAlign: "center" }}>
        <span>-{dodgeAmount} LP</span>
      </div>

      {/* Right: Time Difference */}
      <div style={{ flex: "1", textAlign: "right" }}>
        <span>{timeDifference}</span>
      </div>
    </li>
  );
};

export default DodgeItem;
