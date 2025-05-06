import { useState } from "react";
export default function SearchDropDownItem({ item, style }) {
  const [isHovered, setIsHovered] = useState(false);
  //const handleMouseEnter = () => setIsHovered(true);
  //const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        padding: "0.5rem",
        //display: "block",
        borderBottom: "1px solid #333",
        backgroundColor: isHovered
          ? "#737373"
          : style?.backgroundColor || "rgb(39, 39, 42)",
        ...style, // Apply alternating background color
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
          {item["rank"] !== "demoted" ? (
            <>
              <img
                src={getRankImage(item["rank"])}
                alt="Rank"
                style={{ width: "20px", height: "20px" }}
              />
              {item["leaguePoints"] + " LP | LVL " + item["summonerLevel"]}
            </>
          ) : (
            <>{"LVL " + item["summonerLevel"]}</>
          )}
        </div>
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
