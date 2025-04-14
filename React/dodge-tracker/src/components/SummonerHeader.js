import DodgeHistoryGraph from "./DodgeHistoryGraph.js";
import OPGGButton from "./OPGG.js";

export default function SummonerHeader({
  summonerData,
  dodgeData,
  gameName,
  tagLine,
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
            <span style={{}}>{summonerData["leaguePoints"]} LP</span>
          </div>
          <div style={{ display: "flex", marginTop: "10px" }}>
            <OPGGButton gameName={gameName} tagLine={tagLine} />
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
