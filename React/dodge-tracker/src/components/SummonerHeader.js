import React, { useState } from "react";
import DodgeHistoryGraph from "./DodgeHistoryGraph.js";

export default function SummonerHeader({
  summonerData,
  dodgeData,
  gameName,
  tagLine,
  rank_image,
  style,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      style={{
        backgroundColor: "red",
        width: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          backgroundColor: "grey",
          //width: "50%",
          gap: "10px",
          //alignItems: "center",
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${summonerData["iconId"]}.jpg`}
            alt="Profile Icon"
            style={{ width: "120px", height: "120px" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "0",
              right: "40%",
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              borderRadius: "7px",
              color: "white",
              padding: "2px",
            }}
          >
            {summonerData["summonerLevel"]}
          </div>
        </div>
        <div
          style={{
            display: "column",
            backgroundColor: "green",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              display: "flex",
            }}
          >
            {gameName + "#" + tagLine}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "20px",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <img
              src={`${rank_image}`}
              alt="Rank Icon"
              style={{ width: "40px", height: "40px" }}
            />
            <span style={{}}>{summonerData["leaguePoints"]}</span>
          </div>
          <div style={{ display: "flex", marginTop: "10px" }}>
            <button
              href={`https://www.op.gg/summoners/na/${gameName}-${tagLine}`}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "white",
                borderRadius: "6px",
                cursor: "pointer",
                backgroundColor: isHovered
                  ? "#858484"
                  : style?.backgroundColor || "rgba(0, 0, 0, 0.9)",
                ...style, // Apply alternating background color
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              OP.GG
            </button>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "300px",
          height: "300px",
          display: "flex",
          backgroundColor: "orange",
        }}
      >
        <DodgeHistoryGraph dodgeData={dodgeData} />
      </div>
    </div>
  );
}
