import DodgeHistoryGraph from "./DodgeHistoryGraph.js";
import OPGGButton from "./OPGG.js";
import { Tooltip } from "react-tooltip";

export default function SummonerHeader({
  summonerData,
  dodgeData,
  gameName,
  tagLine,
  region,
  rank_image,
  style,
}) {
  return (
    <div
      style={{
        height: "240px",
        width: "50%",
        display: "flex",
        justifyContent: "space-between", // separate both halves
        alignItems: "center", // align top of image and chart
        minWidth: "800px", // Add minimum width to prevent squeezing
      }}
    >
      <div
        style={{
          display: "flex",
          //backgroundColor: "grey",
          //width: "50%",
          gap: "10px",
          justifyContent: "center", // center content horizontally
          alignItems: "flex-start", // align icon top with chart
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${summonerData["iconId"]}.jpg`}
            alt="Profile Icon"
            style={{
              width: "120px",
              height: "120px",
              paddingBottom: "10px",
              borderRadius: "7px",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "5px",
              right: "40%",
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              opacity: ".8",
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
            //backgroundColor: "green",
            gap: "10px",
          }}
        >
          <div
            style={{
              fontSize: "24px",
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
            {summonerData["rank"] !== "demoted" ? (
              <>
                <img
                  src={getRankImage(summonerData["rank"])}
                  alt="Rank Icon"
                  style={{ width: "40px", height: "40px" }}
                />
                <span style={{}}>{summonerData["leaguePoints"]} LP</span>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  alignContent: "center",
                  gap: "5px",
                }}
              >
                <button
                  data-tooltip-id="demoted"
                  data-tooltip-place="bottom"
                  data-tooltip-delay-show={300}
                  style={{
                    color: "#FAFAFA",
                    border: "none",
                    background: "none",
                    padding: 0,
                    cursor: "pointer",
                    display: "block", // Add this
                    alignSelf: "center",
                    marginTop: "6px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="info-icon"
                    marginTop="10px"
                    style={{ alignSelf: "center" }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </button>
                <Tooltip id="demoted" style={{ zIndex: 1000 }} opacity={100}>
                  <div style={{ display: "column" }}>
                    <div style={{ maxWidth: "200px" }}>
                      Demoted: This player has demoted from master. The account
                      is kept in the database because they have been master+ in
                      the past.
                    </div>
                  </div>
                </Tooltip>
                <span>Demoted</span>
              </div>
            )}
          </div>
          <div style={{ display: "flex", marginTop: "10px" }}>
            <OPGGButton gameName={gameName} tagLine={tagLine} region={region} />
          </div>
        </div>
      </div>
      <div
        style={{
          width: "50%",
          display: "flex",
          justifyContent: "center", // center chart horizontally
          alignItems: "flex-start", // align top with icon
        }}
      >
        <div
          style={{
            width: "100%", // or "80%" if you want some margin
            height: "150px", // reduce height to better match icon
            position: "relative",
            overflow: "visible",
            justifyContent: "flex-end",
          }}
        >
          <DodgeHistoryGraph dodgeData={dodgeData} />
        </div>
      </div>
    </div>
  );
}

const getRankImage = (rank) => {
  if (rank === "demoted") rank = "master";
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
