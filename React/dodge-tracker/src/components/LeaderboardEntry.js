import React, { useState } from "react";

export default function LeaderboardEntry({ rank, player, style }) {
  const [isHovered, setIsHovered] = useState(false);
  // Functions to toggle hover state
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      className="leaderboardEntry"
      style={{
        display: "grid",
        gridTemplateColumns: "0.25fr 2.5fr 0.7fr 0.7fr",
        borderBottom: "1px solid black",
        fontSize: "26px",
        alignItems: "center",
        backgroundColor: isHovered
          ? "#737373"
          : style?.backgroundColor || "#858484",
        ...style, // Apply alternating background color
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ display: "flex", justifySelf: "center" }}>{rank}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${player.iconId}.jpg`}
          alt="Profile Icon"
          style={{ width: "50px", height: "50px" }}
        />
        <span>{player.gameName + "#" + player.tagLine}</span>
        <button
          onClick={() =>
            window.open(
              `https://www.op.gg/summoners/na/${player["gameName"]}-${player["tagLine"]}`,
              "_blank"
            )
          }
          style={{
            cursor: "pointer",
            background: "#FED700",
          }}
        >
          OP.GG
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={getRankImage(player.rank)}
          alt="Profile Icon"
          style={{
            height: "40px",
            width: "40px",
          }}
        />
        {player.leaguePoints}
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {player.totalDodges} dodges
      </div>
    </div>
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
