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
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifySelf: "center",
            marginRight: "10px",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-calendar-days size-6"
          >
            <path d="M8 2v4"></path>
            <path d="M16 2v4"></path>
            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
            <path d="M3 10h18"></path>
            <path d="M8 14h.01"></path>
            <path d="M12 14h.01"></path>
            <path d="M16 14h.01"></path>
            <path d="M8 18h.01"></path>
            <path d="M12 18h.01"></path>
            <path d="M16 18h.01"></path>
          </svg>
          <span>Time Period</span>
          <TimePeriodDropDown
            currentSeason={season}
            onSeasonChange={setSeason}
          />
        </div>
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
              display: "flex",
              height: "30px",
              width: "100%",
              borderBottom: "1px solid Black",
              fontSize: "20px",
              gap: "5px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-chart-no-axes-combined size-6"
            >
              <path d="M12 16v5"></path>
              <path d="M16 14v7"></path>
              <path d="M20 10v11"></path>
              <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"></path>
              <path d="M4 18v3"></path>
              <path d="M8 14v7"></path>
            </svg>
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
                  {(gamesPlayed / numOfDodges).toFixed(1)} Games
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
              display: "flex",
              width: "100%",
              height: "30px",
              borderBottom: "1px solid black",
              gap: "5px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-binoculars size-6"
            >
              <path d="M10 10h4"></path>
              <path d="M19 7V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3"></path>
              <path d="M20 21a2 2 0 0 0 2-2v-3.851c0-1.39-2-2.962-2-4.829V8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2z"></path>
              <path d="M 22 16 L 2 16"></path>
              <path d="M4 21a2 2 0 0 1-2-2v-3.851c0-1.39 2-2.962 2-4.829V8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2z"></path>
              <path d="M9 7V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3"></path>
            </svg>
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
