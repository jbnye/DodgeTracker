import { useState } from "react";
import DodgeHistoryItem from "./DodgeHistoryItem.js";
import TimePeriodDropDown from "./TimePeriodDropDown";
import PercentageBar from "./PercentageBar.js";

export default function DodgeHistory({
  iconId,
  gameName,
  tagLine,
  dodgeData = {},
  gamesPlayed,
}) {
  const [season, setSeason] = useState("season15");

  const seasons = dodgeData.seasons || {};
  const seasonData = seasons[season] || {};
  const dodgeHistory = seasonData.dodges || [];
  const numOfDodges = dodgeHistory.length;
  const totalLpLost = seasonData.total_lp_lost || 0;
  //const smallDodges = seasonData.small_dodges || 0;

  return (
    <div style={{ marginBottom: "10px" }}>
      <div
        style={{
          backgroundColor: "#2E2E30",
          padding: "5px",
          margin: "auto",
          marginTop: "20px",
          marginBottom: "10px",
          width: "80%",
          borderRadius: "7px",
          fontSize: "20px",
        }}
      >
        <span
          style={{
            marginRight: "10px",
          }}
        >
          Time Period
        </span>
        <TimePeriodDropDown currentSeason={season} onSeasonChange={setSeason} />
      </div>
      <div
        style={{
          display: "flex",
          width: "80%",
          margin: "auto",
          gap: "10px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "column",
            backgroundColor: "#2E2E30",
            width: "30%",
            justifyItems: "left",
            minWidth: "200px",
            padding: "10px",
            flexShrink: 1,
            borderRadius: "4px",
            flexGrow: 0,
            fontSize: "14px",
          }}
        >
          <div
            style={{
              height: "30px",
              width: "100%",
              borderBottom: "1px solid Black",
              fontSize: "20px",
            }}
          >
            Statistics
          </div>
          {dodgeHistory.length === 0 ? (
            <div
              style={{
                padding: "5px",
                justifySelf: "center",
              }}
            >
              No Dodges Found
            </div>
          ) : (
            <>
              <PercentageBar
                total={numOfDodges}
                greenValue={dodgeData["seasons"][season]["small_dodges"]}
              />
              <div>Number of Dodges: {numOfDodges}</div>

              {season === "season15" && (
                <div>
                  Dodge Frequency: 1 Dodge Every{" "}
                  {(gamesPlayed / numOfDodges).toFixed(2)} Games
                </div>
              )}
              <div>LP Lost From Dodging: {totalLpLost} LP</div>
            </>
          )}
        </div>
        <div
          style={{
            backgroundColor: "#2E2E30",
            width: "100%",
            display: "column",
            padding: "10px",
            fontSize: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "30px",
              borderBottom: "1px solid black",
            }}
          >
            Dodge History
          </div>
          {dodgeHistory.length === 0 ? (
            <div style={{ padding: "5px", fontSize: "14px" }}>
              No Dodges Found
            </div>
          ) : (
            dodgeHistory.map((data, index) => (
              <DodgeHistoryItem
                key={index}
                date={data["dodgeDate"]}
                lpLost={data["lpLost"]}
                leaguePoints={data["leaguePoints"]}
                rank={data["rank"]}
                gameName={gameName}
                iconId={iconId}
                tagLine={tagLine}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
