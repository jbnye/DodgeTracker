import "./App.css";
import React from "react";
import Navbar from "./components/navbar.js";
import LeaderboardTable from "./components/leaderboardTable.js";
import "./index.css";
import DodgeList from "./components/DodgeList.js"; // Adjust the path if necessary

export default function () {
  return (
    <>
      <Navbar />
      <h1>NA DODGE LEADERBOARD</h1>
      <hr></hr>
      <LeaderboardTable />
    </>
  );
}
