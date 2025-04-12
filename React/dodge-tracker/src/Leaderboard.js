import React from "react";
import LeaderboardTable from "./components/leaderboardTable.js";
import { useParams } from "react-router-dom";
import "./index.css";

export default function Leaderboard() {
  const { region } = useParams();
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
        <LeaderboardTable region={region} />
      </div>
    </>
  );
}
