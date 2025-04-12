import React, { useState, useEffect } from "react";
import LeaderboardEntry from "./LeaderboardEntry.js";
import Pagination from "./LeaderboardPage.js";

export default function LeaderboardTable({ region }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(
    () => {
      fetch(
        `http://127.0.0.1:5000/api/leaderboard?page=${currentPage}&region=${region}`
      ) // Fetch from backend
        .then((response) => response.json())
        .then((data) => {
          setLeaderboard(data.data); // Store data in state
          setTotalPages(data.totalPages);
          //console.log("Leaderboard Data:", data.data);
        })
        .catch((error) => console.error("Error fetching leaderboard:", error));
    },
    [currentPage],
    [region]
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div
      className="leaderboardTable"
      style={{
        height: "100%",
        width: "70%",
        margin: "auto",
        // display: "flex",
        // flexDirection: "column",
        // justifyContent: "center",
        // alignItems: "center",
      }}
    >
      {leaderboard.map((player, index) => (
        <LeaderboardEntry
          key={index}
          rank={(currentPage - 1) * 25 + index + 1} // Adjust rank based on page
          player={player}
        />
      ))}
      {/* Use the Pagination component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
