import React from "react";
import LeaderboardTable from "./components/leaderboardTable.js";
import { useParams } from "react-router-dom";
import { useSocket } from "./SocketContext";
import { ClipLoader } from "react-spinners";
import "./index.css";

export default function Leaderboard() {
  const { region } = useParams();
  const { connectionStatus, socket } = useSocket();

  if (connectionStatus !== "connected") {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          color: "#FAFAFA",
        }}
      >
        <h1>Connection lost - reconnecting</h1>
        <ClipLoader color="#FAFAFA" size={40} />
      </div>
    );
  }
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
