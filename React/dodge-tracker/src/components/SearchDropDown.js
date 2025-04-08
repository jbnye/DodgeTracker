import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function SearchDropDown({
  summonerList,
  onClose,
  inputRef,
  style,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef(null);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, inputRef]);

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top: "100%",
        width: "100%",
        border: "1px solid #ddd",
        borderTop: "none",
        borderRadius: "0 0 4px 4px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        zIndex: 1000,
        maxHeight: "300px",
        overflowY: "auto",
      }}
    >
      {summonerList.length === 0 ? (
        <div
          style={{ color: "#9CA3AF", fontSize: "0.9rem", padding: "0.25rem" }}
        >
          <strong>No players found.</strong>
          <div style={{ marginTop: "0.25rem" }}>
            (Players who ahve never been masters will not show up.)
          </div>
        </div>
      ) : (
        <div>
          {summonerList.map((item, index) => (
            <Link
              key={index}
              to={`/player/${item.gameName}-${item.tagLine}`}
              onClick={() => onClose()}
              style={{
                textDecoration: "none",
                color: "white",
                padding: "0.5rem",
                display: "block",
                borderBottom: "1px solid #333",
                backgroundColor: isHovered
                  ? "#737373"
                  : style?.backgroundColor || "rgb(63 63 70)",
                ...style, // Apply alternating background color
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <div>
                  <img
                    src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${item["iconId"]}.jpg`}
                    alt="Profile Icon"
                    style={{ width: "40x", height: "40px" }}
                  />
                </div>
                <div style={{ display: "column", justifyContent: "start" }}>
                  <div style={{ display: "flex", flexWrap: 1 }}>
                    {item["gameName"]}#{item["tagLine"]}
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <img
                      src={getRankImage(item["rank"])}
                      alt="Rank"
                      style={{ width: "20px", height: "20px" }}
                    />
                    {item["leaguePoints"] +
                      " LP  | LVL  " +
                      item["summonerLevel"]}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
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
