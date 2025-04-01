import React from "react";
import LeaderboardTable from "./components/leaderboardTable.js";
import "./index.css";

export default function Leaderboard() {
  return (
    <>
      <h1>NA DODGE LEADERBOARD</h1>
      <hr></hr>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignContet: "center",
        }}
      >
        <LeaderboardTable />
      </div>
    </>
  );
}
