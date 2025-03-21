import React, { useState, useEffect } from "react";

export default function DodgeItem2(key, item) {
  //     const [isHovered, setIsHovered] = useState(false);
  //     // Functions to toggle hover state
  //     const handleMouseEnter = () => setIsHovered(true);
  //     const handleMouseLeave = () => setIsHovered(false);
  //     rank_pic = getRankImage(item.rank);
  //   return (
  //     <li
  //       className="di"
  //       style={{
  //         display: "flex", // Flexbox for horizontal layout
  //         alignItems: "center", // Center align items vertically
  //         padding: "16px", // Padding around the item
  //         borderBottom: "2px solid black", // Notable bottom border
  //         backgroundColor: isHovered
  //           ? "#737373"
  //           : style?.backgroundColor || "#858484",
  //         cursor: "pointer", // Add pointer cursor for hover effect
  //         ...style, // Apply alternating background color
  //       }}
  //       onMouseEnter={handleMouseEnter}
  //       onMouseLeave={handleMouseLeave}
  //     >
  //       {/* Left: Summoner Icon and Name */}
  //       <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
  //         <img
  //           src={
  //             "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/" +
  //             item.iconId +
  //             ".jpg"
  //           }
  //           alt={"Profile Icon"}
  //           style={{
  //             width: "50px",
  //             height: "50px",
  //             marginRight: "10px",
  //           }}
  //         />
  //         <span style={{ fontWeight: "bold" }}>{gameName + "#" + tagLine}</span>
  //       </div>
  //       {/* Middle: Rank Image and LP */}
  //       <div style={{ display: "flex", alignItems: "center", flex: "1" }}>
  //         <img
  //           src={rank_pic}
  //           alt="Rank"
  //           style={{ width: "40px", height: "40px", marginRight: "10px" }}
  //         />
  //         <span>{item.leaguePoints} LP</span>
  //       </div>
  //       {/* Middle: LP Lost */}
  //       <div style={{ flex: "1", textAlign: "center" }}>
  //         <span>-{item.lpLost} LP</span>
  //       </div>
  //       {/* Right: Time Difference */}
  //       <div style={{ flex: "1", textAlign: "right" }}>
  //         <span>{item.timeDifference}</span>
  //       </div>
  //     </li>
  //   );
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
