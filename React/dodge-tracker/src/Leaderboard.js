import "./App.css";
import React from "react";
import LeaderboardTable from "./components/leaderboardTable.js";
import "./index.css";
import DodgeList from "./components/DodgeList.js"; // Adjust the path if necessary

export default function Leaderboard() {
  return (
    <>
      <h1>NA DODGE LEADERBOARD</h1>
      <hr></hr>
      <LeaderboardTable />
    </>
  );
}
