import React from "react";
import { Tooltip } from "react-tooltip";

export default function DodgeRank({ dodgeRank }) {
  console.log(dodgeRank);
  if (!dodgeRank) {
    return <div className="rank-loading">Loading rank data...</div>;
  }
  if (dodgeRank.rank > dodgeRank.totalPlayers) {
    return <div>No dodge ladder rank.</div>;
  }

  return (
    <div
      style={{
        backgroundColor: "rgb(63 63 70)",
        justifySelf: "center",
        padding: "5px",
      }}
    >
      <button
        className="tooltip-anchor-button"
        data-tooltip-id="dodgeRank-tooltip"
        aria-describedby="dodgeRank-tooltip"
        style={{
          color: "#FAFAFA",
          border: "none",
          background: "none",
          padding: 0,
          cursor: "pointer",
          display: "block", // Add this
        }}
      >
        Dodge Ladder Rank {dodgeRank?.rank}{" "}
        {"(" + dodgeRank?.rank_percentile + "% of top)"}
      </button>
      <Tooltip id="dodgeRank-tooltip" style={{ zIndex: 1000 }}>
        <div
          style={{
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            alignItems: "flex-start",
          }}
        >
          <p
            style={{
              margin: 0,
              padding: 0,
              textAlign: "left",
              whiteSpace: "normal",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              textIndent: 0,
              hangingPunctuation: "none",
            }}
          >
            Rank in the Dodge Leaderboard of all players with at least one Dodge
            in Master+ in the same region and current split.
          </p>
          <div>{"Rank: " + dodgeRank.rank}</div>
          <div>{"Total Accounts: " + dodgeRank.totalPlayers}</div>
        </div>
      </Tooltip>
    </div>
  );
}
