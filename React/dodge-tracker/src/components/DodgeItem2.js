import React, { useState } from "react";
import { Link } from "react-router-dom";
import OPGGButton from "./OPGG";
import "./box.css";
export default function DodgeItem2({ item, style, isNew, currentTime }) {
  const [isHovered, setIsHovered] = useState(false);
  console.log(isNew);
  // Functions to toggle hover state
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  let rank_pic = getRankImage(item.rank);

  return (
    <li
      className="di"
      style={{
        display: "grid",
        paddingTop: "5px",
        paddingBottom: "5px",
        gridTemplateColumns: "50% 20% 10% 20%",
        borderBottom: "1px solid black",
        alignItems: "center",
        backgroundColor: isHovered
          ? "#737373"
          : style?.backgroundColor || "rgb(63 63 70)",
        ...style, // Apply alternating background color
        ...(isNew
          ? {
              animation: "slideIn 0.5s ease-in-out",
              opacity: 1,
              transform: "translateY(0)",
            }
          : {}),
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "18px",
          }}
        >
          <img
            src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${item["iconId"]}.jpg`}
            alt="Profile Icon"
            style={{ width: "50px", height: "50px" }}
          />
          <span>{item["gameName"] + "#" + item["tagLine"]}</span>
          <OPGGButton gameName={item["gameName"]} tagLine={item["tagLine"]} />
        </div>
      </Link>
      {/* Middle: Rank Image and LP */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flex: "1",
          fontSize: "16px",
        }}
      >
        <img
          src={rank_pic}
          alt="Rank"
          style={{ width: "40px", height: "40px", marginRight: "10px" }}
        />
        <span>{item.leaguePoints} LP</span>
      </div>
      {/* Middle: LP Lost */}
      <div style={{ flex: "1", textAlign: "center", fontSize: "14px" }}>
        <div className={item.lpLost <= 5 ? "smallDodge" : "bigDodge"}>
          -{item.lpLost} LP
        </div>
      </div>
      {/* Right: Time Difference */}
      <div style={{ flex: "1", textAlign: "end", fontSize: "14px" }}>
        <span className="timeDif">
          {timeDifference(item.dodgeDate, currentTime)}
        </span>
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

function timeDifference(dodgeDate, currentTime) {
  const dodgeTime = new Date(dodgeDate);
  const secondsAgo = Math.floor((currentTime - dodgeTime) / 1000);
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
