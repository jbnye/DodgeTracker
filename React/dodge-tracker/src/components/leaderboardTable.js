import React, { useState, useEffect } from "react";

export default function LeaderboardTable() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/leaderboard") // Fetch from backend
      .then((response) => response.json())
      .then((data) => {
        setLeaderboard(data); // Store data in state
        console.log("Leaderboard Data:", data); // Debugging
      })
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, []);

  return (
    <div>
      <h1>Leaderboard</h1>
      <table
        border="1"
        style={{ width: "80%", margin: "auto", textAlign: "center" }}
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Summoner</th>
            <th>Level</th>
            <th>Total Dodges</th>
            <th>LP Lost</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((player, index) => (
            <tr key={index}>
              <td>{index + 1}</td> {/* Rank number */}
              <td>
                <img
                  src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${player.iconId}.jpg`}
                  alt="Icon"
                  style={{ width: "30px", height: "30px", marginRight: "10px" }}
                />
                {player.gameName}#{player.tagLine}
              </td>
              <td>{player.summonerLevel}</td>
              <td>{player.totalDodges}</td>
              <td>-{player.totalLpLost} LP</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
