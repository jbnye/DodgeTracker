import React, { useState } from "react";

const DodgeItem = ({
  rankImage, // Matches the `rank` prop passed in DodgeList
  leaguePoints, // Matches the `leaguePoints` prop
  lpLost, // Matches `lpLost`
  gameName,
  tagLine,
  summonerLevel,
  iconId, // Matches `iconId`
  timeDifference,
  style,
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
          src={
            "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/" +
            iconId +
            ".jpg"
          }
          alt={"Profile Icon"}
          style={{
            width: "50px",
            height: "50px",
            marginRight: "10px",
          }}
        />
        <span style={{ fontWeight: "bold" }}>{gameName + "#" + tagLine}</span>
      </div>

      {/* Middle: Rank Image and LP */}
      <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
        <img
          src={rankImage}
          alt="Rank"
          style={{ width: "40px", height: "40px", marginRight: "10px" }}
        />
        <span>{leaguePoints} LP</span>
      </div>

      {/* Middle: LP Lost */}
      <div style={{ flex: "1", textAlign: "center" }}>
        <span>-{lpLost} LP</span>
      </div>

      {/* Right: Time Difference */}
      <div style={{ flex: "1", textAlign: "right" }}>
        <span>{timeDifference}</span>
      </div>
    </li>
  );
};

export default DodgeItem;
