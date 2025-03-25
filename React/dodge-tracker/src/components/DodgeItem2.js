import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
export default function DodgeItem2({ item, style, isNew }) {
  const [isHovered, setIsHovered] = useState(false);
  const [time, setTime] = useState(item.dodgeDate);
  console.log(item);
  // Functions to toggle hover state
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  let rank_pic = getRankImage(item.rank);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const animationStyles = {
    animation: "slideIn 0.5s ease-in-out",
    opacity: 1,
    transform: "translateY(0)",
  };

  const initialStyles = {
    opacity: 0,
    transform: "translateY(-20px)",
  };

  return (
    <li
      className="di"
      style={{
        display: "flex", // Flexbox for horizontal layout
        alignItems: "center", // Center align items vertically
        padding: "16px",
        paddingBottom: "8px", // Padding around the item
        borderBottom: "2px solid black", // Notable bottom border
        backgroundColor: isHovered
          ? "#737373"
          : style?.backgroundColor || "#858484",
        ...style, // Apply alternating background color
        ...(isNew ? { ...initialStyles, ...animationStyles } : {}),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={`/player/${item.gameName}-${item.tagLine}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          alignItems: "center",
          flex: "1",
        }}
      >
        {/* Left: Summoner Icon and Name */}
        <div>
          <img
            src={
              "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/" +
              item.iconId +
              ".jpg"
            }
            alt={"Profile Icon"}
            style={{
              width: "50px",
              height: "50px",
              marginRight: "10px",
            }}
          />
          <span style={{ fontWeight: "bold", fontSize: "20px" }}>
            {item.gameName + "#" + item.tagLine}
          </span>
        </div>
      </Link>
      {/* Middle: Rank Image and LP */}
      <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
        <img
          src={rank_pic}
          alt="Rank"
          style={{ width: "40px", height: "40px", marginRight: "10px" }}
        />
        <span>{item.leaguePoints} LP</span>
      </div>
      {/* Middle: LP Lost */}
      <div style={{ flex: "1", textAlign: "center" }}>
        <span>-{item.lpLost} LP</span>
      </div>
      {/* Right: Time Difference */}
      <div style={{ flex: "1", textAlign: "right" }}>
        <span>{timeDifference(item.dodgeDate)}</span>
      </div>
    </li>
  );
}

const getRankImage = (rank) => {
  const rankImages = {
    master:
      "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/master.svg",
    grandmaster:
      "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/grandmaster.svg",
    challenger:
      "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/challenger.svg",
  };
  return rankImages[rank.toLowerCase()];
};

function timeDifference(dodgeDate) {
  const now = new Date();
  const dodgeTime = new Date(dodgeDate);
  const secondsAgo = Math.floor((now - dodgeTime) / 1000);

  if (secondsAgo < 60) {
    return `${secondsAgo}s ago`;
  } else if (secondsAgo < 300) {
    const minutesAgo = Math.floor(secondsAgo / 60);
    const remainingSeconds = secondsAgo % 60;
    return `${minutesAgo}min ${remainingSeconds}s ago`;
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor((secondsAgo % 3600) / 60);
    return `${minutesAgo}min ago`;
  } else if (secondsAgo < 86400) {
    const minutesAgo = Math.floor((secondsAgo % 3600) / 60);
    const hoursAgo = Math.floor(secondsAgo / 3600);
    return `${hoursAgo}h ${minutesAgo}m ago`;
  } else {
    const daysAgo = Math.floor(secondsAgo / 86400);
    return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
  }
}
